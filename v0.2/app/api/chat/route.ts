import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import fs from 'node:fs'
import path from 'node:path'
import { widgets } from '@/lib/widgets'

const docsDir = path.join(process.cwd(), 'docs')

function loadDocs(): string {
  if (!fs.existsSync(docsDir)) return ''
  return fs
    .readdirSync(docsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => `## File: ${f}\n\n${fs.readFileSync(path.join(docsDir, f), 'utf8')}`)
    .join('\n\n---\n\n')
}

const docs = loadDocs()

const tools = Object.fromEntries(
  Object.entries(widgets).map(([name, w]) => [
    name,
    { description: w.description, parameters: w.schema },
  ])
)

const SYSTEM_PROMPT = `You are an expert assistant for Adobe Edge Delivery Services (AEM EDS).

Answer questions using ONLY the documentation provided below. Rules:
- If the docs do not cover the question, say "I don't see that in the provided docs" instead of guessing.
- Be concise. Use code blocks when showing examples.
- When referencing a concept, mention which doc file you got it from.
- If a tool is appropriate for the user's request, use it. Briefly (one sentence) introduce what's being rendered.

# Documentation

${docs || '(No docs loaded yet — drop markdown files into v0.2/docs/ and restart the dev server.)'}`

// Strip tool state from past assistant messages. The LLM doesn't need to
// see that previous tool calls happened — the user sees the rendered widgets.
// Keeping tool state in history confuses the model and inflates context.
function cleanHistory(messages: any[]): any[] {
  return messages
    .map(m => {
      if (m.role !== 'assistant') return m
      return { role: 'assistant', content: m.content || '' }
    })
    .filter(m => m.role !== 'assistant' || (m.content && m.content.length > 0))
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: groq('openai/gpt-oss-20b'),
    system: SYSTEM_PROMPT,
    messages: cleanHistory(messages),
    tools,
    toolChoice: 'auto',
  })

  return result.toDataStreamResponse()
}
