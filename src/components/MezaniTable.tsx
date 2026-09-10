import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gavel,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  BarChart3,
  Coffee,
  Radio,
  FileText,
  Smile,
  Shield,
  X,
  Play,
  Share2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useChamaStore } from '../store/useChamaStore';
import { AttendanceStatus, PluginWidget } from '../types';
import { sound } from '../utils/audio';

export const MezaniTable: React.FC = () => {
  const {
    members,
    currentUserId,
    meeting,
    cycle,
    pullUpToTable,
    leaveTable,
    setSpeaker,
    postReaction,
    activeReactions,
    setWizardStep,
    approveKatiba,
    setMissionVibe,
    toggleAgendaItem,
    addAgendaItem,
    recordAttendance,
    adjournMeeting,
    reopenMeeting,
    mountPlugin,
    unmountPlugin,
    voteInPoll,
    contributeInstantTip,
  } = useChamaStore();

  const [showPreMeetingModal, setShowPreMeetingModal] = useState(false);
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newVibeInput, setNewVibeInput] = useState(meeting.missionVibe);
  const [showAddPluginModal, setShowAddPluginModal] = useState(false);
  const [customPollTitle, setCustomPollTitle] = useState('');
  const [customPollQuestion, setCustomPollQuestion] = useState('');

  const currentUser = members.find((m) => m.id === currentUserId) || members[0];
  const isChairman = currentUser.role === 'Chairman';
  const isSeated = currentUser.isSeated;

  // Chair angle geometry for circular table
  const totalChairs = 12;
  const radius = 230; // Radius in pixels for desktop positioning

  const quickReactions = ['🔥', '👏', '💰', '🤝', '🙌', '⚖️'];

  const handleBangGavel = () => {
    sound.playGavel();
  };

  const handleAddPlugin = (type: 'quick_poll' | 'instant_tip' | 'speaker_floor') => {
    if (type === 'quick_poll') {
      const newPoll: PluginWidget = {
        id: `plug-poll-${Date.now()}`,
        type: 'quick_poll',
        title: customPollTitle || 'Member Quick Consensus Poll',
        active: true,
        config: {
          question: customPollQuestion || 'Should we adjust next round contribution targets?',
          options: ['Yes, agree', 'Maintain current', 'Review in AOB'],
          votes: { 'Yes, agree': 1, 'Maintain current': 0, 'Review in AOB': 0 },
        },
      };
      mountPlugin(newPoll);
    } else if (type === 'instant_tip') {
      const newTip: PluginWidget = {
        id: `plug-tip-${Date.now()}`,
        type: 'instant_tip',
        title: 'Changa Token (Venue & Water)',
        active: true,
        config: {
          targetAmount: 5000,
          currentAmount: 1500,
          tipsCount: 5,
        },
      };
      mountPlugin(newTip);
    }
    setShowAddPluginModal(false);
    setCustomPollTitle('');
    setCustomPollQuestion('');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] flex flex-col items-center justify-start p-4 sm:p-6 pb-20">
      {/* Dynamic Background Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Meeting Header Bar & Status */}
      <div className="w-full max-w-6xl mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                {meeting.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  meeting.stage === 'live_mezani'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {meeting.stage === 'live_mezani' ? 'Live Session' : meeting.stage}
              </span>
            </div>
            <p className="text-xs text-amber-300/80 font-medium italic mt-0.5">
              "{meeting.missionVibe}"
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-open-premeeting-wizard"
            onClick={() => setShowPreMeetingModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-xs font-semibold text-slate-200 border border-slate-700/60 transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Katiba & Roll Call</span>
          </button>

          {/* Pull up chair / Leave Table */}
          {isSeated ? (
            <button
              id="btn-leave-table"
              onClick={() => leaveTable(currentUser.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition cursor-pointer"
            >
              <span>Step Away</span>
            </button>
          ) : (
            <button
              id="btn-pull-up-chair"
              onClick={() => pullUpToTable(currentUser.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Vuta Kiti (Take Seat #{currentUser.seatNumber})</span>
            </button>
          )}

          {/* Gavel button */}
          <button
            id="btn-bang-gavel"
            onClick={handleBangGavel}
            title="Bang Chairman's Gavel"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <Gavel className="w-4 h-4" />
            <span>Piga Gavel</span>
          </button>

          {/* Speaker floor request */}
          <button
            id="btn-toggle-mic"
            onClick={() => setSpeaker(meeting.activeSpeakerId === currentUser.id ? null : currentUser.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              meeting.activeSpeakerId === currentUser.id
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {meeting.activeSpeakerId === currentUser.id ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-400" />}
            <span>{meeting.activeSpeakerId === currentUser.id ? 'Speaking (Live)' : 'Request Floor'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Mezani Table + Open Plugin Slot Canvas */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center: Circular Mezani Table Canvas (7 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-2 sm:p-6 rounded-3xl bg-slate-950/40 border border-slate-800/40 relative min-h-[560px] overflow-hidden">
          
          {/* Reaction Float Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
            <AnimatePresence>
              {activeReactions.map((rx) => {
                const sender = members.find((m) => m.id === rx.memberId);
                return (
                  <motion.div
                    key={rx.id}
                    initial={{ opacity: 0, y: 300, scale: 0.5 }}
                    animate={{ opacity: 1, y: 120, scale: 1.5 }}
                    exit={{ opacity: 0, y: 20, scale: 1.8 }}
                    transition={{ duration: 2.2, ease: 'easeOut' }}
                    className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 shadow-xl backdrop-blur-md"
                  >
                    <span className="text-2xl">{rx.emoji}</span>
                    <span className="text-[10px] text-slate-300 font-bold">{sender?.name}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Central Circular Mezani Container */}
          <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] flex items-center justify-center my-6">
            
            {/* Outer Wooden Ring */}
            <div className="absolute inset-4 sm:inset-10 rounded-full border-4 border-amber-900/40 bg-gradient-to-b from-[#191512] to-[#0d0b09] shadow-2xl flex items-center justify-center">
              {/* Inner Inlaid Green Baize Cloth */}
              <div className="w-[82%] h-[82%] rounded-full bg-gradient-to-br from-[#0c2419] via-[#091b13] to-[#040f0a] border border-emerald-800/40 shadow-inner flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {/* Subtle cloth texture and concentric golden rosette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0,transparent_70%)]" />
                
                {/* Chairman Gavel & Center Hub */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBangGavel}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-yellow-500 p-1 shadow-2xl shadow-amber-900/50 cursor-pointer flex flex-col items-center justify-center z-10 text-slate-950"
                >
                  <Gavel className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Mezani</span>
                </motion.div>

                {/* Live Collected Counter inside Table */}
                <div className="mt-2 z-10">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/80">Round 4 Pot</p>
                  <p className="text-sm sm:text-base font-extrabold text-white font-mono">
                    KES {meeting.totalCollectedThisMeeting.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-400">Target: KES 120,000</p>
                </div>

                {/* Active Speaker Token Banner */}
                {meeting.activeSpeakerId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-4 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px] font-bold flex items-center gap-1.5 shadow-lg"
                  >
                    <Radio className="w-3 h-3 text-rose-400 animate-ping" />
                    <span>{members.find((m) => m.id === meeting.activeSpeakerId)?.name} speaking</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* 12 Seating Positions Surrounding the Table */}
            {members.slice(0, totalChairs).map((member, index) => {
              const angleDeg = (index * 360) / totalChairs - 90; // Start at top
              const angleRad = (angleDeg * Math.PI) / 180;
              // Responsive radius adjustment
              const currentRadius = typeof window !== 'undefined' && window.innerWidth < 640 ? 150 : radius;
              const x = Math.cos(angleRad) * currentRadius;
              const y = Math.sin(angleRad) * currentRadius;

              const isSpeaker = meeting.activeSpeakerId === member.id;
              const attendance = meeting.attendance[member.id];
              const isPenalized = attendance?.status === 'absent_penalized';
              const isCurrentUserSeat = member.id === currentUserId;

              return (
                <motion.div
                  key={member.id}
                  id={`seat-${member.seatNumber}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  animate={{
                    scale: isSpeaker ? 1.15 : 1,
                  }}
                  className="absolute z-20 flex flex-col items-center"
                >
                  {/* Chair back & Avatar container */}
                  <div className="relative group cursor-pointer" onClick={() => member.isSeated ? null : pullUpToTable(member.id)}>
                    {/* Pulsing halo if speaking */}
                    {isSpeaker && (
                      <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping" />
                    )}

                    {/* Chair wood backing graphic */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-0.5 transition-all duration-300 shadow-xl flex items-center justify-center ${
                        member.isSeated
                          ? isCurrentUserSeat
                            ? 'bg-gradient-to-tr from-amber-400 to-amber-200 ring-2 ring-amber-400'
                            : 'bg-gradient-to-tr from-slate-700 to-slate-500'
                          : 'bg-slate-900/60 border border-dashed border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {member.isSeated ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[10px] text-slate-400">
                          <span>#{member.seatNumber}</span>
                          <span className="text-[9px]">Empty</span>
                        </div>
                      )}
                    </div>

                    {/* Seat number badge */}
                    <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[9px] font-mono font-bold flex items-center justify-center">
                      {member.seatNumber}
                    </span>

                    {/* Status Pip (Online / Absent Fine / Apology) */}
                    {isPenalized ? (
                      <span
                        title="Absent with KES 500 Fine Levied"
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center"
                      >
                        !
                      </span>
                    ) : member.isOnline ? (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    ) : null}

                    {/* Role badge */}
                    {member.role !== 'Member' && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[8px] uppercase tracking-wider">
                        {member.role === 'Chairman' ? 'Chair' : member.role === 'Treasurer' ? 'Treas' : 'Sec'}
                      </span>
                    )}
                  </div>

                  {/* Member Name caption */}
                  <span className="mt-1 text-[10px] sm:text-[11px] font-bold text-slate-300 text-center truncate max-w-[70px] drop-shadow-md">
                    {member.name.split(' ')[0]}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Reaction Tray below table */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 mt-6 backdrop-blur-md">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>React:</span>
            </span>
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                id={`reaction-${emoji}`}
                onClick={() => postReaction(currentUser.id, emoji)}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 flex items-center justify-center text-base hover:scale-125 transition-transform cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Extensible Slot / Plugin Architecture & Agenda (5 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Active Agenda Banner */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Chama Agenda Items</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {meeting.agenda.filter((a) => a.completed).length}/{meeting.agenda.length} Done
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {meeting.agenda.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleAgendaItem(item.id)}
                  className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition cursor-pointer ${
                    item.completed
                      ? 'bg-slate-950/40 text-slate-500 line-through'
                      : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-600 text-amber-500 focus:ring-amber-400"
                  />
                  <div className="flex-1">
                    <p className="leading-snug">{item.title}</p>
                    <span className="text-[10px] text-slate-500">{item.durationMin} mins</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add agenda item */}
            <div className="mt-3 flex gap-1.5">
              <input
                type="text"
                value={newAgendaTitle}
                onChange={(e) => setNewAgendaTitle(e.target.value)}
                placeholder="Add AOB or Discussion item..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                id="btn-add-agenda"
                onClick={() => {
                  if (!newAgendaTitle.trim()) return;
                  addAgendaItem(newAgendaTitle.trim(), 15);
                  setNewAgendaTitle('');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* EXTENSIBLE MEETING CANVAS (OPEN PLUGINS) */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Siku ya Chama Live Plugins</span>
            </h3>
            <button
              id="btn-mount-new-plugin"
              onClick={() => setShowAddPluginModal(true)}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Plug Widget</span>
            </button>
          </div>

          {/* Render Mounted Plugins */}
          <div className="space-y-4">
            {meeting.mountedPlugins.map((plugin) => {
              if (plugin.type === 'quick_poll') {
                const votesObj = (plugin.config?.votes as Record<string, number>) || {};
                const totalVotes: number = Object.values(votesObj).reduce(
                  (a: number, b: number) => a + Number(b || 0),
                  0
                );
                return (
                  <div
                    key={plugin.id}
                    id={`widget-${plugin.id}`}
                    className="p-4 rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-xl backdrop-blur-md relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Live Quorum Poll
                        </h4>
                      </div>
                      <button
                        onClick={() => unmountPlugin(plugin.id)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-medium text-slate-200 mb-3">
                      {plugin.config?.question}
                    </p>

                    <div className="space-y-2">
                      {plugin.config?.options.map((opt: string) => {
                        const count: number = Number(votesObj[opt] || 0);
                        const pct: number = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        return (
                          <button
                            key={opt}
                            onClick={() => voteInPoll(plugin.id, opt)}
                            className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 relative overflow-hidden transition cursor-pointer"
                          >
                            <div
                              className="absolute top-0 bottom-0 left-0 bg-amber-500/15"
                              style={{ width: `${pct}%` }}
                            />
                            <div className="relative flex items-center justify-between text-xs">
                              <span className="text-slate-200 font-medium">{opt}</span>
                              <span className="font-mono text-amber-300 font-bold">{pct}% ({count})</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (plugin.type === 'instant_tip') {
                const target = plugin.config?.targetAmount || 3000;
                const current = plugin.config?.currentAmount || 0;
                const pct = Math.min(100, Math.round((current / target) * 100));

                return (
                  <div
                    key={plugin.id}
                    id={`widget-${plugin.id}`}
                    className="p-4 rounded-3xl bg-slate-900/90 border border-emerald-500/20 shadow-xl backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Changa Meza (Instant Micro-Donations)
                        </h4>
                      </div>
                      <button
                        onClick={() => unmountPlugin(plugin.id)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-baseline justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Raised for Refreshments</span>
                      <span className="font-mono text-emerald-300 font-bold">
                        KES {current.toLocaleString()} / {target.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {[100, 200, 500].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => contributeInstantTip(plugin.id, amt)}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/40 text-emerald-300 font-bold text-xs cursor-pointer transition"
                        >
                          +KES {amt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              if (plugin.type === 'speaker_floor') {
                return (
                  <div
                    key={plugin.id}
                    className="p-4 rounded-3xl bg-slate-900/90 border border-indigo-500/20 shadow-xl backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Kiti cha Msemaji (Speaker Floor)
                        </h4>
                      </div>
                      <button
                        onClick={() => unmountPlugin(plugin.id)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-300">
                      Floor held by: <strong className="text-amber-300">{meeting.activeSpeakerId ? members.find((m) => m.id === meeting.activeSpeakerId)?.name : 'Open Floor (Chair Arbiter)'}</strong>
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        onClick={() => setSpeaker(currentUser.id)}
                        className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Claim Speaker Floor
                      </button>
                      <button
                        onClick={() => setSpeaker(null)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Yield
                      </button>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>

      {/* PRE-MEETING MODAL (Step 1: Katiba -> Step 2: Agenda -> Step 3: Lengo Kuu -> Step 4: Roll Call) */}
      {showPreMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white">Maandalizi ya Mezani (Pre-Meeting Flow)</h2>
              </div>
              <button
                onClick={() => setShowPreMeetingModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Navigation */}
            <div className="grid grid-cols-4 gap-2 my-4">
              {[
                { step: 1, label: 'Katiba & Terms' },
                { step: 2, label: 'Agenda Items' },
                { step: 3, label: 'Lengo Kuu' },
                { step: 4, label: 'Roll Call' },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setWizardStep(s.step)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition ${
                    meeting.wizardStep === s.step
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="block text-[10px] opacity-75">Step {s.step}</span>
                  <span className="truncate block">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Step 1: Katiba & Rules */}
            {meeting.wizardStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <h4 className="text-sm font-bold text-amber-300">Chama Katiba (Constitution v2026)</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                    <li><strong>Share Contribution:</strong> KES {cycle.shareAmount.toLocaleString()} per round per member.</li>
                    <li><strong>Late / Missed Meeting Fine:</strong> Unexcused absence incurs an automatic <span className="text-rose-400 font-bold">KES {cycle.fineAmount}</span> disciplinary fine added directly to member's debit ledger.</li>
                    <li><strong>Rotational Pot Payout:</strong> KES {(cycle.shareAmount * cycle.totalRounds).toLocaleString()} distributed to designated recipient or stepped candidate.</li>
                    <li><strong>Okolea Mutual Aid:</strong> 5% allocation for emergency distress situations, requiring 7/12 quorum approval.</li>
                    <li><strong>Loans Subsystem:</strong> Maximum 3 months reducing balance interest at 5% per month, backed by logbooks or two seated member guarantors.</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-300">Katiba Verified by Executive Scribe</span>
                  </div>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    Proceed to Agenda →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Agenda Items */}
            {meeting.wizardStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Review and approve today's meeting agenda. Items will be displayed in real time on the Mezani canvas.
                </p>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {meeting.agenda.map((ag) => (
                    <div
                      key={ag.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="font-semibold text-slate-200">{ag.title}</span>
                      </div>
                      <span className="text-slate-400 font-mono">{ag.durationMin} mins</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Next: Set Lengo Kuu →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Lengo Kuu (Mission/Vibe) */}
            {meeting.wizardStep === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Define the central purpose, thematic focus, and collective spirit of today's meeting.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Lengo Kuu (Theme & Mission)
                  </label>
                  <textarea
                    rows={3}
                    value={newVibeInput}
                    onChange={(e) => setNewVibeInput(e.target.value)}
                    placeholder="e.g. Harambee ya Biashara 2026: Zero Defaults & Wealth Building"
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setMissionVibe(newVibeInput);
                      setWizardStep(4);
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Next: Interactive Roll Call →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Interactive Roll Call & Auto-Penalty */}
            {meeting.wizardStep === 4 && (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <p className="font-semibold">Attendance & Penalty Engine:</p>
                  <p className="text-[11px] text-amber-300/80">
                    Tagging a member as "Absent" automatically logs a KES {cycle.fineAmount} fine into their ledger and increases their pending penalty balance.
                  </p>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {members.map((m) => {
                    const record = meeting.attendance[m.id];
                    const status: AttendanceStatus = record?.status || 'present';

                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-slate-200">{m.name}</p>
                            <span className="text-[10px] text-slate-400">Seat #{m.seatNumber} • {m.role}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Present button */}
                          <button
                            onClick={() => recordAttendance(m.id, 'present')}
                            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                              status === 'present'
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            Nipo (Present)
                          </button>

                          {/* Apology button */}
                          <button
                            onClick={() => recordAttendance(m.id, 'apology', 'Sent advance notice')}
                            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                              status === 'apology'
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            Udhuru (Apology)
                          </button>

                          {/* Absent button */}
                          <button
                            onClick={() => recordAttendance(m.id, 'absent_penalized')}
                            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                              status === 'absent_penalized'
                                ? 'bg-rose-600 text-white font-bold animate-pulse'
                                : 'bg-slate-800 text-slate-400 hover:text-rose-300'
                            }`}
                          >
                            Absent (-KES {cycle.fineAmount})
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setShowPreMeetingModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    Confirm & Enter Mezani Table →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLUG WIDGET MODAL */}
      {showAddPluginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Mount Widget onto Siku ya Chama
              </h3>
              <button
                onClick={() => setShowAddPluginModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 my-4">
              <div
                onClick={() => handleAddPlugin('instant_tip')}
                className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 cursor-pointer transition flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Changa Meza (Instant Tip Jar)</h4>
                  <p className="text-[11px] text-slate-400">Micro-fund for chai, venue, or instant collective gifts</p>
                </div>
              </div>

              <div
                onClick={() => handleAddPlugin('speaker_floor')}
                className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 cursor-pointer transition flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Kiti cha Msemaji (Speaker Floor Timer)</h4>
                  <p className="text-[11px] text-slate-400">Timed turns for democratic speeches and deliberations</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <BarChart3 className="w-4 h-4" />
                  <span>Custom Instant Quorum Poll</span>
                </div>
                <input
                  type="text"
                  value={customPollQuestion}
                  onChange={(e) => setCustomPollQuestion(e.target.value)}
                  placeholder="Poll question e.g. Approve emergency fund top-up?"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
                <button
                  onClick={() => handleAddPlugin('quick_poll')}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Create Live Poll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
