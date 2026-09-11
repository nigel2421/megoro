import React from 'react';
import {
  Users,
  Coins,
  Wallet,
  HeartHandshake,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { useChamaStore, ActiveNavView } from '../store/useChamaStore';

interface BottomNavProps {
  onOpenStkPush?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenStkPush }) => {
  const { activeView, setActiveView, meeting, cycle } = useChamaStore();

  const navItems: Array<{
    id: ActiveNavView;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }> = [
    {
      id: 'mezani',
      label: 'Mezani',
      icon: Users,
      badge: meeting.stage === 'live_mezani' ? 'LIVE' : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'vault_payout',
      label: 'Mzunguko',
      icon: Coins,
      badge: `R${cycle.currentRound}/${cycle.totalRounds}`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    },
    {
      id: 'my_acc',
      label: 'Pochi',
      icon: Wallet,
    },
    {
      id: 'okolea',
      label: 'Okolea',
      icon: HeartHandshake,
      badge: `KES ${(cycle.okoleaPoolBalance / 1000).toFixed(0)}k`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'dissolution',
      label: 'Katiba',
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      {/* Mobile Sticky Quick Action Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 px-4 py-2 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#131b2a]/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/50">
          <div className="flex items-center gap-2 pl-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Contribution</p>
              <p className="text-xs font-bold text-emerald-300 tabular-nums">
                KES {cycle.shareAmount.toLocaleString()} / Round
              </p>
            </div>
          </div>

          <button
            id="btn-mobile-stk-push"
            onClick={onOpenStkPush}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pay via M-Pesa</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Thumb Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f17]/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 min-w-[60px] rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active Indicator Top Glow */}
                {isActive && (
                  <span className="absolute -top-1.5 w-8 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-sm shadow-emerald-400/50" />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
                  {item.badge && (
                    <span
                      className={`absolute -top-1 -right-3 text-[8px] font-extrabold px-1 rounded-full uppercase tracking-tighter ${
                        item.badgeColor || 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
