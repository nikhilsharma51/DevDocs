from fastapi import FastAPI , HTTPException , Header
from pydantic import BaseModel
from typing import Optional
from rag import run_rag_query , embed_document
import os

app = FastAPI()

class QueryRequest(BaseModel):
    question:str 
    user_id : str

class EmbeddRequest(BaseModel):
    doc_id : str
    title : str
    content : str
    user_id : str

@app.get("/health")
def health():
    return {"ok": True} 

@app.post("/query")
def query(req : QueryRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400 , detail="Question is required")   
    try:
        result = run_rag_query(req.question , req.user_id)
        return result
    except Exception as e:
        print(f"Query error : {e}")
        raise HTTPException(status_code=500 , detail = str(e))
    
@app.post("/embed")
def embed(req : EmbeddRequest):
    if not req.doc_id:
        raise HTTPException(status_code=400 , detail="Doc id is required")
    try : 
        embed_document(req.doc_id , req.title , req.content , req.user_id)    
        return {"ok" : True}
    except Exception as e:
        print(f"Embed error {e}")
        raise HTTPException(status_code=500 , detail=str(e))
    

if __name__ == "__main__":
   import uvicorn
   uvicorn.run("main:app" , host="0.0.0.0", port=8000 , reload=True)
