/**
 * PM2 process definition for the Azure VM deployment (Nginx + PM2).
 *
 * This file ships inside the release archive and is run from the extracted
 * directory, so `script` is relative to it. See README.md → Deployment.
 */
module.exports = {
  apps: [
    {
      name: 'sael-web',
      script: 'server.js',
      // Raise to 'max' to use every core. Each instance keeps its own data and
      // image cache, which docs/architecture.md §5 accounts for.
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Bind to loopback only — Nginx is the public listener.
        HOSTNAME: '127.0.0.1',
        // Runtime configuration. These must match the values the archive was
        // built with for any NEXT_PUBLIC_* variable, which is baked in at build.
        CONTENT_SOURCE: 'mock',
        NEXT_PUBLIC_SITE_URL: 'https://www.sael.co',
      },
    },
  ],
};
