import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './server/db';
import { apiRouter } from './server/routes/api';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

async function startServer() {
  // Initialize SQLite Database & Tables
  initDatabase();

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'MGR ROSCA Engine',
      version: '2.4.0',
      database: 'SQLite (chama.db - WAL Mode)',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API router for persistent SQLite data management
  app.use('/api', apiRouter);

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MGR ROSCA Engine with SQLite running at http://localhost:${PORT}`);
  });
}

startServer();
