import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import fs from 'node:fs'
import path from 'node:path'
import { widgets } from '@/lib/widgets'

type Doc = { name: string; content: string }

const docsDir = path.join(process.cwd(), 'docs')

function loadDocs(): Doc[] {
  if (!fs.existsSync(docsDir)) return []
  return fs
    .readdirSync(docsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => ({ name: f, content: fs.readFileSync(path.join(docsDir, f), 'utf8') }))
}

const allDocs = loadDocs()

// Trivial English stopwords + app-specific action words that don't help retrieval.
const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'have', 'what', 'when', 'where', 'which',
  'about', 'like', 'some', 'more', 'just', 'tell', 'also', 'just', 'then',
  'show', 'make', 'give', 'build', 'create', 'preview', 'demo', 'render',
  'display', 'visualize', 'please', 'need', 'want', 'does', 'will',
  'here', 'there', 'your', 'mine', 'into', 'without', 'using', 'used',
])

// Pick the docs most relevant to the user's latest message.
// - Always include 01-blocks-overview.md as base context (every request benefits).
// - Score remaining docs by keyword hit count; include top 2 that have any hits.
// - Cap at 3 docs total to keep system prompt under ~3k tokens.
function selectDocs(query: string): Doc[] {
  const overview = allDocs.find(d => /^01[-_]/.test(d.name))
  const base: Doc[] = overview ? [overview] : []
  const candidates = allDocs.filter(d => d !== overview)

  const keywords = (query || '')
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w))

  if (keywords.length === 0) return base

  const scored = candidates.map(d => {
    const text = d.content.toLowerCase()
    const score = keywords.reduce((acc, kw) => {
      const matches = text.match(new RegExp(`\\b${kw}\\b`, 'g'))
      return acc + (matches?.length ?? 0)
    }, 0)
    return { doc: d, score }
  })

  const top = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(s => s.doc)

  return [...base, ...top]
}

const tools = Object.fromEntries(
  Object.entries(widgets).map(([name, w]) => [
    name,
    { description: w.description, parameters: w.schema },
  ])
)

// Cap each included doc to ~2500 chars (~600 tokens) to keep system prompt
// predictable. The first ~2500 chars almost always contain the core concept.
const MAX_DOC_CHARS = 2500

function truncateDoc(content: string): string {
  if (content.length <= MAX_DOC_CHARS) return content
  return content.slice(0, MAX_DOC_CHARS) + '\n\n[...truncated for token budget...]'
}

function buildSystemPrompt(query: string): string {
  const selected = selectDocs(query)
  const docsBlock = selected.length
    ? selected
        .map(d => `## ${d.name}\n\n${truncateDoc(d.content)}`)
        .join('\n\n---\n\n')
    : '(no docs selected)'

  // Condensed prompt — was ~500 tokens, now ~250.
  return `You are an AEM Edge Delivery Services (EDS) assistant.

Behavior:
- For factual questions: answer only from the docs below; if not covered, say "I don't see that in the provided docs".
- For render/show/preview/build/compare/scaffold requests: call a tool. Do NOT refuse these just because the exact phrasing isn't in the docs.
- When quoting a fact, cite the doc filename.

Tools:
- **showBlockScaffolder**: empty starter (no styling). For "scaffold / starter / boilerplate".
- **showLiveBlockPreview**: live styled block in an iframe. For "show / demo / preview / render / make / build". For "compare X and Y", call it once per block in the same turn.

showLiveBlockPreview RULES:
- Provide ALL 5 fields. Never empty.
- blockName MUST match the user's exact word (callout → "callout", NOT "hero").
- cssCode: ≥8 real lines (colors, layout, typography). Root selector is .blockName.
- jsCode: "export default function decorate(block) { ... }".
- sampleHtml: 2-6 realistic lines, no outer .blockName wrapper.
- Follow-ups ("make it darker", "center it"): keep same blockName, change only relevant code.

Never emit tool-call syntax as text.

# Docs

${docsBlock}`
}

function cleanHistory(messages: any[]): any[] {
  return messages
    .map(m => {
      if (m.role !== 'assistant') return m
      const textParts: string[] = []
      if (m.content && typeof m.content === 'string' && m.content.trim()) {
        textParts.push(m.content.trim())
      }
      if (Array.isArray(m.toolInvocations)) {
        for (const inv of m.toolInvocations) {
          const name = inv?.toolName ?? 'unknown'
          const args = inv?.args ?? {}
          const block = args.blockName ?? 'unknown'
          const desc = args.description ? ` (${args.description})` : ''
          textParts.push(`[Previously rendered ${name} for block "${block}"${desc}.]`)
        }
      }
      const summary = textParts.join('\n').trim()
      return { role: 'assistant', content: summary }
    })
    .filter(m => m.role !== 'assistant' || (m.content && m.content.length > 0))
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const latestUser = [...messages].reverse().find((m: any) => m.role === 'user')
  const query = typeof latestUser?.content === 'string' ? latestUser.content : ''
  const systemPrompt = buildSystemPrompt(query)

  console.log(
    `[api/chat] query=${JSON.stringify(query.slice(0, 60))} system=${systemPrompt.length}chars`
  )

  // Keep maxTokens under what widgets actually need (~1500). Groq's TPM
  // counts prompt + max_tokens reservation, so 4096 was stealing ~half our
  // 8000-token-per-minute budget even when the actual response was shorter.
  const result = streamText({
    model: groq('openai/gpt-oss-20b'),
    system: systemPrompt,
    messages: cleanHistory(messages),
    tools,
    toolChoice: 'auto',
    maxTokens: 2000,
    onError({ error }) {
      console.error('[api/chat] stream error:', error)
    },
  })

  return result.toDataStreamResponse()
}
