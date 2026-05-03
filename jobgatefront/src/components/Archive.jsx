import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiUsers, FiMail, FiPhone, FiFile, FiArrowLeftCircle, FiX, FiSearch } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";

const Archive = () => {
  const [forums, setForums] = useState([]);
  const [candidats, setCandidats] = useState([]);

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);

  const [recherche,setRecherche]=useState("")
  const [recherche_cand,setRecherche_cand]=useState("")
  

  const token = localStorage.getItem("token-login");

  useEffect(() => {
    // Charger forums archivés
    axios.get("http://127.0.0.1:8000/api/archive_forums/", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => setForums(res.data))
      .catch((err) => console.error(err));

    // Charger candidats archivés
    axios.get("http://127.0.0.1:8000/api/archive_candidats/")
      .then((res) => setCandidats(res.data))
      .catch((err) => console.error(err));
  }, []);

 return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    {/* Header */}
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
    >
      {/* Back Button + Title */}
      <div className="flex flex-col md:flex-row md:items-center md:mb-0 mb-4">
        {/* Back Button */}
        <Link to="/Recruteur" className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl mr-6 md:mr-8">
          <FiArrowLeftCircle className="mr-2 text-xl" />
          <span>Back</span>
        </Link>

        {/* Centered Text */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-1 md:mb-2">
            Archived Forums
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Browse past forums and their associated candidates.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          onChange={(event) => setRecherche(event.target.value)}
          placeholder="Search..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm"
        />
      </div>
    </motion.header>

    {/* Forum List */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {forums.length === 0 ? (
        <div className="col-span-full flex justify-center items-center py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4">
              No archived forums currently exist
            </h1>
          </motion.div>
        </div>
      ) : (
        forums
        .filter((i) => {
          const query = recherche.toLowerCase();
          const name = i.nom ? i.nom.toLowerCase() : "";
          const location = i.lieu ? i.lieu.toLowerCase() : "";
          return query === "" || name.includes(query) || location.includes(query);
        })
        .map((forum) => {
          const forumCandidates = candidats.filter(c => c.forum_id === forum.forum_id);

          return (
            <motion.article
              key={forum.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{forum.nom}</h2>
                    <p className="text-gray-600 mt-1">{forum.entreprise}</p>
                    <p className="text-gray-500 text-sm">{forum.date_forum}</p>
                  </div>
                  <span className="text-sm font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                    {forumCandidates.length} candidates
                  </span>
                </div>

                {/* Button to view archived candidates */}
                <div className="flex justify-between items-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedForum({ ...forum, archivedCandidates: forumCandidates });
                      setShowArchiveModal(true);
                    }}
                    className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:shadow-md"
                  >
                    <FiUsers className="mr-2" />
                    View Archived Candidates
                  </motion.button>
                </div>
              </div>
            </motion.article>
          );
        })
      )}
    </div>

    {/* Archived Candidates Modal */}
    <AnimatePresence>
      {showArchiveModal && selectedForum && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Archived Candidates - {selectedForum.nom}
              </h2>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search_candidate"
                  onChange={(event) => setRecherche_cand(event.target.value)}
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm"
                />
              </div>

              <button
                onClick={() => setShowArchiveModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Candidate List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedForum.archivedCandidates.length > 0 ? (
                selectedForum.archivedCandidates
                .filter((i) => {
                  const query = recherche_cand.toLowerCase();
                  const firstName = i.first_name ? i.first_name.toLowerCase() : "";
                  const lastName = i.last_name ? i.last_name.toLowerCase() : "";
                  const email = i.email ? i.email.toLowerCase() : "";
                  const fullName = ` ${lastName} ${firstName}` || ` ${firstName} ${lastName} ` ;
                  return (
                    query === "" ||
                    firstName.includes(query) ||
                    lastName.includes(query) ||
                    fullName.includes(query) ||
                    email.includes(query)
                  );
                })
                .map((cand) => (
                  <div
                    key={cand.id}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cand.first_name} {cand.last_name}
                    </h3>
                    <p className="flex items-center text-gray-600 text-sm mt-1">
                      <FiMail className="mr-2 text-indigo-500" /> {cand.email}
                    </p>
                    <p className="flex items-center text-gray-600 text-sm mt-1">
                      <FiPhone className="mr-2 text-indigo-500" /> {cand.numero_telephone || "N/A"}
                    </p>
                    {cand.note && <p className="mt-2 text-sm text-gray-700 italic">Note: {cand.note}</p>}
                    {cand.etat && <p className="mt-2 text-sm text-gray-700 italic">Status: {cand.etat}</p>}
                    <a
                      href={`http://127.0.0.1:8000/${cand.cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-light-blue hover:text-midnight-blue transition-colors mt-2"
                    >
                      <FiFile className="mr-1" /> View CV
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic col-span-full">
                  No archived candidates for this forum.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

};

export default Archive;
