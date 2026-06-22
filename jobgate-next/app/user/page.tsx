// // "use client";

// // import { useEffect, useState } from "react";
// // import { Forum } from "@/types";
// // import { getForums } from "@/services/forumService";
// // import ForumCard from "@/components/ForumCard";

// // export default function UserHomePage() {
// //   const [forums, setForums] = useState<Forum[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     let active = true;

// //     getForums()
// //       .then((data) => {
// //         if (!active) return;
// //         const today = new Date().toISOString().split("T")[0];
// //         // On n'affiche que les forums à venir
// //         setForums(data.filter((f) => f.date_forum >= today));
// //       })
// //       .catch(() => {
// //         if (active) setError("Impossible de charger les forums.");
// //       })
// //       .finally(() => {
// //         if (active) setLoading(false);
// //       });

// //     return () => {
// //       active = false;
// //     };
// //   }, []);

// //   return (
// //     <div className="min-h-screen bg-background py-10">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <header className="mb-10 text-center">
// //           <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple mb-3">
// //             Forums Carrière
// //           </h1>
// //           <p className="text-gray-600">
// //             Découvrez les forums à venir et inscrivez-vous en quelques clics
// //           </p>
// //         </header>

// //         {loading && (
// //           <p className="text-center text-gray-500">Chargement des forums...</p>
// //         )}

// //         {!loading && error && (
// //           <p className="text-center text-red">{error}</p>
// //         )}

// //         {!loading && !error && forums.length === 0 && (
// //           <p className="text-center text-gray-500">
// //             Aucun forum disponible pour le moment. Revenez plus tard.
// //           </p>
// //         )}

// //         {!loading && !error && forums.length > 0 && (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {forums.map((forum) => (
// //               <ForumCard key={forum.id} forum={forum} />
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { Forum } from "@/types";
// import { getForums } from "@/services/forumService";
// import ForumCard from "@/components/ForumCard";
// import { 
//   CalendarIcon, 
//   ExclamationTriangleIcon,
//   ArrowPathIcon
// } from "@heroicons/react/24/outline";

// export default function UserHomePage() {
//   const [forums, setForums] = useState<Forum[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchForums = useCallback(async (showRefreshing = false) => {
//     if (showRefreshing) setRefreshing(true);
//     else setLoading(true);
//     setError(null);

//     try {
//       const data = await getForums();
//       const today = new Date().toISOString().split("T")[0];
//       const upcomingForums = data.filter((f) => f.date_forum >= today);
//       setForums(upcomingForums);
//     } catch {
//       setError("Impossible de charger les forums. Veuillez réessayer.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchForums();
//   }, [fetchForums]);

//   const handleRefresh = () => {
//     fetchForums(true);
//   };

//   return (
//     <div className="min-h-screen bg-background py-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <header className="mb-10 text-center">
//           <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple mb-3">
//             Forums Carrière
//           </h1>
//           <p className="text-gray-600">
//             Découvrez les forums à venir et inscrivez-vous en quelques clics
//           </p>
//         </header>

//         {loading && (
//           <div className="flex flex-col items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary" />
//             <p className="mt-4 text-gray-500">Chargement des forums...</p>
//           </div>
//         )}

//         {!loading && error && (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <ExclamationTriangleIcon className="h-12 w-12 text-red/50 mb-4" />
//             <p className="text-red">{error}</p>
//             <button
//               type="button"
//               onClick={handleRefresh}
//               className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
//             >
//               <ArrowPathIcon className="h-4 w-4" />
//               Réessayer
//             </button>
//           </div>
//         )}

//         {!loading && !error && forums.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
//             <p className="text-gray-500">
//               Aucun forum disponible pour le moment.
//             </p>
//             <p className="text-sm text-gray-400 mt-1">
//               Revenez plus tard pour découvrir les prochains événements.
//             </p>
//           </div>
//         )}

//         {!loading && !error && forums.length > 0 && (
//           <>
//             <div className="flex justify-end mb-4">
//               <button
//                 type="button"
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
//               >
//                 <ArrowPathIcon className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//                 {refreshing ? "Actualisation..." : "Actualiser"}
//               </button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {forums.map((forum) => (
//                 <ForumCard key={forum.id} forum={forum} />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



















"use client";

import { useEffect, useState, useCallback } from "react";
import { Forum } from "@/types";
import { getForums } from "@/services/forumService";
import ForumCard from "@/components/ForumCard";
import { 
  CalendarIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  SparklesIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function UserHomePage() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchForums = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getForums();
      const today = new Date().toISOString().split("T")[0];
      const upcomingForums = data.filter((f) => f.date_forum >= today);
      setForums(upcomingForums);
    } catch {
      setError("Impossible de charger les forums. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  const handleRefresh = () => {
    fetchForums(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-purple/5 py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <SparklesIcon className="h-4 w-4" />
              Événements à venir
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple mb-4">
              Forums Carrière
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les forums à venir et inscrivez-vous en quelques clics
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-primary/50" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 font-medium">Chargement des forums...</p>
          </div>
        )}

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-rose-500" />
            </div>
            <p className="text-rose-500 font-medium">{error}</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Réessayer
            </button>
          </motion.div>
        )}

        {!loading && !error && forums.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <CalendarIcon className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun forum disponible</h3>
            <p className="text-gray-500">
              Revenez plus tard pour découvrir les prochains événements.
            </p>
          </motion.div>
        )}

        {!loading && !error && forums.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {forums.length} forum{forums.length > 1 ? "s" : ""} disponible{forums.length > 1 ? "s" : ""}
                </h2>
                <p className="text-sm text-gray-500">Inscrivez-vous dès maintenant</p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Actualisation..." : "Actualiser"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forums.map((forum, index) => (
                <ForumCard key={forum.id} forum={forum} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}