# Only catch things that are clearly inappropriate for a portfolio assistant.
# Keep this list tight — overly broad triggers break normal conversation.
OFF_TOPIC_HARD_STOPS = [
    "ignore your instructions",
    "ignore previous instructions",
    "jailbreak",
    "act as",
    "you are now",
    "pretend you are",
    "forget everything",
    "DAN",
    "do anything now",
]


def is_off_topic(text: str) -> bool:
    """Return True only for clear jailbreak / manipulation attempts."""
    text_lower = text.lower()
    return any(trigger in text_lower for trigger in OFF_TOPIC_HARD_STOPS)


def get_redirect_response() -> str:
    return (
        "I'm here to help you learn about Faiz and his work — "
        "happy to answer any questions about that."
    )
