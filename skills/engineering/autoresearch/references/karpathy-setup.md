# autoresearch — Karpathy's original setup

The concrete instantiation this skill generalizes from. Source:
<https://github.com/karpathy/autoresearch> (MIT, by Andrej Karpathy). Read the live repo
for the exact code — treat the specifics below as the recipe, not a substitute for it.

## The idea (from the README)

> "give an AI agent a small but real LLM training setup and let it experiment autonomously
> overnight. It modifies the code, trains for 5 minutes, checks if the result improved,
> keeps or discards, and repeats."

A single-GPU implementation of nanochat (simplified LLM training). Roughly ~12 experiments
per hour, ~100 overnight.

## Files (the harness)

| File            | Role                                          | Agent edits?                  |
|-----------------|-----------------------------------------------|-------------------------------|
| `program.md`    | Agent instructions + research objective       | read                          |
| `train.py`      | model, optimizer, training loop               | **yes — the only edit surface** |
| `prepare.py`    | data prep, tokenizer training, utilities      | no (frozen)                   |
| `analysis.ipynb`| results analysis                              | —                             |

## Harness parameters (map onto SKILL.md's "Set up the harness")

- **Objective metric**: `val_bpb` (validation bits-per-byte). Lower is better.
- **Budget**: fixed 5-minute wall-clock per experiment — normalizes across hardware.
- **Edit surface**: `train.py` only.
- **Baseline**: the stock `train.py` measured under the 5-minute budget.

## Run it

Requirements: NVIDIA GPU (H100 tested), Python 3.10+, `uv`.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv sync
uv run prepare.py     # data + tokenizer — part of the frozen harness
uv run train.py       # one experiment under the budget
```

Community forks exist for macOS / Windows / AMD. To actually run Karpathy's loop: clone the
repo, then point this skill's harness at metric `val_bpb` (↓), budget 5 min, edit surface
`train.py`, baseline = stock `train.py`.
