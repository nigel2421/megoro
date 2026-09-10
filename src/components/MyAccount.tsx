import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  Lock,
  Zap,
  TrendingUp,
  ShieldCheck,
  Flame,
  Award,
  Calendar,
  AlertCircle,
  FileText,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  DollarSign,
  Briefcase,
  History,
  Info,
} from 'lucide-react';
import { useChamaStore } from '../store/useChamaStore';
import { sound } from '../utils/audio';

export const MyAccount: React.FC = () => {
  const {
    currentUserId,
    members,
    loans,
    ledger,
    depositToBucket,
    withdrawLiquidSavings,
    applyForLoan,
    repayLoanInstallment,
    settleFine,
  } = useChamaStore();

  const currentUser = members.find((m) => m.id === currentUserId) || members[5];

  // Skeuomorphic wallet clasp state
  const [isWalletOpen, setIsWalletOpen] = useState(true);

  // Deposit / Withdraw modal state
  const [activeBucketModal, setActiveBucketModal] = useState<'liquid' | 'saye' | 'mkebe' | null>(null);
  const [bucketActionType, setBucketActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [bucketAmountInput, setBucketAmountInput] = useState<number>(5000);

  // Loan Application state
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanPrincipal, setLoanPrincipal] = useState<number>(30000);
  const [loanDuration, setLoanDuration] = useState<number>(3);
  const [loanCollateral, setLoanCollateral] = useState<string>('');
  const [selectedGuarantors, setSelectedGuarantors] = useState<string[]>([]);

  // Filter for transactions
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'my'>('my');

  const myLoans = loans.filter((l) => l.borrowerId === currentUser.id);
  const myTransactions = ledgerFilter === 'my'
    ? ledger.filter((l) => l.memberId === currentUser.id || l.memberId === 'all-members')
    : ledger;

  const totalMySavings =
    currentUser.balances.liquid + currentUser.balances.saye + currentUser.balances.mkebe;

  const handleDepositOrWithdraw = () => {
    if (!activeBucketModal || bucketAmountInput <= 0) return;

    if (bucketActionType === 'deposit') {
      depositToBucket(currentUser.id, activeBucketModal, bucketAmountInput, 'mpesa');
    } else {
      withdrawLiquidSavings(currentUser.id, bucketAmountInput);
    }
    setActiveBucketModal(null);
  };

  const handleApplyLoan = () => {
    if (loanPrincipal <= 0 || !loanCollateral) return;
    applyForLoan({
      borrowerId: currentUser.id,
      principal: loanPrincipal,
      durationMonths: loanDuration,
      collateral: loanCollateral,
      guarantorIds: selectedGuarantors.length > 0 ? selectedGuarantors : ['m-01', 'm-02'],
    });
    setShowLoanModal(false);
    setLoanCollateral('');
    setSelectedGuarantors([]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-20 space-y-8">
      {/* Top Banner: Skeuomorphic "My Wallet" & Gamified Streaks */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                {currentUser.role}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{currentUser.name}</h2>
              <p className="text-xs text-slate-400">
                Seat #{currentUser.seatNumber} • {currentUser.phone}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                  Total Saved: KES {totalMySavings.toLocaleString()}
                </span>
                {currentUser.balances.pendingFines > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Unpaid Fine: KES {currentUser.balances.pendingFines}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gamified Metrics / Streaks & Badges */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Streak Counter */}
            <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="flex items-center gap-1.5 justify-center text-amber-400">
                <Flame className="w-5 h-5 fill-amber-400 animate-bounce" />
                <span className="text-xl font-black">{currentUser.streakCount}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300/80">
                On-Time Streak
              </span>
            </div>

            {/* Target Hit Ratio */}
            <div className="px-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-xl font-mono font-black text-emerald-400">
                {currentUser.onTimeContributions}/
                {currentUser.onTimeContributions + currentUser.missedContributions}
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Targets Hit
              </span>
            </div>

            {/* Clear Fine Button if fines exist */}
            {currentUser.balances.pendingFines > 0 && (
              <button
                id="btn-settle-fine"
                onClick={() => settleFine(currentUser.id)}
                className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition cursor-pointer"
              >
                Clear KES {currentUser.balances.pendingFines} Fine via M-Pesa
              </button>
            )}
          </div>
        </div>

        {/* Member Level-Up Badges */}
        <div className="pt-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
            Earned Badges:
          </span>
          {currentUser.badges.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-amber-300 whitespace-nowrap shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">{b.name}</span>
              <span className="text-[10px] text-slate-400">({b.description})</span>
            </div>
          ))}
        </div>
      </div>

      {/* SKEUOMORPHIC "MY WALLET" (POCHI YANGU) & BUCKETED SAVINGS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">
              Pochi Yangu (Bucketed Savings Engine)
            </h3>
          </div>
          <button
            onClick={() => {
              setIsWalletOpen(!isWalletOpen);
              sound.playSeatPull();
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            {isWalletOpen ? 'Clasp Wallet' : 'Unclasp & Zip Open'}
          </button>
        </div>

        {/* Wallet Container with clasp / unclasped visual */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c1813] via-[#14120e] to-[#0c0a08] border-2 border-amber-900/50 shadow-2xl relative overflow-hidden">
          {/* Leather Stitching Edge effect */}
          <div className="absolute inset-1 rounded-3xl border border-dashed border-amber-700/20 pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-widest font-black text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{isWalletOpen ? 'Wallet Unclasped & Open' : 'Wallet Clamped Safe'}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              Total Liquidity: <strong className="text-white">KES {totalMySavings.toLocaleString()}</strong>
            </span>
          </div>

          {/* 3 Bucketed Savings Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Liquid Savings */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Bucket 1 • Liquid
                  </span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-300">Instant Access Savings</h4>
                <p className="text-2xl font-black text-white font-mono mt-1">
                  KES {currentUser.balances.liquid.toLocaleString()}
                </p>
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  Instant withdrawal to M-Pesa • 4.5% annual dividend rate
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setActiveBucketModal('liquid');
                    setBucketActionType('deposit');
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  Deposit
                </button>
                <button
                  onClick={() => {
                    setActiveBucketModal('liquid');
                    setBucketActionType('withdraw');
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* 2. SAYE (Save As You Earn) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Bucket 2 • SAYE
                  </span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-300">Save As You Earn (Chama Target)</h4>
                <p className="text-2xl font-black text-white font-mono mt-1">
                  KES {currentUser.balances.saye.toLocaleString()}
                </p>
                <p className="text-[11px] text-amber-300/80 mt-1">
                  Cumulative monthly pool shares • Loan borrowing multiplier x3
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setActiveBucketModal('saye');
                    setBucketActionType('deposit');
                  }}
                  className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Top-up SAYE
                </button>
              </div>
            </div>

            {/* 3. Mkebe (Locked Fixed-Term Vault) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Bucket 3 • Mkebe
                  </span>
                  <Lock className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-300">Mkebe (Locked Term Box)</h4>
                <p className="text-2xl font-black text-white font-mono mt-1">
                  KES {currentUser.balances.mkebe.toLocaleString()}
                </p>
                <p className="text-[11px] text-indigo-300/80 mt-1">
                  Locked until Dec 2026 • 8.5% dividend yield • Early break penalty: 10%
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setActiveBucketModal('mkebe');
                    setBucketActionType('deposit');
                  }}
                  className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                >
                  Lock into Mkebe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOAN SUBSYSTEM: Applications & Amortization Repayments */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <span>Chama Loans & Amortization Subsystem</span>
            </h3>
            <p className="text-xs text-slate-400">
              Low-interest reducing balance (5% monthly) backed by collaterals or mutual guarantors
            </p>
          </div>

          <button
            id="btn-open-loan-modal"
            onClick={() => setShowLoanModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Loan</span>
          </button>
        </div>

        {/* Existing Active Loans */}
        <div className="space-y-4">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{loan.borrowerName}</h4>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        loan.status === 'active'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Collateral: <strong className="text-slate-200">{loan.collateralDescription}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Remaining Balance</p>
                  <p className="text-sm font-mono font-black text-amber-400">
                    KES {loan.remainingBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Amortization Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      <th className="py-2">Installment</th>
                      <th className="py-2">Due Date</th>
                      <th className="py-2">Principal</th>
                      <th className="py-2">Interest (5%)</th>
                      <th className="py-2">Total Due</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {loan.schedule.map((item) => (
                      <tr key={item.installmentNumber} className="text-slate-300">
                        <td className="py-2">#{item.installmentNumber}</td>
                        <td className="py-2">{item.dueDate}</td>
                        <td className="py-2">KES {item.principal.toLocaleString()}</td>
                        <td className="py-2 text-amber-400">KES {item.interest.toLocaleString()}</td>
                        <td className="py-2 font-bold text-white">KES {item.total.toLocaleString()}</td>
                        <td className="py-2">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              item.status === 'paid'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          {item.status !== 'paid' && (
                            <button
                              onClick={() => repayLoanInstallment(loan.id, item.installmentNumber)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] cursor-pointer"
                            >
                              Repay via M-Pesa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DUAL-ENTRY ACID LEDGER & AUDIT TRAIL */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-black text-white">ACID-Compliant Chama Ledger</h3>
              <p className="text-xs text-slate-400">
                Immutable double-entry transaction record with digital verification stamps
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setLedgerFilter('my')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                ledgerFilter === 'my' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Transactions
            </button>
            <button
              onClick={() => setLedgerFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                ledgerFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chama-Wide Ledger
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="py-2.5">TXN Ref / Time</th>
                <th className="py-2.5">Member</th>
                <th className="py-2.5">Type & Bucket</th>
                <th className="py-2.5">Debit (-)</th>
                <th className="py-2.5">Credit (+)</th>
                <th className="py-2.5">Balance After</th>
                <th className="py-2.5">Verified By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono">
              {myTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-3">
                    <p className="font-bold text-amber-400">{tx.reference}</p>
                    <span className="text-[10px] text-slate-500">{tx.timestamp}</span>
                  </td>
                  <td className="py-3 text-slate-200 font-sans font-medium">{tx.memberName}</td>
                  <td className="py-3 font-sans">
                    <span className="capitalize text-slate-300 font-semibold">{tx.type.replace('_', ' ')}</span>
                    <span className="block text-[10px] text-slate-500 uppercase">{tx.bucket} bucket</span>
                  </td>
                  <td className="py-3 text-rose-400 font-bold">
                    {tx.debit > 0 ? `-KES ${tx.debit.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 text-emerald-400 font-bold">
                    {tx.credit > 0 ? `+KES ${tx.credit.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 text-white font-bold">
                    KES {tx.balanceAfter.toLocaleString()}
                  </td>
                  <td className="py-3 text-slate-400 text-[11px] font-sans">
                    {tx.verifiedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BUCKET DEPOSIT / WITHDRAW MODAL */}
      {activeBucketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <h3 className="text-sm font-bold text-white mb-2 capitalize">
              {bucketActionType} {activeBucketModal.toUpperCase()} Savings
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter the amount to {bucketActionType}. Instant transfer via M-Pesa Express.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Amount (KES)</label>
                <input
                  type="number"
                  value={bucketAmountInput}
                  onChange={(e) => setBucketAmountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setActiveBucketModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDepositOrWithdraw}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Confirm {bucketActionType}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOAN APPLICATION MODAL */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <span>Chama Loan Application</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Requested Principal Amount (KES)
              </label>
              <input
                type="number"
                value={loanPrincipal}
                onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Tenure (Months) — 5% Reducing Balance
              </label>
              <select
                value={loanDuration}
                onChange={(e) => setLoanDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              >
                <option value={1}>1 Month</option>
                <option value={2}>2 Months</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Collateral Description / Asset Proof
              </label>
              <input
                type="text"
                value={loanCollateral}
                onChange={(e) => setLoanCollateral(e.target.value)}
                placeholder="e.g. Motorcycle Logbook, Dairy Cow Tag, Land Title"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <p className="font-bold">Guarantor Endorsements:</p>
              <p className="text-[11px] text-amber-300/80">
                Guaranteed by Chairman Kiprono Bett & Treasurer Amani Wanjiru.
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowLoanModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                disabled={!loanCollateral || loanPrincipal <= 0}
                onClick={handleApplyLoan}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
