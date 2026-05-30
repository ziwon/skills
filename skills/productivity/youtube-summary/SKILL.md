---
name: youtube-summary
description: >-
  Summarize YouTube videos from a URL, youtu.be link, Shorts link, embed URL, or
  raw video ID. Use when I share a YouTube link and ask "요약", "정리", "transcript",
  "자막", "강의 노트", "영상 내용", "이거 봐줘", or want an Obsidian-ready Korean
  note with timestamps, key claims, quotes, and follow-up questions. Fetch the
  transcript first; do not invent content when captions are unavailable.
---

# YouTube Summary

Turn a YouTube video into a concise Korean working note grounded in the transcript.

## Procedure

1. Extract the transcript first. Prefer the bundled helper:

   ```sh
   uv run skills/productivity/youtube-summary/scripts/fetch_transcript.py "<youtube-url>" --language ko,en --timestamps
   ```

   If the user asks only for raw transcript, add `--text-only`. If the target language is
   clear from the request, put it first in the language list.
2. Validate the transcript before summarizing: non-empty, plausible language, timestamps
   present. If the requested language is unavailable, retry with `--language en,ko`, then
   with no language flag.
3. For long transcripts, chunk by timestamps. Summarize each chunk, then merge; preserve
   the timestamp range for any claim that depends on a specific section.
4. Output Korean by default unless the user asks otherwise. Keep it Obsidian-ready and
   skimmable.
5. If captions are disabled, unavailable, private, region-blocked, or the helper fails,
   say that directly and do not summarize from the title/thumbnail alone. Offer the next
   useful fallback: ask for pasted transcript, audio file, or another accessible source.

## Default output

Use this shape unless the user asks for a different format:

```md
# <video title or concise topic>

## 한 줄 요지
- <one sentence>

## 핵심 정리
- <claim> (`MM:SS`)
- <claim> (`MM:SS`)
- <claim> (`MM:SS`)

## 챕터
- `00:00` <section title> — <one-sentence summary>

## 인용 후보
- `MM:SS` <short paraphrased quote or exact quote if brief>

## 내 작업에 연결
- <why this matters / how I might use it>

## 후속 질문
- <question>
```

## Guardrails

- Do not present guesses as transcript-grounded facts.
- Keep direct quotes short and timestamped; paraphrase by default.
- Do not include sponsor reads, intros, or repeated calls to action unless they matter.
- Preserve uncertainty: if auto-captions are noisy, say so and mark weak claims.
- For Korean notes, use direct, technical prose with no filler.
