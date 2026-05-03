import React, { useState, useEffect } from 'react';
import { FiFile, FiPhone, FiMessageSquare, FiStar, FiArrowLeftCircle } from 'react-icons/fi';
import axios from 'axios';
import { useParams } from "react-router-dom";

import {
  FiSearch, FiBell, FiMail, FiHome, FiCalendar, FiUsers, FiBarChart2,
  FiPlus, FiMenu, FiEye, FiX, FiClock, FiUser, FiMapPin, FiInfo, FiChevronRight
} from 'react-icons/fi';

import { Link } from "react-router-dom";


const Feedback = () => {
  const { forumId } = useParams(); 

  const [forum, setForum] = useState([]);
  const [feedbackData,setFeedbackData]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recherche,setRecherche]=useState("")
  const [selectedcandidate,setselectedcandidate]=useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    fetchFeedbacks();
  }, []);

const [showForumDetails,setShowForumDetails] = useState(false)

    const fetchFeedbacks = async () => {
        try {
        console.log("forumId utilisé pour fetch :", forumId); // Vérifie la valeur

        const response = await axios.get(
            `http://127.0.0.1:8000/api/list_feedback/?forum_id=${forumId}`
        );

        setForum(response.data.forum);
        setFeedbackData(response.data.feedbacks); // ✅ Les candidatures filtrées
        setStats(response.data.stats);
        setLoading(false);

        } catch (err) {
        console.error("Erreur lors de la récupération des feedbacks:", err);
        setError("Erreur lors du chargement des feedbacks");
        setLoading(false);
        }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-700 font-semibold">
          Chargement des feedbacks...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600 font-semibold">
          {error}
        </div>
      </div>
    );
  }


return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-8">
   <br />
  {/* Header */}
{/* Header */}
<div className="flex flex-col md:flex-row items-center justify-between mb-8">
  {/* Back button on the left */}
  <div className="self-start md:self-auto mb-4 md:mb-0">
    <Link to="/Recruteur" className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl">
      <FiArrowLeftCircle className="mr-3 text-xl" />
      <span>Back</span>
    </Link>
  </div>
  
  {/* Title in the center */}
  <div className="mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
      Candidate List for 
      <br />{forum.nom}
    </h1>
    <p className="text-gray-600 text-base md:text-lg text-center">
      Manage your candidates and their information
    </p>
  </div>

  {/* Search bar on the right */}
  <div className="relative w-full md:w-64 lg:w-80 group self-end md:self-auto">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
      <FiSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
    </div>
    <input
      type="text"
      placeholder="Search by first name, last name or email..."
      name="recherche"
      onChange={(event) => setRecherche(event.target.value)}
      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    />
  </div>
</div>
<br />

{/* Stats */}
<div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    <div className="text-center p-4 bg-blue-50 rounded-lg">
      <div className="text-2xl md:text-3xl font-bold text-blue-600">
        {feedbackData.length}
      </div>
      <div className="text-sm md:text-base text-gray-600">Total Candidates</div>
    </div>
    <div className="text-center p-4 bg-green-50 rounded-lg">
      <div className="text-2xl md:text-3xl font-bold text-green-600">
        {stats.treated_total}
      </div>
      <div className="text-sm md:text-base text-gray-600">Treated Candidates</div>
    </div>
    <div className="text-center p-4 bg-orange-50 rounded-lg">
      <div className="text-2xl md:text-3xl font-bold text-yellow">
        {stats.untreated_total}
      </div>
      <div className="text-sm md:text-base text-gray-600">Untreated Candidates</div>
    </div>
  </div>
</div>

{/* Table Container */}
<div className="bg-white rounded-xl shadow-md overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      {/* Table Header */}
      <thead className="bg-indigo-900 text-white">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Photo</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Last Name</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">First Name</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      
      {/* Table Body */}
      <tbody className="bg-white divide-y divide-gray-200">
        {feedbackData.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
              <div className="flex flex-col items-center justify-center">
                <FiUsers className="text-4xl text-gray-300 mb-2" />
                <p>No candidates found</p>
              </div>
            </td>
          </tr>
        ) : (
          feedbackData
            .filter((i) => {
              const query = recherche.toLowerCase();
              const firstName = i.candidature?.first_name?.toLowerCase() || "";
              const lastName = i.candidature?.last_name?.toLowerCase() || "";
              const email = i.candidature?.email?.toLowerCase() || "";
              const fullName = `${firstName} ${lastName}`.trim();

              return (
                query === "" ||
                firstName.includes(query) ||
                lastName.includes(query) ||
                fullName.includes(query) ||
                email.includes(query)
              );
            })
            .map((candidate, index) => (
              <tr
                key={candidate.id || index}
                onClick={() => {
                  setShowForumDetails(true);
                  setselectedcandidate(candidate);
                }}
                className="hover:bg-indigo-50 transition-colors duration-150 cursor-pointer"
              >
                {/* Photo */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow"
                      src={candidate.candidature.cv || '/logoJG.png'}
                      onError={(e) => { e.target.src = '/logoJG.png'; }}
                      alt={`${candidate.candidature.first_name} ${candidate.candidature.last_name}`}
                    />
                  </div>
                </td>

                {/* Last Name */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {candidate.candidature.last_name || 'N/A'}
                  </div>
                </td>

                {/* First Name */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {candidate.candidature.first_name || 'N/A'}
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600 truncate max-w-xs">
                    {candidate.candidature.email || 'N/A'}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm truncate max-w-xs">
                    {candidate.etat === "Strongly yes" ? (
                      <span className="inline-flex items-center px-8 py-2 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Strongly yes
                      </span>
                    ) : candidate.etat === "Yes" ? (
                      <span className="inline-flex items-center px-8 py-2 rounded-full text-xs font-medium bg-blue-500 text-blue-100">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-8 py-2 rounded-full text-xs font-medium bg-blue-800 text-gray-800">
                        {candidate.etat}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))
        )}
      </tbody>
    </table>
  </div>
</div>

{/* Forum Details Modal */}
{showForumDetails && (
  <div
    className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fadeIn"
    onClick={() => setShowForumDetails(false)}
  >
    <div
      className="bg-white p-6 md:p-10 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl animate-scaleIn"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header: Photo and main info */}
      <div className="flex flex-col md:flex-row md:space-x-6 mb-6 items-center md:items-start">
        <div className="relative">
          <img
            src={selectedcandidate.candidature?.cv || '/placeholder-avatar.png'}
            alt={`${selectedcandidate.candidature?.first_name} ${selectedcandidate.candidature?.last_name}`}
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-md mb-4 md:mb-0"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800">
            {selectedcandidate.candidature?.first_name} {selectedcandidate.candidature?.last_name}
          </h2>
          <p className="text-gray-600 mt-1">{selectedcandidate.candidature?.email}</p>
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
            <a
              href={`http://127.0.0.1:8000/${selectedcandidate.candidature?.cv}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View CV
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Detailed Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 shadow">
          <h4 className="font-semibold text-gray-700 text-sm mb-1 flex items-center">
            {/* Telephone Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Phone
          </h4>
          <p className="text-gray-800">{selectedcandidate.candidature.numero_telephone || 'Not specified'}</p>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 shadow">
          <h4 className="font-semibold text-gray-700 text-sm mb-1 flex items-center">
            {/* Rating Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Rating (0-5)
          </h4>
          <div className="flex items-center mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${star <= (selectedcandidate.annotation_candidat || 0) ? 'text-amber-500' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-700 font-medium">{selectedcandidate.annotation_candidat || 0}/5</span>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 shadow">
          <h4 className="font-semibold text-gray-700 text-sm mb-1 flex items-center">
            {/* Application State Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Application Status
          </h4>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              selectedcandidate.etat === "Strongly yes"
                ? 'bg-green-500 text-white'
                : selectedcandidate.etat === "Yes"
                ? 'bg-blue-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {selectedcandidate.etat || 'Not defined'}
          </span>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 col-span-1 md:col-span-2 shadow">
          <h4 className="font-semibold text-gray-700 text-sm mb-2 flex items-center">
            {/* Comments Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Comments / Notes
          </h4>
          <div className="bg-white p-3 rounded-lg border border-gray-200 min-h-[80px] shadow-sm">
            <p className="text-gray-700 text-sm">{selectedcandidate.note || "No comments"}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}




  </div>
);
};

export default Feedback;

