'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FiHome, FiCalendar, FiBarChart2, FiTrash, FiLogOut, FiAlignJustify,
  FiUsers, FiDownload, FiFileText, FiCheck, FiX, FiCheckSquare, FiSquare, FiUser,
  FiStar, FiClock, FiMapPin, FiChevronRight, FiEdit2
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import API from "@/services/api";

export default function CandidatesPage() {
  const params = useParams();
  const forumId = params?.id ? Number(params.id) : null;
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  
  const [forum, setForum] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [etat, setEtat] = useState<string>('');

  const homeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (selectedCandidate) {
      setRating(selectedCandidate.feedback?.annotation_candidat || 0);
      setNote(selectedCandidate.feedback?.note || '');
      setEtat(selectedCandidate.feedback?.etat || '');
    }
  }, [selectedCandidate]);

  const togglePresence = async (candidatureId: number) => {
    try {
      await API.put(`/alter_presence/${candidatureId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates((prev: any[]) => prev.map(c => c.id === candidatureId ? { ...c, presence: !c.presence } : c));
      if (selectedCandidate && selectedCandidate.id === candidatureId) {
        setSelectedCandidate((prev: any) => prev ? { ...prev, presence: !prev.presence } : null);
      }
      Swal.fire({
        title: 'Statut modifié',
        text: 'La présence a été mise à jour.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Failed to toggle presence", error);
      Swal.fire('Erreur', 'Impossible de modifier le statut de présence.', 'error');
    }
  };

  const handleSaveFeedback = async () => {
    if (!selectedCandidate) return;
    try {
      await API.post('/add_feeback/', {
        candidature_id: selectedCandidate.id,
        annotation_candidat: rating,
        note: note,
        etat: etat
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        title: 'Feedback enregistré',
        text: 'Les notes et évaluation ont été sauvegardées.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      setCandidates((prev: any[]) => prev.map(c => {
        if (c.id === selectedCandidate.id) {
          return {
            ...c,
            feedback: {
              id: c.feedback?.id || Date.now(),
              annotation_candidat: rating,
              note: note,
              etat: etat
            }
          };
        }
        return c;
      }));

      setSelectedCandidate(null);
    } catch (error) {
      console.error("Failed to save feedback", error);
      Swal.fire('Erreur', 'Impossible d\'enregistrer le feedback.', 'error');
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-0.5 text-yellow-400">
        {Array.from({ length: 5 }, (_, i) => (
          <FiStar
            key={i}
            className={`h-4 w-4 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    setToken(localStorage.getItem('token-login') ?? '');
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (token && forumId) {
      fetchCandidates();
    }
  }, [token, forumId]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/list_cand_forum/?forum_id=${forumId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForum(res.data.forum);
      setCandidates(res.data.candidatures || []);
    } catch (error) {
      console.error("Failed to fetch candidates", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token-login');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSelectAll = () => {
    if (selectedIds.length === candidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map(c => c.id));
    }
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExportExcel = async () => {
    if (selectedIds.length === 0) return Swal.fire('Attention', 'Veuillez sélectionner au moins un candidat.', 'warning');
    
    setExportingExcel(true);
    try {
      const res = await API.post('/export/excel/', { candidat_ids: selectedIds }, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'candidats_export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de l\'exportation Excel.', 'error');
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportZip = async () => {
    if (selectedIds.length === 0) return Swal.fire('Attention', 'Veuillez sélectionner au moins un candidat.', 'warning');
    
    setExportingZip(true);
    try {
      const res = await API.post('/export/zip/', { candidat_ids: selectedIds }, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cv_candidats.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors du téléchargement ZIP.', 'error');
    } finally {
      setExportingZip(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 font-sans">
      {/* ── Sidebar ── */}
      <aside
        className={`w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex-shrink-0 fixed lg:sticky top-0 h-screen z-20 transition-all duration-300 transform flex flex-col ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-xl shadow-indigo-100/30`}
      >
        <div className="px-6 pt-7 pb-5">
          <img src="/logoJG.png" alt="Logo" className="h-20 w-auto" />
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          <p className="px-4 text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2">
            Menu
          </p>
          <ul className="space-y-1">
            <Link href="/recruteur">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiHome className="text-base" />
                </span>
                <span className="text-sm font-medium">Home</span>
              </motion.li>
            </Link>
            
            <Link href="/statistics">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiBarChart2 className="text-base" />
                </span>
                <span className="text-sm font-medium">Statistics</span>
              </motion.li>
            </Link>

            <Link href="/recruteur/archive">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiTrash className="text-base" />
                </span>
                <span className="text-sm font-medium">Archive</span>
              </motion.li>
            </Link>

            <Link href="/recruteur/profile">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiUser className="text-base" />
                </span>
                <span className="text-sm font-medium">Mon Profil</span>
              </motion.li>
            </Link>
          </ul>
        </nav>

        <div className="px-3 pb-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-150"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 text-red-500 shadow-sm">
              <FiLogOut className="text-base" />
            </span>
            Déconnexion
          </motion.button>
        </div>

        {/* User profile */}
        <div className="px-3 pb-5 pt-3 border-t border-gray-200/50">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-lg shadow-indigo-200">
              {(user?.first_name?.[0] ?? 'J')}{(user?.last_name?.[0] ?? 'D')}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-xs text-gray-800 break-words whitespace-normal leading-tight">{user?.email}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Recruiter
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main
        ref={homeRef}
        className={`flex-1 p-8 transition-all duration-300 ${showSidebar ? 'ml-72' : 'ml-0'} lg:ml-0`}
      >
        <header className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <button
            className="lg:hidden p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <FiAlignJustify className="text-xl" />
          </button>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <FiUsers className="text-indigo-600" /> Candidate Management {forum ? `- ${forum.nom}` : ''}
            </h2>
            <p className="text-gray-500 mt-1">Manage and export your candidates data.</p>
          </motion.div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportExcel}
              disabled={exportingExcel || selectedIds.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-md ${
                selectedIds.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-200'
              }`}
            >
              {exportingExcel ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiFileText className="text-lg" />
              )}
              Exporter Excel ({selectedIds.length})
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportZip}
              disabled={exportingZip || selectedIds.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-md ${
                selectedIds.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200'
              }`}
            >
              {exportingZip ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiDownload className="text-lg" />
              )}
              Télécharger CV (ZIP)
            </motion.button>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-200/50 overflow-hidden"
        >
          {loading ? (
            <div className="p-10 flex justify-center">
               <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : candidates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200/50">
                    <th className="p-4 w-12">
                      <button onClick={handleSelectAll} className="text-indigo-600 text-xl focus:outline-none">
                        {selectedIds.length === candidates.length ? <FiCheckSquare /> : <FiSquare className="text-gray-400" />}
                      </button>
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Candidat</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Téléphone</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Présence</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Evaluation / Note</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {candidates.map((cand, idx) => (
                      <motion.tr 
                        key={cand.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-b border-gray-100 transition-colors hover:bg-indigo-50/30 cursor-pointer ${selectedIds.includes(cand.id) ? 'bg-indigo-50/50' : ''}`}
                        onClick={() => setSelectedCandidate(cand)}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleSelect(cand.id)} className="text-indigo-600 text-xl focus:outline-none">
                            {selectedIds.includes(cand.id) ? <FiCheckSquare /> : <FiSquare className="text-gray-300" />}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                              {cand.first_name?.[0]}{cand.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{cand.first_name} {cand.last_name}</p>
                              {cand.cv && (
                                <a 
                                  href={cand.cv.startsWith('http') ? cand.cv : `http://localhost:8000${cand.cv}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs text-indigo-500 hover:underline flex items-center gap-1 mt-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FiFileText /> Voir CV
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{cand.email}</td>
                        <td className="p-4 text-sm text-gray-600">{cand.numero_telephone || '-'}</td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => togglePresence(cand.id)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-all hover:scale-105 ${cand.presence ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                          >
                            {cand.presence ? 'Présent' : 'Absent'}
                          </button>
                        </td>
                        <td className="p-4">
                          {cand.feedback ? (
                            <div className="space-y-1">
                              {renderStars(cand.feedback.annotation_candidat)}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold leading-3 ${
                                cand.feedback.etat === 'Strongly yes' ? 'bg-green-100 text-green-800' :
                                cand.feedback.etat === 'Yes' ? 'bg-emerald-100 text-emerald-800' :
                                cand.feedback.etat === 'No' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {cand.feedback.etat || 'Note enregistrée'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Non noté</span>
                          )}
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedCandidate(cand)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Noter le candidat"
                          >
                            <FiEdit2 className="text-lg" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500 flex flex-col items-center">
              <FiUsers className="text-4xl text-gray-300 mb-3" />
              <p>Aucun candidat trouvé pour ce forum.</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* ── Slide-over Candidate Drawer ── */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-40 border-l border-gray-200/50 flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Profil du Candidat</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Évaluation au jour du forum</p>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-1.5 hover:bg-gray-200/50 text-gray-500 hover:text-gray-800 rounded-lg transition-all"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Profile Card */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200/30">
                  {selectedCandidate.image ? (
                    <img
                      src={selectedCandidate.image.startsWith('http') ? selectedCandidate.image : `http://localhost:8000${selectedCandidate.image}`}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-inner flex-shrink-0">
                      {selectedCandidate.first_name?.[0]}{selectedCandidate.last_name?.[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-base truncate">{selectedCandidate.first_name} {selectedCandidate.last_name}</p>
                    <p className="text-xs text-gray-500 truncate">{selectedCandidate.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedCandidate.numero_telephone || 'Pas de téléphone'}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/30">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Créneau Horaire</p>
                    <p className="text-xs font-semibold text-gray-700 mt-1">{selectedCandidate.event_horaire || 'Non spécifié'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/30">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Inscription</p>
                    <p className="text-xs font-semibold text-gray-700 mt-1">
                      {selectedCandidate.date_inscri ? new Date(selectedCandidate.date_inscri).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                    </p>
                  </div>
                </div>

                {/* Presence Switch */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/30">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Présence au Forum</p>
                    <p className="text-xs text-gray-500">Activer si le candidat est présent</p>
                  </div>
                  <button
                    onClick={() => togglePresence(selectedCandidate.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                      selectedCandidate.presence
                        ? 'bg-green-500 text-white shadow-md shadow-green-150'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {selectedCandidate.presence ? 'Présent' : 'Absent'}
                  </button>
                </div>

                {/* Interactive Rating */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Note (Étoiles)</label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setRating(i + 1)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <FiStar
                          className={`h-8 w-8 ${
                            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Decisions */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Statut d'Évaluation</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'Strongly yes', label: 'Strongly Yes 👍', activeColor: 'bg-green-500 text-white border-green-500', normalColor: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200' },
                      { value: 'Yes', label: 'Yes 👌', activeColor: 'bg-emerald-500 text-white border-emerald-500', normalColor: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
                      { value: 'No', label: 'No 👎', activeColor: 'bg-red-500 text-white border-red-500', normalColor: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200' },
                    ].map((btn) => (
                      <button
                        key={btn.value}
                        type="button"
                        onClick={() => setEtat(btn.value)}
                        className={`px-4 py-2 text-xs font-bold border rounded-xl transition-all ${
                          etat === btn.value ? btn.activeColor : `${btn.normalColor}`
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes/Feedback */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Commentaires / Annotations</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Saisissez des commentaires sur les compétences, l'entretien..."
                    rows={4}
                    maxLength={255}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 focus:outline-none transition-all resize-none"
                  />
                  <div className="text-right text-xs text-gray-400">
                    {note.length}/255 caractères
                  </div>
                </div>

                {/* CV Section */}
                {selectedCandidate.cv && (
                  <div className="space-y-2 border-t border-gray-100 pt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">CV du Candidat</label>
                    <a
                      href={selectedCandidate.cv.startsWith('http') ? selectedCandidate.cv : `http://localhost:8000${selectedCandidate.cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all text-xs font-bold w-full justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiFileText /> Ouvrir en grand
                    </a>
                    <div className="mt-2 border border-gray-200/50 rounded-2xl overflow-hidden h-72 bg-gray-50 shadow-inner">
                      <iframe
                        src={selectedCandidate.cv.startsWith('http') ? selectedCandidate.cv : `http://localhost:8000${selectedCandidate.cv}`}
                        className="w-full h-full border-0"
                        title="Candidate CV Preview"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200/50 bg-gray-50 flex gap-3">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveFeedback}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
                >
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
