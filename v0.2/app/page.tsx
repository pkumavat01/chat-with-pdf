'use client'

import { useChat } from 'ai/react'
import { widgets, type WidgetName } from '@/lib/widgets'

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    async onToolCall({ toolCall }) {
      return { rendered: true, toolName: toolCall.toolName }
    },
  })

  return (
    <main style={{ maxWidth: 760, margin: '2rem auto', padding: '0 1rem' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>
          AEM EDS Docs Bot{' '}
          <span style={{ fontSize: 14, color: '#ec4899', verticalAlign: 'middle', marginLeft: 8 }}>
            ✨ Gen UI
          </span>
        </h1>
        <p style={{ color: '#666', marginTop: 4 }}>
          Ask anything about EDS. For block scaffolds, the bot renders an interactive widget.
        </p>
      </header>

      <section style={{ minHeight: 320, marginBottom: 16 }}>
        {messages.length === 0 && (
          <div
            style={{
              color: '#999',
              padding: 24,
              textAlign: 'center',
              border: '1px dashed #ddd',
              borderRadius: 8,
            }}
          >
            Try: <em>"Scaffold me a clickable card block"</em>
          </div>
        )}
        {messages.map(m => (
          <div
            key={m.id}
            style={{
              margin: '12px 0',
              padding: 14,
              background: m.role === 'user' ? '#eff6ff' : '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: m.role === 'user' ? '#1d4ed8' : '#16a34a',
                marginBottom: 6,
              }}
            >
              {m.role === 'user' ? 'You' : 'Bot'}
            </div>

            {m.content && (
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{m.content}</div>
            )}

            {m.toolInvocations?.map(inv => {
              const widget = widgets[inv.toolName as WidgetName]
              if (!widget) return null
              if (inv.state === 'partial-call') return null
              const Component = widget.Component as React.ComponentType<any>
              return <Component key={inv.toolCallId} {...(inv.args as object)} />
            })}

            {m.role === 'assistant' &&
              !m.content &&
              (!m.toolInvocations || m.toolInvocations.length === 0) &&
              !isLoading && (
                <div
                  style={{
                    padding: 12,
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: 6,
                    color: '#7f1d1d',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  ⚠️ The model returned an empty response. This usually means a Groq rate limit,
                  a network error, or the model didn't emit a valid tool call. Try again, or
                  check the dev server logs (look for "[api/chat] stream error").
                </div>
              )}
          </div>
        ))}
        {isLoading && <div style={{ color: '#666', padding: 8 }}>Thinking…</div>}
      </section>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about EDS, or say 'scaffold me a hero block'"
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 24px',
            fontSize: 16,
            border: 'none',
            background: isLoading || !input.trim() ? '#9ca3af' : '#3b82f6',
            color: 'white',
            borderRadius: 8,
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </main>
  )
}
