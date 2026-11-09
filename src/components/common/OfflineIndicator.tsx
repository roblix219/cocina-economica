import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-stone-900/95 border border-amber-500/40 text-amber-300 px-3.5 py-2 text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2">
      <div className="relative flex items-center justify-center">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 animate-ping" />
      </div>
      <div className="flex flex-col">
        <span>Sin conexión a internet</span>
        <span className="text-[10px] text-stone-400 font-normal flex items-center gap-1">
          <Database className="w-3 h-3 text-stone-500 inline" />
          Guardando en memoria local (PWA Offline)
        </span>
      </div>
    </div>
  );
};
