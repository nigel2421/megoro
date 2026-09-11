import Database from 'better-sqlite3';
import path from 'path';

// SQLite database instance (database.sqlite created at project root)
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for concurrency
db.pragma('journal_mode = WAL');

/**
 * Initialize Database Tables
 */
export function initDatabase() {
  // 1. Cycles Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cycles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cycle_number INTEGER NOT NULL,
      currency TEXT NOT NULL,
      share_amount REAL NOT NULL,
      fine_amount REAL NOT NULL,
      vault_pool_balance REAL NOT NULL,
      okolea_pool_balance REAL NOT NULL,
      total_cycle_collected REAL NOT NULL,
      status TEXT NOT NULL,
      start_date TEXT NOT NULL
    );
  `);

  // 2. Members Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      role TEXT NOT NULL,
      phone TEXT NOT NULL,
      seat_number INTEGER NOT NULL,
      streak_count INTEGER DEFAULT 0,
      on_time_contributions INTEGER DEFAULT 0,
      missed_contributions INTEGER DEFAULT 0,
      liquid_balance REAL DEFAULT 0,
      saye_balance REAL DEFAULT 0,
      mkebe_balance REAL DEFAULT 0,
      pending_fines REAL DEFAULT 0,
      is_online INTEGER DEFAULT 1,
      is_seated INTEGER DEFAULT 1,
      active_turn_order INTEGER NOT NULL,
      has_received_payout INTEGER DEFAULT 0
    );
  `);

  // 3. Ledger Entries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ledger_entries (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      member_id TEXT NOT NULL,
      member_name TEXT NOT NULL,
      type TEXT NOT NULL,
      bucket TEXT NOT NULL,
      debit REAL DEFAULT 0,
      credit REAL DEFAULT 0,
      balance_after REAL NOT NULL,
      method TEXT NOT NULL,
      reference TEXT NOT NULL,
      verified_by TEXT NOT NULL,
      notes TEXT
    );
  `);

  // Seed default cycle if database is empty
  const cycleCount = db.prepare('SELECT COUNT(*) as count FROM cycles').get() as { count: number };
  if (cycleCount.count === 0) {
    db.prepare(`
      INSERT INTO cycles (
        id, name, cycle_number, currency, share_amount, fine_amount,
        vault_pool_balance, okolea_pool_balance, total_cycle_collected, status, start_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'cycle-2026-04',
      'Ushirika Bora Chama',
      4,
      'KES',
      10000,
      500,
      120000,
      48500,
      480000,
      'active',
      '2026-01-01'
    );
  }

  // Seed default members if empty
  const memberCount = db.prepare('SELECT COUNT(*) as count FROM members').get() as { count: number };
  if (memberCount.count === 0) {
    const insertMember = db.prepare(`
      INSERT INTO members (
        id, name, avatar, role, phone, seat_number, streak_count, on_time_contributions,
        liquid_balance, saye_balance, pending_fines, is_seated, active_turn_order, has_received_payout
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialMembers = [
      ['m-01', 'Kiprono Bett', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Chairman', '0722100001', 1, 12, 12, 15000, 120000, 0, 1, 1, 1],
      ['m-02', 'Amani Wanjiru', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Treasurer', '0722100002', 2, 12, 12, 22000, 120000, 0, 1, 2, 1],
      ['m-03', 'Brian Otieno', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Secretary', '0722100003', 3, 12, 12, 8500, 120000, 0, 1, 3, 1],
      ['m-04', 'Grace Wanjiku', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Member', '0722100004', 4, 11, 11, 4000, 110000, 0, 1, 4, 0],
      ['m-05', 'Faith Njeri', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', 'Member', '0722100005', 5, 10, 10, 1200, 100000, 0, 1, 5, 0],
      ['m-06', 'Kevin Mwangi', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'Member', '0722100006', 6, 12, 12, 9500, 120000, 0, 1, 6, 0],
    ];

    for (const m of initialMembers) {
      insertMember.run(...m);
    }
  }

  // Seed default ledger entries if empty
  const ledgerCount = db.prepare('SELECT COUNT(*) as count FROM ledger_entries').get() as { count: number };
  if (ledgerCount.count === 0) {
    const insertLedger = db.prepare(`
      INSERT INTO ledger_entries (
        id, timestamp, member_id, member_name, type, bucket, debit, credit, balance_after, method, reference, verified_by, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertLedger.run('TXN-00101', '2026-09-11 10:12:00', 'm-04', 'Grace Wanjiku', 'contribution', 'pool', 0, 10000, 120000, 'mpesa', 'QK78923L', 'M-Pesa Webhook', 'Round 4 Share Contribution');
    insertLedger.run('TXN-00100', '2026-09-11 09:30:00', 'm-05', 'Faith Njeri', 'contribution', 'pool', 0, 10000, 110000, 'mpesa', 'QK78912M', 'M-Pesa Webhook', 'Round 4 Share Contribution');
    insertLedger.run('TXN-00099', '2026-09-10 16:45:00', 'm-02', 'Amani Wanjiru', 'okolea_disbursement', 'okolea', 5000, 0, 48500, 'mpesa', 'OKO-AID-991', 'Chama Quorum (9/12)', 'Approved Emergency Medical Relief');
  }
}

// Initialize database schema & seed data
initDatabase();

/**
 * Helper Database Functions (cPanel MySQL ready)
 */
export function getChamaCycle() {
  return db.prepare('SELECT * FROM cycles LIMIT 1').get();
}

export function getMembers() {
  return db.prepare('SELECT * FROM members ORDER BY seat_number ASC').all();
}

export function getLedgerEntries(limit = 20) {
  return db.prepare('SELECT * FROM ledger_entries ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function recordContribution(params: {
  memberId: string;
  amount: number;
  method: string;
  reference?: string;
}) {
  const member = db.prepare('SELECT * FROM members WHERE id = ?').get(params.memberId) as any;
  const cycle = db.prepare('SELECT * FROM cycles LIMIT 1').get() as any;

  if (!member || !cycle) throw new Error('Member or Cycle not found');

  const refCode = params.reference || `QK${Math.floor(100000 + Math.random() * 900000)}L`;
  const txnId = `TXN-${Date.now().toString().slice(-5)}`;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const newBalance = cycle.vault_pool_balance + params.amount;

  // Transaction: insert ledger entry & update balances atomically
  const insertTxn = db.transaction(() => {
    db.prepare(`
      INSERT INTO ledger_entries (
        id, timestamp, member_id, member_name, type, bucket, debit, credit, balance_after, method, reference, verified_by, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      txnId,
      timestamp,
      params.memberId,
      member.name,
      'contribution',
      'pool',
      0,
      params.amount,
      newBalance,
      params.method,
      refCode,
      'M-Pesa Webhook / SQLite Store',
      `Round ${cycle.cycle_number} Share Contribution`
    );

    db.prepare('UPDATE cycles SET vault_pool_balance = vault_pool_balance + ? WHERE id = ?').run(params.amount, cycle.id);
    db.prepare('UPDATE members SET streak_count = streak_count + 1, on_time_contributions = on_time_contributions + 1, saye_balance = saye_balance + ? WHERE id = ?').run(params.amount, params.memberId);
  });

  insertTxn();

  return {
    transactionId: txnId,
    reference: refCode,
    amount: params.amount,
    timestamp,
  };
}
