from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import httpx  # For making API requests

app = FastAPI()

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow the frontend origin (React app)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# MongoDB client setup
client = MongoClient("mongodb://localhost:27017/")
db = client["jooba_db"]
guesses_collection = db["guesses"]

# Pydantic model for request validation
class Guess(BaseModel):
    location: str
    guessed_time: str

# Localization dictionary
MESSAGES = {
    "en": {
        "winning": "Winning guess! submitted and stored",
        "losing": "Non-winning guess ignored",
    },
    "he": {
        "winning": "ניחוש נכון! התוצאה נשמרה",
        "losing": "ניחוש לא נכון, לא נשמר",
    }
}

# API to fetch real-time world times
def get_real_time_for_location(location: str) -> str:
    """Fetch the real-world time for a given location using WorldTimeAPI."""
    url = f"http://worldtimeapi.org/api/timezone/Etc/GMT"
    
    timezone_map = {
        "Tel Aviv": "Asia/Jerusalem",
        "Jerusalem": "Asia/Jerusalem",
        "Haifa": "Asia/Jerusalem",
        "New York": "America/New_York",
        "London": "Europe/London"
    }

    if location in timezone_map:
        url = f"http://worldtimeapi.org/api/timezone/{timezone_map[location]}"

    try:
        response = httpx.get(url)
        response.raise_for_status()
        data = response.json()
        utc_datetime = datetime.fromisoformat(data["datetime"])
        return utc_datetime.strftime('%H:%M')

    except Exception as e:
        print(f"Error fetching time for {location}: {e}")
        
        haifa_time = datetime.now()
        timezone_offset_map = {
            "New York": -7,
            "London": -3,
        }

        if location in timezone_offset_map:
            offset = timezone_offset_map[location]
            adjusted_time = haifa_time + timedelta(hours=offset)
            return adjusted_time.strftime('%H:%M')

        return haifa_time.strftime('%H:%M')

# API Endpoints
@app.get("/locations", response_model=List[str])
def get_locations():
    """Return a predefined list of locations."""
    return ["Tel Aviv", "Jerusalem", "Haifa", "New York", "London"]

@app.post("/guess")
async def submit_guess(request: Request, guess: Guess):
    """
    Accept a guess, check if it is a winning guess, and store it in MongoDB if correct.
    Returns localized response based on 'Accept-Language' header.
    """
    lang = request.headers.get("Accept-Language", "en").split(",")[0].split(";")[0]  # Default to English
    print(request.headers.get("Accept-Language"))
    lang = "he" if lang.startswith("he") else "en"  # Ensure only "he" or "en"
    location_time = get_real_time_for_location(guess.location)
    print(lang)
    print (MESSAGES[lang])
    if guess.guessed_time == location_time:
        guesses_collection.insert_one(guess.dict())
        return {"message": MESSAGES[lang]["winning"], "isWin": 1}
    else:
        return {"message": MESSAGES[lang]["losing"], "isWin": 0}

@app.get("/results")
async def get_results():
    """Fetch all guesses from MongoDB and return them."""
    results = list(guesses_collection.find({}, {"_id": 0}))
    return results
