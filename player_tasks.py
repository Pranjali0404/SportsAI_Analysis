from crewai import Task

def create_player_tasks(player_name: str, researcher, reporter):
    research_task = Task(
        description=(
            f"Search for {player_name}: sport, team, nationality, top 5 career stats, "
            f"recent season highlights, 2 major achievements. Be brief."
        ),
        expected_output=f"Key facts about {player_name}: sport, stats, achievements, image URL if found.",
        agent=researcher
    )

    report_task = Task(
        description=(
            f"Write a concise Markdown profile for {player_name} using the research. "
            f"Include: ## Name, **Sport | Team | Nationality**, "
            f"### Career Stats (bullets), ### Recent Form (bullets), "
            f"### Achievements (bullets). Max 250 words."
        ),
        expected_output=f"Short Markdown profile for {player_name} with stats, form, achievements.",
        agent=reporter,
        context=[research_task]
    )

    return [research_task, report_task]
