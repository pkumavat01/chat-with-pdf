import { z } from 'zod'
import { BlockScaffolder } from '@/components/BlockScaffolder'
import { LiveBlockPreview } from '@/components/LiveBlockPreview'

export const widgets = {
  showBlockScaffolder: {
    description:
      'Generate a starter SCAFFOLD (code stubs only, no styling) for an EDS block. Call this when the user wants an empty starter template to fill in later. Trigger phrasings: "scaffold me a X block", "X block starter template", "X block boilerplate", "give me a starter for X". Renders files + copy button. Prefer showLiveBlockPreview when the user wants to SEE the block working with real styling.',
    schema: z.object({
      blockName: z
        .string()
        .describe('The block name in kebab-case, e.g. "hero", "card-grid", "carousel"'),
      includeCss: z
        .boolean()
        .default(true)
        .describe('Whether to include the CSS file stub (almost always true)'),
      clickable: z
        .boolean()
        .default(false)
        .describe('Whether the block should include a click handler stub'),
    }),
    Component: BlockScaffolder,
  },
  showLiveBlockPreview: {
    description:
      'Render a LIVE, interactive preview of an EDS block — real CSS, real JS, real sample HTML, all running in a sandboxed iframe. ALWAYS call this (never answer in markdown) when the user asks to: "show me", "demo", "preview", "render", "see", "display", "visualize", "make", or "build" a block. Also call it when the user describes a specific look ("a hero with gradient", "a card with rounded corners"). When the user asks a FOLLOW-UP about a previously rendered block (e.g. "make the bg darker", "center the content", "add animations"), KEEP the same blockName from the previous call and modify only the relevant code. Generate COMPLETE code: full CSS (colors, layout, spacing, typography — at least 8 lines), a working decorate() function, realistic sample HTML.',
    schema: z.object({
      blockName: z
        .string()
        .min(1, 'blockName is required')
        .describe(
          'Block name in kebab-case. MUST match what the user asked for. If they say "callout", use "callout", NOT "hero" or anything else.'
        ),
      description: z
        .string()
        .optional()
        .describe('One short sentence describing what this block does'),
      cssCode: z
        .string()
        .min(30, 'cssCode must be non-trivial CSS, not empty')
        .describe(
          'Complete CSS for the block (NEVER empty, at least 8 lines). Include colors, typography, layout (flex/grid), spacing, border-radius, hover states. Root selector is .blockName. Be bold and tasteful.'
        ),
      jsCode: z
        .string()
        .min(30, 'jsCode must be a complete decorate function, not empty')
        .describe(
          'Complete JS decorate function (NEVER empty). Signature: export default function decorate(block) { ... }. Do real work: add classes, wrap content, add event listeners where appropriate.'
        ),
      sampleHtml: z
        .string()
        .min(10, 'sampleHtml must have realistic demo content')
        .describe(
          'Sample INNER HTML for the block (NEVER empty, do NOT include the outer .blockName wrapper — added automatically). Use realistic demo content: headings, paragraphs, image placeholders via https://picsum.photos/800/400.'
        ),
    }),
    Component: LiveBlockPreview,
  },
} as const

export type WidgetName = keyof typeof widgets
