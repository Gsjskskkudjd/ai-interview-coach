# backend/main.py

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ADD role and level to the request model for submit_answer
class ConversationRequest(BaseModel):
    transcript: list
    role: str
    level: str

class InterviewStartRequest(BaseModel):
    role: str
    level: str

def convert_history_to_json(history: list) -> list:
    json_history = []
    for message in history:
        json_history.append({"role": message.role, "parts": [part.text for part in message.parts]})
    return json_history

def get_system_prompt(role: str, level: str):
    return f"""
    You are an expert HR interviewer conducting a mock interview for a '{role}' position at the '{level}' level.
    Your persona is professional, encouraging, and sharp. Ask only one question at a time.
    Keep your responses concise and conversational. Do not break character.
    After the user answers, provide a brief, one-sentence transition and then ask the next relevant question.
    """

# ✅ This endpoint is now simpler and only returns the first visible message
@app.post("/start_interview")
async def start_interview(request: InterviewStartRequest):
    first_message = "Hello and welcome! I'll be conducting your mock interview today. To start, can you tell me a little about yourself and why you're interested in this role?"
    return {"message": first_message}


# ✅ This endpoint is now stateless and reconstructs the conversation each time
@app.post("/submit_answer")
async def submit_answer(request: ConversationRequest):
    system_prompt = get_system_prompt(request.role, request.level)
    model = genai.GenerativeModel(
        'gemini-1.5-flash-latest',
        system_instruction=system_prompt
    )
    chat_session = model.start_chat(history=request.transcript)
    response = chat_session.send_message(request.transcript[-1]['parts'][0])
    
    # We now send back the full history including the AI's new response
    return {"transcript": convert_history_to_json(chat_session.history)}


@app.post("/end_interview")
async def end_interview(request: ConversationRequest):
    system_prompt = get_system_prompt(request.role, request.level)
    model = genai.GenerativeModel('gemini-1.5-flash-latest', system_instruction=system_prompt)
    
    transcript_text = "\n".join([f"{msg['role'].replace('model', 'Interviewer')}: {msg['parts'][0]}" for msg in request.transcript])
    feedback_prompt = f"Analyze the following interview transcript and provide a structured report in Markdown format with sections for Overall Summary, Strengths, and Areas for Improvement.\n\n---\n{transcript_text}\n---"
    
    response = model.generate_content(feedback_prompt)
    return {"feedback": response.text}