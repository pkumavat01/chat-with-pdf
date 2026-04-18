'use client'

import { useChat } from 'ai/react'

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <main style={{ maxWidth: 760, margin: '2rem auto', padding: '0 1rem' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>AEM EDS Docs Bot</h1>
        <p style={{ color: '#666', marginTop: 4 }}>
          Ask anything about Adobe Edge Delivery Services. Answers are based on local docs only.
        </p>
      </header>

      <section style={{ minHeight: 320, marginBottom: 16 }}>
        {messages.length === 0 && (
          <div style={{ color: '#999', padding: 24, textAlign: 'center', border: '1px dashed #ddd', borderRadius: 8 }}>
            Try: <em>"How do I create a hero block?"</em>
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
            <div style={{ fontSize: 12, fontWeight: 600, color: m.role === 'user' ? '#1d4ed8' : '#16a34a', marginBottom: 6 }}>
              {m.role === 'user' ? 'You' : 'Bot'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{m.content}</div>
          </div>
        ))}
        {isLoading && <div style={{ color: '#666', padding: 8 }}>Thinking…</div>}
      </section>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about EDS blocks, components, decoration…"
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
