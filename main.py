import os
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
