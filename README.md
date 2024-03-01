# SciDocx.AI

Sci-docx is an advanced RAG (Retrieval-Augmented Generation) model tailored for training on scientific documents uploaded by the user. This model combines powerful retrieval mechanisms with state-of-the-art language generation capabilities to enhance the understanding and generation of scientific content.

## Table of Contents
- [Introduction](#introduction)
- [How RAG Model Works](#how-rag-model-works)
- [Features](#features)
- [Getting Started](#getting-started)
- [Library Usage](#library-usage)
- [See the TestCases Output](#testcases-output)
- [Flask Model and API Endpoints](#flask_model)
- [Streamlit Integrated Chat Bot using Custom Embedding](#streamlit_app)

## Introduction <a name="introduction"></a>

Scientific document comprehension and generation require specialized models that can understand and generate technical content accurately. Sci-docx is built to cater to these needs by leveraging the RAG model architecture. Whether you are a researcher, student, or professional in the scientific domain, Sci-docx provides a robust solution for extracting valuable insights and generating coherent scientific text.
</div>

## How RAG Model Works

The Retrieval-Augmented Generation (RAG) model is a two-step process:

1. **Retrieval:** The model retrieves relevant passages from a large set of scientific documents using a retriever module. This step helps narrow down the focus to the most pertinent information related to the user's query.

2. **Generation:** Based on the retrieved content, the model generates human-like responses, summaries, or completions. This generation step is fine-tuned to ensure the output aligns with the scientific context, making it a powerful tool for document understanding and content creation.

## Features

- **Scientific Document Training:** Sci-docx is specifically designed to be trained on scientific documents, ensuring its understanding of technical language and context.

- **RAG Architecture:** Leveraging the RAG model, Sci-docx combines effective retrieval and generation steps to provide accurate and contextually relevant outputs.

- **User-Friendly Interface:** An intuitive interface allows users to upload and process their scientific documents seamlessly using <strong> NextJS </strong> and <strong> ShadCN Library </strong>.

- **Flexible Usage:** Whether you're looking to understand complex scientific papers or generate concise summaries, Sci-docx adapts to various use cases.

## Getting Started

To get started with Sci-docx, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sci-docx.git

2. Install dependencies: <strong> pip install -r requirements.txt</strong>
3. Run the Model: <strong> python main.py </strong>

## Library Usage
- **llama_index.core:** 
  - *Purpose:* Core functionality for the Llama Index library, including loading indexes, storage context, and vector store.

- **llama_index.llms.openai:** 
  - *Purpose:* Integration with the OpenAI language model (LLM - Language Model) for processing and understanding text.

- **llama_index.embeddings.openai:** 
  - *Purpose:* Embedding module for the OpenAI language model, specifically used for generating text embeddings.

- **llama_index.core.node_parser:** 
  - *Purpose:* Module for parsing nodes, such as sentence splitting.

- **llama_index.core.Settings:** 
  - *Purpose:* Centralized settings and configuration module for the Llama Index library.

- **llama_index.core.SimpleDirectoryReader:** 
  - *Purpose:* Reads documents from a directory to be used within the Llama Index.

- **os:** 
  - *Purpose:* Provides a way of interacting with the operating system, used here for setting environment variables.

- **chromadb:** 
  - *Purpose:* A persistent client for ChromaDB, a library for managing and storing vectors in a database.

- **llama_index.vector_stores.chroma:** 
  - *Purpose:* A vector store implementation using ChromaDB, used as the vector store for Llama Index.

- **llama_index.core.retrievers:** 
  - *Purpose:* Module for building retrievers, responsible for retrieving relevant information based on queries.

- **llama_index.core.query_engine:** 
  - *Purpose:* Query engine for processing and executing queries, combining retrievers and response synthesizers.

- **llama_index.core.postprocessor:** 
  - *Purpose:* Postprocessors for refining and processing results, such as the SimilarityPostprocessor in this case.

- **pickle:** 
  - *Purpose:* Serialization and deserialization module used here for loading data from a file.

- **re:** 
  - *Purpose:* Regular expression module, often used for pattern matching and text processing.

- **numpy:** 
  - *Purpose:* Not explicitly seen in the provided code but is commonly used for numerical operations and array manipulations.

- **requests:** 
  - *Purpose:* Not explicitly seen in the provided code but is commonly used for making HTTP requests, often used for API interactions.

- **pytesseract:**
  - *Purpose:* pytesseract is used for Optical Character Recognition (OCR) in Python. It provides an interface to the Tesseract OCR engine, enabling the extraction of text from images.

- **pdf2image:**
  - *Purpose:* pdf2image is used to convert PDF documents into a sequence of PIL images. This library facilitates the extraction of text from PDF documents by converting them into images.

- **HotPdf:**
  - *Purpose:* HotPdf is a library used for extracting text from PDF documents. It provides functionality to parse and extract text from individual pages of a PDF document.

- **fitz:**
  - *Purpose:* fitz is a Python wrapper for the PyMuPDF library, which allows for the manipulation of PDF documents. In this context, fitz is used for extracting text from PDF documents.

- **tabula:**
  - *Purpose:* tabula is a library used for extracting tables from PDF documents. It provides functionality to parse and extract tabular data from PDF files.

- **re:**
  - *Purpose:* re is Python's built-in regular expression module. It is used for pattern matching and string manipulation. In this context, it is used for text processing and manipulation.

- **textwrap:**
  - *Purpose:* textwrap is a module used for formatting and wrapping text blocks. It provides functions to wrap text to a specified width and format it according to specified parameters.

- **SpellChecker:**
  - *Purpose:* SpellChecker is a library used for spell checking in Python. It provides functionality to identify and correct misspelled words in text documents.

- **docparser:**
  - *Purpose:* docparser is a library used for parsing and extracting text from various document formats, such as DOCX files. It facilitates the extraction of structured text from document files.

- **pylatexenc:**
  - *Purpose:* pylatexenc is a library used for converting LaTeX documents to plaintext. It provides functionality to parse LaTeX documents and convert them to human-readable text.

- **pptx:**
  - *Purpose:* pptx is a library used for working with PowerPoint files in Python. It provides functionality to parse and manipulate PowerPoint presentations, including extracting text from slides.
 
## TestCases Output

We have meticulously generated test cases on diverse file formats, including PDF, PPT, DOC, LaTeX, TXT, IPYNB, CSV, and EPUB. The output from our model has been compared against the source files, providing a comprehensive evaluation.

Explore the differences and similarities between the source files and the model-generated output in the `TestCase_Images` folder. The images visually represent the comparison results, offering insights into the accuracy and performance of our model across various file formats.

Feel free to delve into the TestCase_Images folder to gain a deeper understanding of how our model handles different types of files and produces reliable outputs.


## Flask Model and API Endpoints

Explore our Flask model featuring custom API endpoints. To test the code, navigate to the `server` folder and execute the `app.py` script. Ensure you have Flask and the required libraries installed.

### Setting up Flask (Command Line)

1. **Install Flask:**
   ```bash
   pip install Flask
2. **Navigate to `server` Folder.**
3. **Run Flask App**: python app.py


## Streamlit Integrated Chat Bot using Custom Embedding [Additional]
Location: `Model_Using_Custom_Embedding`
This Python script implements a Streamlit-powered chatbot designed for analyzing content from PDF and DOCX files. Users can upload files, ask questions related to the file content, and interact with language models for responses. Below is a breakdown of the script's functionality:
### Features:

- **File Upload:**
  - Users can upload PDF and DOCX files through the Streamlit interface.

- **Text Extraction:**
  - Utilizes libraries such as PyPDF2 and docx to extract text content from the uploaded files.

- **Language Models:**
  - Integrates with OpenAI's GPT-3.5 Turbo for natural language understanding and generation.

- **Conversational Chain:**
  - Implements a conversational retrieval chain to handle user questions and maintain chat history.

### How to Use:

1. **Upload Files:**
   - Use the file uploader in the sidebar to upload PDF or DOCX files.

2. **Processing:**
   - Click the "Process" button to initiate text extraction and set up the chatbot.

3. **Chat with the Bot:**
   - Once processing is complete, interact with the chatbot by asking questions about the uploaded files.

4. **Conversation History:**
   - View the chat history and responses from the chatbot in real-time.

## Requirements:

- Python libraries: Streamlit, PyPDF2, docx, langchain_openai, langchain_community, PyLaTeXenc, and others.

- OpenAI API Key: Ensure you have a valid OpenAI API key for language model interactions.

### Running the Application:
pip install -r requirements.txt <br>
streamlit run script_name.py




