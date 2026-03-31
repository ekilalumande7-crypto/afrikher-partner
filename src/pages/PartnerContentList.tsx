import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { PartnerSubmission } from '@/src/types/partner';
import { useAuth } from '@/src/context/AuthContext';
import { Plus, Search, Filter, Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function PartnerContentList() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<PartnerSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchSubmissions();
  }, [user]);

  async function fetchSubmissions() {
    try {
      const { data, error } = await supabase
        .from('partner_submissions')
        .select('*')
        .eq('partner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-blue-50 text-blue-600 border-blue-100',
      reviewing: 'bg-amber-50 text-amber-600 border-amber-100',
      published: 'bg-green-50 text-green-600 border-green-100',
      rejected: 'bg-red-50 text-red-600 border-red-100',
    };
    const labels: Record<string, string> = {
      pending: 'En attente',
      reviewing: 'En révision',
      published: 'Publié',
      rejected: 'Refusé',
    };
    return (
      <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Mes Contenus</h1>
          <p className="text-brand-black/40">Gérez vos articles, interviews et dossiers soumis à AFRIKHER.</p>
        </div>
        <Link 
          to="/partner/contenus/nouveau"
          className="px-6 py-3 bg-brand-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-brand-black/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau Contenu
        </Link>
      </div>

      <div className="premium-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-brand-gold/10 flex flex-col sm:flex-row gap-4 justify-between bg-white">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/40" />
            <input 
              type="text" 
              placeholder="Rechercher un titre..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-cream/30 border-none rounded-lg text-sm focus:ring-1 focus:ring-brand-gold/50"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-brand-cream/50 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Filtrer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-cream/30 text-[10px] uppercase tracking-widest font-bold text-brand-black/40">
              <tr>
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date de soumission</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gold/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-black/40">Chargement...</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-black/40">Aucun contenu soumis pour le moment.</td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-brand-cream/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-brand-gold/10 flex-shrink-0 overflow-hidden">
                          {sub.cover_image && <img src={sub.cover_image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-medium text-sm truncate max-w-[200px]">{sub.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs capitalize text-brand-black/60">{sub.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-brand-black/40">
                        {format(new Date(sub.created_at), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/partner/contenus/${sub.id}`} className="p-2 hover:bg-brand-gold/10 rounded-lg text-brand-black/40 hover:text-brand-gold transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {(sub.status === 'pending' || sub.status === 'rejected') && (
                          <button className="p-2 hover:bg-brand-gold/10 rounded-lg text-brand-black/40 hover:text-brand-gold transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {sub.status === 'pending' && (
                          <button className="p-2 hover:bg-red-50 rounded-lg text-brand-black/40 hover:text-red-500 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
