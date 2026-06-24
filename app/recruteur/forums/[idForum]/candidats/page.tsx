'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiUsers, FiArrowLeftCircle, FiUser, FiMail, 
  FiCheckCircle, FiClock, FiMoreVertical, FiStar, 
  FiCalendar, FiMapPin, FiPhone, FiAward, FiTrendingUp,
  FiArrowRight
} from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import api from "@/services/api";

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  presence: boolean;
}

interface Forum {
  id: number;
  nom: string;
}

export default function CandidatesPage() {
  const params = useParams();
  const forumId = params?.idForum as string;
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [forum, setForum] = useState<Forum | null>(null);
  const [recherche, setRecherche] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await api.get(`list_cand_forum/?forum_id=${forumId}`);
        const data = await response.data;
        setForum(data.forum);
        setCandidates(data.candidatures);
      } catch (error) {
        console.error('Erreur lors du chargement des candidats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [forumId]);

  const filteredCandidates = candidates.filter((candidate) => {
    const query = recherche.toLowerCase();
    const firstName = candidate.first_name?.toLowerCase() || "";
    const lastName = candidate.last_name?.toLowerCase() || "";
    const email = candidate.email?.toLowerCase() || "";
    const fullName = `${lastName} ${firstName}`;

    return (
      query === "" ||
      firstName.includes(query) ||
      lastName.includes(query) ||
      fullName.includes(query) ||
      email.includes(query)
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9,
      rotateX: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 250,
        duration: 0.5,
      },
    },
    hover: {
      y: -12,
      scale: 1.02,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        damping: 15,
        stiffness: 300,
      },
    }),
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-20" />
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-24" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      {/* Header avec animations */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        className="relative flex flex-col md:flex-row items-center justify-between mb-10"
      >
        <div className="self-start md:self-auto mb-4 md:mb-0">
          <Link 
            href="/recruteur" 
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FiArrowLeftCircle className="text-xl text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">Retour</span>
          </Link>
        </div>
        
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">En direct</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Liste des candidats
            <br />
            <motion.span 
              className="text-primary bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {forum?.nom || 'Forum'}
            </motion.span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1">
            {candidates.length} candidat{candidates.length > 1 ? 's' : ''} inscrit{candidates.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="relative w-full md:w-64 lg:w-80 group mt-4 md:mt-0">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un candidat..."
              value={recherche}
              onChange={(event) => setRecherche(event.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300"
            />
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: recherche ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats avec animations modernes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        {[
          { 
            label: 'Total candidats', 
            value: candidates.length, 
            icon: FiUsers, 
            color: 'primary',
            gradient: 'from-primary/20 to-primary/5',
            border: 'border-primary/20'
          },
          { 
            label: 'Traités', 
            value: candidates.filter(c => c.presence).length, 
            icon: FiCheckCircle, 
            color: 'green',
            gradient: 'from-green/20 to-green/5',
            border: 'border-green/20'
          },
          { 
            label: 'En attente', 
            value: candidates.filter(c => !c.presence).length, 
            icon: FiClock, 
            color: 'orange',
            gradient: 'from-orange/20 to-orange/5',
            border: 'border-orange/20'
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            custom={index}
            variants={statsVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.03,
              transition: { type: "spring", damping: 20 }
            }}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} rounded-2xl border ${stat.border} p-6 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <motion.p 
                  className="text-3xl font-bold text-foreground mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.p>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center border ${stat.border}`}
              >
                <stat.icon className={`text-${stat.color} text-xl`} />
              </motion.div>
            </div>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
            >
              <div className={`h-full bg-gradient-to-r from-${stat.color}/50 to-${stat.color}`} />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Grille des candidats */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </motion.div>
        ) : filteredCandidates.length === 0 ? (
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
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiUsers className="text-4xl text-gray-300" />
            </motion.div>
            <p className="text-gray-500 font-medium text-lg">Aucun candidat trouvé</p>
            <p className="text-sm text-gray-400 mt-1">Essayez de modifier votre recherche</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white rounded-2xl border border-gray-100/50 overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500"
              >
                {/* Glow effect au survol */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Badge statut flottant */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-4 right-4 z-10"
                >
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                    candidate.presence 
                      ? 'bg-green/90 text-white shadow-lg shadow-green/20' 
                      : 'bg-orange/90 text-white shadow-lg shadow-orange/20'
                  }`}>
                    {candidate.presence ? (
                      <>
                        <FiCheckCircle className="text-[10px]" />
                        Traité
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-white mr-0.5"
                        />
                        En attente
                      </>
                    )}
                  </span>
                </motion.div>

                {/* Contenu de la carte */}
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar avec animation */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-primary/10 group-hover:border-primary/30 transition-colors duration-300"
                    >
                      {candidate.image ? (
                        <Image
                          src={candidate.image}
                          alt={`${candidate.first_name} ${candidate.last_name}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <FiUser className="text-primary text-2xl" />
                        </div>
                      )}
                      {/* Overlay de vérification */}
                      <motion.div
                        className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <FiCheckCircle className="text-white text-3xl" />
                      </motion.div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <motion.h3 
                        className="font-bold text-foreground text-lg truncate group-hover:text-primary transition-colors duration-300"
                      >
                        {candidate.first_name} {candidate.last_name}
                      </motion.h3>
                      <motion.div 
                        className="flex items-center gap-1.5 mt-1 text-sm text-gray-400"
                      >
                        <FiMail className="text-xs flex-shrink-0" />
                        <span className="truncate">{candidate.email}</span>
                      </motion.div>
                      
                      {/* Indicateur de présence */}
                      <motion.div 
                        className="mt-2 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${candidate.presence ? 'bg-green' : 'bg-orange'}`} />
                        <span className="text-xs text-gray-400">
                          {candidate.presence ? 'Présence confirmée' : 'Présence non confirmée'}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Actions */}
                  <motion.div 
                    className="mt-5 pt-4 border-t border-gray-100/50 flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {!candidate.presence ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                      >
                        Évaluer le candidat
                        <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 py-2.5 bg-gray-100/50 text-gray-400 text-sm font-medium rounded-xl cursor-not-allowed"
                      >
                        Candidat évalué
                      </motion.button>
                    )}
                  </motion.div>
                </div>

                {/* Effet de bordure animée au survol */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-dark origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}