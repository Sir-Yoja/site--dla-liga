import threading
from config import validate
from db import init_db
from vk_bot import run
from scheduler import vk_scheduler

def main():
    validate(); init_db()
    threading.Thread(target=run,daemon=True,name='vk-long-poll').start()
    threading.Thread(target=vk_scheduler,args=(lambda d: __import__('vk_bot').create_native_poll(d),),daemon=True,name='vk-scheduler').start()
    print('VK football bot started')
    threading.Event().wait()
if __name__=='__main__': main()
