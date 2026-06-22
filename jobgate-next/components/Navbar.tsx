// // "use client";

// // import { useState } from "react";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import { useCurrentUser } from "@/hooks/useCurrentUser";

// // export default function Navbar() {
// //   const router = useRouter();
// //   const user = useCurrentUser();
// //   const [menuOpen, setMenuOpen] = useState(false);

// //   const handleLogout = () => {
// //     if (typeof window !== "undefined") {
// //       // Adaptez ces clés si votre flux de login en stocke d'autres
// //       localStorage.removeItem("token-login");
// //       localStorage.removeItem("user");
// //     }
// //     setMenuOpen(false);
// //     router.push("/login");
// //   };

// //   const initials = user
// //     ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
// //     : "?";

// //   return (
// //     <nav className="bg-white shadow-sm sticky top-0 z-30">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex justify-between items-center h-16">
// //           <Link
// //             href="/user"
// //             className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple"
// //           >
// //             JobGate
// //           </Link>

// //           <div className="relative">
// //             <button
// //               type="button"
// //               onClick={() => setMenuOpen((open) => !open)}
// //               className="flex items-center gap-2 rounded-full px-1 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
// //             >
// //               <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
// //                 {initials}
// //               </div>
// //               {user && (
// //                 <span className="hidden sm:inline text-sm font-medium text-gray-700">
// //                   {user.first_name} {user.last_name}
// //                 </span>
// //               )}
// //               <svg
// //                 className={`h-4 w-4 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //               </svg>
// //             </button>

// //             {menuOpen && (
// //               <>
// //                 {/* Backdrop pour fermer le menu au clic en dehors */}
// //                 <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />

// //                 <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-100 py-1 z-20">
// //                   {user && (
// //                     <div className="px-4 py-2 border-b border-gray-100">
// //                       <p className="text-sm font-medium text-gray-800 truncate">
// //                         {user.first_name} {user.last_name}
// //                       </p>
// //                       <p className="text-xs text-gray-500 truncate">{user.email}</p>
// //                     </div>
// //                   )}

// //                   <button
// //                     type="button"
// //                     onClick={handleLogout}
// //                     className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red hover:bg-red/5"
// //                   >
// //                     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         strokeWidth={2}
// //                         d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
// //                       />
// //                     </svg>
// //                     Se déconnecter
// //                   </button>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }

// "use client";

// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { 
//   UserCircleIcon, 
//   ArrowRightOnRectangleIcon,
//   ChevronDownIcon,
//   HomeIcon
// } from "@heroicons/react/24/outline";

// export default function Navbar() {
//   const router = useRouter();
//   const user = useCurrentUser();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Fermer le menu au clic à l'extérieur
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Fermer le menu avec Escape
//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") setMenuOpen(false);
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, []);

//   const handleLogout = () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("token-login");
//       localStorage.removeItem("user");
//     }
//     setMenuOpen(false);
//     router.push("/login");
//   };

//   const initials = user
//     ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
//     : "?";

//   const fullName = user 
//     ? `${user.first_name || ""} ${user.last_name || ""}`.trim() 
//     : "";

//   return (
//     <nav className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <Link
//             href="/user"
//             className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple hover:opacity-80 transition-opacity"
//             aria-label="Accueil JobGate"
//           >
//             JobGate
//           </Link>

//           <div className="relative" ref={menuRef}>
//             <button
//               type="button"
//               onClick={() => setMenuOpen((open) => !open)}
//               className="flex items-center gap-2 rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all hover:bg-gray-50"
//               aria-expanded={menuOpen}
//               aria-haspopup="true"
//             >
//               <div className="h-9 w-9 rounded-full bg-gradient-to-r from-primary/10 to-purple/10 text-primary flex items-center justify-center text-sm font-semibold">
//                 {initials}
//               </div>
//               {user && (
//                 <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[150px] truncate">
//                   {fullName}
//                 </span>
//               )}
//               <ChevronDownIcon 
//                 className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
//                   menuOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {menuOpen && (
//               <div 
//                 className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 py-1 z-20 origin-top-right animate-in fade-in zoom-in-95 duration-200"
//                 role="menu"
//               >
//                 {user && (
//                   <div className="px-4 py-3 border-b border-gray-100">
//                     <p className="text-sm font-semibold text-gray-800 truncate">
//                       {fullName}
//                     </p>
//                     <p className="text-xs text-gray-500 truncate">{user.email}</p>
//                   </div>
//                 )}

//                 <Link
//                   href="/user"
//                   className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                   role="menuitem"
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   <HomeIcon className="h-4 w-4 text-gray-400" />
//                   Accueil
//                 </Link>

//                 <button
//                   type="button"
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red hover:bg-red/5 transition-colors"
//                   role="menuitem"
//                 >
//                   <ArrowRightOnRectangleIcon className="h-4 w-4" />
//                   Se déconnecter
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }















"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  HomeIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const user = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token-login");
      localStorage.removeItem("user");
    }
    setMenuOpen(false);
    router.push("/login");
  };

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  const fullName = user 
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() 
    : "";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/user"
            className="group flex items-center gap-2 text-xl font-bold"
          >
            <span className="bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
              JobGate
            </span>
            <SparklesIcon className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <div className="relative" ref={menuRef}>
            <motion.button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-full px-3 py-1.5 hover:bg-gray-50/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/10 to-purple/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {initials}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              
              {user && (
                <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[150px] truncate">
                  {fullName}
                </span>
              )}
              
              <ChevronDownIcon 
                className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/50 py-1 z-20 overflow-hidden"
                  role="menu"
                >
                  {user && (
                    <div className="px-4 py-3 border-b border-gray-100/50">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  )}

                  <Link
                    href="/user"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HomeIcon className="h-4 w-4 text-gray-400" />
                    Accueil
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50/50 transition-colors border-t border-gray-100/50 mt-1"
                    role="menuitem"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}