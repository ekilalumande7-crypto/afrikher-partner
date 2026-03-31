import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/src/lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export function PartnerLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      navigate('/partner/dashboard');
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold tracking-widest text-brand-black mb-4">AFRIKHER</h1>
          <p className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold">Espace Partenaire</p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-xl border border-brand-gold/10">
          <h2 className="text-2xl font-serif font-bold mb-8 text-center">Connexion</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-brand-black/60">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" />
                <input 
                  {...register('email')}
                  className="w-full pl-12 pr-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs uppercase tracking-widest font-bold text-brand-black/60">Mot de passe</label>
                <Link to="/partner/forgot-password" size="sm" className="text-xs text-brand-gold hover:underline">Oublié ?</Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" />
                <input 
                  type="password"
                  {...register('password')}
                  className="w-full pl-12 pr-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-black text-white rounded-xl font-bold flex items-center justify-center gap-2 group hover:bg-brand-black/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-brand-gold/10 text-center">
            <p className="text-sm text-brand-black/40">
              Pas encore partenaire ? <br />
              <Link to="/partner/register" className="text-brand-gold font-bold hover:underline mt-2 inline-block">Devenir partenaire AFRIKHER</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
