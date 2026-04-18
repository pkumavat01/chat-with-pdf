/** @type {import('next').NextConfig} */
const nextConfig = {
  // Our /api/chat route reads markdown files from ./docs at module init with
  // fs.readdirSync. Next.js's output file tracing can't detect dynamic fs
  // patterns like this, so without hinting, docs won't be bundled into the
  // serverless function on Vercel and loadDocs() will return empty.
  outputFileTracingIncludes: {
    '/api/chat': ['./docs/**/*'],
  },
}

export default nextConfig
