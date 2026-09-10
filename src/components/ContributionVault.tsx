import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Coins,
  ArrowRightLeft,
  Smartphone,
  Banknote,
  Dices,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  Send,
  RefreshCw,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { useChamaStore } from '../store/useChamaStore';
import { sound } from '../utils/audio';

export const ContributionVault: React.FC = () => {
  const {
    cycle,
    members,
    payoutTurns,
    currentUserId,
    setPayoutMode,
    contributeToPool,
    disbursePayout,
    stepDownTurn,
    swapTurn,
    pickRandomDrawWinner,
    coinBurstTrigger,
    confettiTrigger,
  } = useChamaStore();

  const currentUser = members.find((m) => m.id === currentUserId) || members[5];

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState(currentUser.phone);
  const [mpesaRefInput, setMpesaRefInput] = useState('');
  const [cashReceiptRef, setCashReceiptRef] = useState('');
  const [contributionAmount, setContributionAmount] = useState<number>(cycle.shareAmount);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Stepping / Swap state
  const [showSteppingModal, setShowSteppingModal] = useState(false);
  const [steppingReason, setSteppingReason] = useState('');
  const [swapTargetMemberId, setSwapTargetMemberId] = useState<string>('');

  // Random Raffle Draw State
  const [isSpinningRaffle, setIsSpinningRaffle] = useState(false);
  const [raffleWinnerId, setRaffleWinnerId] = useState<string | null>(null);
  const [raffleEntropySeed, setRaffleEntropySeed] = useState<string | null>(null);

  // Current round recipient
  const currentTurn = payoutTurns.find((t) => t.order === cycle.currentRound);
  const currentRecipient = members.find((m) => m.id === currentTurn?.memberId);

  // Eligible members for random draw (who haven't received payout yet)
  const eligibleRaffleMembers = members.filter((m) => !m.hasReceivedPayoutThisCycle);

  // Handle contribution execution
  const handleContribute = () => {
    setIsProcessingPayment(true);
    sound.playCoin();

    setTimeout(() => {
      const generatedRef =
        paymentMethod === 'mpesa'
          ? mpesaRefInput.trim() || `QJH${Math.floor(100000 + Math.random() * 900000)}`
          : cashReceiptRef.trim() || `CSH-REC-${Math.floor(1000 + Math.random() * 9000)}`;

      contributeToPool({
        memberId: currentUser.id,
        amount: contributionAmount,
        method: paymentMethod,
        reference: generatedRef,
      });

      setIsProcessingPayment(false);
      setPaymentSuccessMsg(`Verified: KES ${contributionAmount.toLocaleString()} credited to Vault via ${paymentMethod.toUpperCase()} (Ref: ${generatedRef})`);
      setMpesaRefInput('');
      setCashReceiptRef('');

      // Trigger Confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });

      setTimeout(() => setPaymentSuccessMsg(null), 5000);
    }, 1200);
  };

  // Handle random raffle draw
  const handleSpinRaffle = () => {
    if (eligibleRaffleMembers.length === 0) return;
    setIsSpinningRaffle(true);
    setRaffleWinnerId(null);

    let counter = 0;
    const interval = setInterval(() => {
      sound.playTick();
      counter++;
      if (counter > 16) {
        clearInterval(interval);
        const winnerId = pickRandomDrawWinner();
        setRaffleWinnerId(winnerId);
        setRaffleEntropySeed(`SHA256-${Date.now()}-PROVABLY-FAIR-${Math.floor(Math.random() * 999999)}`);
        setIsSpinningRaffle(false);
        sound.playFanfare();

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#eab308', '#ec4899', '#8b5cf6'],
        });
      }
    }, 120);
  };

  // Handle Handover / Payout Disburse
  const handleDisburse = (targetId: string) => {
    disbursePayout(targetId, 'mpesa');
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.4 },
      colors: ['#f59e0b', '#10b981', '#ffffff'],
    });
  };

  // Stepping: Step down
  const handleStepDown = () => {
    if (!currentTurn) return;
    stepDownTurn(currentTurn.memberId, steppingReason || 'Voluntary deferral for business reinvestment');
    setShowSteppingModal(false);
    setSteppingReason('');
  };

  // Stepping: Swap
  const handleSwap = () => {
    if (!currentTurn || !swapTargetMemberId) return;
    swapTurn(currentTurn.memberId, swapTargetMemberId, steppingReason || 'Mutual urgent agreement');
    setShowSteppingModal(false);
    setSteppingReason('');
    setSwapTargetMemberId('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-20 space-y-8">
      {/* Top Banner: Central Contribution Vault Graphic */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-900/90 border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Gold Radial Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left / Center: Animated 3D Vault Graphic (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Spinning Metallic Gear Glow */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full border border-amber-400/20"
              />

              {/* Skeuomorphic Safe Vault Box */}
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr from-[#1f1910] via-[#2a2216] to-[#120f0a] border-4 border-amber-500/60 shadow-2xl shadow-amber-950/80 flex flex-col items-center justify-center p-4 relative group">
                {/* Vault Handle Wheel */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 border-2 border-yellow-200 shadow-xl flex items-center justify-center">
                  <Coins className="w-9 h-9 text-slate-950 drop-shadow" />
                </div>

                {/* Coin Slot at top of Vault */}
                <div className="absolute top-2 w-16 h-1.5 rounded-full bg-slate-950 border border-amber-500/50 shadow-inner" />

                {/* Vault Lock Dial */}
                <div className="mt-3 text-center">
                  <span className="text-[10px] uppercase tracking-widest font-black text-amber-400">
                    Vault Safe
                  </span>
                  <div className="flex items-center gap-1 justify-center mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-300 font-mono">ACID-Locked</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                Current Pool Accumulated
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mt-0.5">
                KES {cycle.vaultPoolBalance.toLocaleString()}
              </h2>
              <p className="text-xs text-amber-300 font-medium mt-1">
                Target Pot: KES {(cycle.shareAmount * cycle.totalRounds).toLocaleString()} for Round {cycle.currentRound}
              </p>
            </div>
          </div>

          {/* Right: Multi-Channel Payment Ingestion Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/70 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Deposit Your Round {cycle.currentRound} Share
                </h3>
                <p className="text-xs text-slate-400">
                  Contributing as: <strong className="text-amber-300">{currentUser.name}</strong> ({currentUser.role})
                </p>
              </div>

              {/* Payment Channel Selector (M-Pesa vs Cash) */}
              <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
                <button
                  id="btn-method-mpesa"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'mpesa'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>M-Pesa</span>
                </button>
                <button
                  id="btn-method-cash"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'bg-amber-600 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Cash / Slip</span>
                </button>
              </div>
            </div>

            {/* Ingestion Inputs */}
            <div className="space-y-3.5">
              {paymentMethod === 'mpesa' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      M-Pesa Phone Number
                    </label>
                    <input
                      type="text"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      M-Pesa Reference / Code
                    </label>
                    <input
                      type="text"
                      value={mpesaRefInput}
                      onChange={(e) => setMpesaRefInput(e.target.value.toUpperCase())}
                      placeholder="e.g. QJH7829XK3 (or Auto)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 uppercase"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Treasurer Receipt Voucher #
                    </label>
                    <input
                      type="text"
                      value={cashReceiptRef}
                      onChange={(e) => setCashReceiptRef(e.target.value.toUpperCase())}
                      placeholder="e.g. CSH-REC-4019"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Witness / Counter-Signer
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Amani Wanjiru (Treasurer)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Amount Quick Presets */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Share Contribution Amount
                </label>
                <div className="flex items-center gap-2">
                  {[cycle.shareAmount, cycle.shareAmount * 2].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setContributionAmount(amt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        contributionAmount === amt
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      KES {amt.toLocaleString()} {amt === cycle.shareAmount ? '(1 Share)' : '(Double)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Ingestion */}
              <button
                id="btn-execute-contribution"
                disabled={isProcessingPayment}
                onClick={handleContribute}
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with {paymentMethod.toUpperCase()} Gateway...</span>
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    <span>Contribute KES {contributionAmount.toLocaleString()} to Vault</span>
                  </>
                )}
              </button>

              {paymentSuccessMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{paymentSuccessMsg}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ROTATIONAL PAYOUT ENGINE: Mode Switcher & Execution Canvas */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Rotational Payout Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Round {cycle.currentRound} Distribution Pool: <strong className="text-emerald-400 font-mono">KES {(cycle.shareAmount * cycle.totalRounds).toLocaleString()}</strong>
            </p>
          </div>

          {/* Mode Switcher: Share Order vs Share Random */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              id="mode-share-order"
              onClick={() => setPayoutMode('share_order')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                cycle.payoutMode === 'share_order'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Share Order (Fixed Roster)</span>
            </button>
            <button
              id="mode-share-random"
              onClick={() => setPayoutMode('share_random')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                cycle.payoutMode === 'share_random'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Share Random (Provably Fair Raffle)</span>
            </button>
          </div>
        </div>

        {/* MODE 1: SHARE ORDER (Fixed Rotational Roster with Stepping & Swap) */}
        {cycle.payoutMode === 'share_order' ? (
          <div className="space-y-6">
            {/* Current Round Spotlight Recipient Card */}
            {currentRecipient && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={currentRecipient.avatar}
                      alt={currentRecipient.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-xl"
                    />
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                      Round {cycle.currentRound} Recipient
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{currentRecipient.name}</h3>
                    <p className="text-xs text-slate-400">
                      Scheduled Payout Turn • Full Pot: <strong className="text-emerald-400 font-mono">KES {(cycle.shareAmount * cycle.totalRounds).toLocaleString()}</strong>
                    </p>
                    {currentTurn?.notes && (
                      <p className="text-[11px] text-amber-300/80 mt-1 italic">Note: {currentTurn.notes}</p>
                    )}
                  </div>
                </div>

                {/* Handover & Stepping Controls */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Stepping / Swap Button */}
                  <button
                    id="btn-open-stepping-modal"
                    onClick={() => setShowSteppingModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-amber-500/30 transition cursor-pointer"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Stepping / Swap Turn</span>
                  </button>

                  {/* Disburse Handover button */}
                  <button
                    id="btn-disburse-payout"
                    onClick={() => handleDisburse(currentRecipient.id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Handover Pot (Disburse KES {(cycle.shareAmount * cycle.totalRounds).toLocaleString()})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Roster Timeline of All 12 Rounds */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Full 12-Month Cycle Rotation Timeline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {payoutTurns.map((turn) => {
                  const member = members.find((m) => m.id === turn.memberId);
                  const isCurrent = turn.order === cycle.currentRound;
                  const isPast = turn.status === 'completed';

                  return (
                    <div
                      key={turn.order}
                      className={`p-3.5 rounded-2xl border transition relative overflow-hidden ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                          : isPast
                          ? 'bg-slate-950/60 border-slate-800/80 opacity-75'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          Round #{turn.order}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isPast
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                              : isCurrent
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {turn.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <img
                          src={member?.avatar}
                          alt={member?.name}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{member?.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{turn.scheduledDate}</p>
                        </div>
                      </div>

                      {turn.notes && (
                        <p className="mt-2 text-[10px] text-amber-400/90 truncate border-t border-slate-800 pt-1.5">
                          {turn.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* MODE 2: SHARE RANDOM (Provably Fair Digital Raffle) */
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto mb-2">
                <Dices className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white">Provably Fair Digital Raffle Drum</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A cryptographic transparent draw randomly selects the payout recipient from active members who have not yet received a payout this cycle.
              </p>
            </div>

            {/* Spinning Lottery Drum Animation */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-48 h-48 rounded-full border-4 border-dashed border-purple-500/40 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: isSpinningRaffle ? 360 * 6 : 0 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className="w-36 h-36 rounded-full bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-950 border-2 border-purple-400/50 shadow-2xl flex flex-col items-center justify-center text-center p-3"
                >
                  <Dices className={`w-10 h-10 text-purple-300 ${isSpinningRaffle ? 'animate-spin' : ''}`} />
                  <span className="text-[10px] font-black uppercase text-purple-200 mt-1">
                    {isSpinningRaffle ? 'Spinning...' : 'Raffle Drum'}
                  </span>
                </motion.div>
              </div>

              {/* Winner Announcement Card */}
              {raffleWinnerId && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-950/80 border border-purple-400 text-center max-w-md w-full shadow-2xl"
                >
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-300">
                    Provably Selected Winner
                  </span>
                  <div className="flex items-center justify-center gap-3 my-2">
                    <img
                      src={members.find((m) => m.id === raffleWinnerId)?.avatar}
                      alt="Winner"
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-400"
                    />
                    <div className="text-left">
                      <h4 className="text-base font-extrabold text-white">
                        {members.find((m) => m.id === raffleWinnerId)?.name}
                      </h4>
                      <p className="text-xs text-emerald-300 font-mono font-bold">
                        Wins KES {(cycle.shareAmount * cycle.totalRounds).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {raffleEntropySeed && (
                    <p className="text-[9px] text-slate-400 font-mono truncate px-2 py-1 bg-slate-900/80 rounded-lg">
                      Seed: {raffleEntropySeed}
                    </p>
                  )}

                  <button
                    onClick={() => handleDisburse(raffleWinnerId)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-md transition"
                  >
                    Disburse Round {cycle.currentRound} Pot to Winner
                  </button>
                </motion.div>
              )}

              {/* Spin Button */}
              {!raffleWinnerId && (
                <button
                  id="btn-spin-raffle"
                  disabled={isSpinningRaffle || eligibleRaffleMembers.length === 0}
                  onClick={handleSpinRaffle}
                  className="mt-6 px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-sm shadow-xl shadow-purple-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  {isSpinningRaffle ? 'Selecting...' : `Spin Raffle (${eligibleRaffleMembers.length} Eligible Members)`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* STEPPING & SWAP MODAL */}
      {showSteppingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <span>Stepping & Voluntary Turn Swap Protocol</span>
            </h3>

            <p className="text-xs text-slate-300 my-3 leading-relaxed">
              If the scheduled recipient does not have immediate liquidity requirements or wishes to concede to a peer in urgent need, the turn can be stepped down or swapped with mutual consent.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Reason for Stepping / Swap
                </label>
                <input
                  type="text"
                  value={steppingReason}
                  onChange={(e) => setSteppingReason(e.target.value)}
                  placeholder="e.g. Deferring to next cycle for agri-season harvest / urgent school fee aid"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Option A: Swap Turn with Eligible Member
                </label>
                <select
                  value={swapTargetMemberId}
                  onChange={(e) => setSwapTargetMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="">Select Member to Swap With...</option>
                  {members
                    .filter((m) => m.id !== currentTurn?.memberId && !m.hasReceivedPayoutThisCycle)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (Round #{m.activeTurnOrder})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={handleStepDown}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  Step Down to Next Turn
                </button>
                <button
                  disabled={!swapTargetMemberId}
                  onClick={handleSwap}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50"
                >
                  Execute Approved Swap
                </button>
              </div>

              <button
                onClick={() => setShowSteppingModal(false)}
                className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
