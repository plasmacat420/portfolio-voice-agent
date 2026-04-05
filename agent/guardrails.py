OFF_TOPIC_HARD_STOPS = [
    # Clearly off-topic for a portfolio assistant
    "politics",
    "tell me a joke",
    "personal life",
    # Jailbreak attempts
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
    """Return True for clear off-topic or jailbreak attempts."""
    text_lower = text.lower()
    return any(trigger in text_lower for trigger in OFF_TOPIC_HARD_STOPS)


def get_redirect_response() -> str:
    return (
        "I'm Zara — I'm here to help you learn about Faiz and his work. "
        "What would you like to know?"
    )
