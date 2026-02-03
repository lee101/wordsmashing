#!/usr/bin/env python3
import time
import subprocess
import urllib.request
from urllib.error import URLError, HTTPError
from datetime import datetime, timezone

URL = "https://wordsmashing.v5games.com"
CHECK_INTERVAL = 900  # 15 minutes
LOG_FILE = "/home/lee/code/wordsmashing/monitors/monitor_site.log"

CLAUDE_PROMPT = """wordsmashing.v5games.com is DOWN and not responding.

Investigate and fix this issue. Here's what you need to know:

## Services
- Main app: supervisor process `wordsmashing` running uvicorn on port 9799
- Cloudflare tunnel: supervisor process `cloudflared-wordsmashing` connecting to Cloudflare

## Commands to check status (sudo pw: ilu)
- sudo supervisorctl status wordsmashing cloudflared-wordsmashing
- curl http://localhost:9799/
- curl https://wordsmashing.v5games.com/

## Logs
- Main app: /var/log/supervisor/wordsmashing.log and wordsmashing-error.log
- Cloudflared: /var/log/supervisor/cloudflared-wordsmashing.log and cloudflared-wordsmashing-error.log

## To restart services (sudo pw: ilu)
- sudo supervisorctl restart wordsmashing
- sudo supervisorctl restart cloudflared-wordsmashing

## Project location
/home/lee/code/wordsmashing

## Tunnel info
- Tunnel name: wordsmashingprod2
- Tunnel ID: 91845a76-d46c-410c-b307-b5d6b66efaac
- Config: /home/lee/code/wordsmashing/wordsmashing-cloudflared.yml
- Credentials: /home/lee/.cloudflared/91845a76-d46c-410c-b307-b5d6b66efaac.json

## Common issues
- Tunnel disconnected: restart cloudflared-wordsmashing
- App crashed: check error log, restart wordsmashing
- DNS routing issue: cloudflared tunnel route dns --overwrite-dns wordsmashingprod2 wordsmashing.v5games.com

## Verify fix
After fixing, verify with:
- curl https://wordsmashing.v5games.com/
- jscheck https://wordsmashing.v5games.com/campaign/easy/1 (check for console errors)

Fix the issue so the site responds again."""


def log(message: str) -> None:
    ts = datetime.now(timezone.utc).isoformat()
    with open(LOG_FILE, "a") as fh:
        fh.write(f"{ts} {message}\n")
    print(f"{ts} {message}")


def check_site(url: str, timeout: int = 15) -> bool:
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 Monitor"},
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status < 400
    except (HTTPError, URLError, ValueError, TimeoutError) as e:
        log(f"Error checking {url}: {e}")
        return False


def run_claude_agent() -> None:
    log("Launching claude agent to investigate...")
    subprocess.Popen(
        ["claude", "--dangerously-skip-permissions", "-p", CLAUDE_PROMPT],
        cwd="/home/lee/code/wordsmashing",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main():
    log(f"Starting monitor for {URL}, interval={CHECK_INTERVAL}s")
    last_down = False

    while True:
        ok = check_site(URL)
        if ok:
            log(f"{URL} UP")
            last_down = False
        else:
            log(f"{URL} DOWN")
            if not last_down:
                run_claude_agent()
            last_down = True

        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
