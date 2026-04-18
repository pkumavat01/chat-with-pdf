'use client'

import { useState } from 'react'

type Props = {
  blockName: string
  includeCss?: boolean
  clickable?: boolean
}

export function BlockScaffolder({
  blockName,
  includeCss = true,
  clickable = false,
}: Props) {
  const [copied, setCopied] = useState(false)

  const cssCode = `.${blockName} {
  display: block;
  /* TODO: add styles for ${blockName} */
}`

  const jsCode = clickable
    ? `export default function decorate(block) {
  block.classList.add('${blockName}')

  block.addEventListener('click', (e) => {
    // TODO: handle click
    console.log('${blockName} clicked', e)
  })
  block.style.cursor = 'pointer'
}`
    : `export default function decorate(block) {
  block.classList.add('${blockName}')
  // TODO: transform block's HTML
}`

  const allFiles = [
    `// /blocks/${blockName}/${blockName}.css`,
    cssCode,
    '',
    `// /blocks/${blockName}/${blockName}.js`,
    jsCode,
  ].join('\n')

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(allFiles)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard may be blocked; ignore silently
    }
  }

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        background: '#fafafa',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <strong style={{ color: '#111', fontSize: 14 }}>
          📁 /blocks/{blockName}/
        </strong>
        <button
          onClick={copyAll}
          style={{
            padding: '6px 12px',
            fontSize: 13,
            border: '1px solid #d1d5db',
            background: copied ? '#10b981' : 'white',
            color: copied ? 'white' : '#111',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          {copied ? '✓ Copied' : 'Copy all files'}
        </button>
      </header>

      {includeCss && (
        <FileBlock name={`${blockName}.css`} code={cssCode} />
      )}
      <FileBlock name={`${blockName}.js`} code={jsCode} />

      {clickable && (
        <p style={{ fontSize: 12, color: '#666', marginTop: 8, marginBottom: 0 }}>
          ✨ Includes a click handler stub
        </p>
      )}
    </div>
  )
}

function FileBlock({ name, code }: { name: string; code: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 12,
          color: '#666',
          marginBottom: 4,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        {name}
      </div>
      <pre
        style={{
          background: '#1e293b',
          color: '#e2e8f0',
          padding: 12,
          borderRadius: 6,
          overflow: 'auto',
          margin: 0,
          fontSize: 13,
          lineHeight: 1.5,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
