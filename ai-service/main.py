import os 
from langchain_google_genai import ChatGoogleGenerativeAI , GoogleGenerativeAIEmbeddings
from langchain.messages import HumanMessage , SystemMessage
from supabase import create_client
from dotenv import load_dotenv
load_dotenv()

#-----------------CLIENTS-----------------------------------
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

embeddings_model = GoogleGenerativeAIEmbeddings(model="gemini-embedding-2-preview" ,google_api_key = os.getenv("GEMINI_API_KEY"),
 )

llm = ChatGoogleGenerativeAI(
    model = "gemini-1.5-flash",
    google_api_key = os.getenv("GEMINI_API_KEY"),
    temperature = 0.2
)

#---------embed-------------