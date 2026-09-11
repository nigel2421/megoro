import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  Smartphone,
  Banknote,
  Send,
  Calendar,
  Users,
  Award,
  RefreshCw,
  Coins,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useChamaStore } from '../store/useChamaStore';
import { sound } from '../utils/audio';

export const ContributionVault: React.FC = () => {
  const {
    cycle,
    members,
    payoutTurns,
    currentUserId,
    setActiveView,
    contributeToPool,
    ledger,
  } = useChamaStore();

  const currentUser = members.find((m) => m.id === currentUserId) || members[5];

  // STK Top-up modal inside vault
  const [showStkModal, setShowStkModal] = useState(false);
  const [stkPhone, setStkPhone] = useState(currentUser.phone || '0712345678');
  const [isProcessingStk, setIsProcessingStk] = useState(false);
  const [stkSuccessMsg, setStkSuccessMsg] = useState<string | null>(null);

  // Beneficiary for active round (Round 4)
  const currentTurn = payoutTurns.find((t) => t.order === cycle.currentRound);
  const activeBeneficiary = members.find((m) => m.id === currentTurn?.memberId) || members[3]; // Grace Wanjiku

  // User turn (Round 6)
  const userTurn = payoutTurns.find((t) => t.memberId === currentUser.id) || payoutTurns[5];

  const paidCount = members.filter((m) => m.onTimeContributions > 0).length || 9;
  const totalCount = members.length || 12;
  const collectedAmount = paidCount * cycle.shareAmount;
  const remainingAmount = (totalCount - paidCount) * cycle.shareAmount;
  const progressPercent = Math.round((paidCount / totalCount) * 100);

  const handleExecuteStk = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingStk(true);
    sound.playCoin();

    setTimeout(() => {
      const generatedRef = `QK${Math.floor(100000 + Math.random() * 900000)}L`;
      contributeToPool({
        memberId: currentUser.id,
        amount: cycle.shareAmount,
        method: 'mpesa',
        reference: generatedRef,
      });

      setIsProcessingStk(false);
      setStkSuccessMsg(`M-Pesa STK Verified: KES ${cycle.shareAmount.toLocaleString()} (Ref: ${generatedRef})`);
      
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b'],
      });

      setTimeout(() => {
        setStkSuccessMsg(null);
        setShowStkModal(false);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-12 font-sans">
      {/* 1. Header Badges & Group Meta */}
      <div className="space-y-2">
        {/* Verification Pills Row */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono font-bold tracking-tight">
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED ROSCA
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80">
            ● ACID Synced
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80">
            ● RNG #4
          </span>
        </div>

        {/* Group Name & Chapter */}
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            {cycle.name}
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span>📍 Nairobi Chapter</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Cycle {cycle.currentRound} of {cycle.totalRounds}</span>
            <span>•</span>
            <span className="font-mono">KES {cycle.shareAmount.toLocaleString()}/mo</span>
          </p>
        </div>
      </div>

      {/* 2. Vault Pot Collection Hero Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            VAULT POT COLLECTION
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>3 Days Left</span>
            <span className="text-[10px] text-slate-400 font-mono pl-1">Payout: 28 Oct</span>
          </div>
        </div>

        {/* Amount Display */}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">KES</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              {(cycle.shareAmount * cycle.totalRounds).toLocaleString()}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
            Active Pot
          </span>
        </div>

        {/* Beneficiary Pill */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeBeneficiary.avatar}
              alt={activeBeneficiary.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400"
            />
            <div>
              <p className="text-xs font-extrabold text-slate-100 flex items-center gap-1">
                {activeBeneficiary.name}
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </p>
              <p className="text-[10px] text-slate-400">
                Beneficiary • Seat #{activeBeneficiary.seatNumber}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono font-bold">
            Turn {cycle.currentRound}/{cycle.totalRounds}
          </span>
        </div>

        {/* Progress Bar & Collection Stats */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 font-mono">
              Collected: <strong className="text-emerald-400">KES {collectedAmount.toLocaleString()}</strong>
            </span>
            <span className="text-slate-400">
              {paidCount} of {totalCount} Contributed ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Remaining: KES {remainingAmount.toLocaleString()}</span>
            <span className="text-emerald-400 font-bold">{totalCount - paidCount} Slots Awaiting</span>
          </div>
        </div>

        {/* Your Contribution Status Pill */}
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-emerald-300">Your Turn Contribution Cleared</p>
              <p className="text-[10px] text-slate-400 font-mono">
                M-Pesa Ref: QK78923L • KES {cycle.shareAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs">
            Paid
          </span>
        </div>

        {/* Action CTAs */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setShowStkModal(true)}
            className="py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>STK Top Up</span>
          </button>
          <button
            onClick={() => setActiveView('dissolution')}
            className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700/80 transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pot Audit</span>
          </button>
        </div>
      </div>

      {/* 3. Your Assigned Turn Milestone Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              YOUR ASSIGNED TURN
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-mono font-bold">
            Seat #{currentUser.seatNumber}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-100">
            Round {userTurn.order} • Dec 2024
          </h3>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Projected Lump Sum</p>
            <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              KES {(cycle.shareAmount * cycle.totalRounds).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Remaining Time</p>
            <p className="text-lg font-black text-slate-100 font-mono mt-0.5">
              {userTurn.order - cycle.currentRound} Rounds
            </p>
            <p className="text-[10px] text-slate-400">~68 calendar days</p>
          </div>
        </div>

        {/* Member Honor Streak */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Member Honor Streak:</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-slate-300">{currentUser.streakCount || 12} mos on-time</span>
            <span className="text-emerald-400 font-bold">Score: 99.4%</span>
          </div>
        </div>
      </div>

      {/* 4. Mzunguko Roster Stepper / Horizontal Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>↔ Mzunguko Roster</span>
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{cycle.totalRounds}-Month Cycle</span>
        </div>

        {/* Carousel Row */}
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
          {payoutTurns.map((turn) => {
            const member = members.find((m) => m.id === turn.memberId);
            const isCompleted = turn.order < cycle.currentRound;
            const isActive = turn.order === cycle.currentRound;

            return (
              <div
                key={turn.order}
                className={`min-w-[150px] p-3.5 rounded-2xl border transition-all shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-b from-emerald-950/80 to-[#131b2a] border-emerald-500 shadow-xl ring-1 ring-emerald-500/40'
                    : isCompleted
                    ? 'bg-slate-900/90 border-slate-800/80'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-2">
                  <span className="text-slate-400">Round {turn.order}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <div className="space-y-1.5">
                  <img
                    src={member?.avatar}
                    alt={member?.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <p className="text-xs font-bold text-slate-100 truncate">{member?.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {isCompleted ? 'Disbursed' : isActive ? 'Active' : 'Upcoming'}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-400 font-mono">
                    KES {(cycle.shareAmount * cycle.totalRounds / 1000).toFixed(0)}k {isCompleted && '✓'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Mutual Aid & Total Pool Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Okolea Mutual Aid Card */}
        <div className="p-5 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">MUTUAL AID</span>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-bold">Okolea Pool</p>
            <h4 className="text-2xl font-black text-slate-100 font-mono">
              KES {cycle.okoleaPoolBalance.toLocaleString()}
            </h4>
          </div>

          <button
            onClick={() => setActiveView('okolea')}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>Request Relief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Pool Turnover Card */}
        <div className="p-5 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">TOTAL POOL</span>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-bold">Turnover Volume</p>
            <h4 className="text-2xl font-black text-slate-100 font-mono">
              KES {(cycle.shareAmount * cycle.totalRounds * 4).toLocaleString()}
            </h4>
          </div>

          <p className="text-xs text-emerald-400 font-mono font-bold pt-1">
            100% Repayment Rate
          </p>
        </div>
      </div>

      {/* 6. Chama Activity Feed */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
            <span>📜 Chama Activity Feed</span>
          </h3>
          <button
            onClick={() => setActiveView('my_acc')}
            className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {/* Feed Item 1 */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-slate-100">Grace W. Contribution</p>
                <p className="text-[10px] text-slate-400">Round 4 Pot • 12 mins ago</p>
              </div>
            </div>
            <div className="text-right font-mono">
              <p className="font-bold text-emerald-400">+KES 10,000</p>
              <p className="text-[10px] text-slate-400">M-Pesa Verified</p>
            </div>
          </div>

          {/* Feed Item 2 */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-slate-100">Faith N. Contribution</p>
                <p className="text-[10px] text-slate-400">Round 4 Pot • 1 hr ago</p>
              </div>
            </div>
            <div className="text-right font-mono">
              <p className="font-bold text-emerald-400">+KES 10,000</p>
              <p className="text-[10px] text-slate-400">M-Pesa Verified</p>
            </div>
          </div>

          {/* Feed Item 3 */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-slate-100">Okolea Medical Aid Grant</p>
                <p className="text-[10px] text-slate-400">Approved Emergency • Yesterday</p>
              </div>
            </div>
            <div className="text-right font-mono">
              <p className="font-bold text-rose-400">-KES 5,000</p>
              <p className="text-[10px] text-slate-400">Disbursed</p>
            </div>
          </div>
        </div>

        {/* Ledger Trigger Button */}
        <button
          onClick={() => setActiveView('my_acc')}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700/80 transition cursor-pointer"
        >
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>Open Provably Fair Ledger (Pochi) →</span>
        </button>
      </div>

      {/* STK TOP UP MODAL inside Vault */}
      {showStkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#131b2a] border border-emerald-500/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>M-Pesa STK Top Up</span>
              </h3>
              <button
                onClick={() => setShowStkModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {stkSuccessMsg ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-emerald-300">{stkSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleExecuteStk} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    M-Pesa Mobile Number
                  </label>
                  <input
                    type="text"
                    value={stkPhone}
                    onChange={(e) => setStkPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs">
                  <p className="text-slate-400">Contribution Amount:</p>
                  <p className="text-lg font-black text-emerald-400">KES {cycle.shareAmount.toLocaleString()}</p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingStk}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {isProcessingStk ? 'Sending STK Prompt...' : 'Send STK Prompt'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
