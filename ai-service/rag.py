import os
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# -----------------CLIENTS-----------------------------------
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY"),
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.2,
)


# ---------embed-------------
def get_embeddings(text: str):
    return embeddings_model.embed_query(text)


def embed_document(doc_id, title, content, user_id):
    text = f"{title}\n\n{content}"
    embedding = get_embeddings(text)

    result = (
        supabase.table("documents")
        .update({"embedding": embedding})
        .eq("id", doc_id)
        .eq("author_id", user_id)
        .execute()
    )

    return result


# ----------rag query--------------------------
def run_rag_query(question, user_id):
    question_embedding = get_embeddings(question)

    result = supabase.rpc(
        "match_documents",
        {
            "query_embedding": question_embedding,
            "match_threshold": 0.3,
            "match_count": 3,
            "user_id": user_id,
        },
    ).execute()

    matched_docs = result.data

    if not matched_docs:
        return {
            "answer": "I couldn't find any relevant documentation for that question. Make sure your docs are saved and embedded.",
            "sources": [],
        }

    context = "\n\n---\n\n".join(
        [f"Document: {doc['title']}\n\n{doc['content']}" for doc in matched_docs]
    )

    messages = [
        SystemMessage(
            content="""You are a helpful assistant for an engineering team's documentation system.
           Answer questions using ONLY the documentation provided.
           If the answer is not in the documentation, say so clearly.
           Be concise and accurate."""
        ),
        HumanMessage(
            content=f"""Documentation:
            {context}

            Question: {question}

           Answer:"""
        ),
    ]

    response = llm.invoke(messages)

    return {
        "answer": response.content,
        "sources": [{"id": doc["id"], "title": doc["title"]} for doc in matched_docs]
    }
