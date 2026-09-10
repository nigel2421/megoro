/**
 * MGR (Merry-Go-Round / ROSCA Engine) Core Types
 */

export type MemberRole = 'Chairman' | 'Treasurer' | 'Secretary' | 'Member';

export type AttendanceStatus = 'present' | 'apology' | 'absent_penalized';

export type SavingsBucketType = 'liquid' | 'saye' | 'mkebe';

export type PayoutMode = 'share_order' | 'share_random';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: MemberRole;
  phone: string;
  seatNumber: number;
  streakCount: number;
  onTimeContributions: number;
  missedContributions: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
  }>;
  balances: {
    liquid: number;       // Instant access, dividend bearing
    saye: number;         // Save As You Earn regular pool
    mkebe: number;        // Locked term savings box
    pendingFines: number; // Unpaid penalty ledger
  };
  isOnline: boolean;
  isSeated: boolean;
  activeTurnOrder: number;
  hasReceivedPayoutThisCycle: boolean;
  isSpeaking?: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  completed: boolean;
  durationMin: number;
}

export interface AttendanceRecord {
  memberId: string;
  status: AttendanceStatus;
  timestamp: string;
  fineLevied: number;
  apologyReason?: string;
}

export interface PluginWidget {
  id: string;
  type: 'quick_poll' | 'instant_tip' | 'speaker_floor' | 'breakout_notes';
  title: string;
  active: boolean;
  config?: any;
}

export interface MeetingSession {
  id: string;
  title: string;
  date: string;
  stage: 'idle' | 'pre_meeting_wizard' | 'live_mezani' | 'adjourned';
  wizardStep: number; // 1: Katiba & Badge, 2: Agenda, 3: Lengo Kuu, 4: Roll Call
  missionVibe: string;
  katibaApproved: boolean;
  agenda: AgendaItem[];
  attendance: Record<string, AttendanceRecord>;
  speakerQueue: string[];
  activeSpeakerId: string | null;
  mountedPlugins: PluginWidget[];
  totalCollectedThisMeeting: number;
}

export interface PayoutTurn {
  order: number;
  memberId: string;
  scheduledDate: string;
  status: 'pending' | 'completed' | 'stepped' | 'swapped';
  amount: number;
  payoutMethod?: 'mpesa' | 'cash';
  steppedToMemberId?: string;
  notes?: string;
}

export interface OkoleaRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  reason: string;
  amountRequested: number;
  timestamp: string;
  status: 'active_review' | 'approved_disbursed' | 'declined';
  votesYes: string[]; // Member IDs
  votesNo: string[];
  quorumRequired: number;
}

export interface RepaymentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  principal: number;
  interest: number;
  total: number;
  status: 'paid' | 'upcoming' | 'overdue';
}

export interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  type: 'individual' | 'group_chama';
  principalAmount: number;
  interestRate: number; // e.g. 5% monthly
  durationMonths: number;
  remainingBalance: number;
  collateralDescription: string;
  guarantors: Array<{ memberId: string; memberName: string; guaranteedAmount: number }>;
  status: 'pending' | 'approved' | 'active' | 'repaid' | 'defaulted';
  appliedDate: string;
  schedule: RepaymentScheduleItem[];
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  type:
    | 'contribution'
    | 'payout'
    | 'fine'
    | 'loan_disbursement'
    | 'loan_repayment'
    | 'okolea_contribution'
    | 'okolea_disbursement'
    | 'interest_dividend'
    | 'mkebe_lock';
  bucket: 'liquid' | 'saye' | 'mkebe' | 'pool' | 'okolea' | 'fines';
  debit: number;
  credit: number;
  balanceAfter: number;
  method: 'mpesa' | 'cash' | 'internal_offset';
  reference: string;
  verifiedBy: string;
  notes: string;
}

export interface ChamaCycle {
  id: string;
  name: string;
  cycleNumber: number;
  currency: string;
  shareAmount: number; // e.g. 5,000 KSh per member per round
  payoutMode: PayoutMode;
  totalRounds: number;
  currentRound: number;
  meetingFrequency: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  fineAmount: number; // e.g. 500 KSh for missed meeting
  okoleaPoolBalance: number;
  vaultPoolBalance: number;
  totalCycleCollected: number;
  totalInterestAccumulated: number;
  status: 'active' | 'auditing' | 'dissolved';
  startDate: string;
}
