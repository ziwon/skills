---
name: video-download
description: >-
  Download videos, playlists, subtitles, thumbnails, chapters, and metadata with
  yt-dlp. Use when the user asks to save online video/audio locally, archive a
  playlist/channel, extract audio, fetch subtitles/transcripts, troubleshoot
  yt-dlp 403/signature/cookie/plugin issues, configure yt-dlp defaults, or use
  yt-dlp plugins such as PO token providers, Return YouTube Dislikes, DeArrow,
  ChromeCookieUnlock, or sample extractor/postprocessor plugins.
---

# Video Download

Use `yt-dlp` as the default downloader for video/audio archival tasks. Optimize for
repeatability: explicit output paths, dry-run metadata checks, archive files for batches,
and verification after the download.

## Procedure

1. Confirm the user has rights to download the content. Do not help bypass DRM, paywalls,
   account bans, or access controls. For private or age-restricted content, prefer normal
   authenticated access via cookies from the user's browser.
2. Identify the job shape: single URL vs playlist/channel, video vs audio-only, required
   quality/container, subtitle languages, metadata/thumbnail needs, and destination folder.
3. Check tools before running:

   ```sh
   yt-dlp --version
   ffmpeg -version
   yt-dlp --verbose --simulate "URL"
   ```

   If `yt-dlp` is missing, install or update with the environment's Python tool. In this
   repo default to `uv tool install yt-dlp` or `uv tool upgrade yt-dlp`; otherwise use the
   official binary or `python -m pip install -U "yt-dlp[default]"` only when that matches
   the user's environment.
4. Inspect before downloading:

   ```sh
   yt-dlp -F "URL"
   yt-dlp --dump-single-json --simulate "URL" > info.json
   yt-dlp --print "%(title)s [%(id)s] %(duration_string)s %(webpage_url)s" "URL"
   ```

5. Download with an explicit template. For general video:

   ```sh
   yt-dlp \
     -P "./downloads" \
     -o "%(uploader)s/%(upload_date>%Y-%m-%d)s - %(title).180B [%(id)s].%(ext)s" \
     -f "bv*[height<=1080]+ba/best[height<=1080]/best" \
     --merge-output-format mkv \
     --embed-metadata --embed-thumbnail --embed-chapters \
     --write-subs --write-auto-subs --sub-langs "en.*,ko.*" --sub-format "srt/best" \
     --download-archive "./downloads/.yt-dlp-archive.txt" \
     "URL"
   ```

   For audio-only:

   ```sh
   yt-dlp -P "./downloads/audio" -x --audio-format m4a --audio-quality 0 \
     --embed-metadata --embed-thumbnail \
     -o "%(uploader)s/%(upload_date>%Y-%m-%d)s - %(title).180B [%(id)s].%(ext)s" \
     "URL"
   ```

6. Verify outputs: file exists, playable container, expected subtitles/metadata, and
   archive entry written for batch jobs. Use `ffprobe` when available.

## Configuration

Put persistent defaults in the native config location, not in ad hoc shell aliases:

- Linux/macOS: `${XDG_CONFIG_HOME}/yt-dlp/config` or `~/.config/yt-dlp/config`
- Windows: `%APPDATA%\yt-dlp\config`

Starter config:

```conf
-o "%(uploader)s/%(upload_date>%Y-%m-%d)s - %(title).180B [%(id)s].%(ext)s"
-f "bv*[height<=1080]+ba/best[height<=1080]/best"
--merge-output-format mkv
--embed-metadata
--embed-thumbnail
--embed-chapters
--write-subs
--write-auto-subs
--sub-langs "en.*,ko.*"
--sub-format "srt/best"
--download-archive ".yt-dlp-archive.txt"
```

Use `--ignore-config` for one-off clean runs and `--config-locations PATH` when testing a
new config file.

## Plugins

Treat plugins as executable code. Install only from trusted repositories, pin or record the
source when possible, and run `yt-dlp --verbose` after installation to confirm loaded
plugins. The official plugin shape is:

```text
yt_dlp_plugins/
  extractor/
    myplugin.py
  postprocessor/
    myplugin.py
```

Recommended user plugin directories:

- Linux/macOS: `${XDG_CONFIG_HOME}/yt-dlp/plugins/<package>/yt_dlp_plugins/`
- Windows: `%APPDATA%\yt-dlp\plugins\<package>\yt_dlp_plugins\`

Useful plugin-related options:

```sh
yt-dlp --plugin-dirs "/path/to/plugins" --verbose "URL"
yt-dlp --no-plugin-dirs --verbose "URL"
YTDLP_NO_PLUGINS=1 yt-dlp --verbose "URL"
```

Known advanced plugins to consider, after checking their current README/issues:

- YouTube PO Token Framework/providers: use for YouTube 403/signature/player-client
  failures. Pair with `--extractor-args "youtube:player_client=web,android,ios"` only when
  the current provider docs recommend it.
- YouTube Agegate Bypass: use only for content the user is legally allowed and eligible to
  access; prefer authenticated cookies first.
- Return YouTube Dislikes: metadata enrichment.
- DeArrow: community title/thumbnail post-processing.
- ChromeCookieUnlock: unlock Chromium cookie DBs for `--cookies-from-browser chrome` or
  `edge` when normal browser cookie extraction fails.

Do not blindly paste stale plugin install commands. Verify names and install instructions
from the plugin repository immediately before installing.

## Troubleshooting

- Run with `--verbose` and inspect `yt-dlp`, `ffmpeg`, Python, extractor, cookie, and plugin
  lines before changing flags.
- Update first for extractor breakage: `yt-dlp -U` for official binaries, or reinstall the
  package for pip/uv installs. For persistent YouTube breakage, consider the official
  nightly channel.
- Use `--cookies-from-browser chrome|edge|firefox` for content that requires login. Never
  print or commit cookies.
- Use `--list-subs`, `--list-thumbnails`, and `-F` to understand availability before
  assuming a site exposes a format.
- For playlists/channels, use `--download-archive`, `--max-downloads`, and explicit playlist
  ranges to avoid accidental massive downloads.

## Sources

- yt-dlp README: https://github.com/yt-dlp/yt-dlp/blob/master/README.md
- yt-dlp plugin wiki: https://github.com/yt-dlp/yt-dlp/wiki/Plugins
- yt-dlp plugin development wiki: https://github.com/yt-dlp/yt-dlp/wiki/Plugin-Development
- Sample plugin package: https://github.com/yt-dlp/yt-dlp-sample-plugins
