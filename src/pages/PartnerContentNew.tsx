import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { Image as ImageIcon, Send, X, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const contentSchema = z.object({
  type: z.enum(['interview', 'article', 'dossier', 'portrait']),
  title: z.string().min(5, 'Titre trop court'),
  subject: z.string().optional(),
  category: z.string().min(1, 'Catégorie requise'),
  tags: z.string().optional(),
  content: z.string().min(100, 'Le contenu doit faire au moins 100 caractères'),
  noteToEditor: z.string().optional(),
});

export function PartnerContentNew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: 'article'
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: any) => {
    if (!user) return;
    setLoading(true);

    try {
      let imageUrl = '';
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `submissions/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('partner-assets')
          .upload(filePath, coverImage);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('partner-assets')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('partner_submissions').insert({
        partner_id: user.id,
        type: data.type,
        title: data.title,
        cover_image: imageUrl,
        content: data.content,
        category_id: data.category, // Assuming ID for now
        tags: data.tags?.split(',').map((t: string) => t.trim()),
        note_to_editor: data.noteToEditor,
        status: 'pending'
      });

      if (error) throw error;
      navigate('/partner/contenus');
    } catch (error) {
      console.error('Error submitting content:', error);
      alert('Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2">Soumettre un Contenu</h1>
        <p className="text-brand-black/40">Partagez votre expertise ou vos histoires avec la communauté AFRIKHER.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="premium-card p-8 rounded-2xl space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Titre du contenu</label>
                <input 
                  {...register('title')}
                  className="w-full px-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all text-lg font-serif"
                  placeholder="Ex: L'essor de l'entrepreneuriat féminin en Afrique"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Type</label>
                  <select 
                    {...register('type')}
                    className="w-full px-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none appearance-none"
                  >
                    <option value="article">Article</option>
                    <option value="interview">Interview</option>
                    <option value="dossier">Dossier</option>
                    <option value="portrait">Portrait</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Catégorie</label>
                  <select 
                    {...register('category')}
                    className="w-full px-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none appearance-none"
                  >
                    <option value="">Choisir...</option>
                    <option value="entrepreneuriat">Entrepreneuriat</option>
                    <option value="culture">Culture</option>
                    <option value="technologie">Technologie</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Contenu (Corps du texte)</label>
                <textarea 
                  {...register('content')}
                  rows={15}
                  className="w-full px-6 py-4 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all font-sans leading-relaxed resize-none"
                  placeholder="Écrivez votre contenu ici..."
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message as string}</p>}
              </div>
            </div>
          </div>

          {/* Sidebar Form */}
          <div className="space-y-6">
            <div className="premium-card p-6 rounded-2xl space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Image de couverture</label>
                <div 
                  className={cn(
                    "relative aspect-[4/3] rounded-xl border-2 border-dashed border-brand-gold/20 flex flex-col items-center justify-center overflow-hidden transition-all group cursor-pointer",
                    previewUrl ? "border-none" : "hover:border-brand-gold/50"
                  )}
                  onClick={() => document.getElementById('cover-upload')?.click()}
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Changer l'image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-brand-gold/40 mb-2" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-black/40">Upload Image</span>
                    </>
                  )}
                  <input 
                    id="cover-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-[10px] text-brand-black/40 mt-2">Format recommandé: 1200x800px. Max 5MB.</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Tags (séparés par virgules)</label>
                <input 
                  {...register('tags')}
                  className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none text-sm"
                  placeholder="Afrique, Tech, Succès"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Note pour l'éditeur</label>
                <textarea 
                  {...register('noteToEditor')}
                  rows={3}
                  className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none text-sm resize-none"
                  placeholder="Message privé à l'équipe..."
                />
              </div>
            </div>

            <div className="bg-brand-gold/10 p-6 rounded-2xl border border-brand-gold/20">
              <div className="flex gap-3 mb-4">
                <Info className="w-5 h-5 text-brand-gold shrink-0" />
                <p className="text-xs text-brand-black/60 leading-relaxed">
                  Votre contenu sera examiné par notre équipe éditoriale avant publication. Vous pourrez suivre l'état de votre soumission dans votre tableau de bord.
                </p>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-black/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : 'Soumettre pour révision'}
                {!loading && <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
