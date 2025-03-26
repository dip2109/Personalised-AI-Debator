from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import speech_recognition as sr
import pyttsx3
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Initialize TTS engine
tts_engine = pyttsx3.init()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class PromptRequest(BaseModel):
    text: str

def process_speech(audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError:
            return "Error with recognition service"

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    with open("temp.wav", "wb") as buffer:
        buffer.write(await file.read())
    transcript = process_speech("temp.wav")
    return JSONResponse(content={"transcript": transcript})

@app.post("/chat/")
async def chat_with_ai(prompt: PromptRequest):
    system_message = """You are a friendly AI assistant. Provide complete, concise answers in 2-3 sentences using natural conversational language. 
    Focus on the most important points only. Speak as if having a casual conversation with a friend. 
    Your response must be a single, coherent paragraph that fully addresses the question."""
    
    convo = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": f"Answer this briefly: {prompt.text}"}
    ]

    response = groq_client.chat.completions.create(
        messages=convo, 
        model="llama3-70b-8192",
        temperature=0.7,
        max_tokens=100
    ).choices[0].message.content

    return JSONResponse(content={"response": response})

@app.post("/speak/")
async def generate_speech(prompt: PromptRequest):
    tts_engine.save_to_file(prompt.text, "response.mp3")
    tts_engine.runAndWait()
    return JSONResponse(content={"audio_url": "/response.mp3"})
