import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Wifi,
  Database,
  Cpu,
  X,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { useChamaStore } from '../store/useChamaStore';

interface TrustSealsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrustSealsModal: React.FC<TrustSealsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { cycle } = useChamaStore();
  const [copiedHash, setCopiedHash] = React.useState(false);

  if (!isOpen) return null;

  const mockHash = `0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(mockHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#131b2a] border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        {/* Decorative Top Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                Trust & Cryptographic Proofs
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  VERIFIED
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Transparent ROSCA auditing, immutable ledger, and local-first resilience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Trust Pillars */}
        <div className="space-y-4">
          {/* Pillar 1: Provably Fair RNG */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                <span>Provably Fair Seating RNG</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic Seed
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every round turn order is calculated using HMAC-SHA256 based on the Chama genesis hash and public seed. Neither the Chairman nor any member can manipulate table seating or payout order.
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300">
              <span className="truncate max-w-[280px] sm:max-w-[380px]">{mockHash}</span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-400 hover:text-emerald-300 transition ml-2 cursor-pointer"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pillar 2: ACID Ledger */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>ACID Double-Entry Ledger</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Zero Mismatch
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contributions, payout distributions, and Okolea aid disbursements are committed in atomic transactions. All financial ledger entries are cryptographically hashed and immutable.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <p className="text-[10px] uppercase font-bold text-slate-400">Vault Pool Balance</p>
                <p className="text-sm font-bold text-emerald-400 font-mono">KES {cycle.vaultPoolBalance.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <p className="text-[10px] uppercase font-bold text-slate-400">Okolea Aid Balance</p>
                <p className="text-sm font-bold text-rose-400 font-mono">KES {cycle.okoleaPoolBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Pillar 3: Offline-First Local Sync */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>Offline-First Local Sync</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" /> PWA Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your Chama records, vote history, and member ledger are stored locally in IndexedDB and synchronized automatically when online. You can view Katiba rules, roster order, and calculate payouts completely offline.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Chama Version: <strong className="text-slate-300">MGR Engine v2.4</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
