import { z } from 'zod'
import { BlockScaffolder } from '@/components/BlockScaffolder'

export const widgets = {
  showBlockScaffolder: {
    description:
      'Generate a starter scaffold for an EDS block. ALWAYS call this tool (never write code in markdown) when the user asks for a block via any of these phrasings: "scaffold me a X block", "give me a X block", "create a X block", "X block starter", "X block template", "X block scaffold", "starter for a X block", "template for a X block", "boilerplate for a X block", or "now give me a X block". Also call it when the user asks how to create a specific named block. Trigger words: scaffold, starter, template, boilerplate, create. Renders an interactive widget with file structure and copyable code.',
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
} as const

export type WidgetName = keyof typeof widgets
