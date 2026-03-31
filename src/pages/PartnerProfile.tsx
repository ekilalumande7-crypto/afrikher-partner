import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/src/context/AuthContext';
import { User, Camera, Shield, Globe, Linkedin, Mail, Phone } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().min(2),
  website: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(300),
  country: z.string(),
});

export function PartnerProfile() {
  const { profile } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: profile?.full_name || '',
      companyName: profile?.company_name || '',
      website: profile?.website || '',
      linkedinUrl: profile?.linkedin_url || '',
      bio: profile?.bio || '',
      country: profile?.country || '',
    }
  });

  const onSubmit = (data: any) => {
    console.log('Update profile:', data);
    alert('Profil mis à jour (simulation)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-brand-gold/10 border-2 border-brand-gold/20 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-brand-gold" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-brand-black text-white rounded-full shadow-lg hover:bg-brand-gold transition-all">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-serif font-bold mb-2">{profile?.full_name}</h1>
          <p className="text-brand-gold uppercase tracking-widest text-xs font-bold mb-4">{profile?.company_name}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="px-4 py-1.5 bg-white border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ID: {profile?.id.slice(0, 8)}
            </span>
            <span className="px-4 py-1.5 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-widest">
              Rôle: {profile?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="premium-card p-8 rounded-2xl space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-brand-black/40">Nom Complet</label>
                <input 
                  {...register('fullName')}
                  className="w-full px-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-brand-black/40">Entreprise</label>
                <input 
                  {...register('companyName')}
                  className="w-full px-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-brand-black/40">Pays</label>
                <input 
                  {...register('country')}
                  className="w-full px-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-brand-black/40">Bio (300 chars)</label>
                <textarea 
                  {...register('bio')}
                  rows={4}
                  className="w-full px-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-brand-gold/10">
              <button type="submit" className="px-8 py-4 bg-brand-black text-white rounded-xl font-bold hover:bg-brand-black/90 transition-all">
                Enregistrer les modifications
              </button>
            </div>
          </form>

          <div className="premium-card p-8 rounded-2xl space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Liens & Réseaux</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-brand-gold" />
                <input 
                  {...register('website')}
                  className="flex-1 px-4 py-3 bg-brand-cream/30 border border-brand-black/5 rounded-xl text-sm outline-none"
                  placeholder="Website URL"
                />
              </div>
              <div className="flex items-center gap-4">
                <Linkedin className="w-5 h-5 text-brand-gold" />
                <input 
                  {...register('linkedinUrl')}
                  className="flex-1 px-4 py-3 bg-brand-cream/30 border border-brand-black/5 rounded-xl text-sm outline-none"
                  placeholder="LinkedIn URL"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="premium-card p-8 rounded-2xl space-y-6">
            <h3 className="text-xl font-serif font-bold mb-4">Sécurité</h3>
            <div className="space-y-4">
              <button className="w-full py-4 bg-brand-cream text-brand-black rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-white transition-all">
                <Shield className="w-4 h-4" />
                Changer le mot de passe
              </button>
              <button className="w-full py-4 border border-red-100 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all">
                Supprimer le compte
              </button>
            </div>
          </div>

          <div className="bg-brand-black p-8 rounded-2xl text-white">
            <h3 className="text-xl font-serif font-bold mb-4">Statut Partenaire</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Inscrit le</span>
                <span>12 Jan 2026</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Dernière connexion</span>
                <span>Aujourd'hui</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-brand-gold leading-relaxed">
                  Votre profil est actuellement public. Les visiteurs peuvent voir votre bio et vos contributions sur la plateforme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
