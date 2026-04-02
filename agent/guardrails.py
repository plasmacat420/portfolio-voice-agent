OFF_TOPIC_TRIGGERS = [
    "politics",
    "religion",
    "personal life",
    "girlfriend",
    "boyfriend",
    "weather",
    "news",
    "sports",
    "movies",
    "music",
    "food",
    "travel",
    "tell me a joke",
    "roleplay",
    "pretend",
    "ignore your instructions",
    "jailbreak",
    "forget",
    "act as",
    "you are now",
    "DAN",
]


def is_off_topic(text: str) -> bool:
    """Return True if user message appears off-topic."""
    text_lower = text.lower()
    return any(trigger in text_lower for trigger in OFF_TOPIC_TRIGGERS)


def get_redirect_response() -> str:
    return (
        "I'm Zara, Faiz's professional assistant. I'm here to tell you about his "
        "background and how he can help your team. What would you like to know about his work?"
    )
