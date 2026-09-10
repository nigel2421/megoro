import { create } from 'zustand';
import {
  Member,
  ChamaCycle,
  MeetingSession,
  Loan,
  OkoleaRequest,
  LedgerEntry,
  PayoutTurn,
  AttendanceStatus,
  PayoutMode,
  PluginWidget,
} from '../types';
import {
  initialCycle,
  initialMembers,
  initialPayoutTurns,
  initialMeeting,
  initialLoans,
  initialOkoleaRequests,
  initialLedger,
} from '../data/seedData';
import { sound } from '../utils/audio';

export type ActiveNavView = 'lobby' | 'mezani' | 'vault_payout' | 'my_acc' | 'okolea' | 'dissolution';

interface ChamaStore {
  // Navigation & session
  activeView: ActiveNavView;
  setActiveView: (view: ActiveNavView) => void;
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Domain state
  cycle: ChamaCycle;
  members: Member[];
  payoutTurns: PayoutTurn[];
  meeting: MeetingSession;
  loans: Loan[];
  okoleaRequests: OkoleaRequest[];
  ledger: LedgerEntry[];

  // Animation triggers
  coinBurstTrigger: number;
  triggerCoinBurst: () => void;
  confettiTrigger: number;
  triggerConfetti: () => void;

  // Mezani & Seating
  pullUpToTable: (memberId: string) => void;
  leaveTable: (memberId: string) => void;
  setSpeaker: (memberId: string | null) => void;
  postReaction: (memberId: string, reaction: string) => void;
  activeReactions: Array<{ id: string; memberId: string; emoji: string }>;

  // Pre-meeting wizard & Meeting Flow
  setWizardStep: (step: number) => void;
  approveKatiba: () => void;
  setMissionVibe: (vibe: string) => void;
  toggleAgendaItem: (id: string) => void;
  addAgendaItem: (title: string, durationMin: number) => void;
  recordAttendance: (memberId: string, status: AttendanceStatus, apologyReason?: string) => void;
  adjournMeeting: () => void;
  reopenMeeting: () => void;

  // Extensible Plugins
  mountPlugin: (plugin: PluginWidget) => void;
  unmountPlugin: (id: string) => void;
  voteInPoll: (pluginId: string, option: string) => void;
  contributeInstantTip: (pluginId: string, amount: number) => void;

  // Rotational Payout Engine
  setPayoutMode: (mode: PayoutMode) => void;
  contributeToPool: (params: { memberId: string; amount: number; method: 'mpesa' | 'cash'; reference?: string }) => void;
  disbursePayout: (targetMemberId: string, method: 'mpesa' | 'cash') => void;
  stepDownTurn: (memberId: string, reason: string) => void;
  swapTurn: (sourceMemberId: string, targetMemberId: string, reason: string) => void;
  pickRandomDrawWinner: () => string | null;

  // Okolea Emergency Fund
  requestOkolea: (params: { requesterId: string; reason: string; amount: number }) => void;
  voteOkolea: (requestId: string, memberId: string, approve: boolean) => void;
  contributeOkolea: (amount: number, method: 'mpesa' | 'cash', reference?: string) => void;

  // Member Ledger & Accounts ("My Acc")
  depositToBucket: (memberId: string, bucket: 'liquid' | 'saye' | 'mkebe', amount: number, method: 'mpesa' | 'cash') => void;
  withdrawLiquidSavings: (memberId: string, amount: number) => boolean;
  applyForLoan: (params: { borrowerId: string; principal: number; durationMonths: number; collateral: string; guarantorIds: string[] }) => void;
  repayLoanInstallment: (loanId: string, installmentNumber: number) => void;
  settleFine: (memberId: string) => void;

  // Cycle Dissolution & Reset
  auditAndDissolveCycle: (dividendRatePercent: number) => void;
  resetForNewCycle: (shareAmount: number, frequency: 'Weekly' | 'Bi-Weekly' | 'Monthly') => void;
}

export const useChamaStore = create<ChamaStore>((set, get) => ({
  activeView: 'lobby',
  setActiveView: (view) => set({ activeView: view }),
  currentUserId: 'm-06', // Kevin Mwangi default
  setCurrentUserId: (id) => set({ currentUserId: id }),
  soundEnabled: true,
  toggleSound: () => {
    const next = !get().soundEnabled;
    sound.enabled = next;
    set({ soundEnabled: next });
  },

  cycle: initialCycle,
  members: initialMembers,
  payoutTurns: initialPayoutTurns,
  meeting: initialMeeting,
  loans: initialLoans,
  okoleaRequests: initialOkoleaRequests,
  ledger: initialLedger,

  coinBurstTrigger: 0,
  triggerCoinBurst: () => set((state) => ({ coinBurstTrigger: state.coinBurstTrigger + 1 })),
  confettiTrigger: 0,
  triggerConfetti: () => set((state) => ({ confettiTrigger: state.confettiTrigger + 1 })),

  activeReactions: [],
  postReaction: (memberId, emoji) => {
    const rxId = `${memberId}-${Date.now()}`;
    set((state) => ({
      activeReactions: [...state.activeReactions, { id: rxId, memberId, emoji }],
    }));
    sound.playTick();
    setTimeout(() => {
      set((state) => ({
        activeReactions: state.activeReactions.filter((r) => r.id !== rxId),
      }));
    }, 2500);
  },

  pullUpToTable: (memberId) => {
    sound.playSeatPull();
    set((state) => ({
      members: state.members.map((m) => (m.id === memberId ? { ...m, isSeated: true, isOnline: true } : m)),
    }));
  },

  leaveTable: (memberId) => {
    set((state) => ({
      members: state.members.map((m) => (m.id === memberId ? { ...m, isSeated: false } : m)),
    }));
  },

  setSpeaker: (memberId) => {
    sound.playGavel();
    set((state) => ({
      meeting: {
        ...state.meeting,
        activeSpeakerId: memberId,
      },
      members: state.members.map((m) => ({
        ...m,
        isSpeaking: m.id === memberId,
      })),
    }));
  },

  setWizardStep: (step) => {
    set((state) => ({
      meeting: { ...state.meeting, wizardStep: step },
    }));
  },

  approveKatiba: () => {
    sound.playGavel();
    set((state) => ({
      meeting: { ...state.meeting, katibaApproved: true },
    }));
  },

  setMissionVibe: (vibe) => {
    set((state) => ({
      meeting: { ...state.meeting, missionVibe: vibe },
    }));
  },

  toggleAgendaItem: (id) => {
    sound.playTick();
    set((state) => ({
      meeting: {
        ...state.meeting,
        agenda: state.meeting.agenda.map((ag) => (ag.id === id ? { ...ag, completed: !ag.completed } : ag)),
      },
    }));
  },

  addAgendaItem: (title, durationMin) => {
    const newItem = {
      id: `ag-${Date.now()}`,
      title,
      durationMin,
      completed: false,
    };
    set((state) => ({
      meeting: {
        ...state.meeting,
        agenda: [...state.meeting.agenda, newItem],
      },
    }));
  },

  recordAttendance: (memberId, status, apologyReason) => {
    const { cycle, members } = get();
    const targetMember = members.find((m) => m.id === memberId);
    if (!targetMember) return;

    let fine = 0;
    if (status === 'absent_penalized') {
      fine = cycle.fineAmount;
      sound.playGavel();
    } else {
      sound.playTick();
    }

    const newLedgerEntry: LedgerEntry | null =
      fine > 0
        ? {
            id: `TXN-${Date.now().toString().slice(-5)}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            memberId,
            memberName: targetMember.name,
            type: 'fine',
            bucket: 'fines',
            debit: fine,
            credit: 0,
            balanceAfter: targetMember.balances.pendingFines + fine,
            method: 'internal_offset',
            reference: `FINE-ABSENCE-R${cycle.currentRound}`,
            verifiedBy: 'Katiba Auto-Penalty Protocol',
            notes: `Unexcused absence penalty fine for Round ${cycle.currentRound}`,
          }
        : null;

    set((state) => ({
      meeting: {
        ...state.meeting,
        attendance: {
          ...state.meeting.attendance,
          [memberId]: {
            memberId,
            status,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fineLevied: fine,
            apologyReason,
          },
        },
      },
      members: state.members.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          missedContributions: status === 'absent_penalized' ? m.missedContributions + 1 : m.missedContributions,
          balances: {
            ...m.balances,
            pendingFines: m.balances.pendingFines + fine,
          },
        };
      }),
      ledger: newLedgerEntry ? [newLedgerEntry, ...state.ledger] : state.ledger,
    }));
  },

  adjournMeeting: () => {
    sound.playGavel();
    set((state) => ({
      meeting: { ...state.meeting, stage: 'adjourned' },
    }));
  },

  reopenMeeting: () => {
    sound.playGavel();
    set((state) => ({
      meeting: { ...state.meeting, stage: 'live_mezani' },
    }));
  },

  mountPlugin: (plugin) => {
    set((state) => ({
      meeting: {
        ...state.meeting,
        mountedPlugins: [...state.meeting.mountedPlugins.filter((p) => p.id !== plugin.id), plugin],
      },
    }));
  },

  unmountPlugin: (id) => {
    set((state) => ({
      meeting: {
        ...state.meeting,
        mountedPlugins: state.meeting.mountedPlugins.filter((p) => p.id !== id),
      },
    }));
  },

  voteInPoll: (pluginId, option) => {
    sound.playTick();
    set((state) => ({
      meeting: {
        ...state.meeting,
        mountedPlugins: state.meeting.mountedPlugins.map((p) => {
          if (p.id !== pluginId || p.type !== 'quick_poll') return p;
          const currentVotes = p.config?.votes || {};
          return {
            ...p,
            config: {
              ...p.config,
              votes: {
                ...currentVotes,
                [option]: (currentVotes[option] || 0) + 1,
              },
            },
          };
        }),
      },
    }));
  },

  contributeInstantTip: (pluginId, amount) => {
    sound.playCoin();
    set((state) => ({
      meeting: {
        ...state.meeting,
        mountedPlugins: state.meeting.mountedPlugins.map((p) => {
          if (p.id !== pluginId || p.type !== 'instant_tip') return p;
          return {
            ...p,
            config: {
              ...p.config,
              currentAmount: (p.config?.currentAmount || 0) + amount,
              tipsCount: (p.config?.tipsCount || 0) + 1,
            },
          };
        }),
      },
    }));
  },

  setPayoutMode: (mode) => {
    set((state) => ({
      cycle: { ...state.cycle, payoutMode: mode },
    }));
  },

  contributeToPool: ({ memberId, amount, method, reference }) => {
    sound.playCoin();
    const { members, cycle } = get();
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const refCode = reference || (method === 'mpesa' ? `QJH${Math.floor(100000 + Math.random() * 900000)}` : `CSH-REC-${Math.floor(1000 + Math.random() * 9000)}`);
    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId,
      memberName: member.name,
      type: 'contribution',
      bucket: 'pool',
      debit: 0,
      credit: amount,
      balanceAfter: cycle.vaultPoolBalance + amount,
      method,
      reference: refCode,
      verifiedBy: 'Amani Wanjiru (Treasurer)',
      notes: `Round ${cycle.currentRound} Share Pool Contribution`,
    };

    set((state) => ({
      cycle: {
        ...state.cycle,
        vaultPoolBalance: state.cycle.vaultPoolBalance + amount,
        totalCycleCollected: state.cycle.totalCycleCollected + amount,
      },
      meeting: {
        ...state.meeting,
        totalCollectedThisMeeting: state.meeting.totalCollectedThisMeeting + amount,
      },
      members: state.members.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          streakCount: m.streakCount + 1,
          onTimeContributions: m.onTimeContributions + 1,
          balances: {
            ...m.balances,
            saye: m.balances.saye + amount,
          },
        };
      }),
      ledger: [newEntry, ...state.ledger],
      coinBurstTrigger: state.coinBurstTrigger + 1,
    }));
  },

  disbursePayout: (targetMemberId, method) => {
    sound.playFanfare();
    const { members, cycle } = get();
    const recipient = members.find((m) => m.id === targetMemberId);
    if (!recipient) return;

    const payoutAmount = cycle.shareAmount * cycle.totalRounds; // e.g. 120,000 KES
    const refCode = method === 'mpesa' ? `MP-PAY-${Date.now().toString().slice(-6)}` : `CSH-PAY-${Date.now().toString().slice(-4)}`;

    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId: targetMemberId,
      memberName: recipient.name,
      type: 'payout',
      bucket: 'pool',
      debit: payoutAmount,
      credit: 0,
      balanceAfter: 0,
      method,
      reference: refCode,
      verifiedBy: 'Kiprono Bett (Chairman) & Amani Wanjiru (Treasurer)',
      notes: `Round ${cycle.currentRound} Rotational Pot Payout Handover`,
    };

    set((state) => ({
      cycle: {
        ...state.cycle,
        vaultPoolBalance: 0,
        currentRound: Math.min(state.cycle.totalRounds, state.cycle.currentRound + 1),
      },
      members: state.members.map((m) => {
        if (m.id !== targetMemberId) return m;
        return {
          ...m,
          hasReceivedPayoutThisCycle: true,
          balances: {
            ...m.balances,
            liquid: m.balances.liquid + payoutAmount,
          },
        };
      }),
      payoutTurns: state.payoutTurns.map((turn) => {
        if (turn.order === cycle.currentRound) {
          return {
            ...turn,
            status: 'completed',
            payoutMethod: method,
            notes: `Disbursed to ${recipient.name} on ${new Date().toLocaleDateString()}`,
          };
        }
        return turn;
      }),
      ledger: [newEntry, ...state.ledger],
      confettiTrigger: state.confettiTrigger + 1,
    }));
  },

  stepDownTurn: (memberId, reason) => {
    sound.playGavel();
    const { payoutTurns, cycle } = get();
    const currentTurn = payoutTurns.find((t) => t.order === cycle.currentRound);
    if (!currentTurn || currentTurn.memberId !== memberId) return;

    // Push this member down to next round or end of queue
    const nextEligibleTurn = payoutTurns.find(
      (t) => t.order > cycle.currentRound && t.status === 'pending'
    );

    if (!nextEligibleTurn) return;

    const swappedTurns = payoutTurns.map((t) => {
      if (t.order === currentTurn.order) {
        return { ...t, memberId: nextEligibleTurn.memberId, notes: `Stepped up: ${reason}` };
      }
      if (t.order === nextEligibleTurn.order) {
        return { ...t, memberId: currentTurn.memberId, status: 'stepped' as const, notes: `Deferred from Round ${currentTurn.order}: ${reason}` };
      }
      return t;
    });

    set({ payoutTurns: swappedTurns });
  },

  swapTurn: (sourceMemberId, targetMemberId, reason) => {
    sound.playGavel();
    const { payoutTurns } = get();
    const sourceTurn = payoutTurns.find((t) => t.memberId === sourceMemberId && t.status === 'pending');
    const targetTurn = payoutTurns.find((t) => t.memberId === targetMemberId && t.status === 'pending');

    if (!sourceTurn || !targetTurn) return;

    const updated = payoutTurns.map((t) => {
      if (t.order === sourceTurn.order) {
        return { ...t, memberId: targetMemberId, status: 'swapped' as const, notes: `Swapped with ${targetTurn.order}: ${reason}` };
      }
      if (t.order === targetTurn.order) {
        return { ...t, memberId: sourceMemberId, status: 'swapped' as const, notes: `Swapped from ${sourceTurn.order}: ${reason}` };
      }
      return t;
    });

    set({ payoutTurns: updated });
  },

  pickRandomDrawWinner: () => {
    const { members } = get();
    const eligible = members.filter((m) => !m.hasReceivedPayoutThisCycle);
    if (eligible.length === 0) return null;
    const winner = eligible[Math.floor(Math.random() * eligible.length)];
    return winner.id;
  },

  requestOkolea: ({ requesterId, reason, amount }) => {
    sound.playCoin();
    const { members } = get();
    const requester = members.find((m) => m.id === requesterId);
    if (!requester) return;

    const newReq: OkoleaRequest = {
      id: `oko-${Date.now().toString().slice(-4)}`,
      requesterId,
      requesterName: requester.name,
      reason,
      amountRequested: amount,
      timestamp: 'Just now',
      status: 'active_review',
      votesYes: [requesterId],
      votesNo: [],
      quorumRequired: 7,
    };

    set((state) => ({
      okoleaRequests: [newReq, ...state.okoleaRequests],
    }));
  },

  voteOkolea: (requestId, memberId, approve) => {
    sound.playTick();
    const { okoleaRequests, cycle, members } = get();
    const req = okoleaRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'active_review') return;

    let updatedYes = req.votesYes.filter((id) => id !== memberId);
    let updatedNo = req.votesNo.filter((id) => id !== memberId);

    if (approve) {
      updatedYes.push(memberId);
    } else {
      updatedNo.push(memberId);
    }

    let nextStatus: OkoleaRequest['status'] = req.status;
    let newLedger: LedgerEntry[] = [];
    let updatedCycle = { ...cycle };
    let updatedMembers = [...members];

    // Check if quorum reached
    if (updatedYes.length >= req.quorumRequired) {
      nextStatus = 'approved_disbursed';
      sound.playFanfare();
      updatedCycle.okoleaPoolBalance = Math.max(0, cycle.okoleaPoolBalance - req.amountRequested);

      const disburseEntry: LedgerEntry = {
        id: `TXN-${Date.now().toString().slice(-5)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        memberId: req.requesterId,
        memberName: req.requesterName,
        type: 'okolea_disbursement',
        bucket: 'okolea',
        debit: req.amountRequested,
        credit: 0,
        balanceAfter: updatedCycle.okoleaPoolBalance,
        method: 'mpesa',
        reference: `OKOLEA-AID-${req.id}`,
        verifiedBy: `Chama Quorum (${updatedYes.length}/${members.length} votes)`,
        notes: `Mutual Aid Emergency Relief: ${req.reason}`,
      };
      newLedger.push(disburseEntry);

      updatedMembers = members.map((m) => {
        if (m.id !== req.requesterId) return m;
        return {
          ...m,
          balances: {
            ...m.balances,
            liquid: m.balances.liquid + req.amountRequested,
          },
        };
      });
    }

    set((state) => ({
      cycle: updatedCycle,
      members: updatedMembers,
      okoleaRequests: state.okoleaRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              votesYes: updatedYes,
              votesNo: updatedNo,
              status: nextStatus,
            }
          : r
      ),
      ledger: newLedger.length > 0 ? [...newLedger, ...state.ledger] : state.ledger,
    }));
  },

  contributeOkolea: (amount, method, reference) => {
    sound.playCoin();
    const { currentUserId, members, cycle } = get();
    const member = members.find((m) => m.id === currentUserId);
    const refCode = reference || `OKO-DEP-${Date.now().toString().slice(-5)}`;

    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId: currentUserId,
      memberName: member?.name || 'Member',
      type: 'okolea_contribution',
      bucket: 'okolea',
      debit: 0,
      credit: amount,
      balanceAfter: cycle.okoleaPoolBalance + amount,
      method,
      reference: refCode,
      verifiedBy: 'Amani Wanjiru (Treasurer)',
      notes: 'Direct Voluntary Okolea Emergency Pool Contribution',
    };

    set((state) => ({
      cycle: {
        ...state.cycle,
        okoleaPoolBalance: state.cycle.okoleaPoolBalance + amount,
      },
      ledger: [newEntry, ...state.ledger],
      coinBurstTrigger: state.coinBurstTrigger + 1,
    }));
  },

  depositToBucket: (memberId, bucket, amount, method) => {
    sound.playCoin();
    const { members } = get();
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const ref = `${bucket.toUpperCase()}-DEP-${Date.now().toString().slice(-4)}`;
    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId,
      memberName: member.name,
      type: 'contribution',
      bucket,
      debit: 0,
      credit: amount,
      balanceAfter: member.balances[bucket] + amount,
      method,
      reference: ref,
      verifiedBy: 'Amani Wanjiru (Treasurer)',
      notes: `Top-up into ${bucket.toUpperCase()} savings bucket`,
    };

    set((state) => ({
      members: state.members.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          balances: {
            ...m.balances,
            [bucket]: m.balances[bucket] + amount,
          },
        };
      }),
      ledger: [newEntry, ...state.ledger],
      coinBurstTrigger: state.coinBurstTrigger + 1,
    }));
  },

  withdrawLiquidSavings: (memberId, amount) => {
    const { members } = get();
    const member = members.find((m) => m.id === memberId);
    if (!member || member.balances.liquid < amount) return false;

    sound.playCoin();
    const ref = `WDL-LIQ-${Date.now().toString().slice(-4)}`;
    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId,
      memberName: member.name,
      type: 'payout',
      bucket: 'liquid',
      debit: amount,
      credit: 0,
      balanceAfter: member.balances.liquid - amount,
      method: 'mpesa',
      reference: ref,
      verifiedBy: 'Self-Withdrawal',
      notes: 'Liquid Savings Withdrawal to M-Pesa Wallet',
    };

    set((state) => ({
      members: state.members.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          balances: {
            ...m.balances,
            liquid: m.balances.liquid - amount,
          },
        };
      }),
      ledger: [newEntry, ...state.ledger],
    }));
    return true;
  },

  applyForLoan: ({ borrowerId, principal, durationMonths, collateral, guarantorIds }) => {
    sound.playGavel();
    const { members } = get();
    const borrower = members.find((m) => m.id === borrowerId);
    if (!borrower) return;

    const interestRate = 5; // 5% monthly reducing
    const monthlyPrincipal = Math.round(principal / durationMonths);
    const firstMonthInterest = Math.round(principal * (interestRate / 100));

    const guarantors = guarantorIds.map((gId) => {
      const g = members.find((m) => m.id === gId);
      return {
        memberId: gId,
        memberName: g?.name || 'Member',
        guaranteedAmount: Math.round(principal / guarantorIds.length),
      };
    });

    const schedule = Array.from({ length: durationMonths }).map((_, idx) => ({
      installmentNumber: idx + 1,
      dueDate: `Month +${idx + 1}`,
      principal: monthlyPrincipal,
      interest: Math.round((principal - idx * monthlyPrincipal) * (interestRate / 100)),
      total: monthlyPrincipal + Math.round((principal - idx * monthlyPrincipal) * (interestRate / 100)),
      status: (idx === 0 ? 'upcoming' : 'upcoming') as 'paid' | 'upcoming',
    }));

    const newLoan: Loan = {
      id: `loan-${Date.now().toString().slice(-4)}`,
      borrowerId,
      borrowerName: borrower.name,
      type: 'individual',
      principalAmount: principal,
      interestRate,
      durationMonths,
      remainingBalance: principal,
      collateralDescription: collateral,
      guarantors,
      status: 'active',
      appliedDate: new Date().toISOString().slice(0, 10),
      schedule,
    };

    const disburseEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId: borrowerId,
      memberName: borrower.name,
      type: 'loan_disbursement',
      bucket: 'liquid',
      debit: principal,
      credit: 0,
      balanceAfter: borrower.balances.liquid + principal,
      method: 'mpesa',
      reference: `LOAN-DISB-${newLoan.id}`,
      verifiedBy: 'Chama Executive Committee',
      notes: `Loan Disbursed: ${collateral}`,
    };

    set((state) => ({
      loans: [newLoan, ...state.loans],
      members: state.members.map((m) => {
        if (m.id !== borrowerId) return m;
        return {
          ...m,
          balances: {
            ...m.balances,
            liquid: m.balances.liquid + principal,
          },
        };
      }),
      ledger: [disburseEntry, ...state.ledger],
    }));
  },

  repayLoanInstallment: (loanId, installmentNumber) => {
    sound.playCoin();
    const { loans, members, cycle } = get();
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return;

    const installment = loan.schedule.find((s) => s.installmentNumber === installmentNumber);
    if (!installment || installment.status === 'paid') return;

    const newRemaining = Math.max(0, loan.remainingBalance - installment.principal);
    const newStatus = newRemaining === 0 ? 'repaid' : 'active';

    const repayEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId: loan.borrowerId,
      memberName: loan.borrowerName,
      type: 'loan_repayment',
      bucket: 'pool',
      debit: 0,
      credit: installment.total,
      balanceAfter: cycle.totalInterestAccumulated + installment.interest,
      method: 'mpesa',
      reference: `LOAN-REPAY-${loanId}-I${installmentNumber}`,
      verifiedBy: 'Amani Wanjiru (Treasurer)',
      notes: `Installment #${installmentNumber} Repaid (Interest: KES ${installment.interest})`,
    };

    set((state) => ({
      cycle: {
        ...state.cycle,
        totalInterestAccumulated: state.cycle.totalInterestAccumulated + installment.interest,
      },
      loans: state.loans.map((l) => {
        if (l.id !== loanId) return l;
        return {
          ...l,
          remainingBalance: newRemaining,
          status: newStatus,
          schedule: l.schedule.map((s) => (s.installmentNumber === installmentNumber ? { ...s, status: 'paid' } : s)),
        };
      }),
      ledger: [repayEntry, ...state.ledger],
      coinBurstTrigger: state.coinBurstTrigger + 1,
    }));
  },

  settleFine: (memberId) => {
    sound.playCoin();
    const { members } = get();
    const member = members.find((m) => m.id === memberId);
    if (!member || member.balances.pendingFines <= 0) return;

    const fineAmount = member.balances.pendingFines;
    const newEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId,
      memberName: member.name,
      type: 'fine',
      bucket: 'fines',
      debit: 0,
      credit: fineAmount,
      balanceAfter: 0,
      method: 'mpesa',
      reference: `FINE-CLEAR-${Date.now().toString().slice(-4)}`,
      verifiedBy: 'Amani Wanjiru (Treasurer)',
      notes: 'Cleared outstanding disciplinary penalty fines',
    };

    set((state) => ({
      members: state.members.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          balances: {
            ...m.balances,
            pendingFines: 0,
          },
        };
      }),
      ledger: [newEntry, ...state.ledger],
    }));
  },

  auditAndDissolveCycle: (dividendRatePercent) => {
    sound.playGavel();
    const { cycle, members, loans } = get();

    // 1. Auto-offset any unpaid fines or delinquent loan balances against Mkebe/SAYE savings
    const settledMembers = members.map((m) => {
      let fines = m.balances.pendingFines;
      let newMkebe = m.balances.mkebe;
      let newSaye = m.balances.saye;

      if (fines > 0) {
        if (newMkebe >= fines) {
          newMkebe -= fines;
          fines = 0;
        } else {
          fines -= newMkebe;
          newMkebe = 0;
          if (newSaye >= fines) {
            newSaye -= fines;
            fines = 0;
          }
        }
      }

      // 2. Distribute dividend profit bonus proportional to total savings
      const totalSaved = newMkebe + newSaye + m.balances.liquid;
      const dividendBonus = Math.round(totalSaved * (dividendRatePercent / 100));

      return {
        ...m,
        balances: {
          ...m.balances,
          pendingFines: fines,
          mkebe: newMkebe,
          saye: newSaye,
          liquid: m.balances.liquid + dividendBonus,
        },
      };
    });

    const dividendEntry: LedgerEntry = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      memberId: 'all-members',
      memberName: 'All Chama Members',
      type: 'interest_dividend',
      bucket: 'liquid',
      debit: cycle.totalInterestAccumulated,
      credit: 0,
      balanceAfter: 0,
      method: 'internal_offset',
      reference: `DIVIDEND-AUDIT-CYCLE-${cycle.cycleNumber}`,
      verifiedBy: 'Executive Auditor & Katiba Committee',
      notes: `Audited cycle performance. Distributed ${dividendRatePercent}% dividend bonus across active savers.`,
    };

    set((state) => ({
      cycle: {
        ...state.cycle,
        status: 'dissolved',
      },
      members: settledMembers,
      ledger: [dividendEntry, ...state.ledger],
      confettiTrigger: state.confettiTrigger + 1,
    }));
  },

  resetForNewCycle: (shareAmount, frequency) => {
    sound.playFanfare();
    const { cycle, members } = get();
    const nextCycleNumber = cycle.cycleNumber + 1;

    const resetMembers = members.map((m, idx) => ({
      ...m,
      hasReceivedPayoutThisCycle: false,
      activeTurnOrder: idx + 1,
      isSeated: true,
    }));

    const newPayoutTurns: PayoutTurn[] = resetMembers.map((m, idx) => ({
      order: idx + 1,
      memberId: m.id,
      scheduledDate: `2026-0${Math.min(12, idx + 5)}-15`,
      status: 'pending',
      amount: shareAmount * resetMembers.length,
      notes: `Cycle ${nextCycleNumber} Round ${idx + 1}`,
    }));

    set((state) => ({
      cycle: {
        ...state.cycle,
        id: `cycle-2026-0${nextCycleNumber}`,
        name: `Ushirika Bora ROSCA (Cycle ${nextCycleNumber})`,
        cycleNumber: nextCycleNumber,
        shareAmount,
        meetingFrequency: frequency,
        currentRound: 1,
        vaultPoolBalance: 0,
        totalCycleCollected: 0,
        totalInterestAccumulated: 0,
        status: 'active',
        startDate: new Date().toISOString().slice(0, 10),
      },
      members: resetMembers,
      payoutTurns: newPayoutTurns,
      meeting: {
        ...state.meeting,
        stage: 'pre_meeting_wizard',
        wizardStep: 1,
        totalCollectedThisMeeting: 0,
      },
      activeView: 'mezani',
      confettiTrigger: state.confettiTrigger + 1,
    }));
  },
}));
