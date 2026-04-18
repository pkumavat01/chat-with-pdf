# AEM Docs Bot — v0.2

Generative UI version. The LLM doesn't just answer in markdown — it can render interactive React widgets via tool calls. See [`../docs/architecture-v0.2.md`](../docs/architecture-v0.2.md) for the full design.

Runs on **port 3001** so it can run alongside v0.1 (port 3000).

## Run locally

```bash
cd v0.2
npm install
cp .env.example .env.local
# edit .env.local with your free Groq API key
npm run dev
```

Open http://localhost:3001.

## What it does

Two widgets are registered:

| Widget | Triggers | Renders |
|---|---|---|
| `BlockScaffolder` | "scaffold / starter / boilerplate" | Empty `.css` + `.js` stubs with a "Copy all files" button |
| `LiveBlockPreview` | "show / demo / preview / render / make / build" | A sandboxed `<iframe>` running the block with real CSS + JS, plus a Code tab |

### Try these prompts

| Prompt | Expected |
|---|---|
| *"What is a block in EDS?"* | Plain markdown answer |
| *"Scaffold me a clickable card block"* | `BlockScaffolder` widget |
| *"Show me a hero block with a gradient background"* | `LiveBlockPreview` widget, live iframe |
| *"Make a callout block with an orange background and warning icon"* | `LiveBlockPreview` widget, live iframe |

## What's new vs v0.1

- `lib/widgets.tsx` — widget registry (description + Zod schema + React component per widget)
- `components/BlockScaffolder.tsx` — files scaffold widget
- `components/LiveBlockPreview.tsx` — live iframe widget with Preview/Code tabs
- `app/api/chat/route.ts` — passes widgets as tools, does keyword-based doc retrieval, caps per-request token budget
- `app/page.tsx` — renders `m.toolInvocations`, handles tool results, shows empty-response warnings
- `zod` dependency for validating widget props at the tool-call boundary

## Architecture highlights

### Keyword-based doc retrieval (no embeddings)

The 6 EDS docs totalled ~7000 tokens — too big to paste into every request under Groq's 8000 TPM limit. Instead, each request:

1. Tokenizes the user's query (drops stopwords and action words like "show", "make")
2. Scores each doc by keyword occurrence
3. Always includes `01-blocks-overview.md` as base context + top 2 scoring docs
4. Caps each doc at 2500 chars

Typical request size: ~4000-5000 tokens. See [`app/api/chat/route.ts`](app/api/chat/route.ts).

### History preservation without tool-state

`useChat` would fail with `AI_MessageConversionError` if we sent past tool calls back to the LLM. We collapse past assistant turns into text summaries (e.g. `[Previously rendered showLiveBlockPreview for block "hero"]`) so multi-turn follow-ups like "make it darker" still work.

### Honest failure states

Every widget validates required args with Zod `.min(N)`. `LiveBlockPreview` renders a red error card if fields are missing or too short. The chat UI renders a red "empty response" card if an assistant message has no content AND no tool calls.

## ⚠️ Known limitations (honest)

This demo runs on **Groq's free tier + `openai/gpt-oss-20b`** — a 20-billion-parameter model. That has real trade-offs. You will hit these:

| Limitation | Root cause | Workaround |
|---|---|---|
| **Multi-block requests sometimes render only one widget** | Small models unreliable at emitting multiple parallel tool calls per response | Ask for blocks one at a time |
| **Ambiguous queries over-refuse** ("what is default block" → docs say "Default Content") | 20b model takes phrasing too literally | Rephrase with exact terms from the docs |
| **~8 requests per minute max** | Groq free tier TPM limit of 8000 tokens/min | Upgrade Groq to Dev Tier, or swap provider |
| **Free LLMs truncate on long generations** | 20b model runs out of budget on complex widgets | Zod validation + error card makes this visible, but it still happens |

**This is a free-stack demo, not a production service.** The plumbing is production-grade; the LLM tier isn't.

## Upgrade to a production LLM (BYOK)

The one-line change. Your choice of provider, your billing, your rate limits.

### OpenAI (GPT-4o, GPT-4.1, GPT-5)

```bash
npm install @ai-sdk/openai
```

In `app/api/chat/route.ts`:

```ts
import { openai } from '@ai-sdk/openai'
// ...
model: openai('gpt-4.1-mini'),  // or 'gpt-5', 'gpt-4o'
```

Add `OPENAI_API_KEY=sk-...` to `.env.local`.

### Anthropic (Claude Sonnet 4.6, Opus 4.7)

```bash
npm install @ai-sdk/anthropic
```

In `app/api/chat/route.ts`:

```ts
import { anthropic } from '@ai-sdk/anthropic'
// ...
model: anthropic('claude-sonnet-4-6'),  // or 'claude-opus-4-7'
```

Add `ANTHROPIC_API_KEY=sk-ant-...` to `.env.local`.

### Why this is all it takes

Vercel AI SDK abstracts provider differences. Tool calls, streaming, schema validation all work identically. This is the core design decision we made in v0.1 — don't marry a provider.

With a larger model, you can also relax the token defenses we built for the free tier:

- Raise `maxTokens` from 2000 back to 4096+ (bigger widgets)
- Raise `MAX_DOC_CHARS` from 2500 to e.g. 8000 (more context per doc)
- Include more docs in `selectDocs` (top 3 or 4 instead of top 2)

## Design

See [`../docs/architecture-v0.2.md`](../docs/architecture-v0.2.md) for the full tool-call flow, widget registry pattern, diagrams, and risks.

## What's next

[v0.3](../docs/) extracts the widget registry pattern + the route handler into a publishable npm package: `defineChatbot({ sources, widgets, llm })`. The goal is to let any docs site or SaaS product drop in a gen-UI chatbot with their own widgets — the pattern this v0.2 proves out.
