from groq import Groq
# from openai import OpenAI
# import pyaudio
import speech_recognition as sr
import pyttsx3

# Initialize TTS engine
tts_engine = pyttsx3.init()

groq_client = Groq(api_key="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")

def groq_promt(promt):
    system_message = """You are a friendly AI assistant. Provide complete, concise answers in 2-3 sentences using natural conversational language. 
    Focus on the most important points only. Speak as if having a casual conversation with a friend. 
    Your response must be a single, coherent paragraph that fully addresses the question."""
    
    convo = [
        {'role': 'system', 'content': system_message},
        {'role': 'user', 'content': f"Answer this briefly in a single short paragraph: {promt}"}
    ]
    
    chat_completion = groq_client.chat.completions.create(
        messages=convo, 
        model='llama3-70b-8192',
        temperature=0.7,
        max_tokens=100
    )
    return chat_completion.choices[0].message.content


def text_to_speech(text):
    """Converts text to speech."""
    tts_engine.say(text)
    tts_engine.runAndWait()

def speech_to_text():
    """Converts speech to text using Google Speech Recognition with improved listening."""
    recognizer = sr.Recognizer()
    
    # Adjust these parameters for better recognition
    recognizer.pause_threshold = 1.0  # Seconds of silence before considering the phrase complete
    recognizer.dynamic_energy_threshold = True  # Automatically adjust for ambient noise
    recognizer.energy_threshold = 4000  # Minimum audio energy to consider for recording
    
    with sr.Microphone() as source:
        print("Listening...")
        # Longer ambient noise adjustment
        print("Adjusting for background noise...")
        recognizer.adjust_for_ambient_noise(source, duration=2)
        
        try:
            # Listen with phrase_time_limit to prevent infinite listening
            print("Speak now...")
            audio = recognizer.listen(
                source,
                timeout=10,  # Wait up to 10 seconds for speech to start
                # phrase_time_limit=15,  # Stop listening after 15 seconds of speech
            )
            print("Processing...")
            
            return recognizer.recognize_google(audio)
        except sr.WaitTimeoutError:
            return "No speech detected within timeout period."
        except sr.UnknownValueError:
            return "Sorry, I didn't understand that."
        except sr.RequestError:
            return "Speech recognition service is unavailable."
        except Exception as e:
            return str(e)
        


while True:
    print("Say something (or type 'exit' to quit):")
    user_input = speech_to_text()
    
    if user_input.lower() == 'exit':
        print("Exiting...")
        break
    
    print(f"USER: {user_input}")
    response = groq_promt(user_input)
    print(f"ASSISTANT: {response}")
    
    # Convert the assistant's response to speech
    text_to_speech(response)