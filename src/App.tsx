import React, { useEffect, useState } from 'react';
import { useChamaStore } from './store/useChamaStore';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { TrustSealsModal } from './components/TrustSealsModal';
import { MobileBottomSheet } from './components/MobileBottomSheet';
import { MezaniTable } from './components/MezaniTable';
import { ContributionVault } from './components/ContributionVault';
import { MyAccount } from './components/MyAccount';
import { OkoleaPool } from './components/OkoleaPool';
import { CycleDissolution } from './components/CycleDissolution';
import { OfflineIndicator } from './components/PWAInstallButton';
import {
  ShieldCheck,
  Users,
  Clock,
  Send,
  Lock,
  Zap,
  CheckCircle2,
  FileText,
  Activity,
  ArrowRight,
  HeartHandshake,
  Check,
  X,
  Smartphone,
} from 'lucide-react';

export default function App() {
  const { activeView, setActiveView, members, cycle, ledger, contributeToPool, fetchDbData } = useChamaStore();
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isStkPushOpen, setIsStkPushOpen] = useState(false);
  const [stkPhoneNumber, setStkPhoneNumber] = useState('0712345678');
  const [isStkProcessing, setIsStkProcessing] = useState(false);
  const [stkSuccess, setStkSuccess] = useState(false);

  useEffect(() => {
    fetchDbData();
  }, [fetchDbData]);

  const handleSimulateStk = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStkProcessing(true);
    setTimeout(() => {
      contributeToPool({ memberId: 'm-06', amount: cycle.shareAmount, method: 'mpesa' });
      setIsStkProcessing(false);
      setStkSuccess(true);
      setTimeout(() => {
        setStkSuccess(false);
        setIsStkPushOpen(false);
      }, 1500);
    }, 1800);
  };

  const paidMembersCount = members.filter((m) => m.onTimeContributions > 0).length;


  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 pb-20 md:pb-0">
      {/* Top Global App Bar */}
      <Navbar onOpenTrustModal={() => setIsTrustModalOpen(true)} />

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Responsive Desktop 3-Column Layout (xl: 3 cols, md: 2 cols, sm: 1 col) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT RAIL (Desktop 3/12): Chama Katiba, Schedule & Roster Telemetry */}
          <aside className="hidden xl:block xl:col-span-3 space-y-5">
            {/* Cycle Summary & Dial Card */}
            <div className="p-5 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Cycle Telemetry
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Round #{cycle.currentRound}/{cycle.totalRounds}
                </span>
              </div>

              {/* Progress Dial Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">ROSCA Completion</span>
                  <span className="text-emerald-400 font-mono">
                    {Math.round((cycle.currentRound / cycle.totalRounds) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                    style={{ width: `${(cycle.currentRound / cycle.totalRounds) * 100}%` }}
                  />
                </div>
              </div>

              {/* Live Pot Quick Stats */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vault Pool Balance</span>
                  <strong className="text-emerald-400 font-mono">
                    KES {cycle.vaultPoolBalance.toLocaleString()}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Okolea Aid Reserve</span>
                  <strong className="text-rose-400 font-mono">
                    KES {cycle.okoleaPoolBalance.toLocaleString()}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Round Target</span>
                  <strong className="text-slate-200 font-mono">
                    KES {(cycle.shareAmount * members.length).toLocaleString()}
                  </strong>
                </div>
              </div>

              <button
                onClick={() => setIsTrustModalOpen(true)}
                className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700/60"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Cryptographic Proofs</span>
              </button>
            </div>

            {/* Chama Katiba Rules Snippet */}
            <div className="p-5 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Chama Katiba Rules</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Weekly Payouts:</strong> Every Friday at 20:00 EAT.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Okolea Levy:</strong> KES 500 per round emergency aid buffer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Provably Fair RNG:</strong> Payout seat order locked at round start.</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveView('dissolution')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>Read Full Katiba Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Member Presence Roster */}
            <div className="p-5 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Member Roster
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">12 / 12 Active</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {members.slice(0, 6).map((m) => {
                  const hasPaid = m.onTimeContributions > 0;
                  return (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-slate-200 truncate max-w-[100px]">{m.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasPaid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {hasPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* CENTER CANVAS (Desktop 6/12 or Full Width on Mobile): Active View */}
          <section className="xl:col-span-6 space-y-6">
            {/* Quick Hero Banner for Active View Context */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#131b2a] to-[#131b2a] border border-emerald-500/20 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Chama Status • Round #{cycle.currentRound}
                </p>
                <h2 className="text-lg font-extrabold text-slate-100 capitalize">
                  {activeView.replace('_', ' ')} Dashboard
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBottomSheetOpen(true)}
                  className="md:hidden px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 animate-pulse cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Live Meeting</span>
                </button>

                <button
                  onClick={() => setIsStkPushOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Pay via M-Pesa</span>
                </button>
              </div>
            </div>

            {/* Active View Component */}
            {activeView === 'mezani' && <MezaniTable />}
            {activeView === 'vault_payout' && <ContributionVault />}
            {activeView === 'my_acc' && <MyAccount />}
            {activeView === 'okolea' && <OkoleaPool />}
            {activeView === 'dissolution' && <CycleDissolution />}
          </section>

          {/* RIGHT SIDEBAR (Desktop 3/12): Real-Time ACID Ledger & Okolea Stream */}
          <aside className="hidden xl:block xl:col-span-3 space-y-5">
            {/* Real-time Ledger Stream */}
            <div className="p-5 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-slate-100">Live ACID Ledger</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  REAL-TIME
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {ledger.slice(0, 8).map((tx) => {
                  const txAmount = tx.credit || tx.debit;
                  return (
                    <div key={tx.id} className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-200 truncate max-w-[120px]">{tx.memberName}</span>
                        <span className={`font-mono ${tx.type === 'payout' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {tx.type === 'payout' ? '-' : '+'} KES {txAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{tx.timestamp}</span>
                        <span className="text-emerald-400 font-semibold">{tx.reference}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Okolea Mutual Aid Claims */}
            <div className="p-5 rounded-3xl bg-[#131b2a] border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                <span>Okolea Emergency Aid</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency loans disbursed instantly with 0% interest and 30-day grace period.
              </p>
              <button
                onClick={() => setActiveView('okolea')}
                className="w-full py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition cursor-pointer"
              >
                Request Emergency Aid
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Fixed Thumb Navigation Bar */}
      <BottomNav onOpenStkPush={() => setIsStkPushOpen(true)} />

      {/* Trust & Cryptographic Proofs Modal */}
      <TrustSealsModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
      />

      {/* Interactive Mobile Bottom Sheet for Meetings */}
      <MobileBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onOpenStkPush={() => setIsStkPushOpen(true)}
      />

      {/* M-Pesa STK Push Simulation Modal */}
      {isStkPushOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#131b2a] border border-emerald-500/30 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-100">
                  M-Pesa STK Push Contribution
                </h3>
              </div>
              <button
                onClick={() => setIsStkPushOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {stkSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-extrabold text-emerald-300">
                  Contribution Received!
                </h4>
                <p className="text-xs text-slate-300 font-mono">
                  Receipt: MPESA-STK-{Math.floor(100000 + Math.random() * 900000)}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSimulateStk} className="space-y-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Amount to Deposit</p>
                  <p className="text-xl font-extrabold text-emerald-400 font-mono">
                    KES {cycle.shareAmount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400">For Round #{cycle.currentRound} • Vault Pool</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="text"
                    value={stkPhoneNumber}
                    onChange={(e) => setStkPhoneNumber(e.target.value)}
                    required
                    placeholder="0712345678"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isStkProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isStkProcessing ? (
                    <span>Processing STK Prompt...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send STK Prompt to Phone</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Elevated Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090d16] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-slate-400">
            MGR (Merry-Go-Round Engine) • Ushirika Bora Chama • PWA v2.4
          </p>
          <div className="flex items-center gap-3 text-[11px] text-emerald-400 font-mono">
            <button
              onClick={() => setIsTrustModalOpen(true)}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Provably Fair RNG</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsTrustModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              ACID Ledger
            </button>
            <span>•</span>
            <button
              onClick={() => setIsTrustModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Local-First Sync
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
