'use client'

import { useMemo, useState } from 'react'

type Props = {
  blockName: string
  description?: string
  cssCode: string
  jsCode: string
  sampleHtml: string
}

export function LiveBlockPreview({
  blockName,
  description,
  cssCode,
  jsCode,
  sampleHtml,
}: Props) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)

  const missing: string[] = []
  if (!cssCode || cssCode.trim().length < 10) missing.push('cssCode')
  if (!jsCode || jsCode.trim().length < 10) missing.push('jsCode')
  if (!sampleHtml || sampleHtml.trim().length < 5) missing.push('sampleHtml')

  if (missing.length > 0) {
    return (
      <div
        style={{
          border: '1px solid #fca5a5',
          borderRadius: 12,
          marginTop: 12,
          padding: 16,
          background: '#fef2f2',
          color: '#7f1d1d',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <strong style={{ fontSize: 14 }}>⚠️ Incomplete response for "{blockName}"</strong>
        <p style={{ fontSize: 13, margin: '6px 0 0', lineHeight: 1.5 }}>
          The model returned an empty or truncated tool call. Missing or too-short fields:{' '}
          <code>{missing.join(', ')}</code>. This is typically a Groq rate limit, a model
          truncation, or a transient error. Ask the same question again and it usually works on
          retry.
        </p>
      </div>
    )
  }

  const iframeContent = useMemo(() => {
    const cleanedJs = jsCode.replace(/export\s+default\s+/, '')

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font-family: system-ui, -apple-system, sans-serif; color: #111; background: #fff; }
  ${cssCode}
</style>
</head>
<body>
<div class="${blockName}">
${sampleHtml}
</div>
<script type="module">
${cleanedJs}
try {
  const block = document.querySelector('.${blockName}')
  if (block && typeof decorate === 'function') decorate(block)
} catch (err) {
  const errBox = document.createElement('pre')
  errBox.style.cssText = 'color:#b91c1c;padding:12px;background:#fee2e2;border-radius:6px;margin:0 0 12px 0;font-size:13px;white-space:pre-wrap'
  errBox.textContent = 'decorate() error: ' + err.message
  document.body.insertBefore(errBox, document.body.firstChild)
}
</script>
</body>
</html>`
  }, [blockName, cssCode, jsCode, sampleHtml])

  const fullCode = useMemo(
    () =>
      `/* ${blockName}.css */\n${cssCode}\n\n/* ${blockName}.js */\n${jsCode}\n\n<!-- sample authored HTML -->\n<div class="${blockName}">\n${sampleHtml}\n</div>`,
    [blockName, cssCode, jsCode, sampleHtml]
  )

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(fullCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard may be blocked
    }
  }

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        marginTop: 12,
        background: '#ffffff',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid #e5e7eb',
          background: '#fafafa',
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <strong style={{ fontSize: 14, color: '#111' }}>🎬 Live: {blockName}</strong>
          {description && (
            <div
              style={{
                fontSize: 12,
                color: '#666',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {description}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={() => setTab('preview')} style={tabStyle(tab === 'preview')}>
            Preview
          </button>
          <button onClick={() => setTab('code')} style={tabStyle(tab === 'code')}>
            Code
          </button>
          <button
            onClick={copyAll}
            style={{
              ...tabStyle(false),
              background: copied ? '#10b981' : 'white',
              color: copied ? 'white' : '#111',
              borderColor: copied ? '#10b981' : '#d1d5db',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </header>

      {tab === 'preview' ? (
        <iframe
          srcDoc={iframeContent}
          sandbox="allow-scripts"
          style={{
            width: '100%',
            height: 420,
            border: 'none',
            background: 'white',
            display: 'block',
          }}
          title={`${blockName} live preview`}
        />
      ) : (
        <pre
          style={{
            background: '#0f172a',
            color: '#e2e8f0',
            padding: 16,
            margin: 0,
            overflow: 'auto',
            fontSize: 13,
            lineHeight: 1.5,
            maxHeight: 420,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          <code>{fullCode}</code>
        </pre>
      )}
    </div>
  )
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 12px',
    fontSize: 12,
    border: active ? '1px solid #3b82f6' : '1px solid #d1d5db',
    background: active ? '#3b82f6' : 'white',
    color: active ? 'white' : '#111',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 500,
  }
}
