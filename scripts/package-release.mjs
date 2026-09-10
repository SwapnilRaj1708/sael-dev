/**
 * Assembles the deployment archive handed to the client.
 *
 * `output: 'standalone'` produces a self-contained server, but Next deliberately
 * leaves two things out of it: the static build output and `public/`. This
 * script stitches all three together with the PM2 process definition so the
 * archive extracts and runs with no install step on the target VM.
 *
 *   pnpm build && pnpm package  ->  release/sael-web-<version>.tar.gz
 */

import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const STANDALONE = join(ROOT, '.next', 'standalone');

if (!existsSync(STANDALONE)) {
  console.error('No .next/standalone directory. Run `pnpm build` first.');
  process.exit(1);
}

const { version } = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
const name = `sael-web-${version}`;
const releaseDir = join(ROOT, 'release');
const stageDir = join(releaseDir, name);

await rm(stageDir, { recursive: true, force: true });
await mkdir(stageDir, { recursive: true });

// 1. The standalone server, its traced node_modules and package.json.
await cp(STANDALONE, stageDir, { recursive: true });

// 2. Static output — Next expects it at .next/static relative to server.js.
await cp(join(ROOT, '.next', 'static'), join(stageDir, '.next', 'static'), { recursive: true });

// 3. Anything served by literal URL.
if (existsSync(join(ROOT, 'public'))) {
  await cp(join(ROOT, 'public'), join(stageDir, 'public'), { recursive: true });
}

// 4. Process definition and the environment contract.
await cp(join(ROOT, 'ecosystem.config.cjs'), join(stageDir, 'ecosystem.config.cjs'));
await cp(join(ROOT, '.env.example'), join(stageDir, '.env.example'));

await writeFile(
  join(stageDir, 'DEPLOY.txt'),
  [
    `SAEL corporate website — ${name}`,
    '',
    'Requires Node.js 25 (Node 24 LTS or newer also runs it). No install step:',
    'dependencies are already bundled.',
    '',
    '  1. Extract to /var/www/sael-web',
    '  2. Set the runtime environment in ecosystem.config.cjs (see .env.example)',
    '  3. pm2 start ecosystem.config.cjs',
    '  4. Point Nginx at 127.0.0.1:3000 — see deploy/nginx.conf.sample in the repo',
    '',
    'Health check: GET /api/health/ returns {"status":"ok"}.',
    '',
    'NEXT_PUBLIC_* values are compiled into the client bundle at build time.',
    'Changing one requires a rebuild, not a restart.',
    '',
  ].join('\n'),
  'utf8',
);

// 5. Nothing in the archive may point outside it.
const dangling = [];
for (const entry of await readdir(stageDir, { recursive: true, withFileTypes: true })) {
  if (entry.isSymbolicLink()) dangling.push(join(entry.parentPath, entry.name));
}
if (dangling.length > 0) {
  console.error(`Refusing to archive: ${dangling.length} unresolved link(s), starting with`);
  console.error(`  ${dangling[0]}`);
  process.exit(1);
}

// 6. Compress. bsdtar ships with Windows 10+ and GNU tar with every Linux host.
const archive = `${name}.tar.gz`;
const tar = spawnSync('tar', ['-czf', archive, name], { cwd: releaseDir, stdio: 'inherit' });

if (tar.status !== 0) {
  console.error(`\nStaged at release/${name}, but tar failed — archive it manually.`);
  process.exit(1);
}

await rm(stageDir, { recursive: true, force: true });
console.log(`\nrelease/${archive}`);
