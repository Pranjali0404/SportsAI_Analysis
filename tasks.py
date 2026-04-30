from datetime import datetime
from crewai import Task

# Updated to accept 'query' as the first argument
def create_tasks(query, planner, analyst, reporter):
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Task 1: Research (LITE)
    research_task = Task(
        description=f"Find scores, stats (run rates/partnerships), and 2 turning points for {query}. Get 1 image URL for the top player via Wikipedia. BE BRIEF.",
        expected_output="Actual scores, key stats, 2 turning points, top player name and image URL.",
        agent=planner
    )

    # Task 2: Validate (LITE)
    validation_task = Task(
        description="Check if MatchStats_DB is online. Confirm image URLs are present.",
        expected_output="Database status and URL confirmation.",
        agent=analyst
    )

    # Task 3: Report (LITE)
    reporting_task = Task(
        description="Create a Markdown report with: Summary, Stats, Turning Points, and Top Performer Image.",
        expected_output="Final Markdown report with clear headers and images.",
        agent=reporter,
        context=[research_task, validation_task]
    )

    return [research_task, validation_task, reporting_task]
