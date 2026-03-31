import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { PartnerEarning } from '@/src/types/partner';
import { useAuth } from '@/src/context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  CreditCard,
  Download
} from 'lucide-react';
import { formatCurrency, cn } from '@/src/lib/utils';

const data = [
  { month: 'Jan', amount: 1200 },
  { month: 'Fév', amount: 1900 },
  { month: 'Mar', amount: 1500 },
  { month: 'Avr', amount: 2100 },
  { month: 'Mai', amount: 2800 },
  { month: 'Juin', amount: 2400 },
];

export function PartnerEarnings() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<PartnerEarning[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2">Mes Revenus</h1>
        <p className="text-brand-black/40">Suivez vos ventes, commissions et demandez vos paiements.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-8 rounded-2xl bg-brand-black text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">Total gagné (à vie)</p>
            <h2 className="text-4xl font-serif font-bold mb-4">{formatCurrency(12450.80)}</h2>
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+15% ce mois-ci</span>
            </div>
          </div>
          <Wallet className="w-32 h-32 absolute -bottom-8 -right-8 text-white/5 rotate-12" />
        </div>

        <div className="premium-card p-8 rounded-2xl">
          <p className="text-brand-black/40 text-xs uppercase tracking-widest font-bold mb-2">En attente de paiement</p>
          <h2 className="text-4xl font-serif font-bold mb-4 text-brand-gold">{formatCurrency(850.50)}</h2>
          <button className="w-full py-3 bg-brand-gold text-brand-black rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
            Demander un virement
          </button>
        </div>

        <div className="premium-card p-8 rounded-2xl">
          <p className="text-brand-black/40 text-xs uppercase tracking-widest font-bold mb-2">Commission AFRIKHER</p>
          <h2 className="text-4xl font-serif font-bold mb-4">15%</h2>
          <p className="text-xs text-brand-black/60 leading-relaxed">
            Taux standard appliqué sur chaque vente pour la maintenance et la promotion de la plateforme.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card p-8 rounded-2xl h-[400px]">
            <h3 className="text-xl font-serif font-bold mb-8">Évolution des revenus (6 mois)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F0E8" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#0A0A0A', opacity: 0.4 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#0A0A0A', opacity: 0.4 }}
                  tickFormatter={(value) => `${value}€`}
                />
                <Tooltip 
                  cursor={{ fill: '#F5F0E8' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#C9A84C' : '#0A0A0A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="premium-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-brand-gold/10 flex justify-between items-center bg-white">
              <h3 className="font-serif font-bold text-lg">Historique des transactions</h3>
              <button className="p-2 hover:bg-brand-cream rounded-lg text-brand-black/40 hover:text-brand-black transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-brand-cream/30 text-[10px] uppercase tracking-widest font-bold text-brand-black/40">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Montant Brut</th>
                    <th className="px-6 py-4">Net</th>
                    <th className="px-6 py-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/10">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-brand-cream/10 transition-colors">
                      <td className="px-6 py-4 text-xs text-brand-black/40">12 Mars 2026</td>
                      <td className="px-6 py-4 text-sm font-medium">Vente: Panier Bio Premium</td>
                      <td className="px-6 py-4 text-sm text-brand-black/60">{formatCurrency(45.00)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-brand-gold">{formatCurrency(38.25)}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                          <CheckCircle2 className="w-3 h-3" />
                          Payé
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <h3 className="text-2xl font-serif font-bold">Méthode de paiement</h3>
          <div className="premium-card p-8 rounded-2xl space-y-6">
            <div className="p-4 bg-brand-cream rounded-xl border border-brand-gold/20 flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg">
                <CreditCard className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <p className="text-sm font-bold">Virement Bancaire (IBAN)</p>
                <p className="text-xs text-brand-black/40">FR76 **** **** 1234</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
            </div>

            <div className="p-4 border border-brand-black/5 rounded-xl flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-brand-cream rounded-lg">
                <Wallet className="w-6 h-6 text-brand-black/40" />
              </div>
              <div>
                <p className="text-sm font-bold">Mobile Money (FIDEPAY)</p>
                <p className="text-xs text-brand-black/40">Non configuré</p>
              </div>
            </div>

            <button className="w-full py-4 border border-brand-black/10 text-brand-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-black hover:text-white transition-all">
              Modifier les informations
            </button>
          </div>

          <div className="bg-brand-gold p-8 rounded-2xl text-brand-black">
            <h4 className="font-serif font-bold text-lg mb-2">Prochain virement</h4>
            <p className="text-sm mb-4 opacity-80">Les virements sont effectués automatiquement tous les 1er du mois si le solde dépasse 50€.</p>
            <div className="flex items-center gap-2 font-bold">
              <Clock className="w-5 h-5" />
              <span>Prévu pour le 1er Avril</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
