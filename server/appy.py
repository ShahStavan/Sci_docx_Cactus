from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import logging
import traceback

from llama_index.core import (
    load_index_from_storage,
    StorageContext,
    VectorStoreIndex,
    get_response_synthesizer
)
from llama_index.core.node_parser import SentenceSplitter
import pickle
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings
from llama_index.core import SimpleDirectoryReader
import os
from llama_index.core.node_parser import SentenceSplitter
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor


os.environ["OPENAI_API_KEY"] = "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"
Settings.llm = OpenAI(model="gpt-3.5-turbo")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

def save_uploaded_file(file):
    upload_dir = 'uploads'
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, "data.txt")
    file.save(file_path)
    return file_path

def create_llama_index():
    try:
        index_dir = 'index'
        os.makedirs(index_dir, exist_ok=True)

        # Store the file here
        documents = SimpleDirectoryReader("data").load_data()
        # initialize client, setting path to save data
        db = chromadb.PersistentClient(path="index")
        
        # create collection
        chroma_collection = db.get_or_create_collection("quickstart")

        # assign chroma as the vector_store to the context
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        if not os.path.exists(index_dir) or not os.listdir(index_dir):
            return jsonify({'error':  "Error: in indexing document"})
        
        return jsonify({'result': 'File indexed successfully'})
    except Exception as e:
        logging.error(f"An error occurred during indexing: {e}")
        logging.error(traceback.format_exc())
        return jsonify({'error':  f"An error occurred: {e}"})

def get_custom_prompt():
    try:
        return Prompt("""\
    Rephrase the conversation and subsequent message into 
    a self-contained question while including all relevant details. 
    Conclude the question with: Only refer to this document.

    <Chat History> 
    {chat_history}

    <Follow Up Message>
    {question}

    <Standalone question>
    """)
    except Exception as e:
        logging.error(f"An error occurred during custom prompt creation: {e}")
        logging.error(traceback.format_exc())
        return jsonify({'error':  f"An error occurred: {e}"})

def get_chat_history(history='[]'):
    try:
        history = json.loads(history)
        custom_chat_history = []
        roles = {"left_bubble": "ASSISTANT", "right_bubble": "USER"}
        for chat in history:
            position = chat['position']
            role = MessageRole[roles[position]]
            content = chat['message']
            custom_chat_history.append(
                ChatMessage(
                    role=role,
                    content=content
                )
            )
        return custom_chat_history
    except Exception as e:
        logging.error(f"An error occurred during chat history creation: {e}")
        logging.error(traceback.format_exc())
        return jsonify({'error':  f"An error occurred: {e}"})


def query_index():
    try:
        index_dir = 'index'

        if not os.path.exists(index_dir) or not os.listdir(index_dir):
            return jsonify({'error':  f"Index directory '{index_dir}' does not exist or is empty."})
        
        data = request.get_json()
        prompt = data.get('prompt')
        chat_history = data.get('chatHistory')
        
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        index = load_index_from_storage(storage_context)

        Settings.text_splitter = text_splitter

        # per-index
        vector_index = VectorStoreIndex.from_documents(
            documents, transformations=[text_splitter],storage_context=storage_context
        )

        # configure retriever
        retriever = VectorIndexRetriever(
            index=vector_index,
            similarity_top_k=10,
        )

        #configure response synthesizer
        response_synthesizer = get_response_synthesizer()

        # assemble query engine
        query_engine = RetrieverQueryEngine(
            retriever=retriever,
            response_synthesizer=response_synthesizer,
            node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.7)],
        )

        query_engine = vector_index.as_query_engine()

        chat_engine = CondenseQuestionChatEngine.from_defaults(
            query_engine=query_engine,
            condense_question_prompt=get_custom_prompt(),
            chat_history=get_chat_history(chat_history),
            verbose=True
        )

        response_node = chat_engine.chat(prompt)
        return jsonify({'result':  response_node.response})

    except Exception as e:
        logging.error(f"An error occurred during querying: {e}")
        logging.error(traceback.format_exc())
        return jsonify({'error':  f"An error occurred: {e}"})


@app.route('/')
def hello_world():
    return jsonify({'result':  "Hello world"})

@app.route('/ask_ai', methods=['POST'])
def query_endpoint():
    response = query_index()
    return response

@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        file_path = save_uploaded_file(file)
        return create_llama_index()

if __name__ == '__main__':
    app.run()