import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  User,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Bell,
  PenTool,
  Package,
  DollarSign,
  Send,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/partner/dashboard' },
  {
    icon: FileText,
    label: 'Mes Contenus',
    path: '/partner/contenus',
    subItems: [
      { label: 'Interviews & Articles', path: '/partner/contenus' },
      { label: 'Soumettre un contenu', path: '/partner/contenus/nouveau' },
    ]
  },
  {
    icon: ShoppingBag,
    label: 'Ma Boutique',
    path: '/partner/boutique',
    subItems: [
      { label: 'Mes Produits', path: '/partner/boutique/produits' },
      { label: 'Mes Commandes', path: '/partner/boutique/commandes' },
      { label: 'Mes Revenus', path: '/partner/boutique/revenus' },
    ]
  },
  { icon: Bell, label: 'Notifications', path: '/partner/notifications' },
  { icon: User, label: 'Mon Profil', path: '/partner/profil' },
  { icon: LifeBuoy, label: 'Support', path: '/partner/support' },
];

export function Sidebar() {
  const { signOut, profile } = useAuth();

  return (
    <aside className="w-72 h-screen bg-brand-black text-white flex flex-col sticky top-0 overflow-y-auto border-r border-white/10">
      <div className="p-8">
        <h1 className="text-2xl font-serif font-bold tracking-widest text-brand-gold">AFRIKHER</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">Portail Partenaire</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <div key={item.path} className="space-y-1">
            <NavLink
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive ? "bg-brand-gold text-brand-black" : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.subItems && <ChevronRight className="w-4 h-4 ml-auto opacity-40 group-hover:opacity-100" />}
            </NavLink>
            
            {/* Sub-items could be rendered here if needed, but for now we keep it simple */}
          </div>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/10">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-brand-gold" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name}</p>
            <p className="text-xs text-white/40 truncate">{profile?.role}</p>
          </div>
        </div>
        
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
