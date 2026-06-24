// app/settings/update-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiShield
} from 'react-icons/fi';
import api from "@/services/api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    motdepasse_actuel: '',
    nouveau_motdepasse: '',
    confimer_motdepasse: '',
  });
  const [errors, setErrors] = useState({
    motdepasse_actuel: '',
    nouveau_motdepasse: '',
    confimer_motdepasse: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      motdepasse_actuel: '',
      nouveau_motdepasse: '',
      confimer_motdepasse: '',
    };

    if (!formData.motdepasse_actuel) {
      newErrors.motdepasse_actuel = 'Veuillez saisir votre mot de passe actuel';
      isValid = false;
    }

    if (!formData.nouveau_motdepasse) {
      newErrors.nouveau_motdepasse = 'Veuillez saisir un nouveau mot de passe';
      isValid = false;
    } else if (formData.nouveau_motdepasse.length < 8) {
      newErrors.nouveau_motdepasse = 'Minimum 8 caractères';
      isValid = false;
    }

    if (!formData.confimer_motdepasse) {
      newErrors.confimer_motdepasse = 'Veuillez confirmer votre mot de passe';
      isValid = false;
    } else if (formData.nouveau_motdepasse !== formData.confimer_motdepasse) {
      newErrors.confimer_motdepasse = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post(
        'updatepassword/',
        {
          current_password: formData.motdepasse_actuel,
          new_password: formData.nouveau_motdepasse,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token-login')}`,
          },
        }
      );
      setIsSuccess(true);
      setTimeout(() => router.push('/settings'), 2000);
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrors({
          ...errors,
          motdepasse_actuel: 'Mot de passe actuel incorrect',
        });
      } else {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FiCheckCircle className="text-4xl text-green" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Mot de passe modifié !</h2>
        <p className="text-gray-500 mt-2">Redirection en cours...</p>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <FiLock className="text-primary text-xl" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Sécurité du compte</h1>
          <p className="text-sm text-gray-500">Modifiez votre mot de passe en toute sécurité</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mot de passe actuel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mot de passe actuel
          </label>
          <div className="relative group">
            <input
              type={showPassword.current ? 'text' : 'password'}
              name="motdepasse_actuel"
              value={formData.motdepasse_actuel}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe actuel"
              className={`
                w-full px-4 py-3 pr-12 border rounded-xl
                focus:ring-2 focus:ring-primary/20 focus:border-primary
                outline-none transition-all duration-200
                ${errors.motdepasse_actuel ? 'border-red-500' : 'border-gray-200'}
                group-hover:border-primary/30
              `}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword.current ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
            </button>
          </div>
          <AnimatePresence>
            {errors.motdepasse_actuel && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
              >
                <FiAlertCircle className="text-sm" />
                {errors.motdepasse_actuel}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Nouveau mot de passe */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nouveau mot de passe
          </label>
          <div className="relative group">
            <input
              type={showPassword.new ? 'text' : 'password'}
              name="nouveau_motdepasse"
              value={formData.nouveau_motdepasse}
              onChange={handleChange}
              placeholder="Entrez votre nouveau mot de passe"
              className={`
                w-full px-4 py-3 pr-12 border rounded-xl
                focus:ring-2 focus:ring-primary/20 focus:border-primary
                outline-none transition-all duration-200
                ${errors.nouveau_motdepasse ? 'border-red-500' : 'border-gray-200'}
                group-hover:border-primary/30
              `}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword.new ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
            </button>
          </div>
          <AnimatePresence>
            {errors.nouveau_motdepasse ? (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
              >
                <FiAlertCircle className="text-sm" />
                {errors.nouveau_motdepasse}
              </motion.p>
            ) : (
              <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                <FiShield className="text-[10px]" />
                Minimum 8 caractères
              </p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Confirmation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirmer le mot de passe
          </label>
          <div className="relative group">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              name="confimer_motdepasse"
              value={formData.confimer_motdepasse}
              onChange={handleChange}
              placeholder="Confirmez votre nouveau mot de passe"
              className={`
                w-full px-4 py-3 pr-12 border rounded-xl
                focus:ring-2 focus:ring-primary/20 focus:border-primary
                outline-none transition-all duration-200
                ${errors.confimer_motdepasse ? 'border-red-500' : 'border-gray-200'}
                group-hover:border-primary/30
              `}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword.confirm ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
            </button>
          </div>
          <AnimatePresence>
            {errors.confimer_motdepasse && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
              >
                <FiAlertCircle className="text-sm" />
                {errors.confimer_motdepasse}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Boutons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 pt-2"
        >
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Modification...
              </>
            ) : (
              'Modifier le mot de passe'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/settings')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200"
          >
            Annuler
          </button>
        </motion.div>
      </form>
    </div>
  );
}