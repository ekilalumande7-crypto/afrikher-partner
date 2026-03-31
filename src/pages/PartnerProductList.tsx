import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { PartnerProduct } from '@/src/types/partner';
import { useAuth } from '@/src/context/AuthContext';
import { Plus, Search, Grid, List as ListIcon, MoreVertical, Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, cn } from '@/src/lib/utils';

export function PartnerProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState<PartnerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('partner_products')
        .select('*')
        .eq('partner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending_approval: 'bg-blue-50 text-blue-600 border-blue-100',
      approved: 'bg-green-50 text-green-600 border-green-100',
      rejected: 'bg-red-50 text-red-600 border-red-100',
    };
    const labels: Record<string, string> = {
      pending_approval: 'En attente',
      approved: 'Actif',
      rejected: 'Refusé',
    };
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Ma Boutique</h1>
          <p className="text-brand-black/40">Gérez vos produits et créations artisanales en vente sur AFRIKHER.</p>
        </div>
        <Link 
          to="/partner/boutique/produits/nouveau"
          className="px-6 py-3 bg-brand-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-brand-black/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Ajouter un Produit
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/40" />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-brand-gold/10 rounded-lg text-sm focus:ring-1 focus:ring-brand-gold/50"
          />
        </div>
        <div className="flex bg-white rounded-lg border border-brand-gold/10 p-1">
          <button className="p-2 bg-brand-gold/10 text-brand-gold rounded-md"><Grid className="w-4 h-4" /></button>
          <button className="p-2 text-brand-black/40 hover:text-brand-black"><ListIcon className="w-4 h-4" /></button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="premium-card h-80 rounded-2xl animate-pulse bg-white/50"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="premium-card p-20 rounded-2xl text-center">
          <Package className="w-16 h-16 text-brand-gold/20 mx-auto mb-6" />
          <h3 className="text-xl font-serif font-bold mb-2">Aucun produit en vente</h3>
          <p className="text-brand-black/40 mb-8 max-w-sm mx-auto">
            Commencez à vendre vos créations dès maintenant en ajoutant votre premier produit.
          </p>
          <Link 
            to="/partner/boutique/produits/nouveau"
            className="inline-block px-8 py-3 bg-brand-gold text-brand-black rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Ajouter mon premier produit
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="premium-card rounded-2xl overflow-hidden group">
              <div className="relative aspect-square overflow-hidden bg-brand-cream">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-brand-gold/20" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(product.status)}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif font-bold text-lg truncate flex-1">{product.name}</h3>
                  <button className="p-1 hover:bg-brand-cream rounded-full"><MoreVertical className="w-4 h-4 text-brand-black/40" /></button>
                </div>
                <p className="text-xs text-brand-black/40 mb-4 uppercase tracking-widest font-bold">{product.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-brand-gold">{formatCurrency(product.price)}</span>
                  <span className="text-[10px] text-brand-black/40">Stock: {product.unlimited_stock ? '∞' : product.stock}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-gold/10 flex gap-2">
                  <button className="flex-1 py-2 bg-brand-black text-white rounded-lg text-xs font-bold hover:bg-brand-black/90 transition-all">Modifier</button>
                  <button className="p-2 border border-brand-gold/20 rounded-lg text-brand-gold hover:bg-brand-gold/10 transition-all"><ExternalLink className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
