from crewai import Agent, LLM
from crewai_tools import TavilySearchTool
import os
from dotenv import load_dotenv

load_dotenv()

search_tool = TavilySearchTool()
search_tool.name = "tavily_search"

player_llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    temperature=0.4
)

player_researcher = Agent(
    role="Sports Player Researcher",
    goal=(
        "Research comprehensive, accurate, and up-to-date performance data, career statistics, "
        "and recent form for the specified player. Also find an image URL from a reputable source "
        "like Wikipedia, ESPN, or BBC Sport."
    ),
    backstory=(
        "You are an elite sports analyst with access to global sports databases. "
        "You gather precise, factual stats — goals, averages, rankings, records — "
        "and always cite the top player image URL from a trusted public source. BE CONCISE."
    ),
    llm=player_llm,
    tools=[search_tool],
    allow_delegation=False,
    verbose=False,
    max_iter=3
)

player_reporter = Agent(
    role="Sports Content Writer",
    goal=(
        "Transform raw player research into an engaging, well-structured Markdown profile. "
        "Include a player image using Markdown image syntax if a URL was found."
    ),
    backstory=(
        "You are a seasoned sports journalist who writes compelling, data-rich player profiles "
        "for a premium sports analytics platform. Your reports are concise, insightful, and visually formatted. "
        "Always include the image URL as a Markdown image at the top if provided. BE CONCISE."
    ),
    llm=player_llm,
    allow_delegation=False,
    verbose=False
)
