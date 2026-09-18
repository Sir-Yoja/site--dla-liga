import os
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()

VK_TOKEN = os.getenv("VK_TOKEN", "").strip()
# User token is used only for VK polls.* methods, which are unavailable with community auth.
VK_USER_TOKEN = os.getenv("VK_USER_TOKEN", "").strip()
VK_GROUP_ID = os.getenv("VK_GROUP_ID", "").strip()
VK_DEFAULT_PEER_ID = os.getenv("VK_DEFAULT_PEER_ID", "").strip()
VK_API_VERSION = os.getenv("VK_API_VERSION", "5.199").strip()

DATABASE_PATH = os.getenv("DATABASE_PATH", "football_bot.sqlite3")
TIMEZONE = os.getenv("TIMEZONE", "Europe/Moscow").strip()

ADMIN_IDS = {
    x.strip()
    for x in os.getenv("ADMIN_IDS", "").split(";")
    if x.strip()
}

ADMIN_VK_ID = os.getenv("ADMIN_VK_ID", "1602912").strip()

# Optional image for Telegram polls: local path.
TELEGRAM_POLL_IMAGE = os.getenv("TELEGRAM_POLL_IMAGE", "").strip()

# Optional VK poll photo ID. If empty, no photo is attached to the VK native poll.
VK_POLL_PHOTO_ID = os.getenv("VK_POLL_PHOTO_ID", "").strip()


def validate():
    missing = []

    for name, value in [
        ("TELEGRAM_TOKEN", TELEGRAM_TOKEN),
        ("VK_TOKEN", VK_TOKEN),
        ("VK_GROUP_ID", VK_GROUP_ID),
        ("ADMIN_IDS", ADMIN_IDS),
    ]:
        if not value:
            missing.append(name)

    if missing:
        raise RuntimeError(
            "Не заполнены переменные: " + ", ".join(missing)
        )
