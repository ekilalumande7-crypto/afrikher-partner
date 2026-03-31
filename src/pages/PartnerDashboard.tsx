import React, { useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/lib/supabase';
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
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function PartnerDashboard() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    contenus: 0,
    contenusPublies: 0,
    produits: 0,
    produitsActifs: 0,
    revenusTotal: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStats();
    fetchActivities();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    try {
      // Fetch submissions count
      const { count: totalSubmissions } = await supabase
        .from('partner_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', user.id);

      const { count: publishedSubmissions } = await supabase
        .from('partner_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', user.id)
        .eq('status', 'published');

      // Fetch products count
      const { count: totalProducts } = await supabase
        .from('partner_products')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', user.id);

      const { count: activeProducts } = await supabase
        .from('partner_products')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', user.id)
        .in('status', ['approved', 'active']);

      // Fetch earnings
      const { data: earningsData } = await supabase
        .from('partner_earnings')
        .select('net_amount')
        .eq('partner_id', user.id);

      const totalEarnings = earningsData?.reduce((sum: number, e: any) => sum + (e.net_amount || 0), 0) || 0;

      setStats({
        contenus: totalSubmissions || 0,
        contenusPublies: publishedSubmissions || 0,
        produits: totalProducts || 0,
        produitsActifs: activeProducts || 0,
        revenusTotal: totalEarnings,
      });
    } catch (err) {
      console.error('Stats error:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchActivities = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        setActivities(data.map((n: any) => ({
          id: n.id,
          type: n.type || 'system',
          title: n.title || n.body || 'Notification',
          date: new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
          read: n.read,
        })));
      }
    } catch {}
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const statCards = [
    { label: 'Contenus', value: String(stats.contenus), sub: `${stats.contenusPublies} publies`, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Produits', value: String(stats.produits), sub: `${stats.produitsActifs} actifs`, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Revenus', value: formatCurrency(stats.revenusTotal), sub: 'Total cumule', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Profil', value: profile?.bio ? '100%' : '50%', sub: profile?.bio ? 'Complet' : 'A completer', icon: CheckCircle, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content': return { icon: FileText, color: 'text-blue-500' };
      case 'order': return { icon: ShoppingBag, color: 'text-brand-gold' };
      case 'validation': return { icon: CheckCircle, color: 'text-green-500' };
      case 'rejection': return { icon: AlertCircle, color: 'text-red-500' };
      default: return { icon: Clock, color: 'text-gray-500' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">
            Bienvenue, {profile?.full_name || 'Partenaire'}
          </h1>
          <p className="text-brand-black/40">
            Espace Partenaire AFRIKHER — Votre tableau de bord.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-full text-xs font-bold uppercase tracking-widest border border-brand-gold/20">
            Partenaire Valide
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
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
            <p className="text-3xl font-serif font-bold mb-1">
              {loadingStats ? '...' : stat.value}
            </p>
            <p className="text-xs text-brand-black/60">{loadingStats ? '' : stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">Activite Recente</h2>
          </div>

          <div className="premium-card rounded-2xl overflow-hidden">
            {activities.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-10 h-10 text-brand-black/10 mx-auto mb-4" />
                <p className="text-sm text-brand-black/40">Aucune activite recente.</p>
                <p className="text-xs text-brand-black/30 mt-1">Soumettez du contenu ou ajoutez des produits pour commencer.</p>
              </div>
            ) : (
              activities.map((activity, i) => {
                const { icon: Icon, color } = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className={cn(
                    "p-6 flex items-center gap-4 hover:bg-brand-cream/30 transition-colors",
                    i !== activities.length - 1 && "border-b border-brand-gold/10"
                  )}>
                    <div className={cn("p-2 rounded-full", color.replace('text', 'bg') + '/10')}>
                      <Icon className={cn("w-5 h-5", color)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-brand-black/40">{activity.date}</p>
                    </div>
                    {!activity.read && (
                      <div className="w-2 h-2 rounded-full bg-brand-gold" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/partner/contenus/nouveau" className="p-6 bg-brand-black text-white rounded-2xl flex flex-col items-center gap-3 hover:bg-brand-black/90 transition-all group">
              <Plus className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Soumettre Contenu</span>
            </Link>
            <Link to="/partner/boutique/produits" className="p-6 bg-white border border-brand-gold/20 rounded-2xl flex flex-col items-center gap-3 hover:border-brand-gold transition-all group">
              <ShoppingBag className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Mes Produits</span>
            </Link>
            <Link to="/partner/boutique/revenus" className="p-6 bg-white border border-brand-gold/20 rounded-2xl flex flex-col items-center gap-3 hover:border-brand-gold transition-all group">
              <TrendingUp className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Mes Revenus</span>
            </Link>
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
            <h3 className="text-xl font-serif font-bold mb-1">{profile?.full_name || 'Partenaire'}</h3>
            <p className="text-sm text-brand-black/40 mb-6">{profile?.company_name || ''}</p>

            <div className="space-y-4 text-left">
              <Link to="/partner/profil" className="w-full py-3 border border-brand-gold/30 text-brand-gold rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all block text-center">
                Modifier le profil
              </Link>
            </div>
          </div>

          <div className="bg-brand-black p-8 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-serif font-bold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-white/60 mb-6">Notre equipe support est la pour vous accompagner.</p>
              <Link to="/partner/support" className="px-6 py-3 bg-brand-gold text-brand-black rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all inline-block">
                Contacter Support
              </Link>
            </div>
            <LifeBuoy className="w-32 h-32 absolute -bottom-8 -right-8 text-white/5 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
