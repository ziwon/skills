---
name: youtube-trend-research
description: >-
  Retrieve and rank the top 10 current YouTube trends for a target user segment.
  Use when the user asks for YouTube trends, trending topics, content ideas,
  market research, niche discovery, or audience-specific trend analysis for a
  demographic such as age 40-50, country, language, interests, or creator niche.
  Always gather fresh evidence before ranking; do not rely on memory.
---

# YouTube Trend Research

Find current YouTube trends and rank the top 10 for a specific audience. The output is a
research report, not a generic list: every trend needs evidence, URLs, and a clear
audience-fit argument.

## Inputs

If missing, infer reasonable defaults and state them:

- Target users: age range, country/region, language, interests, pain points, creator niche.
- Market: YouTube region and language, e.g. Korea/Korean or US/English.
- Scope: broad YouTube, a category, a keyword cluster, or competitor channels.
- Time window: today, last 7 days, last 30 days. Default to last 7 days for trend research.

Ask one sharp question only when the target segment or market is impossible to infer.

## Evidence Collection

Always collect fresh data. Prefer official or inspectable sources in this order:

1. YouTube Data API, if credentials are available:
   - `videos.list(chart=mostPopular, regionCode=..., videoCategoryId=...)`
   - `search.list(q=..., order=date|viewCount|relevance, publishedAfter=...)`
   - `videos.list(part=snippet,statistics,contentDetails,topicDetails)`
2. `yt-dlp` metadata for inspectable URLs, playlists, search queries, or channels:

   ```sh
   yt-dlp --dump-single-json --flat-playlist "URL_OR_SEARCH" > youtube-source.json
   yt-dlp --dump-json --simulate "ytsearch20:<query>" > youtube-search.jsonl
   ```

3. Web search for current public YouTube trend pages, creator/category roundups, Google
   Trends context, news, and social signals. Use multiple queries and record URLs.

Do not claim demographic certainty from YouTube metadata alone. Age fit is an inference
from topic, framing, channel audience, language, comments/title signals, and external
context.

## Ranking Method

Score candidates 1-5 on each dimension, then rank by total:

- Freshness: recent upload or recent acceleration.
- Momentum: views, view velocity, repeated appearances across sources, search/social lift.
- Audience fit: why the target users would care, in their life context and language.
- Content opportunity: can the user make a useful, differentiated video from it.
- Evidence strength: direct YouTube URLs and corroborating external sources.

Break ties by audience fit, not raw view count. Exclude trends that are viral but irrelevant
to the target users.

## Output

Use this Markdown shape:

```md
# YouTube trends for <target segment>

## Assumptions
- Region/language:
- Time window:
- Data sources:
- Confidence:

## Top 10 trends
| Rank | Trend | Why it fits <segment> | Evidence | Content angle |
|------|-------|------------------------|----------|---------------|
| 1 | <trend> | <specific audience-fit reasoning> | <YouTube URL + metric/source> | <video idea> |

## Signals I used
- Freshness:
- Momentum:
- Audience fit:
- Gaps/opportunities:

## Watchouts
- <sampling bias, weak evidence, missing API access, regional ambiguity, paid/political sensitivity>
```

For each trend, include at least one YouTube URL when available. If using web search
snippets or inferred metadata, label that evidence clearly.

## Guardrails

- Browse or query live data every time; YouTube trends are time-sensitive.
- Do not fabricate metrics. If exact views, dates, or demographics are unavailable, say so.
- Distinguish "popular on YouTube" from "likely relevant to this target segment."
- Avoid stereotypes. Explain age fit through concrete needs, media habits, purchase
  context, life stage, or topic affinity.
- For medical, financial, legal, political, or crisis topics, add risk notes and prefer
  authoritative sources.
- Do not download videos unless the user explicitly asks; use metadata and public pages for
  trend research.

## Relationship To Other Skills

- Use `youtube-summary` when the task is to summarize a specific video.
- Use `video-download` when the task is to save video/audio/subtitles locally.
- Use this skill when the task is audience-specific trend retrieval, ranking, and content
  ideation.
