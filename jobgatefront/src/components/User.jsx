import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiEye, FiChevronDown, FiUser, FiSearch, FiBell, FiMenu, FiBriefcase } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map component to display the location
const ForumLocationMap = ({ location }) => {
  const [position, setPosition] = useState([33.5731, -7.5898]); // Default position (Casablanca)
  const [loading, setLoading] = useState(true);

  // Function to geocode an address
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return { lat: 33.5731, lng: -7.5898 }; // Default Casablanca
    } catch (error) {
      console.error('Geocoding error:', error);
      return { lat: 33.5731, lng: -7.5898 }; // Default Casablanca
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (location) {
        setLoading(true);
        const coords = await geocodeAddress(location);
        if (coords) {
          setPosition([coords.lat, coords.lng]);
        }
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [location]);

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '200px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
  );
};

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [expandedForum, setExpandedForum] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [recherche,setRecherche]=useState("")

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/forums_talent/")
      .then(res => setForums(res.data))
      .catch(err => console.error(err));
  }, []);

  let [List_cand,setList_cand]=useState([])
  useEffect(()=>{
    axios.get('http://127.0.0.1:8000/api/list_cand/').then((res)=>setList_cand(res.data))
  },[])

  // Get connected user
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleForumDetails = (forumId) => {
    setExpandedForum(expandedForum === forumId ? null : forumId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FiMenu className="h-6 w-6 text-gray-500 mr-4 lg:hidden" />
              <img src="logoJG.png" alt="Logo" className="h-24 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="recherche"
                  onChange={(event) => setRecherche(event.target.value)}
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm"
                />
              </div>
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <FiBell className="h-6 w-6" />
              </button>
              <div className="relative ml-3">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FiUser className="h-5 w-5" />
                  </div>
                  <span className="ml-2 hidden md:inline-block">My Profile</span>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
                    >
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Forums */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Welcome, {user.first_name} {user.last_name}
          </h1>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Explore Career Forums
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover professional events that will boost your career
          </p>
        </motion.header>
    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forums.filter(forum => (
              recherche.toLowerCase() === "" ||
              forum.nom.toLowerCase().includes(recherche.toLowerCase()) ||
              forum.lieu.toLowerCase().includes(recherche.toLowerCase())
          )).length == 0 ? (
            <div className="col-span-full flex justify-center items-center py-12">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red to-yellow mb-4">
                    No forums available at the moment
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Please come back later to discover upcoming events.
                  </p>
                </motion.div>
              </div>
          ) : (
            forums
              .filter(forum => {
                const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
                return (
                  (recherche.toLowerCase() === "" ||
                    forum.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                    forum.lieu.toLowerCase().includes(recherche.toLowerCase())) &&
                  forum.date_forum > today
                );}
              )
              .map((forum) => {
                const candidates = List_cand.filter(e => e.forum === forum.id);
                const isFull = candidates.length === forum.nombre_max;
                const isAlreadyRegistered = candidates.some(c => c.email === user.email);

                if (isFull && !isAlreadyRegistered) return null;

                return (
                  <motion.article
                    key={forum.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -5 }}
                    className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                      expandedForum === forum.id ? 'ring-2 ring-indigo-500 shadow-xl' : ''
                    }`}
                  >
                    {/* Color band */}
                    <div className="h-4 bg-gradient-to-br from-indigo-500 to-purple-600"></div>

                    <div className="p-6">
                      {/* Already registered badge */}
                     <div className="flex flex-col items-end space-y-1 mb-4">
                        {isAlreadyRegistered && (
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                            Already registered
                          </span>
                        )}
                      </div>

                      {/* Main info */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{forum.nom}</h2>
                          <div className="flex items-center text-gray-700 mt-1">
                            <FiBriefcase className="mr-2 text-indigo-500" />
                            <span>{forum.entreprise}</span>
                          </div>

                          <div className="flex items-center text-gray-700 mt-1">
                            <FiCalendar className="mr-2 text-indigo-500" />
                            <span>{forum.date_forum} • {forum.heure_debut} - {forum.heure_fin}</span>
                          </div>

                          <div className="flex items-center text-gray-700 mt-1">
                            <FiMapPin className="mr-2 text-indigo-500" />
                            <span>{forum.lieu}</span>
                          </div>
                        </div>

                        {/* QR Code */}
                        <Link title={`http://localhost:3000/event/${forum.nom}`} to={`/event/${forum.nom}`}>
                          {forum.qrcode && (
                            <div className="bg-white p-2 rounded-lg shadow-md mb-4">
                              <img 
                                src={`http://127.0.0.1:8000${forum.qrcode}`} 
                                alt="QR Code" 
                                className="w-24 h-24 object-contain" 
                              />
                            </div>
                          )}
                        </Link>
                      </div>

                      {/* Description & registered count */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            forum.currentNumber / forum.nombre_max >= 0.8 
                              ? 'bg-red/20 text-red' 
                              : 'bg-light-blue/20 text-light-blue'
                          }`}>
                            {candidates.length}/{forum.nombre_max} registered
                          </span>
                        </div>
                       <p className="text-gray-600 mt-1 line-clamp-2 break-words">
                          {forum.description}
                        </p>
                      </div>

                      {/* View/Details button */}
                      <div className="flex justify-between items-center">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleForumDetails(forum.id)}
                          className="flex items-center px-4 py-2 rounded-lg transition-colors bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        >
                          <FiEye className="mr-2" />
                          {expandedForum === forum.id ? 'Hide' : 'View Details'}
                          <FiChevronDown className={`ml-2 transition-transform ${expandedForum === forum.id ? 'rotate-180' : ''}`} />
                        </motion.button>
                      </div>

                      {/* Forum details */}
                      <AnimatePresence>
                        {expandedForum === forum.id && (
                          <motion.section
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-gray-200"
                          >
                            <p className="text-gray-600 text-sm break-words">
                              {forum.description}
                            </p>

                            {/* Larger QR Code */}
                            <Link title={`/event/${forum.nom}`} to={`/event/${forum.nom}`}>
                              {forum.qrcode && (
                                <motion.div
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                  className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 flex flex-col items-center"
                                >
                                  <img 
                                    src={`http://127.0.0.1:8000${forum.qrcode}`} 
                                    alt="QR Code" 
                                    className="w-32 h-32 object-contain"
                                  />
                                  <p className="text-xs text-center mt-3 text-gray-600 max-w-xs">
                                    Scan this QR Code to access the registration page
                                  </p>
                                </motion.div>
                              )}
                            </Link>

                            {/* Location map */}
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-700 mb-2">Location on map</h4>
                              <ForumLocationMap location={forum.lieu} />
                              <div className="mt-3 flex justify-center">
                                <a 
                                  href={`https://maps.google.com/?q=${encodeURIComponent(forum.lieu)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                  </svg>
                                  Open in Google Maps
                                </a>
                              </div>
                            </div>
                          </motion.section>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                );
              })
          )}
        </div>

      </div>
    </div>
  );
};

export default ForumList;
