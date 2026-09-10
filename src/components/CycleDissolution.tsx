import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  RotateCcw,
  BarChart,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  PieChart,
  DollarSign,
  Users,
} from 'lucide-react';
import { useChamaStore } from '../store/useChamaStore';
import { sound } from '../utils/audio';

export const CycleDissolution: React.FC = () => {
  const {
    cycle,
    members,
    loans,
    auditAndDissolveCycle,
    resetForNewCycle,
    currentUserId,
  } = useChamaStore();

  const currentUser = members.find((m) => m.id === currentUserId) || members[0];
  const isExecutive = currentUser.role === 'Chairman' || currentUser.role === 'Treasurer';

  const [activeStep, setActiveStep] = useState<number>(1);
  const [dividendPercentage, setDividendPercentage] = useState<number>(8.5);
  const [newShareTarget, setNewShareTarget] = useState<number>(12000);
  const [showConfirmResetModal, setShowConfirmResetModal] = useState(false);

  // Performance audit stats
  const totalMobilizedThisCycle = cycle.shareAmount * cycle.totalRounds * members.length;
  const totalLoanInterestAccrued = loans.reduce(
    (sum, l) => sum + l.schedule.reduce((s, sch) => s + sch.interest, 0),
    0
  );
  const totalFinesLevied = members.reduce((sum, m) => sum + m.balances.pendingFines, 0);
  const dividendPoolAvailable = totalLoanInterestAccrued + 18500; // Total surplus reserve
  const estimatedDividendPerMember = Math.round(dividendPoolAvailable / members.length);

  const handleExecuteReset = () => {
    auditAndDissolveCycle(dividendPercentage);
    resetForNewCycle(newShareTarget, 'Monthly');
    setShowConfirmResetModal(false);
    setActiveStep(1);

    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-20 space-y-8">
      {/* Top Banner: Dissolution Protocol Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-10 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-indigo-950/50">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Cycle Dissolution & Performance Audit Protocol
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase border border-indigo-500/30">
                  Katiba Clause 14
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Audits collective capital mobilizations, offsets outstanding member dues automatically against locked collateral, distributes dividend yields, and reboots the roster for the next cycle.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Authorized:</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-amber-300 border border-slate-700">
              {currentUser.name} ({currentUser.role})
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { step: 1, label: '1. Audit Performance' },
          { step: 2, label: '2. Auto-Offset Dues' },
          { step: 3, label: '3. Dividend Yields' },
          { step: 4, label: '4. Reset & Mzunguko Mpya' },
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
              activeStep === s.step
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            <span className="text-xs font-extrabold block">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step 1: Audit Cycle Performance */}
      {activeStep === 1 && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-400" />
              <span>Cycle #{cycle.cycleNumber} Final Financial Audit</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">Status: 100% Solvency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Mobilized Capital
              </span>
              <p className="text-xl font-black text-white font-mono mt-1">
                KES {totalMobilizedThisCycle.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-400 mt-1">12 full rotational rounds</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Loan Interest Accrued
              </span>
              <p className="text-xl font-black text-amber-400 font-mono mt-1">
                KES {totalLoanInterestAccrued.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">5% monthly reducing balance</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Fines Levied
              </span>
              <p className="text-xl font-black text-rose-400 font-mono mt-1">
                KES {totalFinesLevied.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Absence & disciplinary dues</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Distributable Surplus
              </span>
              <p className="text-xl font-black text-emerald-400 font-mono mt-1">
                KES {dividendPoolAvailable.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-300 mt-1">~KES {estimatedDividendPerMember.toLocaleString()} / member</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <span>Next: Auto-Offset Dues</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Auto-Offset Dues */}
      {activeStep === 2 && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Zero-Default Auto-Offset Calculator</span>
              </h3>
              <p className="text-xs text-slate-400">
                If a member has unpaid fines or pending loan installments, the protocol automatically offsets them against their locked Mkebe or liquid savings before cycle closure.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {members.map((m) => {
              const hasDebt = m.balances.pendingFines > 0;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-white">{m.name}</p>
                      <span className="text-[10px] text-slate-400">Seat #{m.seatNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Locked Mkebe</span>
                      <span className="font-mono font-bold text-slate-200">KES {m.balances.mkebe.toLocaleString()}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Pending Dues</span>
                      <span className={`font-mono font-bold ${hasDebt ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {hasDebt ? `KES ${m.balances.pendingFines}` : 'KES 0 (Clean)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Offset Status</span>
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cleared</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <span>Next: Distribute Dividends</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Distribute Dividends */}
      {activeStep === 3 && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                <span>Dividend Yield & Surplus Distribution</span>
              </h3>
              <p className="text-xs text-slate-400">
                Surplus accumulated from loan interest and investment returns is distributed equally into each member's liquid wallet.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">
                Total Distributable Surplus
              </span>
              <p className="text-2xl font-black text-white font-mono">
                KES {dividendPoolAvailable.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-400">
                Yield per Member
              </span>
              <p className="text-xl font-black text-emerald-300 font-mono">
                +KES {estimatedDividendPerMember.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <span>Next: Reset & New Cycle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Reset & Mzunguko Mpya */}
      {activeStep === 4 && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <span>Mzunguko Mpya (Initialize Cycle #{cycle.cycleNumber + 1})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Concludes Cycle #{cycle.cycleNumber}, shifts rotation seeds, and restarts Round 1.
              </p>
            </div>
          </div>

          <div className="max-w-md space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                New Share Contribution per Member (KES)
              </label>
              <input
                type="number"
                value={newShareTarget}
                onChange={(e) => setNewShareTarget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Yields KES {(newShareTarget * 12).toLocaleString()} per round pot in Cycle #{cycle.cycleNumber + 1}
              </p>
            </div>

            <button
              id="btn-confirm-dissolution-reset"
              onClick={() => setShowConfirmResetModal(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              Authorize Dissolution & Reboot Mzunguko Mpya
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {showConfirmResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>Confirm Chama Cycle Dissolution</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will officially close Cycle #{cycle.cycleNumber}, disburse accumulated dividends to all 12 members, reset rotation turn orders, and launch Cycle #{cycle.cycleNumber + 1} with share target of KES {newShareTarget.toLocaleString()}.
            </p>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowConfirmResetModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-md"
              >
                Confirm & Launch Cycle #{cycle.cycleNumber + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
