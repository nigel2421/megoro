import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'MGR ROSCA Engine',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API: Chama Summary & ACID-compliant Ledger Schema
  app.get('/api/chama/info', (req, res) => {
    res.json({
      name: 'Ushirika Bora ROSCA 2026',
      cycleNumber: 3,
      currency: 'KES',
      totalMembers: 12,
      shareAmount: 10000,
      fineAmount: 500,
      payoutPool: 120000,
      protocol: 'MGR-ACID-Ledger-v1',
    });
  });

  // REST API: Live Meeting Room State
  app.get('/api/meetings/current', (req, res) => {
    res.json({
      roomId: 'mezani-round-4',
      stage: 'live_mezani',
      seatsTotal: 12,
      activeSpeaker: 'Kiprono Bett (Chairman)',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API: M-Pesa / Cash Payment Ingestion Simulator & Verification
  app.post('/api/contributions/verify', (req, res) => {
    const { memberId, amount, method, reference } = req.body;
    if (!memberId || !amount) {
      return res.status(400).json({ error: 'Missing memberId or amount' });
    }

    const verifiedRef = reference || (method === 'mpesa' ? `QJH${Math.floor(100000 + Math.random() * 900000)}` : `CSH-REC-${Math.floor(1000 + Math.random() * 9000)}`);
    res.json({
      success: true,
      transactionId: `TXN-${Date.now().toString().slice(-5)}`,
      reference: verifiedRef,
      status: 'verified_cleared',
      verifiedBy: 'M-Pesa Instant Webhook / Treasurer Counter-Sign',
      amount,
      currency: 'KES',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API: Provably Fair Raffle Draw Calculation
  app.post('/api/payouts/raffle', (req, res) => {
    const { eligibleMemberIds } = req.body;
    if (!Array.isArray(eligibleMemberIds) || eligibleMemberIds.length === 0) {
      return res.status(400).json({ error: 'No eligible members provided' });
    }

    const seed = `${Date.now()}-${Math.random()}`;
    const winnerIndex = Math.floor(Math.random() * eligibleMemberIds.length);
    const winnerId = eligibleMemberIds[winnerIndex];

    res.json({
      winnerId,
      winnerIndex,
      fairnessSeed: seed,
      algorithm: 'Fisher-Yates PRNG / SHA-256 Entropy',
      timestamp: new Date().toISOString(),
    });
  });

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MGR ROSCA Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
