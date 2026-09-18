import os
import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, PollAnswerHandler
from config import TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, ADMIN_IDS
from common import normalize_date, normalize_datetime, profile_url_telegram, status_from_option
from db import create_or_update_game,get_game,set_poll_config,get_poll_config,add_poll,get_poll_by_external,upsert_registration,schedule_poll
from notifications import notify_admin
from scheduler import local_datetime_to_iso, telegram_scheduler

def is_admin(uid): return str(uid) in ADMIN_IDS

def game_cmd_text(): return '/game ДД.ММ.ГГГГ | Название | Время | Место | Лимит'

async def send_native_poll(bot, game_date):
    cfg=get_poll_config(game_date,'telegram')
    if not cfg: raise RuntimeError(f'Не настроен Telegram-опрос для {game_date}')
    if cfg['image_path'] and os.path.isfile(cfg['image_path']):
        with open(cfg['image_path'],'rb') as f: await bot.send_photo(chat_id=TELEGRAM_CHAT_ID,photo=f)
    msg=await bot.send_poll(chat_id=TELEGRAM_CHAT_ID,question=cfg['question'],options=cfg['options'],is_anonymous=False,allows_multiple_answers=False,allows_revoting=True,type='regular')
    add_poll(game_date,'telegram',msg.poll.id,msg.message_id)
    return msg

async def start(update, context):
    if update.effective_user and is_admin(update.effective_user.id):
        await update.message.reply_text('Telegram-бот управления.\n\n/game ДД.ММ.ГГГГ | Название | Время | Место | Лимит\n/setpoll ДД.ММ.ГГГГ | Вопрос | Вариант 1 | Вариант 2\n/setpollimage ДД.ММ.ГГГГ | C:\\path\\image.jpg\n/schedule ДД.ММ.ГГГГ | ДД.ММ.ГГГГ ЧЧ:ММ\n/sendpoll ДД.ММ.ГГГГ')

async def game_cmd(update,context):
    if not update.effective_user or not is_admin(update.effective_user.id): return
    parts=[x.strip() for x in update.message.text.partition(' ')[2].split('|')]
    if len(parts)<3: await update.message.reply_text('Формат: '+game_cmd_text()); return
    try:
        d=normalize_date(parts[0]); create_or_update_game(d,parts[1],parts[2],parts[3] if len(parts)>3 else '',int(parts[4]) if len(parts)>4 and parts[4] else 0)
        await update.message.reply_text(f'Игра {d} сохранена.')
    except Exception as e: await update.message.reply_text(f'Ошибка: {e}')

async def setpoll_cmd(update,context):
    if not update.effective_user or not is_admin(update.effective_user.id): return
    parts=[x.strip() for x in update.message.text.partition(' ')[2].split('|')]
    if len(parts)<4: await update.message.reply_text('/setpoll ДД.ММ.ГГГГ | Вопрос | Да | Нет'); return
    try:
        d=normalize_date(parts[0]); set_poll_config(d,'telegram',parts[1],parts[2:]); await update.message.reply_text(f'Telegram-опрос для {d} сохранён.')
    except Exception as e: await update.message.reply_text(f'Ошибка: {e}')

async def setpollimage_cmd(update,context):
    if not update.effective_user or not is_admin(update.effective_user.id): return
    parts=[x.strip() for x in update.message.text.partition(' ')[2].split('|')]
    if len(parts)!=2: await update.message.reply_text('/setpollimage ДД.ММ.ГГГГ | C:\\path\\image.jpg'); return
    try:
        d=normalize_date(parts[0]); cfg=get_poll_config(d,'telegram')
        if not cfg: raise ValueError('Сначала настройте /setpoll')
        set_poll_config(d,'telegram',cfg['question'],cfg['options'],image_path=parts[1]); await update.message.reply_text(f'Картинка Telegram для {d} сохранена.')
    except Exception as e: await update.message.reply_text(f'Ошибка: {e}')

async def schedule_cmd(update,context):
    if not update.effective_user or not is_admin(update.effective_user.id): return
    parts=[x.strip() for x in update.message.text.partition(' ')[2].split('|')]
    if len(parts)!=2: await update.message.reply_text('/schedule ДД.ММ.ГГГГ | ДД.ММ.ГГГГ ЧЧ:ММ'); return
    try:
        d=normalize_date(parts[0]); dt=normalize_datetime(*parts[1].split(' ',1)); schedule_poll(d,'telegram',local_datetime_to_iso(dt)); await update.message.reply_text(f'Telegram-опрос {d} запланирован на {parts[1]}.')
    except Exception as e: await update.message.reply_text(f'Ошибка: {e}')

async def sendpoll_cmd(update,context):
    if not update.effective_user or not is_admin(update.effective_user.id): return
    try: await send_native_poll(context.bot,normalize_date(update.message.text.partition(' ')[2])); await update.message.reply_text('Telegram-опрос отправлен.')
    except Exception as e: await update.message.reply_text(f'Ошибка: {e}')

async def poll_answer(update,context):
    ans=update.poll_answer; row=get_poll_by_external('telegram',ans.poll_id)
    if not row or not ans.user: return
    cfg=get_poll_config(row['game_date'],'telegram')
    if not cfg or not ans.option_ids: return
    idx=ans.option_ids[0]; status=status_from_option(idx)
    name=(ans.user.full_name or ans.user.username or str(ans.user.id)).strip()
    upsert_registration(row['game_date'],'telegram',ans.user.id,name,profile_url_telegram(ans.user),status)
    await notify_admin(row['game_date'])

async def post_init(app):
    # post_init runs before Application.start(); create_task here triggers PTB's warning.
    # asyncio.create_task starts the scheduler independently and cleanly.
    asyncio.create_task(telegram_scheduler(app,send_native_poll))

def build_application():
    app=Application.builder().token(TELEGRAM_TOKEN).post_init(post_init).build()
    for cmd,fn in [('start',start),('game',game_cmd),('setpoll',setpoll_cmd),('setpollimage',setpollimage_cmd),('schedule',schedule_cmd),('sendpoll',sendpoll_cmd)]: app.add_handler(CommandHandler(cmd,fn))
    app.add_handler(PollAnswerHandler(poll_answer)); return app
