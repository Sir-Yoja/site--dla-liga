def split_options(raw):
    return [x.strip() for x in raw.split("|") if x.strip()]


def normalize_date(raw):
    raw = raw.strip()
    # We intentionally use the game date itself as the single identifier.
    parts = raw.replace("/", ".").replace("-", ".").split(".")
    if len(parts) != 3:
        raise ValueError("Дата должна быть в формате ДД.ММ.ГГГГ")

    day, month, year = [int(x) for x in parts]
    if year < 100:
        year += 2000

    return f"{day:02d}.{month:02d}.{year:04d}"


def normalize_datetime(date_str, time_str):
    from datetime import datetime
    dt = datetime.strptime(
        f"{date_str} {time_str}",
        "%d.%m.%Y %H:%M"
    )
    return dt


def profile_url_telegram(user):
    if getattr(user, "username", None):
        return f"https://t.me/{user.username}"

    return f"tg://user?id={user.id}"


def status_from_option(option_index):
    # The first two options are the football attendance choices.
    if option_index == 0:
        return "yes"
    if option_index == 1:
        return "no"
    return f"option_{option_index}"
