import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const step1Schema = z.object({
  fullName: z.string().min(2, 'Nom complet requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
});

const step2Schema = z.object({
  companyName: z.string().min(2, 'Nom de l\'entreprise requis'),
  sector: z.string().min(1, 'Secteur requis'),
  website: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(300, '300 caractères maximum'),
  country: z.string().min(1, 'Pays requis'),
});

const step3Schema = z.object({
  collaborationTypes: z.array(z.string()).min(1, 'Choisissez au moins un type'),
  motivation: z.string().max(500, '500 caractères maximum'),
});

export function PartnerRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const form1 = useForm({ resolver: zodResolver(step1Schema) });
  const form2 = useForm({ resolver: zodResolver(step2Schema) });
  const form3 = useForm({ resolver: zodResolver(step3Schema) });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) isValid = await form1.trigger();
    if (step === 2) isValid = await form2.trigger();
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async () => {
    const isValid = await form3.trigger();
    if (!isValid) return;

    setLoading(true);
    try {
      const data1 = form1.getValues();
      const data2 = form2.getValues();
      const data3 = form3.getValues();

      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data1.email,
        password: data1.password,
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('User creation failed');

      // 2. Create profile with role='pending_partner'
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: data1.fullName,
        role: 'pending_partner',
        created_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      // 3. Create partners table entry with status='pending'
      const { error: partnerError } = await supabase.from('partners').insert({
        id: authData.user.id,
        company_name: data2.companyName,
        sector: data2.sector,
        website: data2.website || null,
        linkedin: data2.linkedinUrl || null,
        bio: data2.bio || null,
        country: data2.country,
        collaboration_types: data3.collaborationTypes,
        motivation: data3.motivation,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      if (partnerError) throw partnerError;

      // 4. Send notification to admin
      await supabase.from('notifications').insert({
        user_id: 'admin-system', // Admin system user
        title: 'Nouvelle demande partenaire',
        body: `${data1.fullName} (${data2.companyName}) - ${data2.sector}`,
        type: 'new_partner',
        read: false,
        data: {
          partner_id: authData.user.id,
          company_name: data2.companyName,
          sector: data2.sector,
        },
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-2xl shadow-xl text-center border border-brand-gold/20"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Demande reçue</h2>
          <p className="text-brand-black/60 mb-8 leading-relaxed">
            Merci pour votre intérêt. Votre demande est en cours de révision par notre équipe éditoriale. 
            Vous recevrez une réponse sous 48h.
          </p>
          <Link 
            to="/partner/login" 
            className="inline-block w-full py-4 bg-brand-black text-white rounded-xl font-medium hover:bg-brand-black/90 transition-all"
          >
            Retour à la connexion
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col lg:flex-row">
      {/* Left Side - Brand/Image */}
      <div className="lg:w-1/3 bg-brand-black p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-serif font-bold tracking-widest text-brand-gold mb-4">AFRIKHER</h1>
          <p className="text-brand-gold/60 uppercase tracking-[0.3em] text-xs font-semibold">Devenir Partenaire</p>
        </div>
        
        <div className="relative z-10">
          <blockquote className="text-2xl font-serif italic leading-relaxed mb-6">
            "Rejoignez une communauté d'entrepreneurs et de créatifs qui redéfinissent l'excellence africaine."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-brand-gold"></div>
            <span className="text-sm uppercase tracking-widest text-brand-gold">L'invitation exclusive</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 p-8 lg:p-24 flex items-center justify-center">
        <div className="max-w-xl w-full">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500",
                    step >= s ? "bg-brand-gold text-brand-black" : "bg-white text-brand-black/20 border border-brand-black/5"
                  )}>
                    {s}
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase tracking-widest font-bold",
                    step >= s ? "text-brand-black" : "text-brand-black/20"
                  )}>
                    {s === 1 ? 'Identité' : s === 2 ? 'Profil' : 'Collaboration'}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-brand-black/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-gold"
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-serif font-bold mb-2">Vos informations</h2>
                  <p className="text-brand-black/40">Commençons par les bases de votre compte.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Nom Complet</label>
                    <input 
                      {...form1.register('fullName')}
                      className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                    {form1.formState.errors.fullName && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.fullName.message as string}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Email</label>
                    <input 
                      {...form1.register('email')}
                      className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                      placeholder="jane@example.com"
                    />
                    {form1.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.email.message as string}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Mot de passe</label>
                    <input 
                      type="password"
                      {...form1.register('password')}
                      className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                      placeholder="••••••••"
                    />
                    {form1.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.password.message as string}</p>}
                  </div>
                </div>

                <button 
                  onClick={nextStep}
                  className="w-full py-5 bg-brand-black text-white rounded-xl font-bold flex items-center justify-center gap-2 group hover:bg-brand-black/90 transition-all"
                >
                  Continuer
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-serif font-bold mb-2">Profil professionnel</h2>
                  <p className="text-brand-black/40">Parlez-nous de votre marque ou entreprise.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Nom de la marque / entreprise</label>
                    <input 
                      {...form2.register('companyName')}
                      className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Secteur</label>
                    <select 
                      {...form2.register('sector')}
                      className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all appearance-none"
                    >
                      <option value="">Choisir...</option>
                      <option value="FinTech">FinTech</option>
                      <option value="AgriTech">AgriTech</option>
                      <option value="Mode">Mode</option>
                      <option value="Beauté">Beauté</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Média">Média</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Pays d'opération</label>
                    <input 
                      {...form2.register('country')}
                      className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Bio courte (300 chars)</label>
                    <textarea 
                      {...form2.register('bio')}
                      rows={3}
                      className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex-1 py-5 border border-brand-black/10 text-brand-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Retour
                  </button>
                  <button 
                    onClick={nextStep}
                    className="flex-[2] py-5 bg-brand-black text-white rounded-xl font-bold flex items-center justify-center gap-2 group hover:bg-brand-black/90 transition-all"
                  >
                    Continuer
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-serif font-bold mb-2">Type de collaboration</h2>
                  <p className="text-brand-black/40">Comment souhaitez-vous contribuer à AFRIKHER ?</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'content', label: 'Soumettre des interviews / articles' },
                    { id: 'products', label: 'Vendre des produits (livres, bouquets, créations)' },
                    { id: 'services', label: 'Proposer des services' },
                    { id: 'sponsor', label: 'Sponsoriser du contenu (publicité)' },
                  ].map((type) => (
                    <label key={type.id} className="flex items-center gap-4 p-4 bg-white border border-brand-black/5 rounded-xl cursor-pointer hover:border-brand-gold/50 transition-all">
                      <input 
                        type="checkbox" 
                        value={type.id}
                        {...form3.register('collaborationTypes')}
                        className="w-5 h-5 rounded border-brand-black/10 text-brand-gold focus:ring-brand-gold"
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Votre motivation (500 chars)</label>
                  <textarea 
                    {...form3.register('motivation')}
                    rows={4}
                    className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all resize-none"
                    placeholder="Pourquoi souhaitez-vous rejoindre AFRIKHER ?"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex-1 py-5 border border-brand-black/10 text-brand-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Retour
                  </button>
                  <button 
                    onClick={onSubmit}
                    disabled={loading}
                    className="flex-[2] py-5 bg-brand-gold text-brand-black rounded-xl font-bold flex items-center justify-center gap-2 group hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Traitement...' : 'Soumettre ma demande'}
                    {!loading && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center mt-12 text-sm text-brand-black/40">
            Déjà partenaire ? <Link to="/partner/login" className="text-brand-gold font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
