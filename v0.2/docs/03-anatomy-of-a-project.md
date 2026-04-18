# The Anatomy of a Project

> Source: https://www.aem.live/developer/anatomy-of-a-franklin-project

This document describes what a typical project looks like from a code standpoint.

## Code: Git and GitHub

One of the defining philosophies is that it is easiest to allow users to work with the tools that they are familiar with. The overwhelming majority of developers manage their code in systems based on Git, so it only makes sense to allow developers to work with Git to manage and deploy their code.

The platform uses a buildless approach that runs directly from your GitHub repo. After installing the AEM GitHub bot on your repo, websites are automatically created for each of your branches for content preview on `https://<branch>--<repo>--<owner>.aem.page/` and the production site on `https://<branch>--<repo>--<owner>.aem.live/` for published content.

Every resource that you put into your GitHub repo is available on your website, so a file in your GitHub repo on the main branch in `/scripts/scripts.js` will be available on `https://main--<repo>--<owner>.aem.page/scripts/scripts.js`

There are few "special" files that Adobe Experience Manager uses to connect the content into your website.

If you wish to use a git host other than GitHub, see Bring your own git.

It is strongly recommended that repos are kept public on GitHub, to foster the community.

**Important notes**:

- The combination `<branch>--<repo>--<owner>` must not exceed 63 characters (including the hyphens/dashes). This is a subdomain name constraint.
- `branch`, `repo` and `owner` cannot contain `--`.

### The Entry Point: head.html

The `head.html` file is the most important extension point to influence the markup of the content. The easiest way to think of it is that this file is injected on the server side as part of the `<head>` HTML tag and is combined with the metadata coming from the content.

The `head.html` should remain largely unchanged from the boilerplate and there are only very few legitimate reasons in a regular project to make changes. Those include remapping your project to a different base URL or to support legacy browsers which usually require scripts that are not loaded as modules.

Adding marketing technology like Adobe Web SDK, Google Tag Manager or other 3rd party scripts to your `head.html` file is strongly advised against due to performance impacts.

### Not Found: 404.html

To create a custom `404` response, place a `404.html` file into the root of your github repository. This will be served on any URL that doesn't map to an existing resource in either content or code.

### Don't Serve: .hlxignore

There are some files in your repo that should not be served from your website (e.g. tests, build tools, build artifacts). You can add those to a `.hlxignore` file in the same format as the well-known `.gitignore` file.

## Configuration

Configuration of your site is managed exclusively via the Configuration service.

### The Content Connection

The content configuration defines the connection between your site and its content source, telling us where to get content from when pages are previewed.

Document Authoring, AEM Authoring, Sharepoint, and Google Drive are all natively supported, with additional sources possible via Bring Your Own Markup.

### Tame the Bots: robots.txt

A `robots.txt` file is generally a regular file that is served as you would expect on your production website on your own domain. To protect your preview and origin site from being indexed, your `.page` and `.live` sites will serve a `robots.txt` file that disallows all robots instead of the `robots.txt` file from your repo.

### Query and Indexing

There is a flexible indexing facility that lets you keep track of all of your content pages conveniently as a spreadsheet or json. This facility is often used to show lists or feeds of pages as well as to filter and sort content on a website.

### Automate Your Sitemap

Complex sitemaps can automatically be created for you whenever authors publish new content, including flexible hreflang mappings where needed.

## Commonly Used File and Folder Structure

Beyond the files treated as special or configuration files, there is a commonly-used structure that is expressed in the Boilerplate repo.

### Scripts and Styles

By convention in an AEM project, the `head.html` references `styles.css`, `scripts.js`, and `aem.js` located in `/scripts` and `/styles`, as the entry points for the project code.

`scripts.js` is where your global custom javascript code lives and is where the block loading code is triggered. `styles.css` hosts the global styling information for your site.

As all three files are loaded before the page can be displayed, it is important that they are kept relatively small and executed efficiently.

Beyond `styles.css`, a `lazy-styles.css` file is commonly used, which is loaded after the LCP event. This could be a good place for fonts or global CSS that is below the fold.

In addition to `scripts.js`, there is the commonly-used `delayed.js`. This is a catch-all for libraries that need to be loaded on a page but should be kept from interfering with the delivery of the page.

### Blocks

Most of the project-specific CSS and JavaScript code lives in blocks. Authors create blocks in their documents. Developers then write the corresponding code that styles the blocks with CSS and/or decorates the DOM.

The block name is used as both the folder name of a block as well as the filename for the `.css` and `.js` files that are loaded by the block loader when a block is used on a page.

The block name is also used as the CSS class name on the block to allow for intuitive styling. The javascript is loaded as a module (ESM) and exports a default function that is executed as part of the block loading.

### Icons

Most projects have SVG files that are usually added to the `/icons` folder, and can be referenced with a `:<iconname>:` notation by authors. By default, icons are inlined into the DOM so they can be styled with CSS, without having to create SVG symbols.
