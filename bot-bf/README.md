# Football Bot — native Telegram + VK polls

Новая версия построена вокруг **нативных опросов самих платформ**.

## Что теперь делает бот

1. Игра имеет единый идентификатор — дату:
   `07.09.2026`

2. Для одной даты можно отдельно настроить:
   - Telegram-опрос;
   - VK-опрос.

3. В назначенное время бот создаёт:
   - настоящий Telegram Poll;
   - настоящий VK Poll.

4. Голоса сохраняются в общей SQLite-базе.

5. Telegram использует неанонимный native Poll и разрешает переголосование.

6. VK использует публичный native Poll и событие `poll_vote_new`.

7. После каждого голоса администратор получает актуальный отчёт.

8. Лимит применяется к суммарному числу участников, выбравших первый вариант.
   Все следующие попадают в очередь.

## Пример

### Создать игру

```text
/game 07.09.2026 | 1/4 поля, 21 человек | 20:30-22:00 | улица Новая Дорога, 11с3 | 21
```

### Настроить Telegram

```text
/setpoll 07.09.2026 | telegram | Кто будет играть? | Ах ты Сукин ты Сын! Я в деле!😎 | Жаль, что минус😵‍💫
```

### Настроить VK

```text
/setpoll 07.09.2026 | vk | Кто будет играть? | Ах ты Сукин ты Сын! Я в деле!😎 | Жаль, что минус😵‍💫
```

### Запланировать

```text
/schedule 07.09.2026 | 07.09.2026 18:30
```

### Для быстрого теста без расписания

```text
/sendpoll 07.09.2026
```

## Важно про изображения

Telegram: можно указать локальный файл в `TELEGRAM_POLL_IMAGE`.
Бот отправит картинку перед нативным Telegram Poll.

VK: у native poll есть собственное поле `photo_id`.
Для него нужен VK `photo_id`; он задаётся через `VK_POLL_PHOTO_ID`.

## Важно про VK

Чтобы бот получал голоса в публичном опросе, включается `poll_vote_new`.
Код пытается включить это через `groups.setLongPollSettings` автоматически.

Опрос VK создаётся от имени сообщества (`owner_id=-VK_GROUP_ID`) и отправляется в беседу как attachment.

## Ограничение лимита

Нативный опрос сам по себе не знает про наш лимит в 21 человека.
Поэтому бот не запрещает 22-му голосовать технически — он записывает 22-го в очередь.

Это сделано намеренно: так сохраняется полный список голосовавших.

## Профили

Для VK бот сохраняет ссылку на профиль пользователя.

Для Telegram:
- при наличии username — ссылка `https://t.me/...`;
- без username используется `tg://user?id=...`.

## Запуск

```powershell
.\.venv\Scripts\python.exe app.py
```

PowerShell activation не нужен.

## Что пока не делает эта версия

Это первая рабочая основа нового native-poll ядра. Отдельную красивую админ-панель/мастер настройки пока не добавляла — команды позволяют проверить всю механику без нового интерфейса.


## VK: two tokens

The VK bot uses two different tokens by design:

- `VK_TOKEN` — community token for messages, Long Poll and bot operation.
- `VK_USER_TOKEN` — personal user token used only for `polls.create` / `polls.getById`, because these poll methods return VK error 27 when called with community authorization.

The native poll itself is created with the community as `owner_id`, so the poll belongs to the community.
