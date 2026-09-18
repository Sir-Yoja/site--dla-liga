from db import get_game, get_game_registrations
from config import ADMIN_IDS, TELEGRAM_TOKEN


def build_report(game_date):
    game = get_game(game_date)

    if not game:
        return f"Игра {game_date} не найдена."

    rows = get_game_registrations(
        game_date,
        "vk",
    )

    tg_rows = get_game_registrations(
        game_date,
        "telegram",
    )

    limit = int(game["capacity"] or 0)

    def split(rows):
        yes = []
        no = []
        other = []

        for row in rows:
            item = (
                f"[{row['name']}]"
                if row["profile_url"]
                else row["name"]
            )

            if row["status"] == "yes":
                yes.append(
                    (item, row["profile_url"])
                )
            elif row["status"] == "no":
                no.append(
                    (item, row["profile_url"])
                )
            else:
                other.append(
                    (item, row["profile_url"])
                )

        return yes, no, other

    vk_yes, vk_no, vk_other = split(rows)
    tg_yes, tg_no, tg_other = split(tg_rows)

    all_yes = (
        [(x, u, "VK") for x, u in vk_yes]
        + [(x, u, "Telegram") for x, u in tg_yes]
    )

    # The limit is applied to the combined list.
    active = all_yes[:limit] if limit else all_yes
    queue = all_yes[limit:] if limit else []

    def format_person(item):
        text, url = item
        if url:
            return f"{text} — {url}"
        return text

    lines = [
        f"⚽ {game_date}",
        f"{game['title']}",
        f"🕐 {game['game_time']}",
    ]

    if limit:
        lines.append(
            f"Лимит: {limit}"
        )

    lines.append("")
    lines.append(
        f"УЧАСТНИКИ ({len(active)})"
    )

    for index, (name, url, platform) in enumerate(
        active,
        start=1,
    ):
        lines.append(
            f"{index}. {name} — {platform}"
        )

    if queue:
        lines.append("")
        lines.append(
            f"ОЧЕРЕДЬ ({len(queue)})"
        )

        for index, (name, url, platform) in enumerate(
            queue,
            start=1,
        ):
            lines.append(
                f"{index}. {name} — {platform}"
            )

    lines.append("")
    lines.append(
        f"VK: идут {len(vk_yes)}, "
        f"не идут {len(vk_no)}"
    )
    lines.append(
        f"Telegram: идут {len(tg_yes)}, "
        f"не идут {len(tg_no)}"
    )

    return "\n".join(lines)


async def notify_admin(game_date):
    """Send the single central admin report to Telegram only."""
    text = build_report(game_date)

    if not ADMIN_IDS:
        return

    try:
        from telegram import Bot
        bot = Bot(TELEGRAM_TOKEN)
        for admin_id in ADMIN_IDS:
            try:
                await bot.send_message(
                    chat_id=int(admin_id),
                    text=text,
                )
            except Exception as exc:
                print("Admin Telegram notification error:", exc)
    except Exception as exc:
        print("Admin Telegram setup error:", exc)
