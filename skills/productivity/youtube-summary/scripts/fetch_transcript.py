# /// script
# requires-python = ">=3.10"
# dependencies = ["youtube-transcript-api>=0.6"]
# ///

from __future__ import annotations

import argparse
import json
import re
from dataclasses import asdict, dataclass
from urllib.parse import parse_qs, urlparse


@dataclass
class CaptionLine:
    start: float
    duration: float
    text: str


def parse_video_id(value: str) -> str:
    value = value.strip()
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", value):
        return value

    parsed = urlparse(value)
    host = parsed.netloc.lower()
    path = parsed.path.strip("/")

    if host.endswith("youtu.be") and path:
        return path.split("/")[0]

    if "youtube.com" in host:
        query_id = parse_qs(parsed.query).get("v", [None])[0]
        if query_id:
            return query_id

        parts = path.split("/")
        for marker in ("shorts", "embed", "live"):
            if marker in parts:
                idx = parts.index(marker)
                if idx + 1 < len(parts):
                    return parts[idx + 1]

    raise SystemExit(f"Could not parse a YouTube video ID from: {value}")


def normalize_languages(value: str | None) -> list[str] | None:
    if not value:
        return None
    languages = [lang.strip() for lang in value.split(",") if lang.strip()]
    return languages or None


def fetch_lines(video_id: str, languages: list[str] | None) -> list[CaptionLine]:
    from youtube_transcript_api import YouTubeTranscriptApi

    try:
        raw = YouTubeTranscriptApi.get_transcript(video_id, languages=languages)
    except AttributeError:
        transcript = YouTubeTranscriptApi().fetch(video_id, languages=languages)
        raw = [
            {
                "start": item.start,
                "duration": item.duration,
                "text": item.text,
            }
            for item in transcript
        ]

    return [
        CaptionLine(
            start=float(item["start"]),
            duration=float(item.get("duration", 0.0)),
            text=str(item["text"]).replace("\n", " ").strip(),
        )
        for item in raw
        if str(item.get("text", "")).strip()
    ]


def timestamp(seconds: float) -> str:
    total = int(seconds)
    hours, remainder = divmod(total, 3600)
    minutes, secs = divmod(remainder, 60)
    if hours:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch a YouTube transcript.")
    parser.add_argument("url_or_id", help="YouTube URL, youtu.be link, Shorts link, or raw video ID")
    parser.add_argument("--language", help="Comma-separated language fallback chain, e.g. ko,en")
    parser.add_argument("--text-only", action="store_true", help="Print transcript text only")
    parser.add_argument("--timestamps", action="store_true", help="Print timestamped transcript lines")
    args = parser.parse_args()

    video_id = parse_video_id(args.url_or_id)
    lines = fetch_lines(video_id, normalize_languages(args.language))

    if args.text_only:
        print("\n".join(line.text for line in lines))
        return

    if args.timestamps:
        for line in lines:
            print(f"{timestamp(line.start)} {line.text}")
        return

    print(json.dumps({"video_id": video_id, "lines": [asdict(line) for line in lines]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
