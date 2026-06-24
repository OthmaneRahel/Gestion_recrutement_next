'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiAlertTriangle,
  FiX,
  FiShield,
  FiLock,
  FiAlertCircle,
  FiTrash2
} from 'react-icons/fi';

import api from "@/services/api";

import axios from 'axios'

export default function DesactiverCompte() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requiredText = 'désactiver mon compte';

  const handleDesactiver = async () => {
    if (confirmationText.toLowerCase() !== requiredText.toLowerCase()) {
      setError(`Écrivez exactement : "${requiredText}"`);
      return;
    }

    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('token-login')
    try {
      const response = await api.post('desactiver_activer_account/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if(response.status !== 200) {
        setError('Une erreur est survenue. Veuillez réessayer');
      }
      localStorage.removeItem('token-login')
      router.push('/login');

    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      throw err;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red/10 rounded-xl flex items-center justify-center">
            <FiShield className="text-red text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Désactivation du compte</h1>
            <p className="text-sm text-gray-500">Cette action est irréversible</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-5"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiAlertTriangle className="text-red text-xl flex-shrink-0 mt-0.5" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-red-800">Action irréversible</h3>
              <p className="text-sm text-red-700 mt-1">
                Toutes vos données personnelles, historiques et informations seront définitivement supprimées.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPopup(true)}
          className="px-6 py-3 bg-red hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red/20"
        >
          <FiTrash2 className="text-lg" />
          Désactiver mon compte
        </motion.button>
      </motion.div>

      {/* Popup de confirmation */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowPopup(false);
              setConfirmationText('');
              setError('');
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 bg-red/10 rounded-full flex items-center justify-center"
                  >
                    <FiAlertTriangle className="text-red text-xl" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-foreground">
                    Confirmation
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setConfirmationText('');
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Attention :</strong> Cette action est irréversible.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Écrivez : <span className="text-red">désactiver mon compte</span>
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => {
                    setConfirmationText(e.target.value);
                    setError('');
                  }}
                  placeholder="désactiver mon compte"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red/20 focus:border-red outline-none transition"
                  autoFocus
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-red flex items-center gap-1"
                    >
                      <FiAlertCircle className="text-sm" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setConfirmationText('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDesactiver}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <FiLock className="w-4 h-4" />
                      Confirmer
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}