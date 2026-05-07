# AI Sports Analyst Platform

It is a premium, multi-agent AI application designed to provide deep, real-time sports analysis. It leverages a decoupled architecture with a FastAPI backend and a modern React frontend, using specialized AI agents to research live match data, analyze performance stats, and generate professional executive reports.

## ✨ Features

- **🔐 Secure Authentication**: Full auth flow including Signup, Login, and Password Reset.
- **🕵️ Multi-Agent System (CrewAI)**:
    - **Planner**: Researches live data and plans the analysis strategy.
    - **Analyst**: Validates technical feasibility and resource availability.
    - **Reporter**: Synthesizes findings into a comprehensive Markdown report.
    - **Player Agent**: Specialized agent for generating detailed player profiles with real-time stats and Wikipedia photos.
- **📊 Real-Time Data**: Integration with Tavily AI for the latest sports scores and news.
- **🎨 Premium UI**: Modern Dashboard with Glassmorphism design, smooth animations (Framer Motion), and responsive layout.
- **📂 User History**: Persistent storage of previous analysis reports for each user.
- **🐳 Docker Ready**: Full containerization for easy deployment using Docker Compose.

---

## 🚀 Tech Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for iconography
- **Axios** for API communication

### Backend
- **FastAPI** (Python 3.10+)
- **CrewAI** for multi-agent orchestration
- **Groq (Llama 3.3 70B)** for high-speed, intelligent reasoning
- **Tavily AI** for real-time web research
- **SQLite** for database management
- **Pydantic** for data validation

---

## 🛠️ Getting Started (Local Setup)

### 📋 Prerequisites
- **Python 3.10+**
- **Node.js & npm**
- API Keys from [Groq](https://console.groq.com/) and [Tavily](https://tavily.com/)

### 1. Setup Backend
1. Navigate to the root directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   .\venv\Scripts\activate   # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file:
   ```env
   GROQ_API_KEY=your_groq_key
   TAVILY_API_KEY=your_tavily_key
   ```
5. Run the backend:
   ```bash
   python main.py
   ```

### 2. Setup Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🐳 Docker Deployment

To run the entire stack using Docker:

1. Ensure Docker and Docker Compose are installed.
2. Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```
3. Access the app at `http://localhost:5173`.

---

## 🛠️ Project Structure
- `/` - FastAPI Backend, CrewAI Agents, and Logic
- `/frontend` - React/Vite/Tailwind Frontend
- `/database.py` - SQLite operations
- `/main.py` - FastAPI entry point
- `/agents.py` & `/tasks.py` - CrewAI configuration

---
