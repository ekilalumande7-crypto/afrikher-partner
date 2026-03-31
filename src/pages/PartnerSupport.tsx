import React from 'react';
import { Mail, MessageCircle, FileText, HelpCircle, ChevronRight } from 'lucide-react';

const faqs = [
  { q: "Comment mes revenus sont-ils calculés ?", a: "AFRIKHER prélève une commission de 15% sur chaque vente effectuée via la plateforme. Le reste vous est reversé net." },
  { q: "Quel est le délai de validation d'un article ?", a: "Notre équipe éditoriale examine chaque soumission sous 48 à 72 heures ouvrées." },
  { q: "Comment puis-je demander un virement ?", a: "Dès que votre solde atteint 50€, vous pouvez demander un virement depuis l'onglet 'Mes Revenus'." },
  { q: "Puis-je modifier un article déjà publié ?", a: "Une fois publié, un article ne peut plus être modifié directement. Contactez le support pour toute correction." },
  { q: "Quels types de fichiers sont acceptés pour les produits ?", a: "Nous acceptons les images JPG, PNG et WebP jusqu'à 5 Mo par fichier." },
];

export function PartnerSupport() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold">Support Partenaire</h1>
        <p className="text-brand-black/40 max-w-2xl mx-auto">
          Besoin d'aide pour gérer votre boutique ou soumettre du contenu ? Notre équipe est à votre disposition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="premium-card p-8 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6 text-brand-gold" />
          </div>
          <h3 className="font-serif font-bold text-xl">Email</h3>
          <p className="text-sm text-brand-black/40">contact@afrikher.com</p>
          <p className="text-xs text-brand-black/60">Réponse sous 24h</p>
        </div>

        <div className="premium-card p-8 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6 text-brand-gold" />
          </div>
          <h3 className="font-serif font-bold text-xl">WhatsApp</h3>
          <p className="text-sm text-brand-black/40">+33 6 00 00 00 00</p>
          <p className="text-xs text-brand-black/60">Lundi - Vendredi, 9h-18h</p>
        </div>

        <div className="premium-card p-8 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6 text-brand-gold" />
          </div>
          <h3 className="font-serif font-bold text-xl">Documentation</h3>
          <p className="text-sm text-brand-black/40">Guide du Partenaire</p>
          <button className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:underline">Télécharger PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="space-y-8">
          <h2 className="text-3xl font-serif font-bold">Envoyez-nous un message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Sujet</label>
                <select className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none appearance-none">
                  <option>Question technique</option>
                  <option>Problème de paiement</option>
                  <option>Aide éditoriale</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Référence (Optionnel)</label>
                <input className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none" placeholder="ID Article ou Produit" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2">Message</label>
              <textarea rows={6} className="w-full px-6 py-4 bg-white border border-brand-black/5 rounded-xl focus:ring-1 focus:ring-brand-gold outline-none resize-none" placeholder="Comment pouvons-nous vous aider ?" />
            </div>
            <button className="w-full py-5 bg-brand-black text-white rounded-xl font-bold hover:bg-brand-black/90 transition-all">
              Envoyer le message
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="space-y-8">
          <h2 className="text-3xl font-serif font-bold">Questions Fréquentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group premium-card rounded-2xl overflow-hidden">
                <summary className="p-6 flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-brand-gold group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-sm text-brand-black/60 leading-relaxed border-t border-brand-gold/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
