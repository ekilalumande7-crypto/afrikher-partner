import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';

export function Topbar() {
  const { profile } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-bottom border-brand-gold/10 sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 hover:bg-brand-cream rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/40" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-10 pr-4 py-2 bg-brand-cream/50 border-none rounded-full text-sm focus:ring-1 focus:ring-brand-gold/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 hover:bg-brand-cream rounded-full transition-all group">
          <Bell className="w-5 h-5 text-brand-black/60 group-hover:text-brand-gold" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-brand-gold/20"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-brand-black">{profile?.full_name}</p>
            <p className="text-[10px] uppercase tracking-wider text-brand-gold font-semibold">Partenaire</p>
          </div>
        </div>
      </div>
    </header>
  );
}
