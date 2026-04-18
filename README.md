# Gen-UI Docs Chatbot (working title)

> An open-source chatbot you can drop into any docs site. Configure your sources and your custom React widgets in one file, get a chatbot that streams interactive UI — not just markdown — back to your users.

**Status:** v0.1 ✅ done (markdown chatbot for AEM EDS docs running locally on port 3000). v0.2 in progress (generative UI). The reusable npm package lands in v0.3.

## Why this exists

The current options for adding an AI chatbot to a docs site or product all have a flaw:

| Type | Examples | Flaw |
|---|---|---|
| Dev toolkits | Vercel AI SDK, CopilotKit, assistant-ui | Powerful primitives, but everyone re-writes the same RAG + tool registry + UI glue. |
| Commercial SaaS | Kapa.ai, Inkeep, Mintlify AI | Closed source, paid per seat, **markdown-only answers** — no custom interactive components. |
| OSS docs bots | DocsGPT, Danswer | Open and configurable, but **no generative UI** — just markdown in, markdown out. |

This project aims to fill the empty slot: **OSS + config-driven + generative UI + a per-project widget registry.**

The motivating use case is the [Adobe AEM EDS](https://www.aem.live/developer/component-model-definitions) developer docs, where beginners struggle to learn from text alone and would benefit hugely from a bot that can render interactive component scaffolders, live previews, and code editors.

## Tech stack (deliberately minimal)

- **Next.js** — UI + API in one repo, free hosting on Vercel
- **Vercel AI SDK** (`ai`, `@ai-sdk/groq`) — provider-agnostic LLM library
- **Groq + Llama 3.3 70B** — free tier, fast, no credit card required
- **TypeScript** end to end

**No Mastra, no LangChain, no CopilotKit.** This package will be built directly on Vercel AI SDK to keep the dependency tree light for future users.

## Repo layout

```
.
├── docs/
│   ├── architecture-v0.1.md      ← design + diagrams for v0.1
│   └── architecture-v0.2.md      ← design + diagrams for v0.2 (gen UI)
├── v0.1/                          ← working markdown chatbot (port 3000)
│   ├── app/
│   ├── docs/                      ← AEM EDS markdown knowledge base
│   ├── README.md
│   └── package.json
├── v0.2/                          ← gen UI version, scaffold only (port 3001)
│   ├── app/
│   ├── components/                ← React widgets the LLM can render
│   ├── lib/                       ← widget registry
│   └── package.json
└── README.md                      ← you are here
```

## Quick start

```bash
cd v0.1
npm install
cp .env.example .env.local         # paste your free Groq API key
npm run dev
```

See [v0.1/README.md](v0.1/README.md) for full instructions and [docs/architecture-v0.1.md](docs/architecture-v0.1.md) for the design.

## Roadmap

| Version | What | Status |
|---|---|---|
| **v0.1** | Working markdown chatbot for AEM EDS docs. No widgets, no embeddings. | ✅ done (local) |
| **v0.2** | Generative UI — LLM can render custom React widgets via tool calls. One demo widget + a 60s video. | 🚧 in progress (architecture + scaffold ready) |
| **v0.3** | Extract into reusable npm package: `defineChatbot({ sources, widgets, llm })`. Publish to npm. | ⏳ planned |

## License

MIT (intended). To be confirmed when the package is published.
