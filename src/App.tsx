import React from 'react';
import { useChamaStore } from './store/useChamaStore';
import { Navbar } from './components/Navbar';
import { MezaniTable } from './components/MezaniTable';
import { ContributionVault } from './components/ContributionVault';
import { MyAccount } from './components/MyAccount';
import { OkoleaPool } from './components/OkoleaPool';
import { CycleDissolution } from './components/CycleDissolution';
import { OfflineIndicator } from './components/PWAInstallButton';

export default function App() {
  const { activeView } = useChamaStore();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Gamified Lobby Navigation */}
      <Navbar />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {activeView === 'mezani' && <MezaniTable />}
        {activeView === 'vault_payout' && <ContributionVault />}
        {activeView === 'my_acc' && <MyAccount />}
        {activeView === 'okolea' && <OkoleaPool />}
        {activeView === 'dissolution' && <CycleDissolution />}
      </main>

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Subtle Footer */}
      <footer className="w-full border-t border-slate-900 bg-[#05070a] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            MGR (Merry-Go-Round Engine) • Ushirika Bora Chama • PWA v2.4
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Provably Fair RNG</span>
            <span>•</span>
            <span>ACID Ledger</span>
            <span>•</span>
            <span>Offline-First Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
