import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function PartnerPending() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-2xl shadow-xl text-center border border-brand-gold/20"
      >
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <Clock className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">Demande en attente</h2>
        <p className="text-brand-black/60 mb-8 leading-relaxed">
          Votre compte est actuellement en cours de validation par nos administrateurs. 
          Ce processus prend généralement moins de 48 heures. Vous recevrez un email dès que votre accès sera activé.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-brand-cream/50 rounded-xl text-sm text-brand-black/40 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Support: contact@afrikher.com</span>
          </div>
          <Link 
            to="/partner/login" 
            className="flex items-center justify-center gap-2 text-brand-gold font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export function PartnerRejected() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-2xl shadow-xl text-center border border-red-100"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4 text-red-600">Demande refusée</h2>
        <p className="text-brand-black/60 mb-8 leading-relaxed">
          Nous regrettons de vous informer que votre demande de partenariat n'a pas été retenue pour le moment. 
          Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez plus d'informations, veuillez nous contacter.
        </p>
        <div className="space-y-4">
          <a 
            href="mailto:contact@afrikher.com"
            className="inline-block w-full py-4 bg-brand-black text-white rounded-xl font-medium hover:bg-brand-black/90 transition-all"
          >
            Contacter l'équipe
          </a>
          <Link 
            to="/partner/login" 
            className="flex items-center justify-center gap-2 text-brand-black/40 font-bold hover:text-brand-black transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
