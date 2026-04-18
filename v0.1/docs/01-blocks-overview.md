# Blocks in AEM Edge Delivery Services

Blocks are the fundamental building unit of an EDS project. A block is a reusable piece of UI — for example a hero, a carousel, a card grid — that authors can drop into a page.

## How a block is structured

Each block lives in its own folder under `/blocks/<block-name>/` and contains at minimum:

- `<block-name>.css` — the styles for the block
- `<block-name>.js` — the JavaScript that decorates (transforms) the block's HTML

For example, a hero block lives at:

```
/blocks/hero/hero.css
/blocks/hero/hero.js
```

## How a block is authored

Authors create blocks in their document (Google Docs or SharePoint) by inserting a single-cell or multi-cell table. The first row of the table contains the block name. For example, a table that starts with the word "Hero" becomes a hero block on the published page.

## How a block is decorated

When a page loads, EDS scans the DOM for `div.block` elements and dynamically imports the matching JS file from `/blocks/<block-name>/<block-name>.js`. That file exports a `decorate(block)` function which receives the block's root element and is responsible for transforming the raw HTML into the final UI.

A minimal `decorate` function looks like:

```js
export default function decorate(block) {
  // transform block's HTML here
  block.classList.add('decorated')
}
```

## Why this matters

This block model means a project can ship dozens of independent UI components without a JavaScript framework, without a build step, and without coupling components to each other. Each block is a self-contained CSS + JS pair.
