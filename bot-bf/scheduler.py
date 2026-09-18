from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import asyncio
from config import TIMEZONE
from db import due_polls, mark_poll_sent

def local_datetime_to_iso(dt):
    return dt.replace(tzinfo=ZoneInfo(TIMEZONE)).astimezone(timezone.utc).isoformat()

def now_iso(): return datetime.now(timezone.utc).isoformat()

async def telegram_scheduler(tg_app, send_func):
    while True:
        try:
            for row in due_polls(now_iso(), 'telegram'):
                try:
                    await send_func(tg_app.bot, row['game_date'])
                    mark_poll_sent(row['game_date'], 'telegram')
                except Exception as exc: print('Telegram scheduler error:', exc)
        except Exception as exc: print('Telegram scheduler error:', exc)
        await asyncio.sleep(10)

def vk_scheduler(send_func):
    while True:
        try:
            for row in due_polls(now_iso(), 'vk'):
                try:
                    send_func(row['game_date'])
                    mark_poll_sent(row['game_date'], 'vk')
                except Exception as exc: print('VK scheduler error:', exc)
        except Exception as exc: print('VK scheduler error:', exc)
        import time; time.sleep(10)
