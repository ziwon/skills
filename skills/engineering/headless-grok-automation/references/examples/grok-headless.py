#!/usr/bin/env python3
"""Minimal async wrapper for Grok Build headless JSON/NDJSON modes."""

from __future__ import annotations

import asyncio
import json
import os
from collections.abc import AsyncIterator
from pathlib import Path
from typing import Any


class GrokError(RuntimeError):
    """Raised when the Grok subprocess fails or emits malformed output."""


class GrokHeadless:
    def __init__(self, cwd: str | Path = ".", model: str = "grok-build") -> None:
        self.cwd = str(Path(cwd).resolve())
        self.model = model
        self.env = os.environ.copy()

    def _command(
        self,
        prompt: str,
        *,
        output_format: str,
        resume_session_id: str | None = None,
        bypass_permissions: bool = False,
        extra_args: list[str] | None = None,
    ) -> list[str]:
        command = [
            "grok",
            "-p",
            prompt,
            "--model",
            self.model,
            "--cwd",
            self.cwd,
            "--output-format",
            output_format,
            "--no-auto-update",
        ]
        if resume_session_id:
            command.extend(["--resume", resume_session_id])
        if bypass_permissions:
            command.extend(["--permission-mode", "bypassPermissions"])
        if extra_args:
            command.extend(extra_args)
        return command

    async def create(
        self,
        prompt: str,
        *,
        resume_session_id: str | None = None,
        bypass_permissions: bool = False,
        extra_args: list[str] | None = None,
    ) -> dict[str, Any]:
        """Run once and return Grok's outer JSON result object."""
        process = await asyncio.create_subprocess_exec(
            *self._command(
                prompt,
                output_format="json",
                resume_session_id=resume_session_id,
                bypass_permissions=bypass_permissions,
                extra_args=extra_args,
            ),
            env=self.env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await process.communicate()
        if process.returncode != 0:
            message = stderr.decode(errors="replace").strip()
            raise GrokError(f"grok exited {process.returncode}: {message}")

        try:
            result = json.loads(stdout)
        except json.JSONDecodeError as exc:
            raise GrokError("grok emitted malformed JSON") from exc
        if not isinstance(result, dict) or not isinstance(result.get("text"), str):
            raise GrokError("grok result is missing the text field")
        return result

    async def stream(
        self,
        prompt: str,
        *,
        resume_session_id: str | None = None,
        bypass_permissions: bool = False,
        extra_args: list[str] | None = None,
    ) -> AsyncIterator[dict[str, Any]]:
        """Yield forward-compatible streaming-json events until the process exits."""
        process = await asyncio.create_subprocess_exec(
            *self._command(
                prompt,
                output_format="streaming-json",
                resume_session_id=resume_session_id,
                bypass_permissions=bypass_permissions,
                extra_args=extra_args,
            ),
            env=self.env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        if process.stdout is None or process.stderr is None:
            raise GrokError("failed to capture grok output")

        stderr_task = asyncio.create_task(process.stderr.read())
        saw_terminal_event = False
        async for raw_line in process.stdout:
            try:
                event = json.loads(raw_line)
            except json.JSONDecodeError as exc:
                process.kill()
                await process.wait()
                await stderr_task
                raise GrokError("grok emitted malformed streaming JSON") from exc
            if not isinstance(event, dict) or not isinstance(event.get("type"), str):
                process.kill()
                await process.wait()
                await stderr_task
                raise GrokError("grok emitted an invalid streaming event")
            yield event
            if event["type"] in {"end", "error"}:
                saw_terminal_event = True

        stderr = (await stderr_task).decode(errors="replace").strip()
        return_code = await process.wait()
        if return_code != 0:
            raise GrokError(f"grok exited {return_code}: {stderr}")
        if not saw_terminal_event:
            raise GrokError("grok stream ended without an end/error event")


async def main() -> None:
    client = GrokHeadless(cwd=".")

    result = await client.create(
        "Summarize this project in one paragraph without editing files.",
        extra_args=["--tools", "read_file,grep,list_dir", "--max-turns", "12"],
    )
    print(result["text"])
    print("session:", result["sessionId"])

    async for event in client.stream(
        "Continue with a concise risk review.",
        resume_session_id=result["sessionId"],
        extra_args=["--tools", "read_file,grep,list_dir", "--max-turns", "12"],
    ):
        if event["type"] == "text":
            print(event.get("data", ""), end="", flush=True)
        elif event["type"] == "end":
            print(f"\nfinished: {event.get('sessionId')}")


if __name__ == "__main__":
    asyncio.run(main())
