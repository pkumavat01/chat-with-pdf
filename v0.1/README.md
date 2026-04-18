# AEM Docs Bot — v0.1

Minimal docs chatbot for AEM EDS. Free LLM (Groq + Llama 3.3), no embeddings, no custom widgets. See [`../docs/architecture-v0.1.md`](../docs/architecture-v0.1.md) for the design.

## Run locally

```bash
cd v0.1
npm install
cp .env.example .env.local
# edit .env.local and paste your free Groq API key
npm run dev
```

Open http://localhost:3000.

## Get a free Groq API key

1. Visit https://console.groq.com
2. Sign in with Google/GitHub (no credit card)
3. Create an API key
4. Paste into `.env.local`

## Add documentation

Drop markdown files into `docs/`. They are loaded into the LLM's context at startup. Keep total size under ~100KB for v0.1 (we're not using embeddings yet).

## What's in this folder

| Path | Purpose |
|---|---|
| `app/page.tsx` | Chat UI |
| `app/api/chat/route.ts` | LLM call + doc loading |
| `docs/` | Markdown knowledge base |
| `package.json` | Dependencies |

## What's next

Once v0.1 works end-to-end, see [`../docs/architecture-v0.1.md`](../docs/architecture-v0.1.md) sections 9–10 for v0.2 (generative UI) and v0.3 (npm package).
