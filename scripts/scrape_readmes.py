#!/usr/bin/env python3
"""
Scrapes all public GitHub repos for a given user and saves their READMEs.

Usage:
    python scripts/scrape_readmes.py
    python scripts/scrape_readmes.py --user apotato369550
    python scripts/scrape_readmes.py --user apotato369550 --out references/readmes
    python scripts/scrape_readmes.py --token ghp_xxxx  # avoid rate limiting
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

# Auto-load .env from the same directory as this script
_env_file = Path(__file__).parent / ".env"
if _env_file.exists():
    for _line in _env_file.read_text().splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _k, _v = _line.split("=", 1)
            os.environ.setdefault(_k.strip(), _v.strip())


API_BASE = "https://api.github.com"
DEFAULT_USER = "apotato369550"
DEFAULT_OUT = Path(__file__).parent.parent / "references" / "readmes"


def get(url: str, token: str | None = None) -> dict | list:
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def get_raw(url: str, token: str | None = None) -> str:
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github.raw+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req) as resp:
        raw = resp.read()
        for enc in ("utf-8", "utf-8-sig", "latin-1"):
            try:
                return raw.decode(enc)
            except UnicodeDecodeError:
                continue
        return raw.decode("utf-8", errors="replace")


def fetch_all_repos(user: str, token: str | None) -> list[dict]:
    repos = []
    page = 1
    while True:
        url = f"{API_BASE}/users/{user}/repos?type=public&per_page=100&page={page}"
        batch = get(url, token)
        if not batch:
            break
        repos.extend(batch)
        page += 1
    return repos


def fetch_readme(repo_full_name: str, token: str | None) -> str | None:
    url = f"{API_BASE}/repos/{repo_full_name}/readme"
    try:
        meta = get(url, token)
        # meta.download_url gives direct raw link
        raw_url = meta.get("download_url")
        if raw_url:
            return get_raw(raw_url, token)
        return None
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise


def main():
    parser = argparse.ArgumentParser(description="Scrape READMEs from a GitHub user's public repos.")
    parser.add_argument("--user", default=DEFAULT_USER, help=f"GitHub username (default: {DEFAULT_USER})")
    parser.add_argument("--out", default=str(DEFAULT_OUT), help="Output directory for README files")
    parser.add_argument("--token", default=os.environ.get("GITHUB_TOKEN"), help="GitHub token (or set GITHUB_TOKEN env var)")
    parser.add_argument("--delay", type=float, default=0.3, help="Seconds between requests (default: 0.3)")
    args = parser.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Fetching public repos for @{args.user}...")
    repos = fetch_all_repos(args.user, args.token)
    print(f"Found {len(repos)} repos.")

    saved = 0
    skipped = 0
    index = []  # [{name, description, readme_file}]

    for repo in repos:
        name = repo["name"]
        full_name = repo["full_name"]
        description = repo.get("description") or ""

        print(f"  [{name}] fetching README...", end=" ", flush=True)
        time.sleep(args.delay)

        readme = fetch_readme(full_name, args.token)
        if readme is None:
            print("none")
            skipped += 1
            index.append({"name": name, "description": description, "readme_file": None})
            continue

        out_file = out_dir / f"{name}.md"
        out_file.write_text(readme, encoding="utf-8")
        print(f"saved -> {out_file.name}")
        saved += 1
        index.append({"name": name, "description": description, "readme_file": str(out_file.name)})

    # Write an index so the site knows what exists
    index_file = out_dir / "_index.json"
    index_file.write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nDone. {saved} READMEs saved, {skipped} repos had none.")
    print(f"Output: {out_dir}")
    print(f"Index:  {index_file}")


if __name__ == "__main__":
    main()
