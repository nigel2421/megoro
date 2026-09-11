import React from 'react';
import {
  Users,
  Coins,
  Wallet,
  HeartHandshake,
  ShieldCheck,
  Volume2,
  VolumeX,
  Flame,
  UserCheck,
  ChevronDown,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useChamaStore, ActiveNavView } from '../store/useChamaStore';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenTrustModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrustModal }) => {
  const {
    activeView,
    setActiveView,
    currentUserId,
    setCurrentUserId,
    members,
    cycle,
    soundEnabled,
    toggleSound,
    meeting,
  } = useChamaStore();

  const currentUser = members.find((m) => m.id === currentUserId) || members[5];

  const navItems: Array<{
    id: ActiveNavView;
    label: string;
    sub: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
  }> = [
    {
      id: 'mezani',
      label: 'Mezani',
      sub: 'Live Chamber',
      icon: Users,
      badge: meeting.stage === 'live_mezani' ? 'LIVE' : undefined,
    },
    {
      id: 'vault_payout',
      label: 'Mzunguko & Vault',
      sub: 'Roster & Payout',
      icon: Coins,
      badge: `R${cycle.currentRound}/${cycle.totalRounds}`,
    },
    {
      id: 'my_acc',
      label: 'Pochi & Ledger',
      sub: 'Savings & Credit',
      icon: Wallet,
    },
    {
      id: 'okolea',
      label: 'Okolea Fund',
      sub: 'Mutual Aid',
      icon: HeartHandshake,
      badge: `KES ${(cycle.okoleaPoolBalance / 1000).toFixed(0)}k`,
    },
    {
      id: 'dissolution',
      label: 'Katiba & Reset',
      sub: 'Audit & Rules',
      icon: ShieldCheck,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f17]/95 backdrop-blur-2xl border-b border-slate-800/90 shadow-xl">
      {/* Top Global Utility App Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs border-b border-slate-800/50">
        {/* Left: Chama Selector & Cycle Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold tracking-tight text-slate-100 text-sm sm:text-base">
              {cycle.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/90 text-amber-300 font-mono text-[11px] border border-amber-500/20 font-semibold">
              Round #{cycle.currentRound} / {cycle.totalRounds}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-400 pl-2 border-l border-slate-800">
            <span>Vault Pool: <strong className="text-emerald-400 font-mono">KES {cycle.vaultPoolBalance.toLocaleString()}</strong></span>
            <span>•</span>
            <span>Okolea: <strong className="text-rose-400 font-mono">KES {cycle.okoleaPoolBalance.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Right: Trust Seal Trigger, Streak, SFX & Member Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trust Seal & Cryptographic Verifier Trigger */}
          <button
            id="btn-open-trust-seals"
            onClick={onOpenTrustModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-900/40 transition cursor-pointer"
            title="Inspect Cryptographic Proofs & Local-First Sync"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-[11px] font-bold">Synced • Provably Fair</span>
            <span className="sm:hidden text-[10px] font-bold">Verified</span>
          </button>

          {/* User Streak */}
          <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{currentUser.streakCount}x</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="p-1.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Active Member Switcher Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700/70 cursor-pointer hover:border-slate-500 transition">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-400/50"
              />
              <div className="hidden sm:block text-left pr-1">
                <p className="text-[11px] font-bold text-slate-200 leading-tight truncate max-w-[90px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold leading-none">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Dropdown switch menu */}
            <div className="absolute right-0 mt-1 w-60 rounded-2xl bg-[#131b2a] border border-slate-700/80 shadow-2xl p-2 hidden group-hover:block z-50">
              <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                Switch Role / View Context
              </p>
              <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                {members.map((m) => (
                  <button
                    key={m.id}
                    id={`switch-user-${m.id}`}
                    onClick={() => setCurrentUserId(m.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs transition cursor-pointer ${
                      m.id === currentUserId
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex-1 truncate">
                      <p className="text-xs truncate">{m.name}</p>
                      <span className="text-[10px] text-slate-400">{m.role} • Seat #{m.seatNumber}</span>
                    </div>
                    {m.id === currentUserId && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Main Sub-Navigation Bar (Hidden on mobile, handled by BottomNav) */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="flex items-center space-x-2 py-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent text-emerald-300 font-extrabold border border-emerald-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm tracking-tight">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                          item.badge === 'LIVE'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 leading-none">
                    {item.sub}
                  </span>
                </div>

                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-400/50" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
