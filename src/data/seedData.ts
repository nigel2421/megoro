import { Member, ChamaCycle, MeetingSession, Loan, OkoleaRequest, LedgerEntry, PayoutTurn } from '../types';

export const initialCycle: ChamaCycle = {
  id: 'cycle-2026-01',
  name: 'Ushirika Bora ROSCA 2026',
  cycleNumber: 3,
  currency: 'KES',
  shareAmount: 10000,
  payoutMode: 'share_order',
  totalRounds: 12,
  currentRound: 4,
  meetingFrequency: 'Monthly',
  fineAmount: 500,
  okoleaPoolBalance: 48500,
  vaultPoolBalance: 120000,
  totalCycleCollected: 360000,
  totalInterestAccumulated: 24500,
  status: 'active',
  startDate: '2026-01-15',
};

export const initialMembers: Member[] = [
  {
    id: 'm-01',
    name: 'Kiprono Bett',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Chairman',
    phone: '+254 712 345 678',
    seatNumber: 1,
    streakCount: 16,
    onTimeContributions: 16,
    missedContributions: 0,
    badges: [
      { id: 'b-1', name: 'Elder Gavel', icon: 'ShieldAlert', description: 'Chama Founder & Arbiter' },
      { id: 'b-2', name: 'Iron Hand', icon: 'Flame', description: 'Zero unexcused absences' }
    ],
    balances: { liquid: 45000, saye: 60000, mkebe: 120000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 1,
    hasReceivedPayoutThisCycle: true,
  },
  {
    id: 'm-02',
    name: 'Amani Wanjiru',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Treasurer',
    phone: '+254 722 987 654',
    seatNumber: 2,
    streakCount: 15,
    onTimeContributions: 15,
    missedContributions: 0,
    badges: [
      { id: 'b-3', name: 'M-Pesa Wizard', icon: 'CheckCircle2', description: 'Audits accounts in under 5 minutes' }
    ],
    balances: { liquid: 52000, saye: 50000, mkebe: 110000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 2,
    hasReceivedPayoutThisCycle: true,
  },
  {
    id: 'm-03',
    name: 'Zawadi Omari',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    role: 'Secretary',
    phone: '+254 733 112 233',
    seatNumber: 3,
    streakCount: 14,
    onTimeContributions: 14,
    missedContributions: 0,
    badges: [
      { id: 'b-4', name: 'Scribe Pro', icon: 'FileText', description: 'Meticulous meeting minutes' }
    ],
    balances: { liquid: 38000, saye: 45000, mkebe: 85000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 3,
    hasReceivedPayoutThisCycle: true,
  },
  {
    id: 'm-04',
    name: 'Brian Omondi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 701 554 433',
    seatNumber: 4,
    streakCount: 8,
    onTimeContributions: 12,
    missedContributions: 1,
    badges: [
      { id: 'b-5', name: 'Agri-Preneur', icon: 'Sprout', description: 'Poultry farm investment drive' }
    ],
    balances: { liquid: 24000, saye: 35000, mkebe: 40000, pendingFines: 500 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 4,
    hasReceivedPayoutThisCycle: false, // Scheduled for current round!
  },
  {
    id: 'm-05',
    name: 'Fatuma Hassan',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 711 778 899',
    seatNumber: 5,
    streakCount: 11,
    onTimeContributions: 11,
    missedContributions: 0,
    badges: [
      { id: 'b-6', name: 'Okolea Champion', icon: 'HeartHandshake', description: 'First to respond to emergency appeals' }
    ],
    balances: { liquid: 41000, saye: 40000, mkebe: 95000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 5,
    hasReceivedPayoutThisCycle: false,
  },
  {
    id: 'm-06',
    name: 'Kevin Mwangi (You)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 720 001 122',
    seatNumber: 6,
    streakCount: 14,
    onTimeContributions: 14,
    missedContributions: 0,
    badges: [
      { id: 'b-7', name: 'Chama Pillar', icon: 'Crown', description: '100% on-time record across 3 cycles' },
      { id: 'b-8', name: 'Early Bird', icon: 'Zap', description: 'Paid within 5 mins of call' }
    ],
    balances: { liquid: 32500, saye: 45000, mkebe: 70000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 6,
    hasReceivedPayoutThisCycle: false,
  },
  {
    id: 'm-07',
    name: 'Faith Chebet',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 725 334 455',
    seatNumber: 7,
    streakCount: 9,
    onTimeContributions: 11,
    missedContributions: 1,
    badges: [
      { id: 'b-9', name: 'Artisan Queen', icon: 'Sparkles', description: 'Eco-basketry innovator' }
    ],
    balances: { liquid: 18000, saye: 30000, mkebe: 35000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 7,
    hasReceivedPayoutThisCycle: false,
  },
  {
    id: 'm-08',
    name: 'Daniel Mutua',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 728 667 788',
    seatNumber: 8,
    streakCount: 7,
    onTimeContributions: 10,
    missedContributions: 2,
    badges: [
      { id: 'b-10', name: 'Hardware Boss', icon: 'Wrench', description: 'Construction materials supplier' }
    ],
    balances: { liquid: 29000, saye: 40000, mkebe: 55000, pendingFines: 500 },
    isOnline: true,
    isSeated: false, // will pull up
    activeTurnOrder: 8,
    hasReceivedPayoutThisCycle: false,
  },
  {
    id: 'm-09',
    name: 'Halima Abdi',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 714 445 566',
    seatNumber: 9,
    streakCount: 13,
    onTimeContributions: 13,
    missedContributions: 0,
    badges: [
      { id: 'b-11', name: 'Livestock Mogul', icon: 'Activity', description: 'Zero repayment defaults' }
    ],
    balances: { liquid: 47000, saye: 55000, mkebe: 80000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 9,
    hasReceivedPayoutThisCycle: false,
  },
  {
    id: 'm-10',
    name: 'Victor Kimani',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 721 990 011',
    seatNumber: 10,
    streakCount: 6,
    onTimeContributions: 9,
    missedContributions: 1,
    badges: [
      { id: 'b-12', name: 'Logistics Fleet', icon: 'Truck', description: 'Matatu saccos networker' }
    ],
    balances: { liquid: 21000, saye: 35000, mkebe: 50000, pendingFines: 0 },
    isOnline: false,
    isSeated: false,
    activeTurnOrder: 10,
    hasReceivedPayoutThisCycle: false,
  },
  {
    id: 'm-11',
    name: 'Mercy Akinyi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 708 332 211',
    seatNumber: 11,
    streakCount: 12,
    onTimeContributions: 12,
    missedContributions: 0,
    badges: [
      { id: 'b-13', name: 'Fintech Spark', icon: 'Zap', description: 'Advocates automated standing orders' }
    ],
    balances: { liquid: 34000, saye: 45000, mkebe: 65000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 11,
    hasReceivedPayoutThisCycle: false,
  },
  {
    id: 'm-12',
    name: 'Samuel Ndung\'u',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    phone: '+254 719 887 766',
    seatNumber: 12,
    streakCount: 10,
    onTimeContributions: 10,
    missedContributions: 1,
    badges: [
      { id: 'b-14', name: 'Green Gold', icon: 'Coins', description: 'Avocado exporter collective' }
    ],
    balances: { liquid: 39000, saye: 50000, mkebe: 75000, pendingFines: 0 },
    isOnline: true,
    isSeated: true,
    activeTurnOrder: 12,
    hasReceivedPayoutThisCycle: false,
  },
];

export const initialPayoutTurns: PayoutTurn[] = [
  { order: 1, memberId: 'm-01', scheduledDate: '2026-01-15', status: 'completed', amount: 120000, payoutMethod: 'mpesa', notes: 'Disbursed round 1' },
  { order: 2, memberId: 'm-02', scheduledDate: '2026-02-15', status: 'completed', amount: 120000, payoutMethod: 'mpesa', notes: 'Disbursed round 2' },
  { order: 3, memberId: 'm-03', scheduledDate: '2026-03-15', status: 'completed', amount: 120000, payoutMethod: 'mpesa', notes: 'Disbursed round 3' },
  { order: 4, memberId: 'm-04', scheduledDate: '2026-04-15', status: 'pending', amount: 120000, notes: 'Current round recipient (or stepping candidate)' },
  { order: 5, memberId: 'm-05', scheduledDate: '2026-05-15', status: 'pending', amount: 120000 },
  { order: 6, memberId: 'm-06', scheduledDate: '2026-06-15', status: 'pending', amount: 120000 },
  { order: 7, memberId: 'm-07', scheduledDate: '2026-07-15', status: 'pending', amount: 120000 },
  { order: 8, memberId: 'm-08', scheduledDate: '2026-08-15', status: 'pending', amount: 120000 },
  { order: 9, memberId: 'm-09', scheduledDate: '2026-09-15', status: 'pending', amount: 120000 },
  { order: 10, memberId: 'm-10', scheduledDate: '2026-10-15', status: 'pending', amount: 120000 },
  { order: 11, memberId: 'm-11', scheduledDate: '2026-11-15', status: 'pending', amount: 120000 },
  { order: 12, memberId: 'm-12', scheduledDate: '2026-12-15', status: 'pending', amount: 120000 },
];

export const initialMeeting: MeetingSession = {
  id: 'meet-round-4',
  title: 'Siku ya Chama: Round 4/12 Mezani',
  date: 'Today, 10:00 AM',
  stage: 'live_mezani',
  wizardStep: 4,
  missionVibe: 'Harambee ya Biashara 2026: Zero Defaults & Wealth Building',
  katibaApproved: true,
  agenda: [
    { id: 'ag-1', title: 'Call to Order & Katiba Reaffirmation', completed: true, durationMin: 10 },
    { id: 'ag-2', title: 'Attendance & Penalty Roll Call', completed: true, durationMin: 15 },
    { id: 'ag-3', title: 'Round 4 Vault Contribution & M-Pesa Verifications', completed: false, durationMin: 25 },
    { id: 'ag-4', title: 'Rotational Payout Handover & Stepping Review', completed: false, durationMin: 20 },
    { id: 'ag-5', title: 'Okolea Emergency Fund Review & Loan Approvals', completed: false, durationMin: 20 },
    { id: 'ag-6', title: 'Any Other Business (AOB) & Adjournment', completed: false, durationMin: 10 },
  ],
  attendance: {
    'm-01': { memberId: 'm-01', status: 'present', timestamp: '09:55 AM', fineLevied: 0 },
    'm-02': { memberId: 'm-02', status: 'present', timestamp: '09:58 AM', fineLevied: 0 },
    'm-03': { memberId: 'm-03', status: 'present', timestamp: '09:56 AM', fineLevied: 0 },
    'm-04': { memberId: 'm-04', status: 'present', timestamp: '10:02 AM', fineLevied: 0 },
    'm-05': { memberId: 'm-05', status: 'present', timestamp: '10:00 AM', fineLevied: 0 },
    'm-06': { memberId: 'm-06', status: 'present', timestamp: '09:54 AM', fineLevied: 0 },
    'm-07': { memberId: 'm-07', status: 'present', timestamp: '10:04 AM', fineLevied: 0 },
    'm-08': { memberId: 'm-08', status: 'present', timestamp: '10:05 AM', fineLevied: 0 },
    'm-09': { memberId: 'm-09', status: 'present', timestamp: '09:59 AM', fineLevied: 0 },
    'm-10': { memberId: 'm-10', status: 'absent_penalized', timestamp: '10:15 AM', fineLevied: 500, apologyReason: 'No prior notice provided' },
    'm-11': { memberId: 'm-11', status: 'present', timestamp: '10:01 AM', fineLevied: 0 },
    'm-12': { memberId: 'm-12', status: 'apology', timestamp: '09:30 AM', fineLevied: 0, apologyReason: 'Attending county agricultural inspection' },
  },
  speakerQueue: ['m-01', 'm-02', 'm-06'],
  activeSpeakerId: 'm-01',
  mountedPlugins: [
    {
      id: 'plug-poll-1',
      type: 'quick_poll',
      title: 'Approve Brian\'s Poultry Expansion Loan?',
      active: true,
      config: {
        question: 'Shall we disburse KES 50,000 to Brian Omondi at 5% interest?',
        options: ['Yes, fully backed', 'Need more collateral', 'Postpone to Round 5'],
        votes: { 'Yes, fully backed': 7, 'Need more collateral': 1, 'Postpone to Round 5': 0 }
      }
    },
    {
      id: 'plug-tip-1',
      type: 'instant_tip',
      title: 'Changa Meza (Refreshments & Chai)',
      active: true,
      config: {
        targetAmount: 3000,
        currentAmount: 2200,
        tipsCount: 8
      }
    },
    {
      id: 'plug-speaker-1',
      type: 'speaker_floor',
      title: 'Kiti cha Msemaji (Speaker Floor)',
      active: true,
      config: {
        currentSpeaker: 'Kiprono Bett (Chairman)',
        timeLeftSec: 140
      }
    }
  ],
  totalCollectedThisMeeting: 90000, // 9 of 12 already submitted for this round!
};

export const initialLoans: Loan[] = [
  {
    id: 'loan-101',
    borrowerId: 'm-04',
    borrowerName: 'Brian Omondi',
    type: 'individual',
    principalAmount: 50000,
    interestRate: 5,
    durationMonths: 3,
    remainingBalance: 35000,
    collateralDescription: 'Motorcycle Logbook (KDG 481X, Boxer 150)',
    guarantors: [
      { memberId: 'm-06', memberName: 'Kevin Mwangi', guaranteedAmount: 25000 },
      { memberId: 'm-02', memberName: 'Amani Wanjiru', guaranteedAmount: 25000 }
    ],
    status: 'active',
    appliedDate: '2026-02-15',
    schedule: [
      { installmentNumber: 1, dueDate: '2026-03-15', principal: 16667, interest: 2500, total: 19167, status: 'paid' },
      { installmentNumber: 2, dueDate: '2026-04-15', principal: 16667, interest: 1750, total: 18417, status: 'upcoming' },
      { installmentNumber: 3, dueDate: '2026-05-15', principal: 16666, interest: 875, total: 17541, status: 'upcoming' },
    ]
  },
  {
    id: 'loan-102',
    borrowerId: 'm-07',
    borrowerName: 'Faith Chebet',
    type: 'individual',
    principalAmount: 30000,
    interestRate: 5,
    durationMonths: 2,
    remainingBalance: 0,
    collateralDescription: 'Handloom weaving loom machinery',
    guarantors: [
      { memberId: 'm-05', memberName: 'Fatuma Hassan', guaranteedAmount: 30000 }
    ],
    status: 'repaid',
    appliedDate: '2026-01-15',
    schedule: [
      { installmentNumber: 1, dueDate: '2026-02-15', principal: 15000, interest: 1500, total: 16500, status: 'paid' },
      { installmentNumber: 2, dueDate: '2026-03-15', principal: 15000, interest: 750, total: 15750, status: 'paid' },
    ]
  }
];

export const initialOkoleaRequests: OkoleaRequest[] = [
  {
    id: 'oko-01',
    requesterId: 'm-07',
    requesterName: 'Faith Chebet',
    reason: 'Urgent hospital admission co-pay for child with severe malaria',
    amountRequested: 15000,
    timestamp: 'Today, 08:30 AM',
    status: 'active_review',
    votesYes: ['m-01', 'm-02', 'm-03', 'm-05', 'm-06'],
    votesNo: [],
    quorumRequired: 7, // 7 out of 12 required
  }
];

export const initialLedger: LedgerEntry[] = [
  {
    id: 'TXN-90812',
    timestamp: '2026-04-15 09:45:10',
    memberId: 'm-06',
    memberName: 'Kevin Mwangi',
    type: 'contribution',
    bucket: 'pool',
    debit: 0,
    credit: 10000,
    balanceAfter: 100000,
    method: 'mpesa',
    reference: 'QJH7829XK3',
    verifiedBy: 'Amani Wanjiru (Treasurer)',
    notes: 'Round 4 Merry-Go-Round Pool Contribution'
  },
  {
    id: 'TXN-90811',
    timestamp: '2026-04-15 09:40:22',
    memberId: 'm-01',
    memberName: 'Kiprono Bett',
    type: 'contribution',
    bucket: 'pool',
    debit: 0,
    credit: 10000,
    balanceAfter: 90000,
    method: 'mpesa',
    reference: 'QJH5518LM2',
    verifiedBy: 'Amani Wanjiru (Treasurer)',
    notes: 'Round 4 Merry-Go-Round Pool Contribution'
  },
  {
    id: 'TXN-90810',
    timestamp: '2026-04-15 09:35:01',
    memberId: 'm-02',
    memberName: 'Amani Wanjiru',
    type: 'contribution',
    bucket: 'pool',
    debit: 0,
    credit: 10000,
    balanceAfter: 80000,
    method: 'mpesa',
    reference: 'QJH4419PP1',
    verifiedBy: 'Self-Treasury',
    notes: 'Round 4 Merry-Go-Round Pool Contribution'
  },
  {
    id: 'TXN-90809',
    timestamp: '2026-04-15 09:30:15',
    memberId: 'm-10',
    memberName: 'Victor Kimani',
    type: 'fine',
    bucket: 'fines',
    debit: 500,
    credit: 0,
    balanceAfter: 500,
    method: 'internal_offset',
    reference: 'SYS-FINE-R4-M10',
    verifiedBy: 'System Katiba Protocol',
    notes: 'Unexcused Absence Fine for Round 4'
  },
  {
    id: 'TXN-90808',
    timestamp: '2026-03-15 11:20:00',
    memberId: 'm-03',
    memberName: 'Zawadi Omari',
    type: 'payout',
    bucket: 'pool',
    debit: 120000,
    credit: 0,
    balanceAfter: 0,
    method: 'mpesa',
    reference: 'QIG9923KJ8',
    verifiedBy: 'Kiprono Bett (Chairman)',
    notes: 'Round 3 Rotational Share Payout'
  },
];
