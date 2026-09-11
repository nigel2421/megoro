import { ChamaCycle, Member, MeetingSession, Loan, OkoleaRequest, LedgerEntry, PayoutTurn } from '../types';

export const apiService = {
  // 1. Fetch Cycle Info
  async getCycleInfo(): Promise<ChamaCycle> {
    const res = await fetch('/api/chama/info');
    if (!res.ok) throw new Error('Failed to fetch cycle info');
    return res.json();
  },

  // 2. Fetch Members
  async getMembers(): Promise<Member[]> {
    const res = await fetch('/api/members');
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
  },

  // 3. Fetch Payout Turns
  async getPayoutTurns(): Promise<PayoutTurn[]> {
    const res = await fetch('/api/payouts/turns');
    if (!res.ok) throw new Error('Failed to fetch payout turns');
    return res.json();
  },

  // 4. Fetch Current Meeting Session
  async getMeetingSession(): Promise<MeetingSession> {
    const res = await fetch('/api/meetings/current');
    if (!res.ok) throw new Error('Failed to fetch meeting session');
    return res.json();
  },

  // 5. Update Meeting Session
  async updateMeetingSession(session: MeetingSession): Promise<MeetingSession> {
    const res = await fetch('/api/meetings/current', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    if (!res.ok) throw new Error('Failed to update meeting session');
    const data = await res.json();
    return data.meeting;
  },

  // 6. Fetch Ledger Entries
  async getLedgerEntries(): Promise<LedgerEntry[]> {
    const res = await fetch('/api/ledger');
    if (!res.ok) throw new Error('Failed to fetch ledger entries');
    return res.json();
  },

  // 7. Fetch Loans
  async getLoans(): Promise<Loan[]> {
    const res = await fetch('/api/loans');
    if (!res.ok) throw new Error('Failed to fetch loans');
    return res.json();
  },

  // 8. Apply for Loan
  async createLoan(payload: {
    borrowerId: string;
    principalAmount: number;
    interestRate: number;
    durationMonths: number;
    collateralDescription?: string;
    guarantors?: Array<{ memberId: string; memberName: string; guaranteedAmount: number }>;
  }) {
    const res = await fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create loan');
    return res.json();
  },

  // 9. Fetch Okolea Emergency Relief Requests
  async getOkoleaRequests(): Promise<OkoleaRequest[]> {
    const res = await fetch('/api/okolea');
    if (!res.ok) throw new Error('Failed to fetch okolea requests');
    return res.json();
  },

  // 10. Vote on Okolea Request
  async voteOkolea(requestId: string, memberId: string, vote: 'yes' | 'no') {
    const res = await fetch('/api/okolea/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, memberId, vote }),
    });
    if (!res.ok) throw new Error('Failed to submit vote');
    return res.json();
  },

  // 11. Verify & Process Contribution Atomically
  async verifyContribution(payload: {
    memberId: string;
    amount: number;
    method: 'mpesa' | 'cash' | 'internal_offset';
    reference?: string;
  }) {
    const res = await fetch('/api/contributions/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to verify contribution');
    return res.json();
  },

  // 12. Provably Fair Raffle Draw
  async drawRaffle(eligibleMemberIds: string[]) {
    const res = await fetch('/api/payouts/raffle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eligibleMemberIds }),
    });
    if (!res.ok) throw new Error('Failed to run raffle draw');
    return res.json();
  },
};
