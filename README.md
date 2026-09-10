# SAEL Corporate Website

A rebuild of [www.sael.co](https://www.sael.co) for SAEL Industries Limited — Next.js 16
(App Router), TypeScript and Tailwind CSS v4.

**New here? Start with [`docs/frontend-progress.md`](docs/frontend-progress.md).** It is the
single source of truth for what is being built next. Then read [`CLAUDE.md`](CLAUDE.md) for the
project's non-negotiables and [`docs/architecture.md`](docs/architecture.md) for where code lives.

---

## Prerequisites

|         |                                                                     |
| ------- | ------------------------------------------------------------------- |
| Node.js | 25 (see `.nvmrc`; `nvm use` picks it up)                            |
| pnpm    | 11+ — `corepack enable` uses the version pinned in `packageManager` |

## Getting started

```bash
pnpm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
pnpm dev
```

The app runs at http://localhost:3000. `.env.local` works unedited — it defaults to the mock
content repository, so no backend is required.

## Scripts

| Script                              | Does                                                                                   |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm dev`                          | Development server                                                                     |
| `pnpm build`                        | Production build (`output: 'standalone'`)                                              |
| `pnpm start`                        | Serve the production build                                                             |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                                                                                 |
| `pnpm typecheck`                    | `tsc --noEmit`                                                                         |
| `pnpm format` / `pnpm format:check` | Prettier                                                                               |
| `pnpm verify:guardrails`            | Asserts the env schema and the banned-import lint rules actually fail when they should |
| `pnpm check`                        | lint → typecheck → guardrails → build. **Run this before opening a PR.**               |
| `pnpm package`                      | Builds the deployable archive (requires a prior `pnpm build`)                          |

## Configuration

Every environment variable is declared in [`.env.example`](.env.example) and validated by
[`src/lib/config/env.ts`](src/lib/config/env.ts) with Zod **at module load** — a missing or
malformed value fails the build with a readable error rather than crashing a request.

Nothing else in the codebase may read `process.env`; ESLint enforces this.

## Deployment

The client hosts on an Azure VM behind Nginx with PM2. There is no container step.

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm package          # -> release/sael-web-<version>.tar.gz
```

The archive is self-contained — the standalone server, its traced dependencies, `.next/static`,
`public/`, `ecosystem.config.cjs` and `DEPLOY.txt`. On the VM:

```bash
tar -xzf sael-web-<version>.tar.gz -C /var/www
cd /var/www/sael-web-<version>
# set the runtime environment in ecosystem.config.cjs first
pm2 start ecosystem.config.cjs
```

Nginx terminates TLS, compresses responses and caches `/_next/static/` —
[`deploy/nginx.conf.sample`](deploy/nginx.conf.sample) is a working starting point. Liveness is
`GET /api/health/`.

`NEXT_PUBLIC_*` values are compiled into the client bundle at build time. Changing one means a
rebuild, not a restart.

## Branching

```
main  ←  feat/FE-NN-slug
```

`main` is production. Work happens on a branch named after its tracker item — `feat/FE-01-initial-project-setup`
— and merges back through a pull request. One tracker item per PR, and the tracker row moves in the
same commit as the code it describes.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/); commitlint,
lint-staged and a pre-push typecheck run automatically via Husky.
