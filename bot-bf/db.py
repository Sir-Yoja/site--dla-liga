import json
import sqlite3
from datetime import datetime, timezone
from config import DATABASE_PATH

def conn():
    c = sqlite3.connect(DATABASE_PATH, timeout=30)
    c.row_factory = sqlite3.Row
    return c

def init_db():
    with conn() as c:
        c.executescript('''
        CREATE TABLE IF NOT EXISTS games (
            game_date TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            game_time TEXT NOT NULL,
            location TEXT DEFAULT '',
            capacity INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS poll_configs (
            game_date TEXT NOT NULL,
            platform TEXT NOT NULL,
            question TEXT NOT NULL,
            options_json TEXT NOT NULL,
            image_path TEXT DEFAULT '',
            vk_photo_id TEXT DEFAULT '',
            PRIMARY KEY(game_date, platform)
        );
        CREATE TABLE IF NOT EXISTS polls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_date TEXT NOT NULL,
            platform TEXT NOT NULL,
            external_poll_id TEXT NOT NULL,
            message_id TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            UNIQUE(platform, external_poll_id)
        );
        CREATE TABLE IF NOT EXISTS registrations (
            game_date TEXT NOT NULL,
            platform TEXT NOT NULL,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            profile_url TEXT DEFAULT '',
            status TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            PRIMARY KEY(game_date, platform, user_id)
        );
        CREATE TABLE IF NOT EXISTS vk_poll_options (
            game_date TEXT NOT NULL,
            poll_id TEXT NOT NULL,
            option_id INTEGER NOT NULL,
            status TEXT NOT NULL,
            PRIMARY KEY(game_date, poll_id, option_id)
        );
        CREATE TABLE IF NOT EXISTS scheduled_polls (
            game_date TEXT NOT NULL,
            platform TEXT NOT NULL,
            send_at TEXT NOT NULL,
            sent INTEGER DEFAULT 0,
            PRIMARY KEY(game_date, platform)
        );
        ''')

def create_or_update_game(game_date, title, game_time, location='', capacity=0):
    with conn() as c:
        c.execute('''INSERT INTO games(game_date,title,game_time,location,capacity,created_at)
        VALUES(?,?,?,?,?,?) ON CONFLICT(game_date) DO UPDATE SET title=excluded.title,
        game_time=excluded.game_time,location=excluded.location,capacity=excluded.capacity''',
        (game_date,title,game_time,location,int(capacity or 0),datetime.now(timezone.utc).isoformat()))

def get_game(game_date):
    with conn() as c:
        return c.execute('SELECT * FROM games WHERE game_date=?',(game_date,)).fetchone()

def set_poll_config(game_date, platform, question, options, image_path='', vk_photo_id=''):
    with conn() as c:
        c.execute('''INSERT INTO poll_configs(game_date,platform,question,options_json,image_path,vk_photo_id)
        VALUES(?,?,?,?,?,?) ON CONFLICT(game_date,platform) DO UPDATE SET question=excluded.question,
        options_json=excluded.options_json,image_path=excluded.image_path,vk_photo_id=excluded.vk_photo_id''',
        (game_date,platform,question,json.dumps(options,ensure_ascii=False),image_path or '',vk_photo_id or ''))

def get_poll_config(game_date, platform):
    with conn() as c:
        row=c.execute('SELECT * FROM poll_configs WHERE game_date=? AND platform=?',(game_date,platform)).fetchone()
    if not row: return None
    d=dict(row); d['options']=json.loads(d['options_json']); return d

def add_poll(game_date, platform, external_poll_id, message_id=''):
    with conn() as c:
        c.execute('''INSERT OR REPLACE INTO polls(game_date,platform,external_poll_id,message_id,created_at)
        VALUES(?,?,?,?,?)''',(game_date,platform,str(external_poll_id),str(message_id or ''),datetime.now(timezone.utc).isoformat()))

def get_poll_by_external(platform, external_poll_id):
    with conn() as c:
        return c.execute('SELECT * FROM polls WHERE platform=? AND external_poll_id=?',(platform,str(external_poll_id))).fetchone()

def upsert_registration(game_date, platform, user_id, name, profile_url, status):
    with conn() as c:
        c.execute('''INSERT INTO registrations(game_date,platform,user_id,name,profile_url,status,updated_at)
        VALUES(?,?,?,?,?,?,?) ON CONFLICT(game_date,platform,user_id) DO UPDATE SET name=excluded.name,
        profile_url=excluded.profile_url,status=excluded.status,updated_at=excluded.updated_at''',
        (game_date,platform,str(user_id),name,profile_url,status,datetime.now(timezone.utc).isoformat()))

def get_registrations(game_date):
    with conn() as c:
        return c.execute('SELECT * FROM registrations WHERE game_date=? ORDER BY status,name',(game_date,)).fetchall()

def get_game_registrations(game_date, platform):
    with conn() as c:
        return c.execute('SELECT * FROM registrations WHERE game_date=? AND platform=? ORDER BY status,name',(game_date,platform)).fetchall()

def schedule_poll(game_date, platform, send_at):
    with conn() as c:
        c.execute('''INSERT OR REPLACE INTO scheduled_polls(game_date,platform,send_at,sent) VALUES(?,?,?,0)''',(game_date,platform,send_at))

def due_polls(now_iso, platform):
    with conn() as c:
        return c.execute('''SELECT * FROM scheduled_polls WHERE platform=? AND sent=0 AND send_at<=? ORDER BY send_at''',(platform,now_iso)).fetchall()

def mark_poll_sent(game_date, platform):
    with conn() as c:
        c.execute('UPDATE scheduled_polls SET sent=1 WHERE game_date=? AND platform=?',(game_date,platform))


def set_vk_poll_option(game_date, poll_id, option_id, status):
    with conn() as c:
        c.execute("INSERT OR REPLACE INTO vk_poll_options(game_date,poll_id,option_id,status) VALUES(?,?,?,?)",
                  (game_date,str(poll_id),int(option_id),status))

def get_vk_poll_option_statuses(game_date, poll_id):
    with conn() as c:
        return c.execute("SELECT option_id,status FROM vk_poll_options WHERE game_date=? AND poll_id=? ORDER BY rowid",
                         (game_date,str(poll_id))).fetchall()

def clear_vk_poll_options(game_date, poll_id):
    with conn() as c:
        c.execute("DELETE FROM vk_poll_options WHERE game_date=? AND poll_id=?",(game_date,str(poll_id)))
