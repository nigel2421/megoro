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
} from 'lucide-react';
import { useChamaStore, ActiveNavView } from '../store/useChamaStore';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
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

  const navItems: Array<{ id: ActiveNavView; label: string; sub: string; icon: React.FC<{ className?: string }>; badge?: string }> = [
    {
      id: 'mezani',
      label: 'Mezani',
      sub: 'Live Meeting',
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
      sub: 'Savings & Loans',
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
      sub: 'Audit & Close',
      icon: ShieldCheck,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080b11]/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top utility ticker */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide text-slate-200">
              {cycle.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px]">
              Cycle #{cycle.cycleNumber}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <span>•</span>
            <span>Vault Pool: <strong className="text-amber-400 font-mono">KES {cycle.vaultPoolBalance.toLocaleString()}</strong></span>
            <span>•</span>
            <span>Okolea Aid: <strong className="text-rose-400 font-mono">KES {cycle.okoleaPoolBalance.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Streak */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{currentUser.streakCount} Streak</span>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Active User Switcher (for testing Chairman, Treasurer, Member perspectives) */}
          <div className="relative group">
            <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 cursor-pointer hover:border-slate-600 transition">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/40"
              />
              <div className="hidden sm:block text-left pr-1">
                <p className="text-[11px] font-bold text-slate-200 leading-tight truncate max-w-[90px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-amber-400 font-medium leading-none">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Dropdown switch menu */}
            <div className="absolute right-0 mt-1 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 hidden group-hover:block z-50">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Role / Member View
              </p>
              <div className="max-h-56 overflow-y-auto space-y-1">
                {members.map((m) => (
                  <button
                    key={m.id}
                    id={`switch-user-${m.id}`}
                    onClick={() => setCurrentUserId(m.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-left text-xs transition cursor-pointer ${
                      m.id === currentUserId
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex-1 truncate">
                      <p className="text-xs truncate">{m.name}</p>
                      <span className="text-[10px] text-slate-400">{m.role} • Seat #{m.seatNumber}</span>
                    </div>
                    {m.id === currentUserId && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Navigation Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
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
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 shadow-inner font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' : 'bg-slate-800/70 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold tracking-tight">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                          item.badge === 'LIVE'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-[10px] text-slate-400 leading-none">
                    {item.sub}
                  </span>
                </div>

                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
