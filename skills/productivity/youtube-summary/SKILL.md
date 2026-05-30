---
name: youtube-summary
description: >-
  Summarize YouTube videos from a URL, youtu.be link, Shorts link, embed URL, or
  raw video ID. Use when I share a YouTube link and ask "요약", "정리", "transcript",
  "자막", "강의 노트", "영상 내용", "이거 봐줘", or want an Obsidian-ready Korean
  note with timestamps, key claims, quotes, and follow-up questions. Also use
  when I ask for "lecture-summarization", "강의 요약", "긴 글로 재구성", or a
  comprehensive lecture-style article. Fetch the transcript first; do not invent
  content when captions are unavailable.
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
4. Choose the output mode:
   - Use **Default output** unless the user asks for a different format.
   - Use **lecture-summarization** when the user explicitly says `lecture-summarization`
     or asks for a comprehensive lecture/article reconstruction.
5. Output Korean by default unless the user asks otherwise. Keep it Obsidian-ready and
   skimmable.
6. If captions are disabled, unavailable, private, region-blocked, or the helper fails,
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

## Option: lecture-summarization

Use this mode when the user asks for `lecture-summarization`, "강의 요약",
"긴 글로 재구성", or a comprehensive article rather than a compact working note.

This mode reconstructs the transcript into a long-form reference article. It should be
expansive, but still grounded in the transcript. Do not add external facts unless the user
explicitly asks for research.

Before writing, infer:

- `video_minutes`: video length from metadata if available; otherwise estimate from the
  final transcript timestamp.
- `target_read_minutes`: `max(5, video_minutes // 4)` for videos longer than 15 minutes,
  otherwise `5`.
- `output_language`: Korean by default unless requested otherwise.

Use this instruction frame:

```md
You are an expert editor at a prestigious knowledge publication like Harvard Business
Review or MIT Technology Review.

Your task is to reconstruct a video transcript into a definitive, long-form article.

## Critical Context
- Video duration: <video_minutes> minutes
- Target reading time: ~<target_read_minutes> minutes
- Output language: <output_language>
- Critical rule: do not make a short abstract. Expand and elaborate. For long videos,
  each minute of video should translate into roughly 150-200 words of article text when
  the transcript supports that level of detail.

## Mission
Transform the raw transcript into authoritative reference material. A 5-minute read for a
long lecture is a failure; provide a deep-dive experience that justifies the target
reading time.

## Expansion Guidelines
1. Detail restoration: include every substantive anecdote, case study, supporting
   argument, and story arc from the speaker.
2. Structural depth: each major `##` section should contain several dense paragraphs when
   the transcript has enough material.
3. No omission: do not skip minor points when they carry nuance, assumptions, constraints,
   trade-offs, or examples.
4. Technical elaboration: when a technical term appears, explain its context, importance,
   and relationship to nearby concepts in the lecture.

## Content Requirements
- All major concepts and granular sub-points
- All examples, analogies, and step-by-step methodologies
- All key statistics and data points
- Comparisons, pros/cons, and trade-offs
- Common misconceptions and the speaker's rebuttals

## Writing Standards
- Write entirely in <output_language>.
- Tone: formal, analytical, and sophisticated.
- Structure:

# <compelling scholarly headline>
*~<target_read_minutes>분 읽기*

<Hook paragraph of 150+ words that sets the stage and explains why the topic matters now.>

## <Major Topic 1>
<Extensive explanation grounded in the transcript.>

## <Major Topic 2>
<Extensive explanation grounded in the transcript.>

<Add as many sections as needed to cover the duration proportionally.>

## Key Takeaways (Deep Analysis)
- **<Concept 1>**: <3-4 sentence analysis, not just a bullet summary.>

## 핵심 용어 및 개념 상세 정리
| 용어 | 맥락 및 심층 정의 |
|------|----------------|
| <Term 1> | <How this term was used in the lecture and why it matters.> |
```

For very long transcripts, produce chunk-level reconstructions first, then merge them into
one article. Preserve timestamps only when they help audit a specific claim; do not turn
this mode into a timestamped outline.

## Guardrails

- Do not present guesses as transcript-grounded facts.
- Keep direct quotes short and timestamped; paraphrase by default.
- Do not include sponsor reads, intros, or repeated calls to action unless they matter.
- Preserve uncertainty: if auto-captions are noisy, say so and mark weak claims.
- For Korean notes, use direct, technical prose with no filler.
