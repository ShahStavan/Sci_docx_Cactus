from flask import Flask, request, jsonify
import os
from firebase_admin import credentials, initialize_app, firestore
from llama_index.core import (
    StorageContext,
    VectorStoreIndex,
    get_response_synthesizer
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings
from llama_index.core import SimpleDirectoryReader
import chromadb
from flask_cors import CORS
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor
from datetime import datetime

# Initialize Firebase
cred = credentials.Certificate('scidocx-ai.json')
initialize_app(cred, {'storageBucket': 'scidocx-ai.appspot.com'})
db = firestore.client()

# Initialize OpenAI
os.environ["OPENAI_API_KEY"] = ""
Settings.llm = OpenAI(model="gpt-3.5-turbo")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads/'
ALLOWED_EXTENSIONS = {'pdf', 'tex', 'word', 'pptx', 'ppt', 'doc', 'txt', 'epub', 'csv', 'ipynb', 'xlsx'}

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

file_id = None  

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    global file_id
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file and allowed_file(file.filename):
        # Delete all files in the uploads folder
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            os.remove(file_path)

        # Save the new file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        # Url maate alag folder.

        # Placeholder for your PDF processing logic
        # process_pdf(filepath)

        return 'File uploaded & processed successfully. You can begin querying now', 200

@app.route('/model', methods=['POST'])
def preprocess_pdf():
    # Check if a file, userId, and prompt were sent
    if 'userId' not in request.form or 'prompt' not in request.form:
        return jsonify({'error': 'Missing userId, or prompt'}), 400

    userId = request.form['userId']
    prompt = request.form['prompt']

    try:
        # Save the response, prompt, timestamp, and status to Firestore
        messages_ref = db.collection(f'Users/{userId}/Messages')
        message_data = {
            'response': '',
            'prompt': prompt,
            'timestamp': datetime.now(),
            'status': 'updating'
        }
        
        doc_ref = messages_ref.add(message_data)
        doc_id = doc_ref[1].id

        # Load documents using the processed text
        documents = SimpleDirectoryReader(app.config['UPLOAD_FOLDER']).load_data()

        # Initialize client, setting path to save data
        chroma_db = chromadb.PersistentClient(path="stored_data")
        text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=20)

        # Create collection
        chroma_collection = chroma_db.get_or_create_collection("quickstart")

        # Assign chroma as the vector_store to the context
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Global
        Settings.text_splitter = text_splitter

        # Per-index
        vector_index = VectorStoreIndex.from_documents(
            documents, transformations=[text_splitter], storage_context=storage_context
        )

        # Configure retriever
        retriever = VectorIndexRetriever(
            index=vector_index,
            similarity_top_k=10,
        )

        # Configure response synthesizer
        response_synthesizer = get_response_synthesizer()

        # Assemble query engine
        query_engine = RetrieverQueryEngine(
            retriever=retriever,
            response_synthesizer=response_synthesizer,
            node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.7)],
        )

        query_engine = vector_index.as_query_engine()

        response = query_engine.query(prompt)
        response_str = str(response)

        # Update the status field to "completed" and response field with the generated response
        messages_ref.document(doc_id).update({'response': response_str, 'status': 'completed'})

        return response_str, 200

    except Exception as e:
        # If an error occurs, delete the data uploaded to Firestore
        if doc_id:
            messages_ref.document(doc_id).delete()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
