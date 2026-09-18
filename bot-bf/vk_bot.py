import json, random, requests, time
from config import VK_TOKEN,VK_GROUP_ID,VK_DEFAULT_PEER_ID,VK_API_VERSION,ADMIN_VK_ID
from db import (get_poll_config,add_poll,get_poll_by_external,upsert_registration,create_or_update_game,
                set_poll_config,set_vk_poll_option,get_vk_poll_option_statuses,clear_vk_poll_options)
from common import normalize_date

API='https://api.vk.com/method/'
EMPTY_KEYBOARD=json.dumps({'one_time': True, 'buttons': []}, ensure_ascii=False)

def vk(method,token=None,**params):
    params.update(access_token=(token or VK_TOKEN),v=VK_API_VERSION)
    r=requests.post(API+method,data=params,timeout=30).json()
    if 'error' in r: raise RuntimeError(str(r['error']))
    return r['response']

def send_vk_message(peer_id,message,clear_keyboard=True):
    params={'peer_id':peer_id,'random_id':random.randint(-2147483648,2147483647),'message':message}
    if clear_keyboard:
        params['keyboard']=EMPTY_KEYBOARD
    return vk('messages.send',**params)

def ensure_poll_vote_event():
    print('VK Long Poll: using community settings')

def get_vk_user(uid):
    try:
        users=vk('users.get',user_ids=str(uid),fields='screen_name')
        if users:
            u=users[0]
            name=f"{u.get('first_name','')} {u.get('last_name','')}".strip() or f'VK user {uid}'
            sn=u.get('screen_name')
            return name,(f'https://vk.com/{sn}' if sn else f'https://vk.com/id{uid}')
    except Exception as e:
        print('VK user lookup error:',e)
    return f'VK user {uid}',f'https://vk.com/id{uid}'

def process_poll_vote(event):
    obj=event.get('object',{})
    pid=obj.get('poll_id'); option=obj.get('option_id'); uid=obj.get('user_id')
    if not pid or option is None or not uid: return
    row=get_poll_by_external('vk',pid)
    if not row:
        print('VK poll vote for unknown poll:',pid)
        return
    game_date=row['game_date']
    mappings=get_vk_poll_option_statuses(game_date,pid)
    status=None
    for r in mappings:
        if int(r['option_id'])==int(option):
            status=r['status']; break

    # Manual-poll mode: no polls.getById and no VK user token are required.
    # For a fresh poll, the admin can calibrate automatically by voting YES first,
    # then NO. The first two distinct option IDs are mapped to yes/no.
    if status is None and len(mappings) < 2:
        status='yes' if len(mappings)==0 else 'no'
        set_vk_poll_option(game_date,pid,int(option),status)
        print(f'VK poll option learned: poll={pid} option={option} -> {status}')
    if status is None:
        print(f'VK poll option is unknown: poll={pid} option={option}. Use a fresh poll or clear mapping.')
        return

    name,url=get_vk_user(uid)
    upsert_registration(game_date,'vk',uid,name,url,status)
    print(f'VK vote saved: {game_date} {uid} {name} {status} (option_id={option})')

def attach_poll(game_date, raw_poll_id):
    raw=raw_poll_id.strip()
    # Accept either a numeric poll ID or VK widget identifier owner_polltoken.
    poll_id=raw.split('_',1)[0] if '_' in raw else raw
    poll_id=int(poll_id)
    add_poll(game_date,'vk',poll_id,'')
    clear_vk_poll_options(game_date,poll_id)
    return poll_id

def handle_message(event):
    obj=event.get('object',{}); msg=obj.get('message',{})
    text=(msg.get('text') or '').strip(); uid=msg.get('from_id'); peer=msg.get('peer_id')
    if str(uid)!=str(ADMIN_VK_ID) or not text.startswith('/'): return
    cmd,_,arg=text.partition(' ')
    parts=[x.strip() for x in arg.split('|')]
    try:
        if cmd in ('/clearkeyboard','/clear_keyboard'):
            send_vk_message(peer,'Старое меню убрано.')
        elif cmd=='/game' and len(parts)>=3:
            d=normalize_date(parts[0])
            create_or_update_game(d,parts[1],parts[2],parts[3] if len(parts)>3 else '',int(parts[4]) if len(parts)>4 and parts[4] else 0)
            send_vk_message(peer,f'Игра {d} сохранена.')
        elif cmd=='/setpoll' and len(parts)>=4:
            d=normalize_date(parts[0]); set_poll_config(d,'vk',parts[1],parts[2:])
            send_vk_message(peer,f'VK-опрос для {d} сохранён.')
        elif cmd=='/attachpoll' and len(parts)==2:
            d=normalize_date(parts[0]); pid=attach_poll(d,parts[1])
            send_vk_message(peer,f'VK-опрос {pid} привязан к игре {d}.\nДля калибровки: сначала проголосуй за первый вариант (ИДУ), затем за второй (НЕ ИДУ).')
        elif cmd=='/pollmap' and len(parts)==3:
            d=normalize_date(parts[0]); pid=int(parts[1]); yes_id=int(parts[2]);
            set_vk_poll_option(d,pid,yes_id,'yes')
            send_vk_message(peer,f'Для опроса {pid}: option_id {yes_id} = ИДУ. Второй вариант бот определит автоматически при первом голосе.')
        elif cmd=='/setpollimage' and len(parts)==2:
            send_vk_message(peer,'Для ручного VK-опроса картинка публикуется вместе с сообщением вручную. Эта команда не требуется.')
        elif cmd=='/sendpoll':
            send_vk_message(peer,'В ручном режиме VK-опрос создаётся и публикуется вручную. Используй /attachpoll после создания опроса.')
        else:
            send_vk_message(peer,'Неизвестная команда или неверный формат.')
    except Exception as e:
        send_vk_message(peer,f'Ошибка: {e}')

def run():
    ensure_poll_vote_event(); print('VK football bot starting...')
    lp=vk('groups.getLongPollServer',group_id=int(VK_GROUP_ID))
    server,key,ts=lp['server'],lp['key'],lp['ts']
    print('VK Long Poll connected')
    while True:
        try:
            r=requests.get(server,params={'act':'a_check','key':key,'wait':25,'ts':ts},timeout=35).json()
            if 'ts' in r: ts=r['ts']
            if r.get('failed'):
                lp=vk('groups.getLongPollServer',group_id=int(VK_GROUP_ID)); server,key,ts=lp['server'],lp['key'],lp['ts']; continue
            for event in r.get('updates',[]):
                print('VK EVENT:',json.dumps(event,ensure_ascii=False))
                if event.get('type')=='poll_vote_new': process_poll_vote(event)
                elif event.get('type')=='message_new': handle_message(event)
        except Exception as e:
            print('VK error:',e); time.sleep(2)
