'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiUsers, FiArrowLeftCircle, FiFile, FiPhone, 
  FiMessageSquare, FiStar, FiCalendar, FiUser, FiMail,
  FiCheckCircle, FiClock, FiMoreVertical, FiDownload,
  FiEye, FiUserCheck, FiUserX, FiArrowRight, FiAward,
  FiTrendingUp, FiMapPin
} from 'react-icons/fi';

import api from "@/services/api";

// Types
interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  cv: string;
  numero_telephone: string;
  presence: boolean;
  event_horaire: string | null;
  date_inscri: string;
}

interface Forum {
  id: number;
  nom: string;
  description?: string;
}

interface FeedbackData {
  annotation_candidat: number;
  note: string;
  etat: string;
  candidature_id: number | null;
}

export default function CandidatesPage() {
  const params = useParams();
  const router = useRouter();
  const forumId = params.idForum;

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [forum, setForum] = useState<Forum | null>(null);
  const [search, setSearch] = useState('');
  const [showForumDetails, setShowForumDetails] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const initialFeedback: FeedbackData = {
    annotation_candidat: 0,
    note: '',
    etat: '',
    candidature_id: null,
  };
  const [feedbackData, setFeedbackData] = useState<FeedbackData>(initialFeedback);

  useEffect(() => {
    if (forumId) {
      fetchCandidates();
    }
  }, [forumId]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get(`list_cand_forum/?forum_id=${forumId}`);
      const data = await response.data;
      setForum(data.forum);
      setCandidates(data.candidatures);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const togglePresence = async () => {
    if (!selectedCandidate) return;
    
    try {
      await api.put(`alter_presence/${selectedCandidate.id}`);
      setSelectedCandidate({
        ...selectedCandidate,
        presence: !selectedCandidate.presence,
      });
      fetchCandidates();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      setIsLoading(true);
      await api.post(`add_feedback/`, feedbackData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setFeedbackData(initialFeedback);
      setShowForumDetails(false);
      fetchCandidates();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFeedbackData({
      ...feedbackData,
      annotation_candidat: rating,
    });
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const query = search.toLowerCase();
    const firstName = candidate.first_name?.toLowerCase() || '';
    const lastName = candidate.last_name?.toLowerCase() || '';
    const email = candidate.email?.toLowerCase() || '';
    const fullName = `${firstName} ${lastName}`;

    return (
      query === '' ||
      firstName.includes(query) ||
      lastName.includes(query) ||
      fullName.includes(query) ||
      email.includes(query)
    );
  });

  const totalCandidates = candidates.length;
  const processedCandidates = candidates.filter(c => c.presence).length;
  const pendingCandidates = candidates.filter(c => !c.presence).length;

  // Animations
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              Liste des Candidats
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
              {totalCandidates} candidat{totalCandidates > 1 ? 's' : ''} inscrit{totalCandidates > 1 ? 's' : ''}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Statistiques - 3 sur la même ligne */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {/* Total candidats */}
          <motion.div
            custom={0}
            variants={statsVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.03,
              transition: { type: "spring", damping: 20 }
            }}
            className="relative overflow-hidden bg-white rounded-2xl border border-primary/20 p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total candidats</p>
                <motion.p 
                  className="text-3xl font-bold text-primary mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {totalCandidates}
                </motion.p>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"
              >
                <FiUsers className="text-primary text-xl" />
              </motion.div>
            </div>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="h-full bg-gradient-to-r from-primary/50 to-primary" />
            </motion.div>
          </motion.div>

          {/* Traités */}
          <motion.div
            custom={1}
            variants={statsVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.03,
              transition: { type: "spring", damping: 20 }
            }}
            className="relative overflow-hidden bg-white rounded-2xl border border-green/20 p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Traités</p>
                <motion.p 
                  className="text-3xl font-bold text-green mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {processedCandidates}
                </motion.p>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center border border-green/20"
              >
                <FiCheckCircle className="text-green text-xl" />
              </motion.div>
            </div>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="h-full bg-gradient-to-r from-green/50 to-green" />
            </motion.div>
          </motion.div>

          {/* En attente */}
          <motion.div
            custom={2}
            variants={statsVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.03,
              transition: { type: "spring", damping: 20 }
            }}
            className="relative overflow-hidden bg-white rounded-2xl border border-orange/20 p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">En attente</p>
                <motion.p 
                  className="text-3xl font-bold text-orange mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {pendingCandidates}
                </motion.p>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center border border-orange/20"
              >
                <FiClock className="text-orange text-xl" />
              </motion.div>
            </div>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="h-full bg-gradient-to-r from-orange/50 to-orange" />
            </motion.div>
          </motion.div>
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
                  onClick={() => {
                    if (!candidate.presence) {
                      setShowForumDetails(true);
                      setSelectedCandidate(candidate);
                      setFeedbackData({ ...feedbackData, candidature_id: candidate.id });
                    }
                  }}
                  className={`group relative bg-white rounded-2xl border border-gray-100/50 overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 ${
                    candidate.presence ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
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

                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-primary/10 group-hover:border-primary/30 transition-colors duration-300"
                      >
                        <img
                          src={`http://127.0.0.1:8000/${candidate.image}` || './LogoUser.jpg'}
                          alt={`${candidate.first_name} ${candidate.last_name}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = './LogoUser.jpg';
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <FiEye className="text-white text-2xl" />
                        </motion.div>
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <motion.h3 
                          className="font-bold text-foreground text-lg truncate group-hover:text-primary transition-colors duration-300"
                        >
                          {candidate.first_name} {candidate.last_name}
                        </motion.h3>
                        <motion.div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
                          <FiMail className="text-xs flex-shrink-0" />
                          <span className="truncate">{candidate.email}</span>
                        </motion.div>
                        
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

                    <motion.div 
                      className="mt-5 pt-4 border-t border-gray-100/50 flex items-center justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <FiCalendar className="text-xs" />
                        {new Date(candidate.date_inscri).toLocaleDateString('fr-FR')}
                      </div>
                      {!candidate.presence ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowForumDetails(true);
                            setSelectedCandidate(candidate);
                            setFeedbackData({ ...feedbackData, candidature_id: candidate.id });
                          }}
                        >
                          Évaluer
                          <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiCheckCircle className="text-green" />
                          Évalué
                        </span>
                      )}
                    </motion.div>
                  </div>

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

        {/* Modal Détails */}
        {showForumDetails && selectedCandidate && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => {
              setShowForumDetails(false);
              setFeedbackData(initialFeedback);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <motion.div 
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"
                  >
                    <FiUser className="text-primary" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Détails du Candidat
                    </h2>
                    <p className="text-xs text-gray-400">ID: #{selectedCandidate.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowForumDetails(false);
                    setFeedbackData(initialFeedback);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="relative">
                      <img
                        src={selectedCandidate.image || '/placeholder-avatar.png'}
                        alt="Candidate"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
                      />
                      {selectedCandidate.presence && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                          <FiCheckCircle className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold text-foreground">
                        {selectedCandidate.first_name} {selectedCandidate.last_name}
                      </h3>
                      <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                        <FiMail className="text-gray-400 text-sm" />
                        <span className="text-sm text-gray-500">{selectedCandidate.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 font-medium">Téléphone</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FiPhone className="text-primary text-sm" />
                        <p className="text-sm font-medium text-gray-700">{selectedCandidate.numero_telephone}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 font-medium">Horaire</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FiCalendar className="text-primary text-sm" />
                        <p className="text-sm font-medium text-gray-700">{selectedCandidate.event_horaire || 'Non spécifié'}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                      <p className="text-xs text-gray-400 font-medium">CV</p>
                      <a
                        href={`http://127.0.0.1:8000${selectedCandidate.cv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                      >
                        <FiFile className="text-sm" />
                        Voir le CV
                        <FiDownload className="text-sm ml-1" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${selectedCandidate.presence ? 'bg-green' : 'bg-orange'}`}></div>
                    <span className="font-medium text-gray-700">
                      {selectedCandidate.presence ? 'Présence confirmée' : 'En attente de confirmation'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={selectedCandidate.presence}
                      onChange={togglePresence}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
                  </label>
                </div>

                <hr className="border-gray-100 mb-6" />

                <div>
                  <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FiMessageSquare className="text-primary" />
                    Évaluation du Candidat
                  </h4>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Notes</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        placeholder="Notes sur le candidat, compétences, attitude..."
                        value={feedbackData.note || ''}
                        onChange={(e) => setFeedbackData({ ...feedbackData, note: e.target.value })}
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Note (0-5)</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              className="p-1 text-2xl focus:outline-none"
                              onClick={() => handleRatingChange(star)}
                            >
                              {star <= (feedbackData.annotation_candidat || 0) ? (
                                <FiStar className="text-yellow fill-yellow" />
                              ) : (
                                <FiStar className="text-gray-300" />
                              )}
                            </motion.button>
                          ))}
                          <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {feedbackData.annotation_candidat || 0}/5
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Décision</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'Strongly yes', color: 'green' },
                            { label: 'Yes', color: 'blue' },
                            { label: 'No', color: 'red' }
                          ].map(({ label, color }) => (
                            <motion.button
                              key={label}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                feedbackData.etat === label
                                  ? `bg-${color} text-white shadow-md`
                                  : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                              }`}
                              onClick={() => setFeedbackData({ ...feedbackData, etat: label })}
                            >
                              {label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setShowForumDetails(false);
                      setFeedbackData(initialFeedback);
                    }}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
                      selectedCandidate.presence
                        ? 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg hover:-translate-y-0.5'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!selectedCandidate.presence || isLoading}
                    onClick={() => {
                      if (selectedCandidate.presence) {
                        handleSubmitFeedback();
                      }
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Envoi...
                      </div>
                    ) : (
                      "Enregistrer l'évaluation"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}