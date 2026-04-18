# Web Performance: Maintaining a Perfect Lighthouse Score

> Source: https://www.aem.live/developer/keeping-it-100

## Overview

Adobe Experience Manager (AEM) prioritizes web performance optimization, emphasizing the importance of maintaining excellent user experiences and high performance metrics. The platform leverages Real User Monitoring (RUM) to gather field data that informs performance improvements beyond laboratory testing alone.

## Core Performance Principles

### Server-Side vs. Client-Side Rendering

AEM renders canonical page content into markup on the server, with CSS and DOM handling decorative elements. Client-side rendering is reserved for non-canonical content like block listings or applications. Redundant semantic content is omitted from markup to prevent performance degradation affecting metrics like Largest Contentful Paint (LCP) and Total Blocking Time.

### Core Web Vitals and Lab Testing

The performance of a website impacts its rankings in search results and influences user experience through Core Web Vitals metrics. PageSpeed Insights provides standardized Lighthouse testing in a controlled lab environment, offering reliable performance measurements across projects. However, the recommendations that you get from PageSpeed Insights do not necessarily lead to better results as scores approach 100.

## Three-Phase Loading Strategy (E-L-D)

### Phase E: Eager
This phase prioritizes content necessary for LCP. The body initially remains hidden to prevent premature image downloads and layout shift. The first section and its primary image load with priority, with an optimal payload target under 100KB for mobile performance.

### Phase L: Lazy
Non-blocking resources load during this phase, including additional sections, blocks, images with lazy-loading attributes, and JavaScript libraries that don't impact rendering speed.

### Phase D: Delayed
Third-party resources like marketing tools, consent management, and analytics load at least three seconds after LCP to minimize experience disruption.

## Common Performance Anti-Patterns

**Early hints and resource preloading** consume limited mobile bandwidth without improving LCP timing. Redirects impose performance penalties across all metrics. CDN script injection and TTFB delays negatively impact results. Code minification provides negligible benefits in the AEM environment where resources deploy in compressed, parallelized blocks.

## Key Takeaway

Continuous testing during development prevents performance degradation, making it hard to improve your Lighthouse score once it is low, but it is not hard to keep it at 100 if you continuously test.
