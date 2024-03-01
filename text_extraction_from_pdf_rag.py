from llama_index.core import (
    load_index_from_storage,
    StorageContext,
    VectorStoreIndex,
    get_response_synthesizer
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings
from llama_index.core import SimpleDirectoryReader
import os
from llama_index.core.node_parser import SentenceSplitter
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
from langchain.embeddings import HuggingFaceEmbeddings
from llama_index.embeddings.langchain import LangchainEmbedding
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor
import fitz  # PyMuPDF
os.environ["OPENAI_API_KEY"] = "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"

def extract_text_from_all_pages(pdf_path):
    pdf_document = fitz.open(pdf_path)
    total_pages = pdf_document.page_count
    full_text_by_page = []

    for page_number in range(total_pages):
        page = pdf_document[page_number]
        page_text = page.get_text("text")
        full_text_by_page.append(page_text)

    pdf_document.close()
    return full_text_by_page

pdf_file_path = "sample_data\DigiKore.pdf"
all_pages_text = extract_text_from_all_pages(pdf_file_path)

# Concatenate the list of strings into a single string
full_text = "\n".join(all_pages_text)

with open("data/extracted_text.txt", 'w', encoding="utf-8") as file:# Write the input string to the file
    file.write(full_text)
#print(f"String exported to extracted_text.txt successfully.")

Settings.llm = OpenAI(model="gpt-3.5-turbo")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

db = chromadb.PersistentClient(path="stored_data")
text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=20)
chroma_collection = db.get_or_create_collection("quickstart")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
Settings.text_splitter = text_splitter

# documents = SimpleDirectoryReader("data").load_data()
documents = SimpleDirectoryReader("data").load_data()
vector_index = VectorStoreIndex.from_documents(
    documents, transformations=[text_splitter], storage_context=storage_context
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
response = query_engine.query("In how many types manual fact-checking is divided into?")
print(response)
