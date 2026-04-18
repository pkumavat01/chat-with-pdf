# AEM Docs Bot — v0.2

Generative UI version. The LLM doesn't just answer in markdown — it can render interactive React widgets (currently one: `BlockScaffolder`) via tool calls. See [`../docs/architecture-v0.2.md`](../docs/architecture-v0.2.md) for the full design.

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

## What's new vs v0.1

- `lib/widgets.tsx` — widget registry (the LLM-facing API for declaring renderable widgets)
- `components/BlockScaffolder.tsx` — a real-world demo widget (file scaffolder + copy button)
- `app/api/chat/route.ts` — adds `tools: { ... }` to `streamText`
- `app/page.tsx` — renders `m.toolInvocations` alongside text bubbles
- `zod` dependency for validating widget props

## Try these prompts

| Prompt | What you should see |
|---|---|
| *"What is a block in EDS?"* | Plain markdown answer (text-only path still works) |
| *"Scaffold me a card block"* | A rendered `<BlockScaffolder blockName="card" />` widget |
| *"Give me a clickable hero block scaffold"* | A widget with `blockName="hero"` AND `clickable: true` |

The "Copy all files" button on the widget copies the multi-file output ready to paste into your editor.

## Design

See [`../docs/architecture-v0.2.md`](../docs/architecture-v0.2.md) — covers the tool-call flow, widget registry pattern, and risks.

## What's next

[v0.3](../docs/) will extract the widget registry pattern + the route handler into a publishable npm package: `defineChatbot({ sources, widgets, llm })`.
