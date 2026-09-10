import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `next dev` only — the LAN address a phone on the same network uses to
  // reach the dev server, which Next otherwise refuses as a cross-origin
  // request. `next build` ignores it, so nothing in the standalone artefact
  // reads it and /CLAUDE.md §7's "no hardcoded hostnames" is not in play.
  // It is one machine's address: change it, do not assume it is yours.
  allowedDevOrigins: ['192.168.0.156'],
  // Standalone output is the deployment artefact: `.next/standalone/server.js`
  // runs under PM2 behind Nginx. See docs/architecture.md §8 and /CLAUDE.md §7,
  // which requires it. It stays the default, so `pnpm build && pnpm package`
  // produces the client's archive with no environment set at all.
  //
  // `STANDALONE_OUTPUT=false` turns it off, for a host that builds its own
  // output rather than running ours. A platform-neutral switch on purpose: it
  // names what it does, not who asked for it, and nothing about the shipped
  // application changes either way.
  //
  // The concrete case is a preview deploy on Vercel, whose builder reads
  // `.next/next-server.js.nft.json` to trace server files and fails with ENOENT
  // once standalone has relocated that tree — Vercel's own guidance is not to
  // set `output` there.
  output: process.env.STANDALONE_OUTPUT === 'false' ? undefined : 'standalone',
  // URL parity with the legacy site — see docs/accessibility-and-seo.md.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.blob.core.windows.net' }],
  },
  turbopack: {
    rules: {
      // SVGR, scoped to the icon folder only. Icons inherit `currentColor` and
      // so have to be components; the brand artwork in src/assets/images/ is
      // fixed-colour and stays a file for `next/image` to process. Widening
      // this to all `*.svg` would break every image import.
      // docs/asset-inventory.md §3. Types: src/types/svg.d.ts.
      './src/assets/icons/*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async redirects() {
    return []; // populated in FE-22
  },
};

export default nextConfig;
