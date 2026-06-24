// // "use client";

// // import Link from "next/link";
// // import { Forum } from "@/types";

// // interface ForumCardProps {
// //   forum: Forum;
// // }

// // function formatDate(dateStr: string) {
// //   try {
// //     return new Date(dateStr).toLocaleDateString("fr-FR", {
// //       weekday: "long",
// //       day: "numeric",
// //       month: "long",
// //       year: "numeric",
// //     });
// //   } catch {
// //     return dateStr;
// //   }
// // }

// // export default function ForumCard({ forum }: ForumCardProps) {
// //   const ratio = forum.nombre_max > 0 ? forum.currentNumber / forum.nombre_max : 0;

// //   return (
// //     <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
// //       <div className="h-2 bg-gradient-to-r from-primary to-purple" />

// //       <div className="p-6">
// //         <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
// //           {forum.nom}
// //         </h2>

// //         <div className="space-y-2 text-sm text-gray-600 mb-5">
// //           <div className="flex items-center gap-2">
// //             <svg className="h-4 w-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //             </svg>
// //             <span>{formatDate(forum.date_forum)}</span>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <svg className="h-4 w-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
// //             </svg>
// //             <span className="truncate">{forum.lieu}</span>
// //           </div>
// //         </div>

// //         <div className="flex items-center justify-between gap-3">
// //           <span
// //             className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
// //               ratio >= 0.8 ? "bg-red/10 text-red" : "bg-light-blue/10 text-light-blue"
// //             }`}
// //           >
// //             {forum.currentNumber}/{forum.nombre_max} inscrits
// //           </span>

// //           <Link
// //             href={`/user/forum/${forum.id}`}
// //             className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
// //           >
// //             Voir détail
// //           </Link>
// //         </div>
// //       </div>
// //     </article>
// //   );
// // }

// "use client";

// import Link from "next/link";
// import { Forum } from "@/types";
// import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";

// interface ForumCardProps {
//   forum: Forum;
//   className?: string;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString("fr-FR", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   } catch {
//     return dateStr;
//   }
// }

// function getRegistrationStatus(ratio: number): {
//   label: string;
//   className: string;
//   isFull: boolean;
// } {
//   if (ratio >= 1) {
//     return { label: "Complet", className: "bg-red/10 text-red", isFull: true };
//   }
//   if (ratio >= 0.8) {
//     return { label: "Places limitées", className: "bg-orange/10 text-orange", isFull: false };
//   }
//   return { label: "Places disponibles", className: "bg-green/10 text-green", isFull: false };
// }

// export default function ForumCard({ forum, className = "" }: ForumCardProps) {
//   const ratio = forum.nombre_max > 0 ? forum.currentNumber / forum.nombre_max : 0;
//   const status = getRegistrationStatus(ratio);
//   const isFull = ratio >= 1;

//   return (
//     <article 
//       className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
//       role="article"
//       aria-label={`Forum: ${forum.nom}`}
//     >
//       <div className={`h-2 bg-gradient-to-r from-primary to-purple ${
//         isFull ? "opacity-50" : ""
//       }`} />

//       <div className="p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
//           {forum.nom}
//         </h2>

//         <div className="space-y-2 text-sm text-gray-600 mb-5">
//           <div className="flex items-center gap-2">
//             <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
//             <span>{formatDate(forum.date_forum)}</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <MapPinIcon className="h-4 w-4 text-primary shrink-0" />
//             <span className="truncate" title={forum.lieu}>{forum.lieu}</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <UsersIcon className="h-4 w-4 text-primary shrink-0" />
//             <span>
//               {forum.currentNumber}/{forum.nombre_max} inscrits
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between gap-3 flex-wrap">
//           <span
//             className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${status.className}`}
//           >
//             {status.label}
//           </span>

//           <Link
//             href={`/user/forum/${forum.id}`}
//             className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
//               isFull
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-gradient-to-r from-primary to-purple hover:opacity-90 hover:shadow-md"
//             }`}
//             aria-disabled={isFull}
//             tabIndex={isFull ? -1 : undefined}
//           >
//             {isFull ? "Complet" : "Voir détail"}
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }


"use client";

import Link from "next/link";
import { Forum } from "@/types";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface ForumCardProps {
  forum: Forum;
  index?: number;
  className?: string;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getStatus(ratio: number): {
  label: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
} {
  if (ratio >= 1) {
    return {
      label: "Complet",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      icon: <span className="text-rose-500 text-xs font-bold">●</span>
    };
  }
  if (ratio >= 0.8) {
    return {
      label: "Dernières places",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      icon: <span className="text-amber-500 text-xs font-bold">●</span>
    };
  }
  return {
    label: "Disponible",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    icon: <span className="text-emerald-500 text-xs font-bold">●</span>
  };
}

export default function ForumCard({ forum, index = 0, className = "" }: ForumCardProps) {
  const ratio = forum.nombre_max > 0 ? forum.currentNumber / forum.nombre_max : 0;
  const status = getStatus(ratio);
  const isFull = ratio >= 1;
  const progress = Math.min(ratio * 100, 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${className}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top bar with gradient */}
      <div className={`h-1.5 bg-gradient-to-r from-primary to-purple transition-all duration-500 ${
        isFull ? "opacity-40" : ""
      }`} />

      <div className="relative p-6">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
            {status.icon}
            {status.label}
          </div>
          <span className="text-xs font-mono text-gray-400">
            #{String(forum.id).padStart(3, '0')}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {forum.nom}
        </h2>

        <div className="space-y-2.5 text-sm text-gray-600 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
            <span>{formatDate(forum.date_forum)}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <MapPinIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="truncate" title={forum.lieu}>{forum.lieu}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <UsersIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">
              {forum.currentNumber}
              <span className="text-gray-400 font-normal">/{forum.nombre_max}</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full rounded-full bg-gradient-to-r from-primary to-purple ${
                isFull ? "opacity-50" : ""
              }`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            {isFull ? "Plus de places disponibles" : `${forum.nombre_max - forum.currentNumber} places restantes`}
          </div>

          <Link
            href={`/user/forum/${forum.id}`}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              isFull
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-purple text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            }`}
            aria-disabled={isFull}
            tabIndex={isFull ? -1 : undefined}
          >
            {isFull ? "Complet" : "Voir le forum"}
            {!isFull && <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}