'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { toPng } from 'html-to-image';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import {
  FiSearch, FiBell, FiMail, FiHome, FiCalendar, FiUsers, FiBarChart2, FiAlignJustify,
  FiPlus, FiMenu, FiEye, FiX, FiClock, FiUser, FiMapPin, FiInfo, FiChevronRight,
  FiTrash, FiRotateCcw, FiHash, FiLogOut, FiStar, FiTrendingUp, FiActivity,
} from 'react-icons/fi';

import type { Forum, Recruiter, User, Stats } from '@/types';
// import API from "@/services/api";
import API from "@/services/api";

// ── Leaflet doit être chargé uniquement côté client ─────────────────────────
// const ForumMap = dynamic(() => import('@/components/ForumMap'), { ssr: false });
 const ForumMap = dynamic(() => import('@/components/ForumMap'), { ssr: false });
// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

function calculerNombreMax(
  start: string,
  end: string,
  dureeCreneau: string | number,
  forum: Partial<Forum>
): number {
  if (!start || !end || !dureeCreneau || !forum?.date_forum) return 0;
  const duree = parseInt(String(dureeCreneau), 10);
  if (isNaN(duree) || duree <= 0) return 0;

  const startDate = new Date(`${forum.date_forum}T${start}:00`);
  const endDate = new Date(`${forum.date_forum}T${end}:00`);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;

  let slots = 0;
  let current = new Date(startDate);
  while (current < endDate) {
    const next = new Date(current.getTime() + duree * 60000);
    if (next > endDate) break;
    slots++;
    current = next;
  }

  return slots * (forum.recruteurs?.length ?? 0);
}

// ── Types locaux ─────────────────────────────────────────────────────────────
interface FormData {
  nom: string;
  date_forum: string;
  lieu: string;
  description: string;
  recruteurs: number[];
  nombre_max: number;
  universite_id: number;
  date_debut: string;
  date_fin: string;
  duree: number;
  isActive?: boolean;
}

const initialFormData: FormData = {
  nom: '',
  date_forum: '',
  lieu: '',
  description: '',
  recruteurs: [],
  nombre_max: 0,
  universite_id: 1,
  date_debut: '',
  date_fin: '',
  duree: 0,
};

// import { useAuth } from "@/hooks/useAuth";
import { useAuth } from "@/hooks/useAuth";

// ── Page principale ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { logout } = useAuth("recruteur");

  const [showSidebar, setShowSidebar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showForumDetails, setShowForumDetails] = useState(false);
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);

  const [forums, setForums] = useState<Forum[]>([]);
  const [upcoming, setUpcoming] = useState<Forum[]>([]);
  const [past, setPast] = useState<Forum[]>([]);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [villes, setVilles] = useState<{ ville: string }[]>([]);
  const [data_rec, setDataRec] = useState<Recruiter[]>([]);
  const [id_rec, setIdRec] = useState<number>(0);
  const [recherche, setRecherche] = useState('');
  const [currentPage2, setCurrentPage2] = useState(1);

  const [rechercheUpcoming, setRechercheUpcoming] = useState('');
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);

  const [stats, setStats] = useState<Stats>({
    totalForums: 0,
    upcomingForums: 0,
    pastForums: 0,
  });

  const itemsPerPage2 = 2;
  const itemsPerPageUpcoming = 2;
  const forumsRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLElement>(null);
  const qrref = useRef<SVGSVGElement>(null);

  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token-login') ?? '');
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3004/villes').then((res) => setVilles(res.data));
  }, []);

  useEffect(() => {
    if (token) fetchForums();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    API.get('/list_rec/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setDataRec(res.data));
  }, [token]);

  useEffect(() => {
    if (!forums.length) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const up = forums.filter((f) => {
      const d = new Date(f.date_forum);
      d.setHours(0, 0, 0, 0);
      return d > today;
    });
    const p = forums.filter((f) => {
      const d = new Date(f.date_forum);
      d.setHours(0, 0, 0, 0);
      return d < today;
    });

    setUpcoming(up);
    setPast(p);
    setStats({ totalForums: forums.length, upcomingForums: up.length, pastForums: p.length });
  }, [forums]);

  useEffect(() => {
    setCurrentPageUpcoming(1);
  }, [rechercheUpcoming]);

  const fetchForums = async () => {
    try {
      const res = await API.get('/forums/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForums(res.data);
    } catch (err) {
      console.error('Erreur chargement forums', err);
    }
  };

  const getTodayForums = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return forums.filter((f) => {
      const d = new Date(f.date_forum);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrref.current) return;

    const res = await toPng(qrref.current as unknown as HTMLElement);
    const blob = await (await fetch(res)).blob();
    const file = new File([blob], `qr-code ${formData.nom}.png`, { type: 'image/png' });

    try {
      const frmdata = new FormData();
      frmdata.append('nom', formData.nom);
      frmdata.append('recruteurs', `{${formData.recruteurs.join(',')}}`);
      frmdata.append('date_forum', formData.date_forum);
      frmdata.append('lieu', formData.lieu);
      frmdata.append('description', formData.description);
      frmdata.append('nombre_max', String(formData.nombre_max));
      frmdata.append('universite_id', String(formData.universite_id));
      frmdata.append('duree', String(formData.duree));
      if (formData.date_debut && formData.date_fin) {
        frmdata.append('date_debut', formData.date_debut);
        frmdata.append('date_fin', formData.date_fin);
      }
      frmdata.append('qrcode', file);

      await API.post('/forums/create/', frmdata, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      Swal.fire({ 
        title: 'Success 🎉', 
        text: 'Forum créé avec succès !', 
        icon: 'success', 
        confirmButtonText: 'OK',
        confirmButtonColor: '#6366f1',
      });
      setShowForm(false);
      setFormData(initialFormData);
      fetchForums();
    } catch {
      Swal.fire({ 
        title: 'Erreur', 
        text: 'Impossible de créer le forum', 
        icon: 'error', 
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleForumArchive = async (forumId: number) => {
    try {
      await API.post('/Archive/', { forum_id: forumId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ 
        icon: 'success', 
        title: 'Archivé !', 
        text: 'Forum archivé avec succès.', 
        confirmButtonColor: '#6366f1',
      });
      fetchForums();
    } catch {
      Swal.fire({ 
        icon: 'error', 
        title: 'Erreur', 
        text: "Erreur lors de l'archivage.", 
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const addRec = () => {
    if (id_rec !== 0) {
      setFormData((prev) => ({ ...prev, recruteurs: [...prev.recruteurs, id_rec] }));
      setIdRec(0);
    }
  };

  const removeRec = (id: number) =>
    setFormData((prev) => ({ ...prev, recruteurs: prev.recruteurs.filter((r) => r !== id) }));

  const handleDureeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuree = e.target.value;
    setFormData((prev) => ({
      ...prev,
      duree: Number(newDuree),
      nombre_max: calculerNombreMax(prev.date_debut, prev.date_fin, newDuree, prev),
    }));
  };

  const todayForums = getTodayForums();
  const totalPages = Math.ceil(past.length / itemsPerPage2);

  const upcomingFiltered = [...upcoming]
    .sort((a, b) => new Date(a.date_forum).getTime() - new Date(b.date_forum).getTime())
    .filter((f) => {
      const q = rechercheUpcoming.toLowerCase();
      return q === '' || f.nom?.toLowerCase().includes(q) || f.lieu?.toLowerCase().includes(q);
    });
  const totalPagesUpcoming = Math.max(1, Math.ceil(upcomingFiltered.length / itemsPerPageUpcoming));
  const upcomingPageItems = upcomingFiltered.slice(
    (currentPageUpcoming - 1) * itemsPerPageUpcoming,
    currentPageUpcoming * itemsPerPageUpcoming
  );

  // ── Render ───────────────────────────────────────────────────────────────
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
            {[
              { icon: FiHome, label: 'Home', action: () => homeRef.current?.scrollIntoView({ behavior: 'smooth' }) },
              { icon: FiCalendar, label: 'Forums', action: () => forumsRef.current?.scrollIntoView({ behavior: 'smooth' }) },
            ].map((item) => (
              <motion.li
                key={item.label}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-150"
                onClick={item.action}
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <item.icon className="text-base" />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </motion.li>
            ))}
            
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
        {/* Header */}
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-500">Summary of your recent activities</p>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200/50"
            >
              <FiBell className="text-gray-600 text-lg" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
          </div>
        </header>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <StatCard 
            label="Total Forums" 
            value={stats.totalForums} 
            icon={<FiHash className="text-xl" />} 
            gradient="from-indigo-500 to-purple-600"
            bgGradient="from-indigo-50 to-purple-50"
          />
          <StatCard 
            label="Upcoming Forums" 
            value={stats.upcomingForums} 
            icon={<FiClock className="text-xl" />} 
            gradient="from-green-400 to-emerald-500"
            bgGradient="from-green-50 to-emerald-50"
          />
          <StatCard 
            label="Past Forums" 
            value={stats.pastForums} 
            icon={<FiRotateCcw className="text-xl" />} 
            gradient="from-yellow-400 to-orange-500"
            bgGradient="from-yellow-50 to-orange-50"
          />
        </motion.div>

        {/* Today's forums */}
        <AnimatePresence>
          {todayForums.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-l-4 border-green-500 rounded-2xl p-6 mb-6 shadow-xl shadow-green-100/50 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2.5 rounded-xl mr-3 shadow-lg shadow-green-200">
                    <FiCalendar className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    Today's Forums{' '}
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-3 py-1 text-sm ml-2 shadow-lg shadow-green-200">
                      {todayForums.length}
                    </span>
                  </h3>
                </div>
                <span className="text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm py-1.5 px-4 rounded-full shadow-sm border border-gray-200/50">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {todayForums.map((forum, index) => (
                    <motion.div
                      key={forum.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200/50 hover:border-green-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-green-100/50 hover:-translate-y-0.5"
                      onClick={() => { setSelectedForum(forum); setShowForumDetails(true); }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-gray-800 truncate">{forum.nom}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <CapacityBadge current={forum.currentNumber} max={forum.nombre_max} />
                          <span className="flex items-center text-xs text-gray-600">
                            <FiMapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            {forum.lieu}
                          </span>
                          <span className="flex items-center text-xs text-gray-600">
                            <FiClock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            {forum.date_debut}
                          </span>
                        </div>
                      </div>
                      <FiChevronRight className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl shadow-xl shadow-green-200/50">
                    <p className="text-sm text-white/90 mb-3 flex items-center gap-2">
                      <FiUsers className="text-white" />
                      Manage applications for each forum
                    </p>
                    <div className="space-y-2">
                      {todayForums.map((forum) => (
                        <Link key={forum.id} href={`/recruteur/forums/${forum.id}/current-candidats`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200 cursor-pointer group border border-white/20"
                          >
                            <div className="flex items-center truncate">
                              <FiUser className="h-4 w-4 mr-2 flex-shrink-0 text-white" />
                              <span className="font-medium text-white truncate">Candidates - {forum.nom}</span>
                            </div>
                            <FiChevronRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Forum button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end mb-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200"
          >
            <FiPlus className="w-5 h-5" />
            New Forum
          </motion.button>
        </motion.div>

        {/* Upcoming Forums */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-200/50 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <FiTrendingUp className="text-indigo-500" />
              Upcoming Forums
            </h3>
            <div className="relative w-48 md:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={rechercheUpcoming}
                onChange={(e) => setRechercheUpcoming(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2.5 border-0 bg-gray-100/50 rounded-xl shadow-sm focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {upcomingPageItems.length > 0 ? (
              upcomingPageItems.map((forum, index) => (
                <motion.div
                  key={forum.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ForumRow
                    forum={forum}
                    onView={() => { setSelectedForum(forum); setShowForumDetails(true); }}
                  />
                </motion.div>
              ))
            ) : (
              <p className="text-center py-6 text-gray-400 text-sm">No upcoming forums found.</p>
            )}
          </div>

          {/* Pagination Upcoming */}
          {upcomingFiltered.length > 0 && (
            <div className="flex justify-center mt-4 space-x-1">
              <PaginationButton
                onClick={() => setCurrentPageUpcoming((p) => Math.max(p - 1, 1))}
                disabled={currentPageUpcoming === 1}
                label="← Prev"
              />
              {Array.from({ length: totalPagesUpcoming }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPageUpcoming(i + 1)}
                  className={`flex items-center justify-center w-8 h-8 text-xs font-medium rounded-lg transition-all ${
                    currentPageUpcoming === i + 1
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <PaginationButton
                onClick={() => setCurrentPageUpcoming((p) => Math.min(p + 1, totalPagesUpcoming))}
                disabled={currentPageUpcoming === totalPagesUpcoming}
                label="Next →"
              />
            </div>
          )}
        </motion.div>

        {/* Past Forums */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-200/50 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
              <FiActivity className="text-yellow-500" />
              Past Forums
            </h3>
            <div className="relative w-48 md:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2.5 border-0 bg-gray-100/50 rounded-xl shadow-sm focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all"
              />
            </div>
          </div>

          <div ref={forumsRef} className="space-y-4">
            {[...past]
              .sort((a, b) => new Date(a.date_forum).getTime() - new Date(b.date_forum).getTime())
              .filter((f) => {
                const q = recherche.toLowerCase();
                return q === '' || f.nom?.toLowerCase().includes(q) || f.lieu?.toLowerCase().includes(q);
              })
              .slice((currentPage2 - 1) * itemsPerPage2, currentPage2 * itemsPerPage2)
              .map((forum, index) => (
                <motion.div
                  key={forum.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 hover:border-yellow-200 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-100/30"
                >
                  <div>
                    <p className="font-medium text-gray-800">{forum.nom}</p>
                    <p className="text-sm text-gray-500">{formatDate(forum.date_forum)} • {forum.lieu}</p>
                    <CapacityBadge current={forum.currentNumber} max={forum.nombre_max} />
                  </div>
                  <div className="flex items-center gap-2">
                    {forum.qrcode_img && <img src={forum.qrcode_img} alt="QR" className="w-12 h-12 rounded-lg" />}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setSelectedForum(forum); setShowForumDetails(true); }}
                      className="p-2 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all"
                    >
                      <FiEye className="text-xl" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        Swal.fire({
                          title: 'Are you sure?',
                          text: 'This forum will be permanently archived.',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#6366f1',
                          cancelButtonColor: '#ef4444',
                          confirmButtonText: 'Yes, archive',
                          cancelButtonText: 'Cancel',
                        }).then((r) => { if (r.isConfirmed) handleForumArchive(forum.id); })
                      }
                      className="p-2 text-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all"
                    >
                      <FiTrash className="text-xl" />
                    </motion.button>
                    <Link href={`/recruteur/forums/${forum.id}/candidats`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all cursor-pointer"
                      >
                        <p className="font-medium text-sm text-green-700">Feedbacks</p>
                        <FiChevronRight className="text-green-600" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-1">
            <PaginationButton
              onClick={() => setCurrentPage2((p) => Math.max(p - 1, 1))}
              disabled={currentPage2 === 1}
              label="← Prev"
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage2(i + 1)}
                className={`flex items-center justify-center w-8 h-8 text-xs font-medium rounded-lg transition-all ${
                  currentPage2 === i + 1
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <PaginationButton
              onClick={() => setCurrentPage2((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage2 === totalPages}
              label="Next →"
            />
          </div>
        </motion.div>
      </main>

      {/* ── Modal: Créer forum ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => { setShowForm(false); setFormData(initialFormData); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Create New Forum
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Slots</span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                      formData.isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Forum Name"
                  className="w-full border-0 bg-gray-100/50 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />

                <div className="flex flex-wrap gap-2">
                  {formData.recruteurs.map((recId) => {
                    const rec = data_rec.find((r) => r.id === recId);
                    return rec ? (
                      <div key={rec.id} className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        {rec.first_name} {rec.last_name}
                        <button type="button" onClick={() => removeRec(rec.id)} className="ml-2 text-indigo-500 hover:text-indigo-700">
                          <FiX size={14} />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={id_rec}
                    onChange={(e) => setIdRec(Number(e.target.value))}
                    className="flex-grow border-0 bg-gray-100/50 rounded-xl p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                  >
                    <option value={0}>Select a recruiter</option>
                    {data_rec.filter((r) => !formData.recruteurs.includes(r.id)).map((r) => (
                      <option value={r.id} key={r.id}>{r.first_name} {r.last_name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addRec}
                    disabled={id_rec === 0}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-50 transition-all"
                  >
                    Add
                  </button>
                </div>

                <input
                  type="date"
                  className="w-full border-0 bg-gray-100/50 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                  value={formData.date_forum}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date_forum: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start:</label>
                    <input type="time" className="w-full border-0 bg-gray-100/50 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                      value={formData.date_debut}
                      onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">End:</label>
                    <input type="time" className="w-full border-0 bg-gray-100/50 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                      value={formData.date_fin}
                      onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })} />
                  </div>
                </div>

                <input
                  list="cities"
                  placeholder="Location"
                  className="w-full border-0 bg-gray-100/50 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  required
                />
                <datalist id="cities">
                  {villes.map((v) => <option key={v.ville} value={v.ville} />)}
                </datalist>

                <textarea
                  placeholder="Description"
                  className="w-full border-0 bg-gray-100/50 rounded-xl p-3 resize-y min-h-[100px] focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />

                {formData.isActive ? (
                  <div className="space-y-4 pl-4 border-l-4 border-indigo-300">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-700">Slot Duration:</span>
                      <select
                        className="border-0 bg-gray-100/50 rounded-xl p-2 focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                        value={formData.duree}
                        onChange={handleDureeChange}
                      >
                        <option value="">Select duration</option>
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                      </select>
                    </div>
                    <p className="text-gray-700 font-medium">Max Attendees: {formData.nombre_max}</p>
                  </div>
                ) : (
                  <input
                    type="number"
                    placeholder="Max Attendees"
                    className="w-full border-0 bg-gray-100/50 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-indigo-400/50 transition-all shadow-sm"
                    value={formData.nombre_max}
                    onChange={(e) => setFormData({ ...formData, nombre_max: Number(e.target.value) })}
                    required
                    min="1"
                  />
                )}

                <div className="flex justify-end space-x-4 pt-6">
                  <button type="button"
                    onClick={() => { setShowForm(false); setFormData(initialFormData); }}
                    className="px-5 py-2 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all"
                  >
                    Create Forum
                  </button>
                </div>
              </form>

              <div style={{ position: 'absolute', left: '-9999px' }}>
                <QRCodeSVG
                  ref={qrref}
                  value={`http://localhost:3000/event/${formData.nom}`}
                  size={200}
                  level="H"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal: Détails forum ── */}
      <AnimatePresence>
        {showForumDetails && selectedForum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowForumDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200/50">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedForum.nom}
                </h2>
                <button onClick={() => setShowForumDetails(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all">
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-6">
                  <InfoCard color="blue" icon={<FiCalendar className="h-5 w-5 text-blue-600" />} title="Date">
                    <p className="text-lg font-medium text-gray-900">{formatDate(selectedForum.date_forum)}</p>
                  </InfoCard>

                  <InfoCard color="green" icon={<FiMapPin className="h-5 w-5 text-green-600" />} title="Location">
                    <p className="text-lg font-medium text-gray-900">{selectedForum.lieu}</p>
                  </InfoCard>

                  {selectedForum.duree > 0 && (
                    <>
                      <InfoCard color="orange" icon={<FiClock className="h-5 w-5 text-orange-600" />} title="Slot Duration">
                        <p className="text-lg font-medium text-gray-900">{selectedForum.duree} minutes</p>
                      </InfoCard>
                      <InfoCard color="indigo" icon={<FiCalendar className="h-5 w-5 text-indigo-600" />} title="Slot Period">
                        <p className="text-lg font-medium text-gray-900">From {selectedForum.date_debut} to {selectedForum.date_fin}</p>
                      </InfoCard>
                    </>
                  )}

                  <InfoCard color="red" icon={<FiUser className="h-5 w-5 text-red-600" />} title="Current / Max Attendees">
                    <p className="text-lg font-medium text-gray-900">{selectedForum.currentNumber}/{selectedForum.nombre_max} participants</p>
                  </InfoCard>

                  <InfoCard color="purple" icon={<FiInfo className="h-5 w-5 text-purple-600" />} title="Description">
                    <p className="text-gray-700 leading-relaxed">{selectedForum.description || 'No description provided.'}</p>
                  </InfoCard>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl border border-gray-200/50 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FiMapPin className="h-5 w-5 mr-2 text-red-500" />
                      Location on Map
                    </h3>
                    <div className="h-64 rounded-xl overflow-hidden border border-gray-200/50 bg-gray-100">
                      {selectedForum.lieu && <ForumMap location={selectedForum.lieu} />}
                    </div>
                    <div className="mt-3 flex justify-center">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(selectedForum.lieu)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200/50 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FiUsers className="h-5 w-5 mr-2 text-indigo-500" />
                      Participating Recruiters
                      <span className="ml-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {selectedForum.recruteurs?.length ?? 0}
                      </span>
                    </h3>
                    {selectedForum.recruteurs?.length ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedForum.recruteurs.map((recId) => {
                          const rec = data_rec.find((r) => r.id === recId);
                          return (
                            <div key={recId} className="flex items-center p-3 rounded-xl border border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium mr-3 flex-shrink-0 shadow-lg shadow-indigo-200">
                                {rec ? `${rec.first_name[0]}${rec.last_name[0]}` : 'R'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">
                                  {rec ? `${rec.first_name} ${rec.last_name}` : `Recruiter #${recId}`}
                                </p>
                                {rec?.entreprise && <p className="text-xs text-gray-500 truncate">{rec.entreprise}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-gray-500">No recruiters registered yet</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay mobile sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 lg:hidden" onClick={() => setShowSidebar(false)} />
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, gradient, bgGradient }: { 
  label: string; 
  value: number; 
  icon: React.ReactNode; 
  gradient: string;
  bgGradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`bg-gradient-to-br ${bgGradient} p-6 rounded-2xl shadow-lg shadow-indigo-100/50 border border-gray-200/50 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <h3 className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-white/80 shadow-sm text-gray-600`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function ForumRow({ forum, onView }: { forum: Forum; onView: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 hover:border-indigo-200 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-100/30">
      <div>
        <p className="font-medium text-gray-800">{forum.nom}</p>
        <p className="text-sm text-gray-500">{formatDate(forum.date_forum)} • {forum.lieu}</p>
        <CapacityBadge current={forum.currentNumber} max={forum.nombre_max} />
      </div>
      <div className="flex items-center gap-2">
        {forum.qrcode_img && <img src={forum.qrcode_img} alt="QR" className="w-12 h-12 rounded-lg" />}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onView}
          className="p-2 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all"
        >
          <FiEye className="text-xl" />
        </motion.button>
      </div>
    </div>
  );
}

function CapacityBadge({ current, max }: { current: number; max: number }) {
  const ratio = current / max;
  const isFull = ratio >= 0.8;
  const gradient = isFull 
    ? 'from-green-400 to-emerald-500' 
    : 'from-blue-400 to-indigo-500';
  
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r ${gradient} text-white shadow-lg ${isFull ? 'shadow-green-200' : 'shadow-blue-200'}`}>
      {current}/{max} registered
    </span>
  );
}

function InfoCard({ color, icon, title, children }: { color: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const bgMap: Record<string, string> = {
    blue: 'from-blue-50 to-blue-100/50',
    green: 'from-green-50 to-green-100/50',
    orange: 'from-orange-50 to-orange-100/50',
    indigo: 'from-indigo-50 to-indigo-100/50',
    red: 'from-red-50 to-red-100/50',
    purple: 'from-purple-50 to-purple-100/50',
  };
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center mb-3">
        <div className={`bg-gradient-to-br ${bgMap[color] ?? 'from-gray-50 to-gray-100/50'} p-2.5 rounded-xl mr-3 shadow-sm`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="ml-12">{children}</div>
    </div>
  );
}

function PaginationButton({ onClick, disabled, label }: { onClick: () => void; disabled: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center px-3 h-8 text-xs font-medium rounded-lg transition-all ${
        disabled
          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
          : 'text-gray-600 bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-200'
      }`}
    >
      {label}
    </button>
  );
}