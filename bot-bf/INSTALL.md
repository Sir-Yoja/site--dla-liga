# Установка

1. Скопировать `.env.example` в `.env`.
2. Заполнить токены.
3. Установить зависимости:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

4. Запустить:

```powershell
.\.venv\Scripts\python.exe app.py
```

## VK

У сообщества должны быть включены:
- сообщения;
- Long Poll API;
- событие `poll_vote_new`;
- права доступа сообщества для работы с сообщениями и опросами.

Бот сам пытается включить `poll_vote_new` через API при запуске.

## Telegram

Бот должен находиться в группе и иметь право отправлять сообщения и опросы.

Для получения `poll_answer` опрос должен быть:
- отправлен самим ботом;
- неанонимным.

В этой версии Telegram-опрос создаётся именно так.


### VK_USER_TOKEN

Add this line to your own `.env`:

`VK_USER_TOKEN=...`

It is a personal VK access token with permission to work with polls. Keep it private. The existing `VK_TOKEN` remains the community token.
