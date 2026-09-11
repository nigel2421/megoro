import Database from 'better-sqlite3';
import path from 'path';
import {
  initialCycle,
  initialMembers,
  initialPayoutTurns,
  initialMeeting,
  initialLoans,
  initialOkoleaRequests,
  initialLedger,
} from '../src/data/seedData';
import { Member, ChamaCycle, MeetingSession, Loan, OkoleaRequest, LedgerEntry, PayoutTurn } from '../src/types';

const dbPath = path.join(process.cwd(), 'chama.db');
export const db = new Database(dbPath);

// Enable WAL mode & Foreign Keys for reliability and concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS chama_cycles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cycleNumber INTEGER NOT NULL,
      currency TEXT NOT NULL,
      shareAmount REAL NOT NULL,
      payoutMode TEXT NOT NULL,
      totalRounds INTEGER NOT NULL,
      currentRound INTEGER NOT NULL,
      meetingFrequency TEXT NOT NULL,
      fineAmount REAL NOT NULL,
      okoleaPoolBalance REAL NOT NULL,
      vaultPoolBalance REAL NOT NULL,
      totalCycleCollected REAL NOT NULL,
      totalInterestAccumulated REAL NOT NULL,
      status TEXT NOT NULL,
      startDate TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      role TEXT NOT NULL,
      phone TEXT NOT NULL,
      seatNumber INTEGER NOT NULL,
      streakCount INTEGER NOT NULL,
      onTimeContributions INTEGER NOT NULL,
      missedContributions INTEGER NOT NULL,
      liquidBalance REAL NOT NULL,
      sayeBalance REAL NOT NULL,
      mkebeBalance REAL NOT NULL,
      pendingFines REAL NOT NULL,
      isOnline INTEGER NOT NULL,
      isSeated INTEGER NOT NULL,
      activeTurnOrder INTEGER NOT NULL,
      hasReceivedPayoutThisCycle INTEGER NOT NULL,
      badges TEXT NOT NULL -- JSON string
    );

    CREATE TABLE IF NOT EXISTS payout_turns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderNum INTEGER NOT NULL,
      memberId TEXT NOT NULL,
      scheduledDate TEXT NOT NULL,
      status TEXT NOT NULL,
      amount REAL NOT NULL,
      payoutMethod TEXT,
      steppedToMemberId TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS meeting_sessions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      stage TEXT NOT NULL,
      wizardStep INTEGER NOT NULL,
      missionVibe TEXT NOT NULL,
      katibaApproved INTEGER NOT NULL,
      agenda TEXT NOT NULL, -- JSON string
      attendance TEXT NOT NULL, -- JSON string
      speakerQueue TEXT NOT NULL, -- JSON string
      activeSpeakerId TEXT,
      mountedPlugins TEXT NOT NULL, -- JSON string
      totalCollectedThisMeeting REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS loans (
      id TEXT PRIMARY KEY,
      borrowerId TEXT NOT NULL,
      borrowerName TEXT NOT NULL,
      type TEXT NOT NULL,
      principalAmount REAL NOT NULL,
      interestRate REAL NOT NULL,
      durationMonths INTEGER NOT NULL,
      remainingBalance REAL NOT NULL,
      collateralDescription TEXT NOT NULL,
      guarantors TEXT NOT NULL, -- JSON string
      status TEXT NOT NULL,
      appliedDate TEXT NOT NULL,
      schedule TEXT NOT NULL -- JSON string
    );

    CREATE TABLE IF NOT EXISTS okolea_requests (
      id TEXT PRIMARY KEY,
      requesterId TEXT NOT NULL,
      requesterName TEXT NOT NULL,
      reason TEXT NOT NULL,
      amountRequested REAL NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL,
      votesYes TEXT NOT NULL, -- JSON string
      votesNo TEXT NOT NULL, -- JSON string
      quorumRequired INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ledger_entries (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      memberId TEXT NOT NULL,
      memberName TEXT NOT NULL,
      type TEXT NOT NULL,
      bucket TEXT NOT NULL,
      debit REAL NOT NULL,
      credit REAL NOT NULL,
      balanceAfter REAL NOT NULL,
      method TEXT NOT NULL,
      reference TEXT NOT NULL,
      verifiedBy TEXT NOT NULL,
      notes TEXT NOT NULL
    );
  `);

  seedDatabaseIfEmpty();
}

function seedDatabaseIfEmpty() {
  const cycleCount = (db.prepare('SELECT COUNT(*) as count FROM chama_cycles').get() as { count: number }).count;
  if (cycleCount > 0) {
    return;
  }

  console.log('Seeding SQLite database chama.db with initial ROSCA data...');

  const insertCycle = db.prepare(`
    INSERT INTO chama_cycles (
      id, name, cycleNumber, currency, shareAmount, payoutMode, totalRounds,
      currentRound, meetingFrequency, fineAmount, okoleaPoolBalance, vaultPoolBalance,
      totalCycleCollected, totalInterestAccumulated, status, startDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCycle.run(
    initialCycle.id,
    initialCycle.name,
    initialCycle.cycleNumber,
    initialCycle.currency,
    initialCycle.shareAmount,
    initialCycle.payoutMode,
    initialCycle.totalRounds,
    initialCycle.currentRound,
    initialCycle.meetingFrequency,
    initialCycle.fineAmount,
    initialCycle.okoleaPoolBalance,
    initialCycle.vaultPoolBalance,
    initialCycle.totalCycleCollected,
    initialCycle.totalInterestAccumulated,
    initialCycle.status,
    initialCycle.startDate
  );

  const insertMember = db.prepare(`
    INSERT INTO members (
      id, name, avatar, role, phone, seatNumber, streakCount, onTimeContributions,
      missedContributions, liquidBalance, sayeBalance, mkebeBalance, pendingFines,
      isOnline, isSeated, activeTurnOrder, hasReceivedPayoutThisCycle, badges
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const m of initialMembers) {
    insertMember.run(
      m.id,
      m.name,
      m.avatar,
      m.role,
      m.phone,
      m.seatNumber,
      m.streakCount,
      m.onTimeContributions,
      m.missedContributions,
      m.balances.liquid,
      m.balances.saye,
      m.balances.mkebe,
      m.balances.pendingFines,
      m.isOnline ? 1 : 0,
      m.isSeated ? 1 : 0,
      m.activeTurnOrder,
      m.hasReceivedPayoutThisCycle ? 1 : 0,
      JSON.stringify(m.badges)
    );
  }

  const insertTurn = db.prepare(`
    INSERT INTO payout_turns (orderNum, memberId, scheduledDate, status, amount, payoutMethod, steppedToMemberId, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const t of initialPayoutTurns) {
    insertTurn.run(
      t.order,
      t.memberId,
      t.scheduledDate,
      t.status,
      t.amount,
      t.payoutMethod || null,
      t.steppedToMemberId || null,
      t.notes || null
    );
  }

  const insertMeeting = db.prepare(`
    INSERT INTO meeting_sessions (
      id, title, date, stage, wizardStep, missionVibe, katibaApproved,
      agenda, attendance, speakerQueue, activeSpeakerId, mountedPlugins, totalCollectedThisMeeting
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMeeting.run(
    initialMeeting.id,
    initialMeeting.title,
    initialMeeting.date,
    initialMeeting.stage,
    initialMeeting.wizardStep,
    initialMeeting.missionVibe,
    initialMeeting.katibaApproved ? 1 : 0,
    JSON.stringify(initialMeeting.agenda),
    JSON.stringify(initialMeeting.attendance),
    JSON.stringify(initialMeeting.speakerQueue),
    initialMeeting.activeSpeakerId,
    JSON.stringify(initialMeeting.mountedPlugins),
    initialMeeting.totalCollectedThisMeeting
  );

  const insertLoan = db.prepare(`
    INSERT INTO loans (
      id, borrowerId, borrowerName, type, principalAmount, interestRate, durationMonths,
      remainingBalance, collateralDescription, guarantors, status, appliedDate, schedule
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const l of initialLoans) {
    insertLoan.run(
      l.id,
      l.borrowerId,
      l.borrowerName,
      l.type,
      l.principalAmount,
      l.interestRate,
      l.durationMonths,
      l.remainingBalance,
      l.collateralDescription,
      JSON.stringify(l.guarantors),
      l.status,
      l.appliedDate,
      JSON.stringify(l.schedule)
    );
  }

  const insertOkolea = db.prepare(`
    INSERT INTO okolea_requests (
      id, requesterId, requesterName, reason, amountRequested, timestamp, status,
      votesYes, votesNo, quorumRequired
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const o of initialOkoleaRequests) {
    insertOkolea.run(
      o.id,
      o.requesterId,
      o.requesterName,
      o.reason,
      o.amountRequested,
      o.timestamp,
      o.status,
      JSON.stringify(o.votesYes),
      JSON.stringify(o.votesNo),
      o.quorumRequired
    );
  }

  const insertLedger = db.prepare(`
    INSERT INTO ledger_entries (
      id, timestamp, memberId, memberName, type, bucket, debit, credit,
      balanceAfter, method, reference, verifiedBy, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const entry of initialLedger) {
    insertLedger.run(
      entry.id,
      entry.timestamp,
      entry.memberId,
      entry.memberName,
      entry.type,
      entry.bucket,
      entry.debit,
      entry.credit,
      entry.balanceAfter,
      entry.method,
      entry.reference,
      entry.verifiedBy,
      entry.notes
    );
  }

  console.log('SQLite database chama.db successfully seeded!');
}

// Data Access Object (DAO) helpers
export function getCycleInfo(): ChamaCycle {
  const row = db.prepare('SELECT * FROM chama_cycles LIMIT 1').get() as any;
  if (!row) throw new Error('No chama cycle found');
  return {
    id: row.id,
    name: row.name,
    cycleNumber: row.cycleNumber,
    currency: row.currency,
    shareAmount: row.shareAmount,
    payoutMode: row.payoutMode,
    totalRounds: row.totalRounds,
    currentRound: row.currentRound,
    meetingFrequency: row.meetingFrequency,
    fineAmount: row.fineAmount,
    okoleaPoolBalance: row.okoleaPoolBalance,
    vaultPoolBalance: row.vaultPoolBalance,
    totalCycleCollected: row.totalCycleCollected,
    totalInterestAccumulated: row.totalInterestAccumulated,
    status: row.status,
    startDate: row.startDate,
  };
}

export function getMembers(): Member[] {
  const rows = db.prepare('SELECT * FROM members ORDER BY seatNumber ASC').all() as any[];
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    role: row.role,
    phone: row.phone,
    seatNumber: row.seatNumber,
    streakCount: row.streakCount,
    onTimeContributions: row.onTimeContributions,
    missedContributions: row.missedContributions,
    badges: JSON.parse(row.badges || '[]'),
    balances: {
      liquid: row.liquidBalance,
      saye: row.sayeBalance,
      mkebe: row.mkebeBalance,
      pendingFines: row.pendingFines,
    },
    isOnline: Boolean(row.isOnline),
    isSeated: Boolean(row.isSeated),
    activeTurnOrder: row.activeTurnOrder,
    hasReceivedPayoutThisCycle: Boolean(row.hasReceivedPayoutThisCycle),
  }));
}

export function getMemberById(id: string): Member | undefined {
  const row = db.prepare('SELECT * FROM members WHERE id = ?').get(id) as any;
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    role: row.role,
    phone: row.phone,
    seatNumber: row.seatNumber,
    streakCount: row.streakCount,
    onTimeContributions: row.onTimeContributions,
    missedContributions: row.missedContributions,
    badges: JSON.parse(row.badges || '[]'),
    balances: {
      liquid: row.liquidBalance,
      saye: row.sayeBalance,
      mkebe: row.mkebeBalance,
      pendingFines: row.pendingFines,
    },
    isOnline: Boolean(row.isOnline),
    isSeated: Boolean(row.isSeated),
    activeTurnOrder: row.activeTurnOrder,
    hasReceivedPayoutThisCycle: Boolean(row.hasReceivedPayoutThisCycle),
  };
}

export function getPayoutTurns(): PayoutTurn[] {
  const rows = db.prepare('SELECT * FROM payout_turns ORDER BY orderNum ASC').all() as any[];
  return rows.map((row) => ({
    order: row.orderNum,
    memberId: row.memberId,
    scheduledDate: row.scheduledDate,
    status: row.status,
    amount: row.amount,
    payoutMethod: row.payoutMethod || undefined,
    steppedToMemberId: row.steppedToMemberId || undefined,
    notes: row.notes || undefined,
  }));
}

export function getMeetingSession(): MeetingSession {
  const row = db.prepare('SELECT * FROM meeting_sessions LIMIT 1').get() as any;
  if (!row) throw new Error('No meeting session found');
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    stage: row.stage,
    wizardStep: row.wizardStep,
    missionVibe: row.missionVibe,
    katibaApproved: Boolean(row.katibaApproved),
    agenda: JSON.parse(row.agenda || '[]'),
    attendance: JSON.parse(row.attendance || '{}'),
    speakerQueue: JSON.parse(row.speakerQueue || '[]'),
    activeSpeakerId: row.activeSpeakerId || null,
    mountedPlugins: JSON.parse(row.mountedPlugins || '[]'),
    totalCollectedThisMeeting: row.totalCollectedThisMeeting,
  };
}

export function updateMeetingSession(session: MeetingSession) {
  db.prepare(`
    UPDATE meeting_sessions SET
      title = ?, date = ?, stage = ?, wizardStep = ?, missionVibe = ?,
      katibaApproved = ?, agenda = ?, attendance = ?, speakerQueue = ?,
      activeSpeakerId = ?, mountedPlugins = ?, totalCollectedThisMeeting = ?
    WHERE id = ?
  `).run(
    session.title,
    session.date,
    session.stage,
    session.wizardStep,
    session.missionVibe,
    session.katibaApproved ? 1 : 0,
    JSON.stringify(session.agenda),
    JSON.stringify(session.attendance),
    JSON.stringify(session.speakerQueue),
    session.activeSpeakerId,
    JSON.stringify(session.mountedPlugins),
    session.totalCollectedThisMeeting,
    session.id
  );
}

export function getLoans(): Loan[] {
  const rows = db.prepare('SELECT * FROM loans ORDER BY appliedDate DESC').all() as any[];
  return rows.map((row) => ({
    id: row.id,
    borrowerId: row.borrowerId,
    borrowerName: row.borrowerName,
    type: row.type,
    principalAmount: row.principalAmount,
    interestRate: row.interestRate,
    durationMonths: row.durationMonths,
    remainingBalance: row.remainingBalance,
    collateralDescription: row.collateralDescription,
    guarantors: JSON.parse(row.guarantors || '[]'),
    status: row.status,
    appliedDate: row.appliedDate,
    schedule: JSON.parse(row.schedule || '[]'),
  }));
}

export function getOkoleaRequests(): OkoleaRequest[] {
  const rows = db.prepare('SELECT * FROM okolea_requests ORDER BY timestamp DESC').all() as any[];
  return rows.map((row) => ({
    id: row.id,
    requesterId: row.requesterId,
    requesterName: row.requesterName,
    reason: row.reason,
    amountRequested: row.amountRequested,
    timestamp: row.timestamp,
    status: row.status,
    votesYes: JSON.parse(row.votesYes || '[]'),
    votesNo: JSON.parse(row.votesNo || '[]'),
    quorumRequired: row.quorumRequired,
  }));
}

export function getLedgerEntries(): LedgerEntry[] {
  const rows = db.prepare('SELECT * FROM ledger_entries ORDER BY timestamp DESC').all() as any[];
  return rows.map((row) => ({
    id: row.id,
    timestamp: row.timestamp,
    memberId: row.memberId,
    memberName: row.memberName,
    type: row.type,
    bucket: row.bucket,
    debit: row.debit,
    credit: row.credit,
    balanceAfter: row.balanceAfter,
    method: row.method,
    reference: row.reference,
    verifiedBy: row.verifiedBy,
    notes: row.notes,
  }));
}

// Atomic contribution transaction
export const processContributionTransaction = db.transaction(
  (memberId: string, amount: number, method: 'mpesa' | 'cash' | 'internal_offset', reference?: string) => {
    const member = getMemberById(memberId);
    if (!member) throw new Error(`Member with ID ${memberId} not found`);

    const verifiedRef =
      reference ||
      (method === 'mpesa'
        ? `QJH${Math.floor(100000 + Math.random() * 900000)}`
        : `CSH-REC-${Math.floor(1000 + Math.random() * 9000)}`);

    const newStreak = member.streakCount + 1;
    const newOnTime = member.onTimeContributions + 1;

    // 1. Update Member state in DB
    db.prepare(`
      UPDATE members SET
        streakCount = ?,
        onTimeContributions = ?
      WHERE id = ?
    `).run(newStreak, newOnTime, memberId);

    // 2. Fetch current cycle vault total
    const cycle = getCycleInfo();
    const newVaultTotal = cycle.vaultPoolBalance + amount;
    const newCycleCollected = cycle.totalCycleCollected + amount;

    db.prepare(`
      UPDATE chama_cycles SET
        vaultPoolBalance = ?,
        totalCycleCollected = ?
      WHERE id = ?
    `).run(newVaultTotal, newCycleCollected, cycle.id);

    // 3. Update meeting session total collected
    const meeting = getMeetingSession();
    const newMeetingCollected = meeting.totalCollectedThisMeeting + amount;
    meeting.totalCollectedThisMeeting = newMeetingCollected;
    updateMeetingSession(meeting);

    // 4. Create Ledger entry
    const txnId = `TXN-${Date.now().toString().slice(-5)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    db.prepare(`
      INSERT INTO ledger_entries (
        id, timestamp, memberId, memberName, type, bucket, debit, credit,
        balanceAfter, method, reference, verifiedBy, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      txnId,
      timestamp,
      member.id,
      member.name,
      'contribution',
      'pool',
      0,
      amount,
      newVaultTotal,
      method,
      verifiedRef,
      'M-Pesa Instant Webhook / Treasurer Counter-Sign',
      `Round ${cycle.currentRound} Merry-Go-Round Pool Contribution`
    );

    return {
      success: true,
      transactionId: txnId,
      reference: verifiedRef,
      status: 'verified_cleared',
      verifiedBy: 'M-Pesa Instant Webhook / Treasurer Counter-Sign',
      amount,
      currency: cycle.currency,
      timestamp,
    };
  }
);
