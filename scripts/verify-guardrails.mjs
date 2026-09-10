/**
 * Asserts that the project's guardrails actually fail when they should.
 *
 * A guardrail nobody tests is a guardrail that quietly stops working. This
 * script proves six things:
 *
 *   1. `src/lib/config/env.ts` rejects a missing or malformed environment with
 *      a readable message, at module load — so the build fails, not a request.
 *   2. ESLint blocks importing a concrete content repository outside
 *      `src/lib/content/` (/CLAUDE.md §6).
 *   3. ESLint blocks reading `process.env` outside `src/lib/config/env.ts`
 *      (docs/architecture.md §6).
 *   4. No file under `src/` carries a raw colour or a bare `vw` outside the
 *      token layer (/CLAUDE.md §2.2).
 *   5. `<Container>` is the only thing that sets horizontal page padding
 *      (docs/design-guidelines.md §3).
 *   6. No file under `src/` carries a magic number in a Tailwind arbitrary
 *      value (/CLAUDE.md §2.2, third clause).
 *
 * 4 and 5 are the FE-02 acceptance criteria that would otherwise be "someone
 * remembers to grep for it". 6 closes the gap they left: rule 2.2 has four
 * clauses and only three were enforced, which is why FE-04 accumulated
 * `h-[42px]`, `z-[100]` and friends with a green build. Added as C-5 of
 * docs/design-reconciliation.md, ahead of FE-06.
 *
 * Runs in `pnpm check` and on pre-push. No test framework — see
 * docs/architecture.md §1 ("Not in scope").
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FIXTURE_DIR = join(ROOT, 'src', '__verify__');

const VALID_SITE_URL = 'https://www.sael.co';

/** Variables the child process needs to start at all, on Windows and POSIX. */
const PASSTHROUGH = ['PATH', 'Path', 'SystemRoot', 'windir', 'COMSPEC', 'PATHEXT', 'TEMP', 'TMP'];

const failures = [];

function report(ok, name, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) {
    failures.push(name);
    if (detail) console.log(`      ${detail.trim().split('\n').join('\n      ')}`);
  }
}

// ---------------------------------------------------------------------------
// 1. Environment validation
// ---------------------------------------------------------------------------

/** Load src/lib/config/env.ts in a clean child process with the given env. */
function loadEnv(vars) {
  const env = Object.create(null);
  for (const key of PASSTHROUGH) {
    if (process.env[key] !== undefined) env[key] = process.env[key];
  }
  Object.assign(env, vars);

  const result = spawnSync(
    process.execPath,
    [
      '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
      '--input-type=module',
      '-e',
      "await import('./src/lib/config/env.ts');",
    ],
    { cwd: ROOT, env, encoding: 'utf8' },
  );

  return { ok: result.status === 0, output: `${result.stdout}${result.stderr}` };
}

const ENV_CASES = [
  {
    name: 'env: a complete environment loads',
    vars: { NEXT_PUBLIC_SITE_URL: VALID_SITE_URL },
    shouldPass: true,
  },
  {
    name: 'env: missing NEXT_PUBLIC_SITE_URL is rejected',
    vars: {},
    shouldPass: false,
    expect: 'NEXT_PUBLIC_SITE_URL',
  },
  {
    name: 'env: malformed NEXT_PUBLIC_SITE_URL is rejected',
    vars: { NEXT_PUBLIC_SITE_URL: 'www.sael.co' },
    shouldPass: false,
    expect: 'NEXT_PUBLIC_SITE_URL',
  },
  {
    name: 'env: CONTENT_SOURCE=api without API_BASE_URL is rejected',
    vars: { NEXT_PUBLIC_SITE_URL: VALID_SITE_URL, CONTENT_SOURCE: 'api' },
    shouldPass: false,
    expect: 'API_BASE_URL',
  },
  {
    name: 'env: CONTENT_SOURCE=api with API_BASE_URL loads',
    vars: {
      NEXT_PUBLIC_SITE_URL: VALID_SITE_URL,
      CONTENT_SOURCE: 'api',
      API_BASE_URL: 'https://api.example.com',
    },
    shouldPass: true,
  },
  {
    name: 'env: unknown CONTENT_SOURCE is rejected',
    vars: { NEXT_PUBLIC_SITE_URL: VALID_SITE_URL, CONTENT_SOURCE: 'database' },
    shouldPass: false,
    expect: 'CONTENT_SOURCE',
  },
];

for (const testCase of ENV_CASES) {
  const { ok, output } = loadEnv(testCase.vars);

  if (testCase.shouldPass) {
    report(ok, testCase.name, ok ? undefined : output);
    continue;
  }

  if (ok) {
    report(false, testCase.name, 'Expected the module to throw, but it loaded.');
  } else if (testCase.expect && !output.includes(testCase.expect)) {
    report(false, testCase.name, `Error did not name ${testCase.expect}:\n${output}`);
  } else {
    report(true, testCase.name);
  }
}

// ---------------------------------------------------------------------------
// 2 & 3. ESLint guardrails
// ---------------------------------------------------------------------------

const LINT_CASES = [
  {
    name: 'lint: importing @/lib/content/mock outside the data layer is blocked',
    file: 'restricted-mock-import.ts',
    source: [
      "import { MockContentRepository } from '@/lib/content/mock';",
      '',
      'export const repository = MockContentRepository;',
      '',
    ].join('\n'),
    rule: 'no-restricted-imports',
  },
  {
    name: 'lint: importing @/lib/content/api outside the data layer is blocked',
    file: 'restricted-api-import.ts',
    source: [
      "import { ApiContentRepository } from '@/lib/content/api';",
      '',
      'export const repository = ApiContentRepository;',
      '',
    ].join('\n'),
    rule: 'no-restricted-imports',
  },
  {
    name: 'lint: importing a retired section is blocked',
    file: 'restricted-retired-import.ts',
    source: [
      "import { PixelStrip } from '@/components/sections/_retired/pixel-strip';",
      '',
      'export const strip = PixelStrip;',
      '',
    ].join('\n'),
    rule: 'no-restricted-imports',
  },
  {
    name: 'lint: reading process.env outside config/env.ts is blocked',
    file: 'restricted-process-env.ts',
    source: 'export const source = process.env.CONTENT_SOURCE;\n',
    rule: 'no-restricted-properties',
  },
  {
    name: 'lint: a compliant module reports neither guardrail',
    file: 'compliant.ts',
    source: [
      "import { env } from '@/lib/config/env';",
      '',
      'export const source = env.CONTENT_SOURCE;',
      '',
    ].join('\n'),
    rule: null,
  },
];

try {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  for (const testCase of LINT_CASES) {
    writeFileSync(join(FIXTURE_DIR, testCase.file), testCase.source, 'utf8');
  }

  const eslint = new ESLint({ cwd: ROOT });
  const results = await eslint.lintFiles([join(FIXTURE_DIR, '*.ts')]);

  for (const testCase of LINT_CASES) {
    const result = results.find((candidate) => candidate.filePath.endsWith(testCase.file));

    if (!result) {
      report(false, testCase.name, `ESLint did not lint ${testCase.file}.`);
      continue;
    }

    const guardrailIds = ['no-restricted-imports', 'no-restricted-properties'];
    const hit = result.messages.filter(
      (message) => message.ruleId !== null && guardrailIds.includes(message.ruleId),
    );

    if (testCase.rule === null) {
      report(
        hit.length === 0,
        testCase.name,
        hit.map((message) => `${message.ruleId ?? '?'}: ${message.message}`).join('\n'),
      );
    } else {
      const matched = hit.some((message) => message.ruleId === testCase.rule);
      report(
        matched,
        testCase.name,
        matched ? undefined : `Expected ${testCase.rule}; got ${JSON.stringify(result.messages)}`,
      );
    }
  }
} finally {
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// 4 & 5. Token discipline
// ---------------------------------------------------------------------------

const SRC = join(ROOT, 'src');

/** Files allowed to contain raw design values. The token layer, and only it. */
const TOKEN_LAYER = new Set(['src/styles/theme.css']);

/** Documentation and the kitchen sink name tokens; they do not define them. */
const VALUE_EXEMPT = new Set(['src/styles/README.md', 'src/app/dev/design-system/page.tsx']);

function walk(dir) {
  const entries = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__verify__') continue;
      entries.push(...walk(path));
    } else {
      entries.push(path);
    }
  }
  return entries;
}

const SOURCE_FILES = walk(SRC)
  .filter((path) => /\.(?:ts|tsx|css|md)$/.test(path))
  .map((path) => ({ path, id: relative(ROOT, path).split(sep).join('/') }));

const VALUE_CHECKS = [
  {
    name: 'tokens: no raw hex colour outside theme.css',
    // Three, four, six or eight digits. Anchored so a git sha or an id in a
    // string does not trip it.
    pattern: /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
    allow: TOKEN_LAYER,
    hint: 'Use a --color-* token from src/styles/theme.css.',
  },
  {
    name: 'tokens: no rgb()/rgba()/hsl() literal outside theme.css',
    pattern: /\b(?:rgba?|hsla?)\(/g,
    allow: TOKEN_LAYER,
    hint: 'Use a --color-* or --gradient-* token from src/styles/theme.css.',
  },
  {
    name: 'tokens: no bare vw unit outside theme.css',
    // `vw` is safe inside a clamp() in the token layer, and nowhere else — a
    // proportional unit is not a responsive one.
    // docs/responsive-strategy.md §1.
    //
    // One further exemption, added in FE-04: an `<Image sizes>` attribute is a
    // list of media conditions, and a viewport unit is the only way to write
    // one. Rather than weaken the rule for every file, the `sizes` strings are
    // confined to a module that contains nothing else.
    pattern: /\b\d+(?:\.\d+)?vw\b/g,
    allow: new Set([...TOKEN_LAYER, 'src/lib/utils/image-sizes.ts']),
    hint: 'Use a fluid token, aspect-ratio, or a breakpoint. docs/responsive-strategy.md §3.',
  },
  {
    name: 'layout: <Container> is the only source of horizontal page padding',
    // The gutter token itself, applied anywhere but the Container primitive.
    pattern: /\b(?:px|pl|pr)-gutter\b/g,
    allow: new Set(['src/components/ui/container.tsx']),
    hint: 'Wrap the content in <Container> instead. docs/design-guidelines.md §3.',
  },
  {
    name: 'tokens: no magic number in a Tailwind arbitrary value',
    /*
     * /CLAUDE.md §2.2's third clause — "no magic pixel numbers" — which was the
     * one rule here with nothing enforcing it. A Tailwind arbitrary value whose
     * contents *begin with a number* is a raw dimension: `h-[42px]`, `z-[100]`,
     * `backdrop-blur-[22px]`, `scale-[1.02]`, `tracking-[0.25em]`.
     *
     * Anchoring on that leading digit is what makes the rule cheap and precise.
     * It admits, without needing an allowlist:
     *
     *   - composed values — `pt-[calc(var(--a)+var(--b))]`, `w-[min(…)]` — which
     *     start with a function name and are how a token is *used*, not dodged;
     *   - arbitrary properties — `[clip-path:polygon(…)]`, `[text-wrap:pretty]`
     *     — which have no `utility-` prefix before the bracket;
     *   - variant brackets — `supports-[backdrop-filter]`, `data-[state=open]`,
     *     `transition-[color,background-color]` — which start with a letter.
     *
     * The token layer keeps its literals, and the design-system page is a
     * showcase of raw values by definition; both are already exempt above.
     */
    pattern: /\b[a-z][a-zA-Z-]*-\[-?\d[^\]]*\]/g,
    /*
     * Grid track sizing is the one place a bare number is the idiom rather than
     * a magic value: `grid-rows-[0fr]` → `grid-rows-[1fr]` is how a collapsing
     * row is animated, and `1fr` is a ratio, not a dimension. There is no token
     * that could express it and no drift for it to cause.
     */
    except: /^grid-(?:rows|cols)-\[/,
    allow: TOKEN_LAYER,
    hint: 'Mint a token in src/styles/theme.css. /CLAUDE.md §2.2, docs/design-guidelines.md §3.',
  },
];

/**
 * Blank out comments, preserving offsets so reported line numbers stay true.
 *
 * Without this, a comment explaining *why* a token exists trips the check that
 * enforces it — and the fix would be to stop documenting the rule, which is
 * the wrong way round. Only block comments and whole-line `//` comments are
 * stripped; a trailing `//` is left alone so `https://` survives.
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/^[ \t]*\/\/.*$/gm, (match) => ' '.repeat(match.length));
}

for (const check of VALUE_CHECKS) {
  const offenders = [];

  for (const file of SOURCE_FILES) {
    if (check.allow.has(file.id) || VALUE_EXEMPT.has(file.id)) continue;

    const source = stripComments(readFileSync(file.path, 'utf8'));
    const matches = [...source.matchAll(check.pattern)].filter(
      (match) => check.except === undefined || !check.except.test(match[0]),
    );
    if (matches.length === 0) continue;

    // Report the line, so the message is actionable rather than a filename.
    for (const match of matches.slice(0, 3)) {
      const line = source.slice(0, match.index).split('\n').length;
      offenders.push(`${file.id}:${line}  ${match[0]}`);
    }
  }

  report(
    offenders.length === 0,
    check.name,
    offenders.length === 0 ? undefined : `${offenders.join('\n')}\n${check.hint}`,
  );
}

// ---------------------------------------------------------------------------
// 6. Stylesheet layering
// ---------------------------------------------------------------------------

/*
 * Unlayered author styles outrank every `@layer` regardless of specificity. A
 * bare `* { padding: 0 }` in globals.css therefore beats `.px-gutter`, and
 * every other padding, margin and gap utility in the codebase, with no build
 * error and no console warning — the site renders with all of its colour and
 * type and none of its spacing.
 *
 * That shipped in FE-01 and survived FE-02 undetected. So: in the two files
 * that carry rules, every top-level block must be an at-rule that either
 * declares a layer or does not cascade at all.
 *
 * theme.css is exempt. It declares custom properties on `:root`, which compete
 * with nothing.
 */
const LAYERED_STYLESHEETS = ['src/styles/globals.css', 'src/styles/animations.css'];
const ALLOWED_TOP_LEVEL = /^@(?:layer|utility|keyframes|import|charset|property)\b/;

for (const id of LAYERED_STYLESHEETS) {
  const source = readFileSync(join(ROOT, id), 'utf8');
  // Strip comments so a brace inside one cannot throw off the depth count.
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, '');

  const offenders = [];
  let depth = 0;
  let preambleStart = 0;

  for (let index = 0; index < stripped.length; index++) {
    const char = stripped[index];

    if (char === '{') {
      if (depth === 0) {
        const preamble = stripped.slice(preambleStart, index).trim();
        if (preamble !== '' && !ALLOWED_TOP_LEVEL.test(preamble)) {
          const line = source.slice(0, source.indexOf(preamble)).split('\n').length;
          offenders.push(`${id}:${line}  ${preamble.split('\n')[0]}`);
        }
      }
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) preambleStart = index + 1;
    } else if (depth === 0 && char === ';') {
      preambleStart = index + 1;
    }
  }

  report(
    offenders.length === 0,
    `styles: every top-level rule in ${id} is inside a layer`,
    offenders.length === 0
      ? undefined
      : `${offenders.join('\n')}\nWrap it in @layer base (globals.css) or @layer components (animations.css).`,
  );
}

// ---------------------------------------------------------------------------

if (failures.length > 0) {
  console.error(`\n${failures.length} guardrail check(s) failed.`);
  process.exit(1);
}

console.log('\nAll guardrail checks passed.');
