'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FiHome, FiCalendar, FiBarChart2, FiTrash, FiLogOut, FiAlignJustify,
  FiBell, FiUsers, FiActivity, FiTrendingUp, FiFilter, FiUser
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import API from "@/services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisticsPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  
  const [forums, setForums] = useState<any[]>([]);
  const [selectedForum, setSelectedForum] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const homeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token-login') ?? '');
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch forums for the dropdown
      API.get('/forums/', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setForums(res.data)).catch(console.error);
      
      fetchStats();
    }
  }, [token, selectedForum, startDate, endDate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      let url = '/stats/?';
      if (selectedForum) url += `forum_id=${selectedForum}&`;
      if (startDate) url += `start_date=${startDate}&`;
      if (endDate) url += `end_date=${endDate}&`;
      
      const res = await API.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token-login');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 font-sans text-gray-800">
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
                className="group flex items-center gap-3 px-4 py-2.5 text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 transition-all duration-150 shadow-sm">
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
                <span className="text-sm font-medium">My Profile</span>
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
            Logout
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
        className={`flex-1 p-8 transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'} lg:ml-0`}
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Global Statistics
            </h2>
            <p className="text-gray-500">Analyze candidate engagement and metrics.</p>
          </motion.div>
        </header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl shadow-indigo-100/50 mb-8 flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <FiFilter className="text-indigo-500" /> Filters:
          </div>
          <select 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none shadow-sm transition-all"
            value={selectedForum}
            onChange={(e) => setSelectedForum(e.target.value)}
          >
            <option value="">All Forums</option>
            {forums.map((f: any) => (
              <option key={f.id} value={f.id}>{f.nom}</option>
            ))}
          </select>
          <input 
            type="date" 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none shadow-sm transition-all"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input 
            type="date" 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none shadow-sm transition-all"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </motion.div>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl border border-gray-200/50"></div>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="h-80 bg-gray-100 rounded-2xl border border-gray-200/50"></div>
               <div className="h-80 bg-gray-100 rounded-2xl border border-gray-200/50"></div>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-indigo-100/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Candidates</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats?.metrics.total_candidats}</h3>
                  </div>
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shadow-inner">
                    <FiUsers className="text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-green-100/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Present Candidates</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats?.metrics.present_candidats}</h3>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 shadow-inner">
                    <FiActivity className="text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-purple-100/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Presence Rate</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats?.metrics.presence_rate}%</h3>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 shadow-inner">
                    <FiTrendingUp className="text-xl" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Line Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl shadow-indigo-100/50"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Inscriptions over Time</h3>
                <div className="h-64">
                  {stats && (
                    <Line
                      data={{
                        labels: stats.charts.inscriptions.labels,
                        datasets: [{
                          label: 'Inscriptions',
                          data: stats.charts.inscriptions.data,
                          borderColor: '#6366f1',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          tension: 0.4,
                          fill: true,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { grid: { color: '#e5e7eb' }, ticks: { color: '#6b7280' } },
                          x: { grid: { color: '#e5e7eb' }, ticks: { color: '#6b7280' } }
                        }
                      }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl shadow-indigo-100/50 flex flex-col items-center justify-center"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 w-full text-left">Presence Status</h3>
                <div className="h-64 w-full flex justify-center">
                  {stats && (
                    <Pie
                      data={{
                        labels: stats.charts.status.labels,
                        datasets: [{
                          data: stats.charts.status.data,
                          backgroundColor: ['#10b981', '#ef4444'],
                          borderColor: '#ffffff',
                          borderWidth: 2,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { color: '#4b5563', padding: 20 } }
                        }
                      }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Bar Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl shadow-indigo-100/50 lg:col-span-2"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Forums by Inscriptions</h3>
                <div className="h-64">
                  {stats && (
                    <Bar
                      data={{
                        labels: stats.charts.top_forums.labels,
                        datasets: [{
                          label: 'Candidates',
                          data: stats.charts.top_forums.data,
                          backgroundColor: '#a855f7',
                          borderRadius: 6,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { grid: { color: '#e5e7eb' }, ticks: { color: '#6b7280' } },
                          x: { grid: { display: false }, ticks: { color: '#6b7280' } }
                        }
                      }}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
