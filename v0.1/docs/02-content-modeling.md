# Content Modeling for AEM Authoring Projects

> Source: https://www.aem.live/developer/component-model-definitions

## Overview

Content modeling in Adobe Experience Manager (AEM) authoring projects involves structuring how content is organized, stored, and rendered for Edge Delivery Services. This approach ensures authors can create compelling content while maintaining semantic markup independent of the content source.

## Prerequisites

Before modeling content, understand these foundational concepts:

- **Getting Started – Universal Editor Developer Tutorial**
- **Markup, Sections, Blocks, and Auto Blocking**
- **Block Collection**

These prerequisites establish the content-source-agnostic approach necessary for flexible authoring experiences.

## Default Content

Default content represents intuitive page elements authors add without special semantics: text, headings, links, and images. In AEM, these are implemented through simple, pre-defined component models supporting Markdown and HTML serialization, including:

- **Text**: Rich text with list elements, bold, italic formatting
- **Title**: Text with heading levels (h1-h6)
- **Image**: Source and description
- **Button**: Text, title, URL, and type (default, primary, secondary)

## Blocks

Blocks create richer content with specific styling and functionality. They require explicit modeling through the `component-models.json` file, which defines available fields and their properties.

### Block Model Definition

Each block model specifies:

- Field components (reference, text-input, text-area, etc.)
- Value types (string, number, etc.)
- Labels and default values
- Whether fields accept multiple values

The `component-definitions.json` file lists available blocks for the Universal Editor, using the `core/franklin/components/block/v1/block` resource type.

### Block Structure Types

**Simple Blocks**: Properties render as single rows/columns in model-defined order.

**Key-Value Blocks**: Render as configuration pairs, useful for metadata and settings.

**Container Blocks**: Support parent properties plus child items, enabling two-dimensional structures. Children can be added, removed, and reordered while maintaining their own models.

**Columns Block**: Defines layout grids without content modeling. Accepts only rows, columns, and classes properties; limited to default content in cells.

## Content Modeling Techniques

### Type Inference

Values infer semantic meaning automatically:

- **Images**: MIME types starting with `image/` render as `<picture><img>` elements
- **Links**: References or URLs starting with `https?://` render as anchors
- **Rich Text**: Values starting with HTML tags render as semantic markup
- **Class Names**: Treated as block options
- **Value Lists**: Multi-value properties become comma-separated lists

### Field Collapse

Multiple fields combine into single semantic elements using naming suffixes (Title, Type, MimeType, Alt, Text). For example, `image` + `imageAlt` properties collapse into a single `<picture>` element with alt text.

### Element Grouping

Using underscores (e.g., `teaserText_title`, `teaserText_description`), multiple properties group into single table cells, creating semantic markup without requiring individual elements. This restricts author choices while maintaining clean HTML output.

### Multi-Fields and Composite Multi-Fields

Multi-fields handle lists of content:

- **Single semantic elements** (text, links, images) render as `<ul><li>` lists
- **Multiple semantic elements** separate with `<hr>` tags
- **Single items** render as paragraphs rather than lists

Composite multi-fields combine multiple field types, enabling structures like image carousels with alt text or CTAs with descriptions.

## Sections and Section Metadata

Sections maintain the single-level nesting intentionally designed into Edge Delivery Services. Section metadata uses key-value block rendering, applied automatically if the model isn't empty.

Section definitions include:

- **Name**: Display label in Universal Editor
- **Model ID**: References the section metadata component model
- **Filter ID**: Controls authoring behavior and child restrictions

Custom sections (tabs, accordions) use consecutive sections combined through auto-blocking client-side logic.

## Page Metadata

Page metadata controls `<meta>` elements in document headers. AEM maps standard page properties (title, description, keywords, robots, canonical URL) automatically.

Additional metadata approaches:

**Metadata Spreadsheets**: Define metadata per path or path pattern using table-like authoring interfaces.

**Custom Page Properties**: Create component models with ID `page-metadata` for custom fields, or template-specific models using `<template>-metadata` naming.

Standard AEM properties available include `cq:lastModified`, published-time, and `cq-tags`.
