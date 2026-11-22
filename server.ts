import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createBackendRouter } from './backend/app.ts';
import { getServerConfig } from './backend/config/env.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const config = getServerConfig();
  const app = express();
  app.set('trust proxy', 1);

  // Mount /api/v1/* backend endpoints and security middleware
  app.use(createBackendRouter({ config }));

  if (config.nodeEnv !== 'production') {
    // Dev mode: mount Vite middlewares cleanly while preserving HMR disabled config
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve compiled static Vite bundle with SPA fallback
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: 'index.html' }));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(
      `Government High School Davangere portal listening on http://0.0.0.0:${config.port} (${config.nodeEnv})`
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
