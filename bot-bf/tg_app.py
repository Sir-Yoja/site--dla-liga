from config import validate
from db import init_db
from telegram_bot import build_application

def main():
    validate(); init_db(); print('Telegram football bot started'); build_application().run_polling(allowed_updates=['message','poll_answer'])
if __name__=='__main__': main()
