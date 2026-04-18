import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import fs from 'node:fs'
import path from 'node:path'

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

const SYSTEM_PROMPT = `You are an expert assistant for Adobe Edge Delivery Services (AEM EDS).

Answer questions using ONLY the documentation provided below. Rules:
- If the docs do not cover the question, say "I don't see that in the provided docs" instead of guessing.
- Be concise. Use code blocks when showing examples.
- When referencing a concept, mention which doc file you got it from.

# Documentation

${docs || '(No docs loaded yet — drop markdown files into v0.1/docs/ and restart the dev server.)'}`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: SYSTEM_PROMPT,
    messages,
  })

  return result.toDataStreamResponse()
}
