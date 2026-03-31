import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { 
  FileText, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  ArrowRight,
  User,
  LifeBuoy
} from 'lucide-react';
import { formatCurrency, cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export function PartnerDashboard() {
  const { profile } = useAuth();

  const stats = [
    { label: 'Contenus', value: '12', sub: '8 publiés', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Produits', value: '24', sub: '18 actifs', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Ventes (Mois)', value: formatCurrency(1250), sub: '+12% vs fév', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Profil', value: '85%', sub: 'Presque complet', icon: CheckCircle, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
  ];

  const activities = [
    { id: 1, type: 'publish', title: 'Votre article "L\'AgriTech au Sénégal" a été publié', date: 'Il y a 2h', icon: CheckCircle, color: 'text-green-500' },
    { id: 2, type: 'order', title: 'Nouvelle commande pour "Panier Bio Premium"', date: 'Il y a 5h', icon: ShoppingBag, color: 'text-brand-gold' },
    { id: 3, type: 'review', title: 'Votre produit "Huile de Baobab" est en révision', date: 'Hier', icon: Clock, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Bienvenue, {profile?.full_name}</h1>
          <p className="text-brand-black/40">Espace Partenaire AFRIKHER — Votre tableau de bord pour aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-full text-xs font-bold uppercase tracking-widest border border-brand-gold/20">
            Partenaire Validé
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 rounded-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
            <h3 className="text-brand-black/40 text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</h3>
            <p className="text-3xl font-serif font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-brand-black/60">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">Activité Récente</h2>
            <button className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:underline">Voir tout</button>
          </div>
          
          <div className="premium-card rounded-2xl overflow-hidden">
            {activities.map((activity, i) => (
              <div key={activity.id} className={cn(
                "p-6 flex items-center gap-4 hover:bg-brand-cream/30 transition-colors",
                i !== activities.length - 1 && "border-b border-brand-gold/10"
              )}>
                <div className={cn("p-2 rounded-full", activity.color.replace('text', 'bg') + '/10')}>
                  <activity.icon className={cn("w-5 h-5", activity.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-brand-black/40">{activity.date}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-black/20" />
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-6 bg-brand-black text-white rounded-2xl flex flex-col items-center gap-3 hover:bg-brand-black/90 transition-all group">
              <Plus className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Soumettre Contenu</span>
            </button>
            <button className="p-6 bg-white border border-brand-gold/20 rounded-2xl flex flex-col items-center gap-3 hover:border-brand-gold transition-all group">
              <ShoppingBag className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Ajouter Produit</span>
            </button>
            <button className="p-6 bg-white border border-brand-gold/20 rounded-2xl flex flex-col items-center gap-3 hover:border-brand-gold transition-all group">
              <TrendingUp className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Voir mes Ventes</span>
            </button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold">Votre Profil</h2>
          <div className="premium-card p-8 rounded-2xl text-center">
            <div className="w-24 h-24 rounded-full bg-brand-gold/10 mx-auto mb-6 flex items-center justify-center border-2 border-brand-gold/20 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-brand-gold" />
              )}
            </div>
            <h3 className="text-xl font-serif font-bold mb-1">{profile?.full_name}</h3>
            <p className="text-sm text-brand-black/40 mb-6">{profile?.company_name}</p>
            
            <div className="space-y-4 text-left">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span>Complétion</span>
                  <span>85%</span>
                </div>
                <div className="h-2 bg-brand-cream rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gold w-[85%]"></div>
                </div>
              </div>
              <p className="text-xs text-brand-black/60 leading-relaxed">
                Complétez votre bio et ajoutez vos réseaux sociaux pour augmenter votre visibilité.
              </p>
              <button className="w-full py-3 border border-brand-gold/30 text-brand-gold rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all">
                Modifier le profil
              </button>
            </div>
          </div>

          <div className="bg-brand-black p-8 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-serif font-bold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-white/60 mb-6">Notre équipe support est là pour vous accompagner.</p>
              <button className="px-6 py-3 bg-brand-gold text-brand-black rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                Contacter Support
              </button>
            </div>
            <LifeBuoy className="w-32 h-32 absolute -bottom-8 -right-8 text-white/5 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
