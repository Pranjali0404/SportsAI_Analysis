import os
from dotenv import load_dotenv
load_dotenv()

try:
    from crewai import Crew, Process
    from agents import planner_agent, analyst_agent, reporter_agent
    from tasks import create_tasks

    print(f"Using GROQ Key ending in: ...{os.getenv('GROQ_API_KEY')[-4:]}")
    tasks = create_tasks("India vs australia", planner_agent, analyst_agent, reporter_agent)
    crew = Crew(
        agents=[planner_agent, analyst_agent, reporter_agent],
        tasks=tasks,
        process=Process.sequential
    )
    result = crew.kickoff()
    print("SUCCESS! Output:")
    print(result)
except Exception as e:
    print(f"FAILED: {e}")
