from llama_index.core import (
    load_index_from_storage,
    StorageContext,
    VectorStoreIndex,
    get_response_synthesizer
)
import re
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

documents = SimpleDirectoryReader("data").load_data()
# initialize client, setting path to save data
db = chromadb.PersistentClient(path="stored_data")
text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=20)
# create collection
chroma_collection = db.get_or_create_collection("quickstart")

# assign chroma as the vector_store to the context
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# global

Settings.text_splitter = text_splitter

# per-index
vector_index = VectorStoreIndex.from_documents(
    documents, transformations=[text_splitter],storage_context=storage_context
)

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
response = query_engine.query("What is the Training Accuracy Score?")
print(response)
# document_info = str(response.source_nodes)
# print("========================================")
# print(document_info)
