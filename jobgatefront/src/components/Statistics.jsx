// Statistics.jsx
import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiStar, FiCheckCircle, FiXCircle, FiMapPin, FiArrowLeftCircle } from 'react-icons/fi';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Enregistrer les composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


const Statistics = () => {
  const [forums, setForums] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForum, setSelectedForum] = useState('all');
  const [stats, setStats] = useState({
    totalForums: 0,
    upcomingForums: 0,
    pastForums: 0
  });

  useEffect(() => {
    fetchForums();
    fetchCandidates();
    fetchFeedback();
  }, []);

 let token = localStorage.getItem("token-login")
  const fetchForums = async () => {
    try {
      axios.get('http://localhost:8000/api/forums/', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((res)=>{
      setForums(res.data);
    });

    } catch (error) {
      console.error('Erreur chargement forums', error);
    }
  };


  useEffect(()=>{
    const today = new Date();
    const upcoming =forums.filter(forum => new Date(forum.date_forum) >= today);
    const past =forums.filter(forum => new Date(forum.date_forum) < today);
    setStats({
        totalForums: forums.length,
        upcomingForums: upcoming.length,
        pastForums: past.length
    });
  },[forums])
  
  console.log(stats)
  console.log(forums.length)

  const [feedback, setFeedback] = useState([])

  const fetchFeedback = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/list_feedback_forum_statistics/');
      const data = await res.json();
      setFeedback(data);
    } catch (error) {
      console.error('Erreur chargement feedback', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/list_cand_forum_statistics/');
      const data = await res.json();
      setCandidates(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement candidats', error);
      setLoading(false);
    }
  };

  // Filtrer les candidatures par forum sélectionné
  const filteredCandidates = selectedForum === 'all' 
    ? candidates 
    : candidates.filter(candidate => candidate.forum == selectedForum);

  // Calculer les statistiques pour chaque forum
  const forumStats = forums.map(forum => {
    const forumCandidates = candidates.filter(c => c.forum == forum.id);
    const presentCandidates = forumCandidates.filter(c => c.presence);
    const absentCandidates = forumCandidates.filter(c => !c.presence);
    
    // Compter les notes à partir du feedback
    const forumFeedback = feedback.filter(f => 
      forumCandidates.some(c => c.id == f.candidature.id)
    );
    console.log(feedback)
    const fiveStarCandidates = forumFeedback.filter(f => f.annotation_candidat === 5).length;
    const threePlusStarCandidates = forumFeedback.filter(f => f.annotation_candidat >= 3).length;

    return {
      id: forum.id,
      name: forum.nom,
      date_forum:forum.date_forum,
      totalCandidates: forumCandidates.length,
      maxCapacity: forum.nombre_max,
      present: presentCandidates.length,
      absent: absentCandidates.length,
      fiveStar: fiveStarCandidates,
      threePlusStar: threePlusStarCandidates,
      location: forum.lieu
    };
  });

  // Statistiques globales si "Tous les forums" est sélectionné
  const globalStats = selectedForum === 'all' 
    ? {
        totalCandidates: candidates.length,
        present: candidates.filter(c => c.presence).length,
        absent: candidates.filter(c => !c.presence).length,
        fiveStar: feedback.filter(f => f.annotation_candidat === 5).length,
        threePlusStar: feedback.filter(f => f.annotation_candidat >= 3).length,
        maxCapacity: forums.reduce((sum, forum) => sum + forum.nombre_max, 0)
      }
    : forumStats.find(f => f.id === parseInt(selectedForum));

  // Préparer les données pour les graphiques

  // Graphique 1: Répartition par ville - CORRIGÉ
  const cityData = {};
  forums.forEach(forum => {
    if (!cityData[forum.lieu]) {
      cityData[forum.lieu] = 0;
    }
    const forumCandidates = candidates.filter(c => c.forum == forum.id);
    cityData[forum.lieu] += forumCandidates.length;
  });

  const cityChartData = {
    labels: Object.keys(cityData),
    datasets: [
      {
        label: 'Nombre de candidats par ville',
        data: Object.values(cityData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Graphique 2: Présence vs Absence
  const attendanceChartData = {
    labels: ['Présents', 'Absents'],
    datasets: [
      {
        data: [globalStats?.present || 0, globalStats?.absent || 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Graphique 3: Évaluation des candidats
  const ratingChartData = {
    labels: ['5 étoiles', '3+ étoiles', 'Moins de 3 étoiles'],
    datasets: [
      {
        label: 'Répartition des évaluations',
        data: [
          globalStats?.fiveStar || 0,
          (globalStats?.threePlusStar || 0) - (globalStats?.fiveStar || 0),
          (globalStats?.totalCandidates || 0) - (globalStats?.threePlusStar || 0)
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Graphique 4: Évolution des inscriptions par forum (line chart) - CORRIGÉ
  const forumEvolutionData = {
    labels: forums.map(f => f.nom),
    datasets: [
      {
        label: 'Nombre de candidats',
        data: forums.map(f => candidates.filter(c => c.forum == f.id).length),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-700 font-semibold">
          Chargement des statistiques...
        </div>
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    {/* Header with grid layout */}
    <div className="grid grid-cols-3 items-center mb-8">
      {/* Back Button on the left */}
      <div className="justify-self-start">
        <Link to="/Recruteur" className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl">
          <FiArrowLeftCircle className="mr-3 text-xl" />
          <span>Back</span>
        </Link>
      </div>

      {/* Title in the center */}
      <div className="justify-self-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Forum Statistics</h1>
        <p className="text-gray-600 text-center">Analysis of participation and evaluation data</p>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Forums</p>
            <h3 className="text-2xl font-bold">{stats.totalForums}</h3>
          </div>
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <FiCalendar className="text-xl" />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Upcoming Forums</p>
            <h3 className="text-2xl font-bold">{stats.upcomingForums}</h3>
          </div>
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <FiCalendar className="text-xl" />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Past Forums</p>
            <h3 className="text-2xl font-bold">{stats.pastForums}</h3>
          </div>
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <FiCalendar className="text-xl" />
          </div>
        </div>
      </div>
    </div>

    {/* Forum Selector */}
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Select a Forum</h2>
        <select
          value={selectedForum}
          onChange={(e) => setSelectedForum(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Forums</option>
          {forums.map(forum => (
            <option key={forum.id} value={forum.id}>{forum.nom}</option>
          ))}
        </select>
      </div>

      {/* Detailed Stats */}
      {selectedForum !== 'all' && globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiUsers className="text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Capacity</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {globalStats.totalCandidates}/{globalStats.maxCapacity}
            </p>
            <p className="text-sm text-blue-700">
              {globalStats.maxCapacity ? 
                Math.round((globalStats.totalCandidates / globalStats.maxCapacity) * 100) : 0}% filled
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiCheckCircle className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Present</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{globalStats.present}</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiXCircle className="text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Absent</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{globalStats.absent}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiStar className="text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">5 Stars</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{globalStats.fiveStar}</p>
          </div>
        </div>
      )}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Chart 1: Candidates by City (Bar Chart) */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiMapPin className="mr-2 text-indigo-600" /> 
          Candidate Distribution by City
        </h3>
        <div className="h-80">
          <Bar data={cityChartData} options={chartOptions} />
        </div>
      </div>

      {/* Chart 2: Attendance (Doughnut Chart) */}
      <div className="bg-white p-6 rounded-xl shadow justify-items-center">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiUsers className="mr-2 text-green-600" /> 
          Attendance vs Absence
        </h3>
        <div className="h-80">
          <Doughnut data={attendanceChartData} options={chartOptions} />
        </div>
      </div>

      {/* Chart 3: Candidate Ratings (Pie Chart) */}
      <div className="bg-white p-6 rounded-xl shadow justify-items-center">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiStar className="mr-2 text-yellow-600" /> 
          Candidate Ratings
        </h3>
        <div className="h-80">
          <Pie data={ratingChartData} options={chartOptions} />
        </div>
      </div>

      {/* Chart 4: Forum Registration Trend (Line Chart) */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">
          Registration Trend by Forum
        </h3>
        <div className="h-80">
          <Line data={forumEvolutionData} options={chartOptions} />
        </div>
      </div>
    </div>

    {/* Detailed Forum Statistics Table */}
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Detailed Forum Statistics</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Forum</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-center">Candidates/Max</th>
              <th className="px-4 py-2 text-center">Present</th>
              <th className="px-4 py-2 text-center">Absent</th>
              <th className="px-4 py-2 text-center">5 Stars</th>
              <th className="px-4 py-2 text-center">3+ Stars</th>
            </tr>
          </thead>
          <tbody>
            {forumStats.map((forum, index) => (
              <tr key={forum.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3 border-b">{forum.name}</td>
                <td className="px-4 py-3 border-b">{forum.date_forum}</td>
                <td className="px-4 py-3 border-b">{forum.location}</td>
                <td className="px-4 py-3 border-b text-center">
                  {forum.totalCandidates}/{forum.maxCapacity}
                </td>
                <td className="px-4 py-3 border-b text-center text-green-600">
                  {forum.present}
                </td>
                <td className="px-4 py-3 border-b text-center text-red-600">
                  {forum.absent}
                </td>
                <td className="px-4 py-3 border-b text-center text-yellow-600">
                  {forum.fiveStar}
                </td>
                <td className="px-4 py-3 border-b text-center text-blue-600">
                  {forum.threePlusStar}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

};

export default Statistics;