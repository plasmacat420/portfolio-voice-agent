from livekit.agents import WorkerOptions, cli

from agent.zara import ZaraAgent


async def entrypoint(ctx):
    agent = ZaraAgent()
    await agent.start(ctx)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
