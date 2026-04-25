import { Router } from "express";
import { handleEmbedding, handleQuery } from "../services/aiService.js";
import axios from 'axios'

export const aiRouter = Router();

PYTHON_AI_URI = process.env.PYTHON_AI_URI || 'http://localhost:8000'


aiRouter.post("/query" , async(req,res)=>{
  const {question} = req.body

  if(!question.trim()){
    return res.status(400).json({error : "Question is required"})
  }

  try{
    const {data} = await axios.post(`${PYTHON_AI_URI}/query`,{
      question,
      user_id = req.user.id
    })
    res.json(data)
  }catch(error){
    console.error('Python call failed! : ',error.response?.data || err.message)
    res.status(500).json({
      error : err.response?.data?.detail || "Ai service unavailable"
    })
  }
})


aiRouter.post("/embed", async (req, res) => {
  const { docId, title, content } = req.body;
  if (!docId) return res.status(400).json({ error: "docId required" });

  try{
    await axios.post(`${PYTHON_AI_URI}/embed`,{
      doc_id = docId,
      title,
      content
      user_id = req.user.id
    })

    res.json({ok :true})
  }catch(err){
    console.error('Python embed call failed : ',err.response?.data || err.message)
    res.status(500).json({error: err.response?.data?.detail || 'Embedding service unavailable'})
  }
});

