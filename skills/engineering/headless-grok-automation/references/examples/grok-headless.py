#!/usr/bin/env python3
"""
grok-headless.py
Python에서 Grok Build headless를 OpenAI-compatible client처럼 사용하는 예제.

특징:
- streaming-json 완전 지원 (async generator)
- session ID 자동 관리
- 안전한 기본 플래그 포함
"""

import asyncio
import json
import os
import subprocess
from typing import AsyncIterator, Optional


class GrokHeadless:
    def __init__(self, cwd: str = ".", model: str = "grok-build"):
        self.cwd = cwd
        self.model = model
        self.env = {**os.environ}

    def _build_cmd(
        self,
        prompt: str,
        *,
        session_id: Optional[str] = None,
        yolo: bool = False,
        output_format: str = "json",
        extra_args: list[str] | None = None,
    ) -> list[str]:
        cmd = [
            "grok",
            "-p", prompt,
            "-m", self.model,
            "--cwd", self.cwd,
            "--output-format", output_format,
            "--no-auto-update",
        ]
        if session_id:
            cmd += ["-s", session_id]
        if yolo:
            cmd += ["--yolo"]
        if extra_args:
            cmd += extra_args
        return cmd

    async def create(
        self,
        prompt: str,
        *,
        session_id: Optional[str] = None,
        yolo: bool = False,
        extra_args: list[str] | None = None,
    ) -> dict:
        """일반 JSON 모드 (한 번에 전체 결과 받기)"""
        cmd = self._build_cmd(
            prompt,
            session_id=session_id,
            yolo=yolo,
            output_format="json",
            extra_args=extra_args,
        )
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            env=self.env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await proc.communicate()

        if proc.returncode != 0:
            raise RuntimeError(f"Grok failed (code {proc.returncode}): {stderr.decode()}")

        data = json.loads(stdout.decode() or "{}")
        return {
            "text": data.get("text", ""),
            "session_id": data.get("sessionId"),
            "stop_reason": data.get("stopReason"),
        }

    async def stream(
        self,
        prompt: str,
        *,
        session_id: Optional[str] = None,
        yolo: bool = False,
        extra_args: list[str] | None = None,
    ) -> AsyncIterator[dict]:
        """streaming-json 모드 (실시간 청크 + thought 수신)"""
        cmd = self._build_cmd(
            prompt,
            session_id=session_id,
            yolo=yolo,
            output_format="streaming-json",
            extra_args=extra_args,
        )
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            env=self.env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        if not proc.stdout:
            return

        async for raw_line in proc.stdout:
            line = raw_line.decode().strip()
            if not line:
                continue
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue

            yield event

            if event.get("type") == "end":
                break

        await proc.wait()


# === Usage Examples ===

async def main():
    client = GrokHeadless(cwd=".")

    # 1. Regular call + session reuse
    result = await client.create(
        "Summarize the architecture of this project in one paragraph.",
        session_id="demo-2026-06",
    )
    print("=== Normal ===")
    print(result["text"][:300])
    print("Session:", result["session_id"])

    # 2. Streaming (including thought tokens)
    print("\n=== Streaming ===")
    async for event in client.stream(
        "Scaffold a simple Python FastAPI project.",
        yolo=True,
        extra_args=["--allow", "Write(**/*.py)"],
    ):
        if event.get("type") == "text":
            print(event["data"], end="", flush=True)
        elif event.get("type") == "thought":
            print(f"\n[thought] {event['data']}\n", flush=True)
        elif event.get("type") == "end":
            print(f"\n[done] session={event.get('sessionId')}")


if __name__ == "__main__":
    asyncio.run(main())
