import { z } from 'zod';

/**
 * The single sanctioned reader of `process.env`.
 *
 * Validation runs at module load, so a missing or malformed variable fails the
 * **build** rather than the first request. ESLint blocks `process.env` access
 * everywhere else — see eslint.config.mjs.
 *
 * Note the explicit property reads below: Next.js only inlines `NEXT_PUBLIC_*`
 * variables into the client bundle when it can see a literal member access, so
 * `process.env` must never be spread or iterated here.
 */

/** Treat an unset variable and an empty `KEY=` in .env as the same thing. */
const optionalUrl = z.preprocess((value) => (value === '' ? undefined : value), z.url().optional());

const envSchema = z
  .object({
    // Set by Next, not by us — but it is still a `process.env` read, and this
    // is the only module allowed to make one. Consumers use `isProduction`.
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    CONTENT_SOURCE: z.enum(['mock', 'api']).default('mock'),
    API_BASE_URL: optionalUrl,
    API_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
    AZURE_BLOB_BASE_URL: optionalUrl,
    NEXT_PUBLIC_SITE_URL: z.url(),
    CAREER_REDIRECT_URL: optionalUrl,
    MOCK_LATENCY_MS: z.coerce.number().int().nonnegative().default(0),
  })
  .superRefine((value, ctx) => {
    if (value.CONTENT_SOURCE === 'api' && value.API_BASE_URL === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['API_BASE_URL'],
        message: 'Required when CONTENT_SOURCE is "api".',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  CONTENT_SOURCE: process.env.CONTENT_SOURCE,
  API_BASE_URL: process.env.API_BASE_URL,
  API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
  AZURE_BLOB_BASE_URL: process.env.AZURE_BLOB_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  CAREER_REDIRECT_URL: process.env.CAREER_REDIRECT_URL,
  MOCK_LATENCY_MS: process.env.MOCK_LATENCY_MS,
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');

  throw new Error(
    `Invalid environment configuration.\n${details}\n\nCopy .env.example to .env.local and fill in the missing values.`,
  );
}

export const env: Env = parsed.data;

/**
 * True in a production build. Gates anything that must not ship — currently
 * the design-system kitchen sink at `/dev/design-system/`.
 */
export const isProduction: boolean = env.NODE_ENV === 'production';
