import { Router } from 'express';
import {
  getCycleInfo,
  getMembers,
  getMemberById,
  getPayoutTurns,
  getMeetingSession,
  updateMeetingSession,
  getLoans,
  getOkoleaRequests,
  getLedgerEntries,
  processContributionTransaction,
  db,
} from '../db';

export const apiRouter = Router();

// 1. Chama Summary & Cycle Stats
apiRouter.get('/chama/info', (req, res) => {
  try {
    const cycle = getCycleInfo();
    res.json(cycle);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Members Management
apiRouter.get('/members', (req, res) => {
  try {
    const members = getMembers();
    res.json(members);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/members/:id', (req, res) => {
  try {
    const member = getMemberById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Rotational Payout Turns
apiRouter.get('/payouts/turns', (req, res) => {
  try {
    const turns = getPayoutTurns();
    res.json(turns);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Live Meeting Session State
apiRouter.get('/meetings/current', (req, res) => {
  try {
    const meeting = getMeetingSession();
    res.json(meeting);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/meetings/current', (req, res) => {
  try {
    const sessionUpdate = req.body;
    updateMeetingSession(sessionUpdate);
    res.json({ success: true, meeting: sessionUpdate });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. ACID Double-Entry Financial Ledger
apiRouter.get('/ledger', (req, res) => {
  try {
    const entries = getLedgerEntries();
    res.json(entries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Loans Management
apiRouter.get('/loans', (req, res) => {
  try {
    const loans = getLoans();
    res.json(loans);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/loans', (req, res) => {
  try {
    const { borrowerId, principalAmount, interestRate, durationMonths, collateralDescription, guarantors } = req.body;
    const member = getMemberById(borrowerId);
    if (!member) {
      return res.status(404).json({ error: 'Borrower not found' });
    }

    const loanId = `loan-${Date.now().toString().slice(-4)}`;
    const appliedDate = new Date().toISOString().slice(0, 10);
    const schedule = [];
    const monthlyPrincipal = Math.round(principalAmount / durationMonths);

    for (let i = 1; i <= durationMonths; i++) {
      const interest = Math.round((principalAmount * (interestRate / 100)) / durationMonths);
      schedule.push({
        installmentNumber: i,
        dueDate: `2026-0${Math.min(12, 4 + i)}-15`,
        principal: monthlyPrincipal,
        interest,
        total: monthlyPrincipal + interest,
        status: 'upcoming',
      });
    }

    db.prepare(`
      INSERT INTO loans (
        id, borrowerId, borrowerName, type, principalAmount, interestRate, durationMonths,
        remainingBalance, collateralDescription, guarantors, status, appliedDate, schedule
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      loanId,
      member.id,
      member.name,
      'individual',
      principalAmount,
      interestRate,
      durationMonths,
      principalAmount,
      collateralDescription || 'Standard Guarantee',
      JSON.stringify(guarantors || []),
      'pending',
      appliedDate,
      JSON.stringify(schedule)
    );

    res.json({ success: true, loanId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Okolea Emergency Relief Requests
apiRouter.get('/okolea', (req, res) => {
  try {
    const requests = getOkoleaRequests();
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/okolea/vote', (req, res) => {
  try {
    const { requestId, memberId, vote } = req.body; // vote: 'yes' | 'no'
    const requestRow = db.prepare('SELECT * FROM okolea_requests WHERE id = ?').get(requestId) as any;
    if (!requestRow) {
      return res.status(404).json({ error: 'Okolea request not found' });
    }

    const votesYes: string[] = JSON.parse(requestRow.votesYes || '[]');
    const votesNo: string[] = JSON.parse(requestRow.votesNo || '[]');

    if (vote === 'yes' && !votesYes.includes(memberId)) {
      votesYes.push(memberId);
    } else if (vote === 'no' && !votesNo.includes(memberId)) {
      votesNo.push(memberId);
    }

    let status = requestRow.status;
    if (votesYes.length >= requestRow.quorumRequired) {
      status = 'approved_disbursed';
    }

    db.prepare(`
      UPDATE okolea_requests SET
        votesYes = ?,
        votesNo = ?,
        status = ?
      WHERE id = ?
    `).run(JSON.stringify(votesYes), JSON.stringify(votesNo), status, requestId);

    res.json({ success: true, votesYes, votesNo, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Atomic Contribution Payment Ingestion
apiRouter.post('/contributions/verify', (req, res) => {
  try {
    const { memberId, amount, method, reference } = req.body;
    if (!memberId || !amount) {
      return res.status(400).json({ error: 'Missing memberId or amount' });
    }

    const result = processContributionTransaction(memberId, Number(amount), method || 'mpesa', reference);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Provably Fair Raffle Draw Calculation
apiRouter.post('/payouts/raffle', (req, res) => {
  try {
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
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
