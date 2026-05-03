import React, { useState, useEffect } from 'react';
import { FiFile, FiPhone, FiMessageSquare, FiStar, FiArrowLeftCircle } from 'react-icons/fi';
import axios from 'axios';
import { useParams } from "react-router-dom";

import {
  FiSearch, FiBell, FiMail, FiHome, FiCalendar, FiUsers, FiBarChart2,
  FiPlus, FiMenu, FiEye, FiX, FiClock, FiUser, FiMapPin, FiInfo, FiChevronRight
} from 'react-icons/fi';

import { Link } from "react-router-dom";


const Candidates = () => {
  const { forumId } = useParams(); 
  const [candidates, setCandidates] = useState([]);
  const [forum, setForum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [error, setError] = useState(null);
  const [selectedcandidate,setselectedcandidate]=useState(null)
  const [recherche,setRecherche]=useState("")
  const initialFeed  = {
    annotation_candidat : 0,
    note : '',
    etat : '',
    candidature_id : null,
  }
  const [feedbackData,setFeedbackData]=useState(initialFeed)

  useEffect(() => {
    fetchCandidates();
  }, []);



  const [showForumDetails,setShowForumDetails] = useState(false)
    const fetchCandidates = async () => {
      try {
        console.log("forumId utilisé pour fetch :", forumId); // Vérifie la valeur

        const response = await axios.get(
          `http://127.0.0.1:8000/api/list_cand_forum/?forum_id=${forumId}`
        );

        setForum(response.data.forum);
        setCandidates(response.data.candidatures); // ✅ Les candidatures filtrées
        setLoading(false);

      } catch (err) {
        console.error("Erreur lors de la récupération des candidats:", err);
        setError("Erreur lors du chargement des candidats");
        setLoading(false);
      }
    };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-700 font-semibold">
          Chargement des candidats...
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

  console.log("Id",forumId,"Candidates",candidates.length)

  let toggleActive = () => {
   
    setselectedcandidate((e)=>({
    ...e,
    presence : !(e.presence)
    }))
    axios.put("http://127.0.0.1:8000/api/alter_presence/"+selectedcandidate.id)
    .then((e)=>{
      console.log(e.data)
    })
    .catch((e)=>{
      console.log(e)
    })
  }

  console.log("hona:",feedbackData)

  let handleSubmitFeedback = () => {
    axios.post("http://127.0.0.1:8000/api/add_feeback/",feedbackData)
    .then((e)=>{
      console.log(e.data)
      setFeedbackData(initialFeed)
      fetchCandidates();
    })
    .catch((e)=>{
      console.log(e)
    })
  }


  let handleRatingChange = (elem) => {
   
    setFeedbackData((e)=>({
    ...e,
    annotation_candidat : elem
    }))
  }


return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-8">
   
  
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
          placeholder="Search by first name, last name, or email..."
          name="recherche"
          onChange={(event) => setRecherche(event.target.value)}
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>


    {/* Stats */}
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl md:text-3xl font-bold text-blue-600">
            {candidates.length}
          </div>
          <div className="text-sm md:text-base text-gray-600">Total Candidates</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl md:text-3xl font-bold text-green-600">
            {candidates.filter(c => c.presence ).length}
          </div>
          <div className="text-sm md:text-base text-gray-600">Processed Candidates</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl md:text-3xl font-bold text-yellow">
            {candidates.filter(c =>  !c.presence ).length}
          </div>
          <div className="text-sm md:text-base text-gray-600">Pending</div>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Photo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                First Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200 ">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FiUsers className="text-4xl text-gray-300 mb-2" />
                    <p>No candidates found</p>
                  </div>
                </td>
              </tr>
            ) : (
              candidates.filter((i) => {
                const query = recherche.toLowerCase();
                const firstName = i.first_name ? i.first_name.toLowerCase() : "";
                const lastName = i.last_name ? i.last_name.toLowerCase() : "";
                const email = i.email ? i.email.toLowerCase() : "";
                const fullName = ` ${lastName} ${firstName}` || ` ${firstName} ${lastName} `;

                return (
                  query === "" ||
                  firstName.includes(query) ||
                  lastName.includes(query) ||
                  fullName.includes(query) ||
                  email.includes(query)
                );
              }).map((candidate, index) => (
                <tr
                    key={candidate.id || index}
                    onClick={() => {
                      if (!candidate.presence) {
                        setShowForumDetails(true);
                        setselectedcandidate(candidate);
                        setFeedbackData({ ...feedbackData, candidature_id: candidate.id });
                      }
                    }}
                    className={`hover:bg-indigo-50 transition-colors duration-150 cursor-pointer ${
                      candidate.presence ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                  {/* Photo */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow"
                        src={candidate.image} 
                        onError={(e) => { e.target.src = '/logoJG.png'; }}
                        alt={`${candidate.first_name} ${candidate.last_name}`}
                      />
                    </div>
                  </td>
                  
                  {/* Last Name */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {candidate.last_name || 'N/A'}
                    </div>
                  </td>
                  
                  {/* First Name */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {candidate.first_name || 'N/A'}
                    </div>
                  </td>
                  
                  {/* Email */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {candidate.email || 'N/A'}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm truncate max-w-xs">
                      {candidate.presence ? (
                        <span className="inline-flex items-center px-8 py-2 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Processed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-8 py-2 rounded-full text-xs font-medium bg-red-10 text-red">
                          Not processed
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
    {/* Forum Details Modal */}
      {showForumDetails && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        onClick={() => { setShowForumDetails(false); setFeedbackData(initialFeed); }}
      >
        <div
          className="bg-white p-6 md:p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="flex flex-col md:flex-row md:justify-between md:space-x-6 mb-6">
            {/* Left: Image and main info */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <img
                src={selectedcandidate.image || '/placeholder-avatar.png'}
                alt="Candidate photo"
                className="w-20 h-20 rounded-full object-cover border-2 border-light-blue shadow-sm"
              />
              <div className="text-center">
                <h2 className="text-xl font-bold" style={{ color: 'rgb(44, 62, 80)' }}>
                  {selectedcandidate.first_name} {selectedcandidate.last_name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">{selectedcandidate.email}</p>
                <a
                  href={`http://127.0.0.1:8000/${selectedcandidate.cv}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-light-blue hover:text-midnight-blue transition-colors"
                >
                  <FiFile className="mr-1" /> View CV
                </a>
              </div>
            </div>

            {/* Right: Basic info + presence */}
            <div className="flex-1 flex flex-col space-y-10 mt-4 md:mt-0">
              {/* Basic information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-3 bg-light-blue/10 rounded-lg">
                  <FiPhone className="mt-0.5 mr-3 text-light-blue flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-midnight-blue text-sm">Phone</h4>
                    <p className="text-sm text-gray-800">{selectedcandidate.numero_telephone}</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-light-blue/10 rounded-lg">
                  <FiCalendar className="mt-0.5 mr-3 text-light-blue flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-midnight-blue text-sm">Time Slot</h4>
                    <p className="text-sm text-gray-800">{selectedcandidate.event_horaire || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Presence */}
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedcandidate.presence}
                      onChange={toggleActive}
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${
                        selectedcandidate.presence ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        selectedcandidate.presence ? 'translate-x-4' : ''
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3 font-medium" style={{ color: 'rgb(44, 62, 80)' }}>
                    Presence confirmed
                  </div>
                </label>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Feedback form */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'rgb(44, 62, 80)' }}>
              <FiMessageSquare className="mr-2 text-light-blue" /> Candidate Evaluation
            </h3>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Comments - left side */}
              <div className="flex-1">
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-blue focus:border-transparent"
                  placeholder="Notes about the candidate, skills, attitude..."
                  value={feedbackData.note || ''}
                  onChange={(e) => setFeedbackData({ ...feedbackData, note: e.target.value })}
                />
              </div>

              {/* Right container with stars and status */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Rating out of 5 */}
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">Rating (0-5)</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl focus:outline-none transition-transform hover:scale-110"
                        onClick={() => handleRatingChange(star)}
                      >
                        {star <= (feedbackData.annotation_candidat || 0) ? (
                          <FiStar className="text-yellow" />
                        ) : (
                          <FiStar className="text-gray-300" />
                        )}
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-500">{feedbackData.annotation_candidat || 0}/5</span>
                  </div>
                </div>

                {/* Candidate status */}
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">Application Status</p>
                  <div className="flex flex-wrap gap-2">
                    {["Strongly yes", "Yes", "No"].map((option) => {
                      const isSelected = feedbackData.etat === option;

                      // Style configuration
                      const optionConfig = {
                        "Strongly yes": {
                          selected: {
                            bg: "bg-gradient-to-r from-emerald-500 to-green-500",
                            text: "text-white",
                            icon: (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            )
                          },
                          unselected: {
                            bg: "bg-white",
                            text: "text-emerald-700",
                            border: "border-emerald-300",
                            icon: (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            )
                          }
                        },
                        "Yes": {
                          selected: {
                            bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
                            text: "text-white",
                            icon: (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )
                          },
                          unselected: {
                            bg: "bg-white",
                            text: "text-blue-700",
                            border: "border-blue-300",
                            icon: (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )
                          }
                        },
                        "No": {
                          selected: {
                            bg: "bg-gradient-to-r from-red to-yellow",
                            text: "text-white",
                            icon: (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )
                          },
                          unselected: {
                            bg: "bg-white",
                            text: "text-red",
                            border: "border-red",
                            icon: (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )
                          }
                        }
                      };

                      const style = isSelected ? optionConfig[option].selected : optionConfig[option].unselected;

                      return (
                        <button
                          key={option}
                          type="button"
                          className={`flex items-center px-2 py-1 rounded-xl border ${style.border || 'border-gray-300'} ${style.bg} ${style.text} transition-all duration-200 font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isSelected
                              ? "ring-2 ring-white ring-opacity-50 transform -translate-y-0.5"
                              : "hover:-translate-y-0.5"
                          }`}
                          onClick={() => setFeedbackData({ ...feedbackData, etat: option })}
                        >
                          <span className="mr-1">{style.icon}</span>
                          <span className="text-sm font-medium">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className={`px-5 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-midnight-blue focus:ring-offset-2 ${
                  selectedcandidate.presence
                    ? "text-white bg-light-blue hover:bg-midnight-blue hover:shadow-lg hover:-translate-y-0.5"
                    : "text-gray-400 bg-gray-300 cursor-not-allowed"
                }`}
                disabled={!selectedcandidate.presence}
                onClick={() => {
                  if (selectedcandidate.presence) {
                    handleSubmitFeedback();
                    setShowForumDetails(false);
                  }
                }}
              >
                Save Evaluation
              </button>
            </div>

          </div>
        </div>
      </div>
      )}



  </div>
);
};

export default Candidates;

