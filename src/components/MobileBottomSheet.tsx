import React from 'react';
import {
  Users,
  Clock,
  Mic,
  MicOff,
  Smile,
  Send,
  X,
  ChevronUp,
  Flame,
  Zap,
} from 'lucide-react';
import { useChamaStore } from '../store/useChamaStore';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStkPush?: () => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  onOpenStkPush,
}) => {
  const { meeting, members, cycle, postReaction, currentUserId } = useChamaStore();
  const [isMicOn, setIsMicOn] = React.useState(false);

  if (!isOpen) return null;

  const activeSpeaker = members.find((m) => m.id === meeting.activeSpeakerId) || members[0];
  const paidMembersCount = members.filter((m) => m.onTimeContributions > 0).length;

  const reactions = ['👏', '🔥', '💰', '🇰🇪', '🎉'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in md:hidden">
      <div className="w-full max-h-[85vh] rounded-t-3xl bg-[#131b2a] border-t border-slate-700/80 shadow-2xl p-5 overflow-y-auto custom-scrollbar flex flex-col space-y-4 animate-slide-up">
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto" />

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h3 className="text-base font-extrabold text-slate-100">
              Live Mezani Meeting
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Round #{cycle.currentRound}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Speaker Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeSpeaker.avatar}
                alt={activeSpeaker.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-400"
              />
              <span className="absolute bottom-0 right-0 p-0.5 rounded-full bg-emerald-500 text-slate-950">
                <Mic className="w-2.5 h-2.5" />
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Current Speaker</p>
              <p className="text-sm font-extrabold text-slate-100 truncate max-w-[140px]">
                {activeSpeaker.name}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">
                {activeSpeaker.role} • Seat #{activeSpeaker.seatNumber}
              </p>
            </div>
          </div>

          {/* Quick Mic Control */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-2xl flex items-center justify-center transition cursor-pointer ${
              isMicOn
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Live Attendance & Contribution Progress */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Live Attendance</p>
            <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
              12 / 12 Members
            </p>
            <p className="text-[10px] text-slate-400">100% Quorum Reached</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Round Contributions</p>
            <p className="text-sm font-extrabold text-amber-400 mt-0.5 font-mono">
              {paidMembersCount} / {members.length} Paid
            </p>
            <p className="text-[10px] text-amber-300/80">KES {(paidMembersCount * cycle.shareAmount).toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Reactions Bar */}
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Live Table Reactions</p>
          <div className="flex items-center gap-2">
            {reactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => postReaction(currentUserId, emoji)}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-lg hover:scale-110 transition active:scale-95 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => {
            onClose();
            onOpenStkPush?.();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Pay KES {cycle.shareAmount.toLocaleString()} via M-Pesa</span>
        </button>
      </div>
    </div>
  );
};
