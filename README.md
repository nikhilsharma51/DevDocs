# DevDocs — AI-Powered Developer Knowledge Base

Built DevDocs because every engineering team has the same problem — documentation lives in three different places, nobody reads it, and every new developer spends their first week just asking questions that are already answered somewhere. This is my attempt at actually solving that.

---

## The Problem

If you have worked on an engineering team of any size, you know this situation. The backend deployment steps are in a Notion page that hasn't been touched in eight months. The auth service is documented in a Confluence doc that three people know exists. The environment variables are in someone's head. And when a new developer joins, they spend days piecing together information that should take an hour.

Search doesn't help because you need to know what to search for. Asking teammates works but it pulls people away from their work. And the documentation that does exist is scattered across too many tools to realistically maintain.

The idea behind DevDocs is simple — give engineering teams one place to write and store their technical documentation, and then let an AI actually read it and answer questions about it. Not a generic AI, not ChatGPT with no context. An AI that has read your specific docs and can answer questions about your specific stack.

---

## What It Does

DevDocs is a full-stack knowledge base application built for engineering teams. Developers can write and store technical documentation in a clean markdown editor. The docs are organized, searchable, and shareable across teams. And then there is an AI assistant that has actually read everything and can answer natural language questions about it.

The core user flow is straightforward. You write documentation the same way you always have, in markdown. You tag it, categorize it, and optionally share it with your team. When someone has a question — how do I deploy the backend, where is the auth logic, what are the environment variables for staging — they ask the AI assistant and get a precise answer with a reference to the exact document it pulled from. No hallucinations about your codebase, no generic advice. Answers from your actual docs.

---

## The Tech Stack

The frontend is built with React, Tailwind CSS, and React Router. The backend is Node.js with Express handling auth middleware and routing. The database is Supabase, which gives you Postgres with pgvector for storing embeddings alongside your actual documents. The AI service is a separate Python FastAPI server running the RAG pipeline. The LLM and embedding model are both from Google Gemini, specifically Gemini 1.5 Flash for generation and text-embedding-004 for creating vector representations of text.

The reason for splitting the backend into Node.js and Python is practical. LangChain's Python library is more mature and better documented than the JavaScript version. All the AI work lives in Python where it's easier to iterate on, and Express handles what it's good at — auth verification and routing.

---

## The RAG Pipeline — How It Actually Works

RAG stands for Retrieval-Augmented Generation. The name is a bit technical but the concept is not complicated once you see it laid out. It is the reason the AI assistant gives you answers from your actual documentation instead of making things up.

### The Problem RAG Solves

Large language models like Gemini are trained on massive amounts of public internet data. They know a lot about programming in general, but they know absolutely nothing about your team's specific codebase, your deployment scripts, your environment setup, or your internal APIs. If you just ask a raw LLM "how do I deploy our backend", it will give you a generic answer that has nothing to do with your actual setup.

The naive solution is to dump all your documentation into the prompt. But language models have context limits. You cannot paste 200 documents into a single prompt. And even if you could, the model would struggle to find the relevant information in all that noise.

RAG solves this by being smarter about what context you give the model. Instead of giving it everything, you give it only the most relevant documents for the specific question being asked. The model then answers based on that targeted context. The result is precise, grounded answers that actually reflect your documentation.

### How Documents Get Embedded

When a developer saves a document in DevDocs, two things happen. First the document is saved normally to the Supabase Postgres database. Then immediately after, the Python AI service is called with the document's title and content.

The Python service sends that text to Google's text-embedding-004 model. What comes back is a list of 768 numbers. That list of numbers is called an embedding and it represents the semantic meaning of the document — not its exact words, but what it is about. Documents about deployment will have embeddings that are numerically close to each other. Documents about authentication will cluster together. Documents about database schemas will be in their own neighborhood.

That list of 768 numbers gets stored as a new column on the same document row in Supabase. This is the pgvector extension doing its job — Postgres has a special column type called vector that can store and mathematically compare these number arrays efficiently. No separate vector database needed, no Pinecone, no extra service to manage. Everything lives in one place.

### How a Question Gets Answered

When a developer types a question into the AI assistant, the pipeline runs in four steps.

The question text gets sent to the same text-embedding-004 model that processed the documents. This converts the question into its own embedding — another list of 768 numbers representing what the question is asking about.

Then pgvector runs a similarity search across all the stored document embeddings. It uses cosine similarity to find which document vectors are mathematically closest to the question vector. Because semantically similar text produces numerically similar embeddings, this finds the documents most relevant to the question even if they don't share exact keywords. A question about "how do I start the server" will match a document that talks about "running npm run dev" even without those exact words appearing in the question.

The top three matching documents are retrieved from Supabase. Their full content is then assembled into a context block and sent to Gemini 1.5 Flash along with the original question and a system prompt that instructs the model to answer only from the provided documentation.

The model generates an answer grounded in those specific documents. The response that comes back to the frontend includes the answer text and the titles of the source documents it used. You can click any source reference and it takes you directly to that document.

### Why This Matters for Context Awareness

The key insight is that the AI assistant is not just a chatbot sitting on top of your documentation. It has a semantic understanding of what every document is about. When you ask it something, it is not doing a keyword search — it is finding documents that are conceptually relevant to your question.

This means you can ask questions the way you would ask a colleague. "How do we handle errors in production", "what's the database schema for users", "where is the payment integration documented". The system finds the right documents and gives you a precise answer with a reference so you can read the full context if you need to.

It also means the AI cannot hallucinate about your codebase. It is constrained to answer from the documents it retrieved. If the answer is not in your documentation, it tells you that instead of making something up.

---

## Team Collaboration

Documentation is only useful if everyone can access it. DevDocs has a full team system built in. An admin creates a team and invites colleagues by email. Invited users see a banner when they log in and can accept with one click. Any team member can mark a document as shared with the team, making it visible to everyone. The AI assistant searches across both personal and team documentation when answering questions.

The team feature is built using Supabase RPC functions with security definer privileges rather than row-level security policies. This turned out to be significantly more reliable and easier to reason about than complex RLS policies that tend to conflict with each other.

---

## What I Learned Building This

The most surprising thing was how much the quality of your embeddings depends on how you prepare the text before embedding. Concatenating the title and content before sending it to the embedding model — rather than just embedding the content alone — meaningfully improved retrieval quality because the title carries a lot of semantic signal about what the document covers.

The second thing was that splitting the AI work into a separate Python service was absolutely the right call. JavaScript LangChain exists but the Python version is so much further ahead in terms of stability and documentation that trying to fight it is not worth it.

The third was that RLS policies in Supabase can get complicated fast when you have cross-table relationships. Using `security definer` functions for team operations rather than trying to write policies that reference multiple tables eliminated an entire category of bugs.

---

## Stack Summary

React, Tailwind CSS, React Router for the frontend. Node.js and Express for the API gateway and auth middleware. Python and FastAPI for the AI service. LangChain for the RAG pipeline orchestration. Google Gemini for embeddings and LLM generation. Supabase with Postgres and pgvector for the database. Vercel for frontend deployment and Railway for the backend services.

---

## Running It Locally

You need three things running at once — the React frontend, the Express backend, and the Python AI service. Clone the repo, set up your environment variables for Supabase and Gemini, activate the Python virtual environment, and start all three. The README in the repo has the exact commands.

The Supabase setup requires creating the tables, enabling the pgvector extension, and running the SQL functions for team management. All of that SQL is included in the repo.

---

This is the kind of project that starts as a weekend experiment and turns into something you actually want to keep working on. The RAG pipeline in particular is something I want to keep improving — better chunking strategies, re-ranking retrieved documents, streaming responses. There is a lot of room to go deeper.

If you are building something similar or have questions about any part of the implementation, reach out.
