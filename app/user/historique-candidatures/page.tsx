// app/user/historique-candidatures/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FiClock,
  FiMail,
  FiPhone,
  FiFile,
  FiCheckCircle,
  FiClock as FiClockIcon,
  FiSearch,
  FiUser,
  FiCalendar,
  FiEye,
  FiArrowRight,
  FiBriefcase,
  FiMapPin,
  FiStar,
  FiTrendingUp,
  FiArrowLeft
} from 'react-icons/fi';
import Link from 'next/link';
import api from "@/services/api";

interface Candidature {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cv: string;
  numero_telephone: string;
  image: string;
  presence: boolean;
  event_horaire: string | null;
  date_inscri: string;
  forum?: {
    id: number;
    nom: string;
  };
}

export default function HistoriqueCandidaturesPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await api.get('forumcandidature/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token-login')}`,
          },
        });
        setCandidatures(response.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          notFound();
        } else {
          throw error;
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidatures();
  }, []);

  const filteredCandidatures = candidatures.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.first_name?.toLowerCase().includes(query) ||
      c.last_name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.forum?.nom?.toLowerCase().includes(query)
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-20" />
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-12" />
        </div>
      </div>
    </div>
  );

  // Statistiques
  const totalCandidatures = candidatures.length;
  const traitees = candidatures.filter(c => c.presence).length;
  const enAttente = candidatures.filter(c => !c.presence).length;
  const tauxTraitement = totalCandidatures > 0 ? Math.round((traitees / totalCandidatures) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-24 mt-1 animate-pulse" />
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-48 animate-pulse" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-8 bg-gray-200 rounded w-12 mt-2" />
                  </div>
                  <div className="w-11 h-11 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Liste skeleton */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header avec bouton retour */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/user"
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/5 transition-colors group"
            >
              <FiArrowLeft className="text-primary group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">Retour</span>
            </Link>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FiClock className="text-primary text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Historique des candidatures</h1>
                <p className="text-sm text-gray-500">
                  {totalCandidatures} candidature{totalCandidatures > 1 ? 's' : ''} au total
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-sm w-full md:w-64 bg-white/70 backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total</p>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-2xl font-bold text-foreground mt-1"
                >
                  {totalCandidatures}
                </motion.p>
              </div>
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                <FiBriefcase className="text-primary text-xl" />
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Traités</p>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-2xl font-bold text-green mt-1"
                >
                  {traitees}
                </motion.p>
              </div>
              <div className="w-11 h-11 bg-green/10 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="text-green text-xl" />
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green rounded-full" style={{ width: `${tauxTraitement}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">En attente</p>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-2xl font-bold text-orange mt-1"
                >
                  {enAttente}
                </motion.p>
              </div>
              <div className="w-11 h-11 bg-orange/10 rounded-xl flex items-center justify-center">
                <FiClockIcon className="text-orange text-xl" />
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange rounded-full" style={{ width: `${enAttente > 0 ? (enAttente / totalCandidatures) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Taux de traitement</p>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-2xl font-bold text-primary mt-1"
                >
                  {tauxTraitement}%
                </motion.p>
              </div>
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-primary text-xl" />
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${tauxTraitement}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Liste des candidatures */}
        <AnimatePresence mode="wait">
          {filteredCandidatures.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  transition: { duration: 2, repeat: Infinity }
                }}
                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FiClockIcon className="text-3xl text-gray-300" />
              </motion.div>
              <p className="text-gray-500 font-medium text-lg">Aucune candidature trouvée</p>
              <p className="text-sm text-gray-400 mt-1">Vous n'avez pas encore de candidatures</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredCandidatures.map((c) => (
                <motion.div
                  key={c.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex-shrink-0 border-2 border-primary/10 group-hover:border-primary/30 transition-colors"
                      >
                        {c.image ? (
                          <img src={c.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                            {c.first_name?.[0]}{c.last_name?.[0]}
                          </div>
                        )}
                      </motion.div>

                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                          {c.first_name} {c.last_name}
                        </p>
                        {c.forum && (
                          <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                            <FiBriefcase className="text-[10px]" />
                            {c.forum.nom}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FiMail className="text-[10px]" />
                            {c.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiPhone className="text-[10px]" />
                            {c.numero_telephone}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="text-[10px]" />
                            {new Date(c.date_inscri).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          c.presence ? 'bg-green/10 text-green' : 'bg-orange/10 text-orange'
                        }`}
                      >
                        {c.presence ? (
                          <><FiCheckCircle className="mr-1 text-[10px]" /> Traité</>
                        ) : (
                          <><FiClockIcon className="mr-1 text-[10px]" /> En attente</>
                        )}
                      </motion.span>

                      {c.cv && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          href={`http://127.0.0.1:8000${c.cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <FiFile className="text-[10px]" />
                          CV
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}