import os
import requests
from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import datetime
from dotenv import load_dotenv

load_dotenv()

# Local imports
from database import add_user, check_user, add_history, get_history, reset_password
from agents import planner_agent, analyst_agent, reporter_agent
from tasks import create_tasks
from player_agent import player_researcher, player_reporter
from player_tasks import create_player_tasks
from crewai import Crew, Process

app = FastAPI(title="Sportlytics API", description="Backend for real-time sports analysis")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class UserAuth(BaseModel):
    email: str
    password: str
    username: Optional[str] = None

class AnalysisRequest(BaseModel):
    user_id: int
    query: str

class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str

class PlayerRequest(BaseModel):
    player_name: str
    user_id: Optional[int] = None

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "Sportlytics API is active"}

# Authentication
@app.post("/auth/signup")
async def signup(user: UserAuth):
    if not user.username or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    success = add_user(user.username, user.email, user.password)
    if success:
        return {"message": "User created successfully"}
    else:
        raise HTTPException(status_code=400, detail="User already exists")

@app.post("/auth/login")
async def login(user: UserAuth):
    db_user = check_user(user.email, user.password)
    if db_user:
        return {
            "id": db_user[0],
            "username": db_user[1],
            "email": user.email
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/auth/reset-password")
async def reset_pw(request: ResetPasswordRequest):
    success = reset_password(request.email, request.new_password)
    if success:
        return {"message": "Password reset successfully"}
    else:
        raise HTTPException(status_code=404, detail="Email not found")

# History
@app.get("/history/{user_id}")
async def fetch_history(user_id: int):
    results = get_history(user_id)
    # Format results: (query, result, timestamp)
    history_list = []
    for row in results:
        history_list.append({
            "query": row[0],
            "result": row[1],
            "timestamp": row[2]
        })
    return history_list

# Analysis
@app.post("/analyze")
async def analyze(request: AnalysisRequest):
    try:
        # 1. Create tasks based on the query
        tasks = create_tasks(
            request.query, 
            planner_agent, 
            analyst_agent, 
            reporter_agent
        )

        # 2. Setup the crew
        crew = Crew(
            agents=[planner_agent, analyst_agent, reporter_agent],
            tasks=tasks,
            process=Process.sequential,
            verbose=True
        )

        # 3. Kickoff analysis
        result = crew.kickoff()
        
        # 4. Save to history
        result_str = str(result)
        add_history(request.user_id, request.query, result_str)

        return {
            "query": request.query,
            "result": result_str,
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        import traceback
        error_msg = str(e)
        print(f"Error during analysis: {error_msg}")
        traceback.print_exc()
        
        # Highlighting API-related issues for the user
        if "Unauthorized" in error_msg or "Invalid API Key" in error_msg:
            detail = "API Authentication Failed: Please check your TAVILY_API_KEY or GROQ_API_KEY in the .env file."
        elif "rate limit" in error_msg.lower():
            detail = "API Rate Limit Exceeded: Please wait a moment or upgrade your API plan."
        else:
            detail = f"Analysis Failed: {error_msg[:100]}..."
            
        raise HTTPException(status_code=500, detail=detail)

# ─── Helper: Wikipedia Image Fetch (FREE — No API Key Needed) ────────────────
def fetch_player_image_wikipedia(player_name: str) -> Optional[str]:
    """Fetch a player image URL from Wikipedia REST API. Completely free, no key required."""
    try:
        # Step 1: Search Wikipedia for the player
        search_url = "https://en.wikipedia.org/w/api.php"
        search_params = {
            "action": "query",
            "list": "search",
            "srsearch": f"{player_name} sportsperson",
            "format": "json",
            "srlimit": 1
        }
        headers = {"User-Agent": "Sportlytics/1.0 (sports analytics app)"}
        search_resp = requests.get(search_url, params=search_params, headers=headers, timeout=8)
        search_resp.raise_for_status()
        search_results = search_resp.json().get("query", {}).get("search", [])
        if not search_results:
            return None

        page_title = search_results[0]["title"]

        # Step 2: Get the page thumbnail image
        image_params = {
            "action": "query",
            "titles": page_title,
            "prop": "pageimages",
            "format": "json",
            "pithumbsize": 400
        }
        image_resp = requests.get(search_url, params=image_params, headers=headers, timeout=8)
        image_resp.raise_for_status()
        pages = image_resp.json().get("query", {}).get("pages", {})
        for page in pages.values():
            thumb = page.get("thumbnail", {}).get("source")
            if thumb:
                return thumb
    except Exception as e:
        print(f"[Wikipedia] Image fetch failed: {e}")
    return None


# ─── Player Content Agent Endpoint ───────────────────────────────────────────
@app.post("/player/generate")
async def generate_player_content(request: PlayerRequest):
    if not request.player_name.strip():
        raise HTTPException(status_code=400, detail="Player name is required.")
    try:
        # 1. Fetch player image from Wikipedia (free, no storage)
        image_url = fetch_player_image_wikipedia(request.player_name)

        # 2. Run CrewAI player crew
        tasks = create_player_tasks(
            request.player_name,
            player_researcher,
            player_reporter
        )
        crew = Crew(
            agents=[player_researcher, player_reporter],
            tasks=tasks,
            process=Process.sequential,
            verbose=False
        )
        result = crew.kickoff()
        result_str = str(result)

        return {
            "player_name": request.player_name,
            "report": result_str,
            "image_url": image_url,  # None if Google CSE not configured
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        import traceback
        print(f"[Player Agent] Error: {e}")
        traceback.print_exc()
        if "rate limit" in str(e).lower():
            detail = "API Rate Limit Exceeded. Please wait a moment and try again."
        elif "Unauthorized" in str(e) or "Invalid API Key" in str(e):
            detail = "API Authentication Failed. Check your GROQ_API_KEY or TAVILY_API_KEY."
        else:
            detail = f"Player content generation failed: {str(e)[:120]}"
        raise HTTPException(status_code=500, detail=detail)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
