import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Coins,
  Smartphone,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { useChamaStore } from '../store/useChamaStore';
import { sound } from '../utils/audio';

export const OkoleaPool: React.FC = () => {
  const {
    cycle,
    okoleaRequests,
    currentUserId,
    members,
    requestOkolea,
    voteOkolea,
    contributeOkolea,
  } = useChamaStore();

  const currentUser = members.find((m) => m.id === currentUserId) || members[5];

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [requestAmount, setRequestAmount] = useState<number>(10000);
  const [topUpAmount, setTopUpAmount] = useState<number>(2000);

  const handleCreateRequest = () => {
    if (!requestReason.trim() || requestAmount <= 0) return;
    requestOkolea({
      requesterId: currentUser.id,
      reason: requestReason.trim(),
      amount: requestAmount,
    });
    setShowRequestModal(false);
    setRequestReason('');
  };

  const handleTopUp = () => {
    if (topUpAmount <= 0) return;
    contributeOkolea(topUpAmount, 'mpesa');
    sound.playCoin();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-20 space-y-8">
      {/* Top Hero: Okolea Emergency Mutual-Aid Pool */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/30 p-6 sm:p-10 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-rose-900/40">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Okolea Mutual-Aid Emergency Fund
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
                  Auxiliary Reserve
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                A dedicated solidarity safety net operating outside the standard merry-go-round cycle. Disburses instant, unencumbered distress relief for hospitalization, sudden loss, and urgent household emergencies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Available Okolea Reserves
              </span>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                KES {cycle.okoleaPoolBalance.toLocaleString()}
              </p>
            </div>

            <button
              id="btn-open-okolea-modal"
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Omba Okolea (Request Aid)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Active Quorum Appeals & Voluntary Top-Up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Emergency Appeals & Quorum Voting (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Active Quorum Appeals for Collective Vote</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Quorum: 7 of 12 Member Votes Required
            </span>
          </div>

          {okoleaRequests.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
              No active emergency distress appeals at this time. All members in good standing!
            </div>
          ) : (
            <div className="space-y-4">
              {okoleaRequests.map((req) => {
                const requester = members.find((m) => m.id === req.requesterId);
                const hasVotedYes = req.votesYes.includes(currentUser.id);
                const hasVotedNo = req.votesNo.includes(currentUser.id);
                const isDisbursed = req.status === 'approved_disbursed';

                const totalVotes = req.votesYes.length;
                const progressPct = Math.min(100, Math.round((totalVotes / req.quorumRequired) * 100));

                return (
                  <div
                    key={req.id}
                    className={`p-5 rounded-3xl border transition relative overflow-hidden backdrop-blur-md ${
                      isDisbursed
                        ? 'bg-emerald-950/40 border-emerald-500/30'
                        : 'bg-slate-900/80 border-rose-500/30 shadow-xl'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={requester?.avatar}
                          alt={req.requesterName}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-400"
                        />
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{req.requesterName}</h4>
                          <span className="text-[10px] text-slate-400">{req.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Requested Relief:</span>
                        <span className="text-base font-black text-rose-400 font-mono">
                          KES {req.amountRequested.toLocaleString()}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isDisbursed
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isDisbursed ? 'Disbursed to M-Pesa' : 'Voting Quorum'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 my-3 leading-relaxed">
                      "{req.reason}"
                    </p>

                    {/* Quorum Progress Bar */}
                    <div className="space-y-1.5 my-3">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">
                          Chama Quorum: <strong className="text-white">{req.votesYes.length} / {req.quorumRequired} Votes</strong>
                        </span>
                        <span className="font-mono text-rose-300 font-bold">{progressPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Voting Controls */}
                    {!isDisbursed && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-400">
                          Cast your vote as <strong className="text-amber-300">{currentUser.name}</strong>:
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => voteOkolea(req.id, currentUser.id, true)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              hasVotedYes
                                ? 'bg-emerald-500 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{hasVotedYes ? 'Voted YES' : 'Vote Approve'}</span>
                          </button>

                          <button
                            onClick={() => voteOkolea(req.id, currentUser.id, false)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              hasVotedNo
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Voluntary Okolea Top-up Ingestion (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Coins className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold">Voluntary Okolea Top-up</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Support the mutual-aid emergency reserve through discretionary M-Pesa contributions. All top-ups are credited directly to the collective Okolea pool.
          </p>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Top-Up Amount (KES)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    topUpAmount === amt
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  KES {amt.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
            />
          </div>

          <button
            onClick={handleTopUp}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Top-up KES {topUpAmount.toLocaleString()} via M-Pesa</span>
          </button>
        </div>
      </div>

      {/* REQUEST OKOLEA MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
              <span>Omba Okolea Relief Application</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Amount Requested (KES)
              </label>
              <input
                type="number"
                value={requestAmount}
                onChange={(e) => setRequestAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Emergency Distress Reason
              </label>
              <textarea
                rows={3}
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                placeholder="Describe the medical, family, or critical circumstance..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                disabled={!requestReason.trim() || requestAmount <= 0}
                onClick={handleCreateRequest}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs disabled:opacity-50"
              >
                Submit for Quorum Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
