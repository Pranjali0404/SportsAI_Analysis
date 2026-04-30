from crewai import Agent, LLM
from crewai_tools import TavilySearchTool
from sports_analysis import check_resource
import os
from dotenv import load_dotenv

load_dotenv()

search_tool = TavilySearchTool()
search_tool.name = "tavily_search"

local_llm = LLM(
    model="groq/llama-3.1-8b-instant", # Switched to 8b for higher TPM/RPM limits and better reliability
    temperature=0.3
)

planner_agent = Agent(
    role='Lead Sports Planner',
    goal='Research real-time sports data and plan analysis steps.',
    backstory="Expert sports strategist. BE CONCISE.",
    llm=local_llm,
    tools=[search_tool],
    allow_delegation=False,
    verbose=False,
    max_iter=2
)

analyst_agent = Agent(
    role='Resource Validator',
    goal='Verify tool availability.',
    backstory="Technical expert. BE CONCISE.",
    llm=local_llm,
    tools=[check_resource],
    allow_delegation=False,
    verbose=False,
    max_iter=1
)

reporter_agent = Agent(
    role="Chief Sports Editor",
    goal="Combine analysis into a final markdown report.",
    backstory="Expert editor. BE CONCISE.",
    llm=local_llm,
    allow_delegation=False,
    verbose=False
)
