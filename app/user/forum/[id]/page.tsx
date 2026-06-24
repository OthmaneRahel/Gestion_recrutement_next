// // // // "use client";

// // // // import { useEffect, useMemo, useState } from "react";
// // // // import { useParams } from "next/navigation";
// // // // import Link from "next/link";
// // // // import dynamic from "next/dynamic";
// // // // import { Forum, Candidature } from "@/types";
// // // // import { getForumById, getCandidatures, registerForum } from "@/services/forumService";
// // // // import { getMediaUrl } from "@/lib/media";
// // // // import { useCurrentUser } from "@/hooks/useCurrentUser";
// // // // import SlotPicker from "@/components/SlotPicker";

// // // // // Leaflet a besoin de `window`, donc on désactive le rendu serveur pour ce
// // // // // composant et on ne le charge que côté navigateur.
// // // // const ForumMap = dynamic(() => import("@/components/ForumMap"), {
// // // //   ssr: false,
// // // //   loading: () => (
// // // //     <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500">
// // // //       Chargement de la carte...
// // // //     </div>
// // // //   ),
// // // // });

// // // // // Extrait uniquement la portion HH:MM d'une valeur, qu'elle arrive sous la
// // // // // forme "09:00", "09:00:00", ou un datetime ISO complet "...T09:00:00Z".
// // // // function extractTime(value: string): string {
// // // //   const match = value?.match(/(\d{2}:\d{2})/);
// // // //   return match ? match[1] : value;
// // // // }

// // // // // Génère les créneaux d'une journée à partir de l'heure de début/fin du forum
// // // // // et de la durée d'un créneau (en minutes).
// // // // function generateTimeSlots(
// // // //   dateForum: string,
// // // //   start: string,
// // // //   end: string,
// // // //   intervalMinutes: number
// // // // ): string[] {
// // // //   if (!dateForum || !start || !end || !intervalMinutes) {
// // // //     console.warn("Créneaux: données manquantes", { dateForum, start, end, intervalMinutes });
// // // //     return [];
// // // //   }

// // // //   const startTime = extractTime(start);
// // // //   const endTime = extractTime(end);

// // // //   let current = new Date(`${dateForum}T${startTime}`);
// // // //   const endDate = new Date(`${dateForum}T${endTime}`);

// // // //   if (isNaN(current.getTime()) || isNaN(endDate.getTime())) {
// // // //     console.warn("Créneaux: date invalide après parsing", {
// // // //       dateForum,
// // // //       start,
// // // //       end,
// // // //       startTime,
// // // //       endTime,
// // // //     });
// // // //     return [];
// // // //   }

// // // //   // Si l'heure de fin est avant l'heure de début, on suppose que le forum
// // // //   // chevauche minuit (ex: 22:00 -> 01:00) et on décale la fin au lendemain.
// // // //   if (endDate <= current) {
// // // //     endDate.setDate(endDate.getDate() + 1);
// // // //   }

// // // //   const slots: string[] = [];
// // // //   const fmt = (d: Date) =>
// // // //     `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

// // // //   while (current < endDate) {
// // // //     const next = new Date(current.getTime() + intervalMinutes * 60000);
// // // //     slots.push(`${fmt(current)} - ${fmt(next)}`);
// // // //     current = next;
// // // //   }

// // // //   return slots;
// // // // }

// // // // export default function ForumDetailPage() {
// // // //   const params = useParams<{ id: string }>();
// // // //   const forumId = Number(params.id);
// // // //   const user = useCurrentUser();

// // // //   const [forum, setForum] = useState<Forum | null>(null);
// // // //   const [candidatures, setCandidatures] = useState<Candidature[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [loadError, setLoadError] = useState<string | null>(null);

// // // //   const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
// // // //   const [submitting, setSubmitting] = useState(false);
// // // //   const [submitError, setSubmitError] = useState<string | null>(null);
// // // //   const [registered, setRegistered] = useState(false);

// // // //   useEffect(() => {
// // // //     let active = true;

// // // //     Promise.all([getForumById(forumId), getCandidatures()])
// // // //       .then(([forumData, candData]) => {
// // // //         if (!active) return;
// // // //         setForum(forumData ?? null);
// // // //         setCandidatures(candData);
// // // //       })
// // // //       .catch(() => {
// // // //         if (active) setLoadError("Impossible de charger ce forum.");
// // // //       })
// // // //       .finally(() => {
// // // //         if (active) setLoading(false);
// // // //       });

// // // //     return () => {
// // // //       active = false;
// // // //     };
// // // //   }, [forumId]);

// // // //   const hasSlots = !!forum && !!forum.duree && forum.duree !== 0;

// // // //   const slots = useMemo(() => {
// // // //     if (!forum || !hasSlots) return [];
// // // //     return generateTimeSlots(forum.date_forum, forum.date_debut, forum.date_fin, forum.duree);
// // // //   }, [forum, hasSlots]);

// // // //   const candidatsDuForum = useMemo(
// // // //     () => (forum ? candidatures.filter((c) => c.forum === forum.id) : []),
// // // //     [candidatures, forum]
// // // //   );

// // // //   const dejaInscrit = useMemo(
// // // //     () => !!user && candidatsDuForum.some((c) => c.email === user.email),
// // // //     [candidatsDuForum, user]
// // // //   );

// // // //   const handleRegister = async () => {
// // // //     if (!forum) return;
// // // //     if (hasSlots && !selectedSlot) return;

// // // //     setSubmitting(true);
// // // //     setSubmitError(null);
// // // //     try {
// // // //       await registerForum({
// // // //         forum_nom: forum.nom,
// // // //         horaire: hasSlots ? selectedSlot : null,
// // // //       });
// // // //       setRegistered(true);
// // // //     } catch {
// // // //       setSubmitError("L'inscription a échoué. Veuillez réessayer.");
// // // //     } finally {
// // // //       setSubmitting(false);
// // // //     }
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center text-gray-500">
// // // //         Chargement...
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (loadError || !forum) {
// // // //     return (
// // // //       <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-4">
// // // //         <p className="text-gray-600">{loadError || "Ce forum est introuvable."}</p>
// // // //         <Link href="/user" className="text-primary font-medium">
// // // //           Retour à l&apos;accueil
// // // //         </Link>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (registered || dejaInscrit) {
// // // //     return (
// // // //       <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
// // // //         <div className="h-16 w-16 rounded-full bg-green/10 text-green flex items-center justify-center mb-4">
// // // //           <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// // // //           </svg>
// // // //         </div>
// // // //         <h1 className="text-3xl font-bold text-gray-800 mb-2">Inscription confirmée</h1>
// // // //         <p className="text-gray-600 mb-6">
// // // //           Vous êtes inscrit(e) au forum « {forum.nom} ».
// // // //         </p>
// // // //         <Link
// // // //           href="/user"
// // // //           className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple text-white font-medium"
// // // //         >
// // // //           Retour à l&apos;accueil
// // // //         </Link>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   const qrUrl = getMediaUrl(forum.qrcode || forum.qrcode_img);

// // // //   return (
// // // //     <div className="min-h-screen bg-background py-10">
// // // //       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
// // // //         <Link href="/user" className="text-sm text-primary mb-6 inline-block">
// // // //           &larr; Retour aux forums
// // // //         </Link>

// // // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // // //           {/* Détails du forum */}
// // // //           <div className="lg:col-span-1">
// // // //             <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 space-y-5">
// // // //               <h1 className="text-2xl font-bold text-gray-800">{forum.nom}</h1>

// // // //               <div>
// // // //                 <p className="text-xs font-medium text-gray-500">Date</p>
// // // //                 <p className="text-gray-800">
// // // //                   {new Date(forum.date_forum).toLocaleDateString("fr-FR", {
// // // //                     weekday: "long",
// // // //                     day: "numeric",
// // // //                     month: "long",
// // // //                     year: "numeric",
// // // //                   })}
// // // //                 </p>
// // // //               </div>

// // // //               <div>
// // // //                 <p className="text-xs font-medium text-gray-500">Lieu</p>
// // // //                 <p className="text-gray-800 mb-3">{forum.lieu}</p>
// // // //                 <ForumMap location={forum.lieu} />
// // // //                 <a
// // // //                   href={`https://maps.google.com/?q=${encodeURIComponent(forum.lieu)}`}
// // // //                   target="_blank"
// // // //                   rel="noopener noreferrer"
// // // //                   className="mt-2 flex items-center justify-center gap-1 text-xs text-primary hover:underline"
// // // //                 >
// // // //                   Ouvrir dans Google Maps
// // // //                 </a>
// // // //               </div>

// // // //               <div>
// // // //                 <p className="text-xs font-medium text-gray-500">Inscrits</p>
// // // //                 <p className="text-gray-800">
// // // //                   {candidatsDuForum.length}/{forum.nombre_max}
// // // //                 </p>
// // // //               </div>

// // // //               {forum.description && (
// // // //                 <div>
// // // //                   <p className="text-xs font-medium text-gray-500">Description</p>
// // // //                   <p className="text-gray-600 text-sm break-words">{forum.description}</p>
// // // //                 </div>
// // // //               )}

// // // //               {qrUrl && (
// // // //                 <div className="flex flex-col items-center pt-4 border-t border-gray-100">
// // // //                   <img src={qrUrl} alt="QR Code du forum" className="w-32 h-32 object-contain" />
// // // //                   <p className="text-xs text-gray-500 mt-2">Code QR du forum</p>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           </div>

// // // //           {/* Inscription */}
// // // //           <div className="lg:col-span-2">
// // // //             <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
// // // //               <h2 className="text-xl font-bold text-gray-800 mb-1">Inscription</h2>

// // // //               {hasSlots ? (
// // // //                 <>
// // // //                   <p className="text-sm text-gray-500 mb-4">
// // // //                     Choisissez un créneau disponible ({forum.duree} min chacun) puis confirmez
// // // //                     votre inscription.
// // // //                   </p>
// // // //                   <SlotPicker
// // // //                     forum={forum}
// // // //                     slots={slots}
// // // //                     candidatures={candidatures}
// // // //                     selectedSlot={selectedSlot}
// // // //                     onSelect={setSelectedSlot}
// // // //                   />
// // // //                 </>
// // // //               ) : (
// // // //                 <p className="text-sm text-gray-500 mb-4">
// // // //                   Ce forum ne nécessite pas de créneau horaire. Cliquez ci-dessous pour vous
// // // //                   inscrire.
// // // //                 </p>
// // // //               )}

// // // //               {submitError && <p className="text-sm text-red mt-4">{submitError}</p>}

// // // //               <button
// // // //                 type="button"
// // // //                 onClick={handleRegister}
// // // //                 disabled={submitting || (hasSlots && !selectedSlot)}
// // // //                 className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-purple px-6 py-3 text-white font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
// // // //               >
// // // //                 {submitting ? "Inscription en cours..." : "Confirmer l'inscription"}
// // // //               </button>

// // // //               {hasSlots && !selectedSlot && (
// // // //                 <p className="mt-3 text-center text-sm text-red">
// // // //                   Veuillez sélectionner un créneau pour confirmer votre inscription
// // // //                 </p>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { useEffect, useMemo, useState, useCallback } from "react";
// // // import { useParams } from "next/navigation";
// // // import Link from "next/link";
// // // import dynamic from "next/dynamic";
// // // import { Forum, Candidature } from "@/types";
// // // import { getForumById, getCandidatures, registerForum } from "@/services/forumService";
// // // import { getMediaUrl } from "@/lib/media";
// // // import { useCurrentUser } from "@/hooks/useCurrentUser";
// // // import SlotPicker from "@/components/SlotPicker";
// // // import { 
// // //   CalendarIcon, 
// // //   MapPinIcon, 
// // //   UsersIcon, 
// // //   InformationCircleIcon,
// // //   ArrowLeftIcon,
// // //   CheckCircleIcon,
// // //   ExclamationTriangleIcon,
// // //   QrCodeIcon,
// // //   ClockIcon
// // // } from "@heroicons/react/24/outline";

// // // // Leaflet avec chargement dynamique
// // // const ForumMap = dynamic(() => import("@/components/ForumMap"), {
// // //   ssr: false,
// // //   loading: () => (
// // //     <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500 animate-pulse">
// // //       Chargement de la carte...
// // //     </div>
// // //   ),
// // // });

// // // function extractTime(value: string): string {
// // //   const match = value?.match(/(\d{2}:\d{2})/);
// // //   return match ? match[1] : value;
// // // }

// // // function generateTimeSlots(
// // //   dateForum: string,
// // //   start: string,
// // //   end: string,
// // //   intervalMinutes: number
// // // ): string[] {
// // //   if (!dateForum || !start || !end || !intervalMinutes) {
// // //     return [];
// // //   }

// // //   const startTime = extractTime(start);
// // //   const endTime = extractTime(end);

// // //   let current = new Date(`${dateForum}T${startTime}`);
// // //   const endDate = new Date(`${dateForum}T${endTime}`);

// // //   if (isNaN(current.getTime()) || isNaN(endDate.getTime())) {
// // //     return [];
// // //   }

// // //   if (endDate <= current) {
// // //     endDate.setDate(endDate.getDate() + 1);
// // //   }

// // //   const slots: string[] = [];
// // //   const fmt = (d: Date) =>
// // //     `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

// // //   while (current < endDate) {
// // //     const next = new Date(current.getTime() + intervalMinutes * 60000);
// // //     slots.push(`${fmt(current)} - ${fmt(next)}`);
// // //     current = next;
// // //   }

// // //   return slots;
// // // }

// // // export default function ForumDetailPage() {
// // //   const params = useParams<{ id: string }>();
// // //   const forumId = Number(params.id);
// // //   const user = useCurrentUser();

// // //   const [forum, setForum] = useState<Forum | null>(null);
// // //   const [candidatures, setCandidatures] = useState<Candidature[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [loadError, setLoadError] = useState<string | null>(null);

// // //   const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [submitError, setSubmitError] = useState<string | null>(null);
// // //   const [registered, setRegistered] = useState(false);

// // //   // Chargement des données
// // //   useEffect(() => {
// // //     let active = true;

// // //     Promise.all([getForumById(forumId), getCandidatures()])
// // //       .then(([forumData, candData]) => {
// // //         if (!active) return;
// // //         setForum(forumData ?? null);
// // //         setCandidatures(candData);
// // //       })
// // //       .catch(() => {
// // //         if (active) setLoadError("Impossible de charger ce forum.");
// // //       })
// // //       .finally(() => {
// // //         if (active) setLoading(false);
// // //       });

// // //     return () => {
// // //       active = false;
// // //     };
// // //   }, [forumId]);

// // //   // Vérifier si l'utilisateur est déjà inscrit
// // //   useEffect(() => {
// // //     if (user && forum) {
// // //       const alreadyRegistered = candidatures.some(
// // //         (c) => c.forum === forum.id && c.email === user.email
// // //       );
// // //       if (alreadyRegistered) {
// // //         setRegistered(true);
// // //       }
// // //     }
// // //   }, [user, forum, candidatures]);

// // //   const hasSlots = !!forum && !!forum.duree && forum.duree !== 0;

// // //   const slots = useMemo(() => {
// // //     if (!forum || !hasSlots) return [];
// // //     return generateTimeSlots(forum.date_forum, forum.date_debut, forum.date_fin, forum.duree);
// // //   }, [forum, hasSlots]);

// // //   const candidatsDuForum = useMemo(
// // //     () => (forum ? candidatures.filter((c) => c.forum === forum.id) : []),
// // //     [candidatures, forum]
// // //   );

// // //   const isFull = forum ? candidatsDuForum.length >= forum.nombre_max : false;

// // //   const handleRegister = async () => {
// // //     if (!forum) return;
// // //     if (hasSlots && !selectedSlot) return;

// // //     setSubmitting(true);
// // //     setSubmitError(null);
// // //     try {
// // //       await registerForum({
// // //         forum_nom: forum.nom,
// // //         horaire: hasSlots ? selectedSlot : null,
// // //       });
// // //       setRegistered(true);
// // //     } catch (err) {
// // //       setSubmitError(err instanceof Error ? err.message : "L'inscription a échoué. Veuillez réessayer.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex flex-col items-center justify-center">
// // //         <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary" />
// // //         <p className="mt-4 text-gray-500">Chargement du forum...</p>
// // //       </div>
// // //     );
// // //   }

// // //   if (loadError || !forum) {
// // //     return (
// // //       <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-4">
// // //         <ExclamationTriangleIcon className="h-12 w-12 text-red/50" />
// // //         <p className="text-gray-600">{loadError || "Ce forum est introuvable."}</p>
// // //         <Link href="/user" className="text-primary font-medium hover:underline inline-flex items-center gap-2">
// // //           <ArrowLeftIcon className="h-4 w-4" />
// // //           Retour à l&apos;accueil
// // //         </Link>
// // //       </div>
// // //     );
// // //   }

// // //   if (registered) {
// // //     return (
// // //       <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
// // //         <div className="h-20 w-20 rounded-full bg-green/10 text-green flex items-center justify-center mb-6">
// // //           <CheckCircleIcon className="h-10 w-10" />
// // //         </div>
// // //         <h1 className="text-3xl font-bold text-gray-800 mb-2">Inscription confirmée</h1>
// // //         <p className="text-gray-600 mb-2">
// // //           Vous êtes inscrit(e) au forum :
// // //         </p>
// // //         <p className="text-xl font-semibold text-primary mb-6">
// // //           {forum.nom}
// // //         </p>
// // //         {selectedSlot && (
// // //           <p className="text-sm text-gray-500 mb-6">
// // //             Créneau sélectionné : <span className="font-medium">{selectedSlot}</span>
// // //           </p>
// // //         )}
// // //         <Link
// // //           href="/user"
// // //           className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple text-white font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
// // //         >
// // //           <ArrowLeftIcon className="h-4 w-4" />
// // //           Retour à l&apos;accueil
// // //         </Link>
// // //       </div>
// // //     );
// // //   }

// // //   const qrUrl = getMediaUrl(forum.qrcode || forum.qrcode_img);

// // //   return (
// // //     <div className="min-h-screen bg-background py-10">
// // //       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
// // //         <Link 
// // //           href="/user" 
// // //           className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
// // //         >
// // //           <ArrowLeftIcon className="h-4 w-4" />
// // //           Retour aux forums
// // //         </Link>

// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // //           {/* Détails du forum */}
// // //           <div className="lg:col-span-1">
// // //             <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 space-y-5 sticky top-24">
// // //               <h1 className="text-2xl font-bold text-gray-800 line-clamp-2">{forum.nom}</h1>

// // //               <div className="space-y-3">
// // //                 <div>
// // //                   <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
// // //                     <CalendarIcon className="h-3 w-3" />
// // //                     Date
// // //                   </p>
// // //                   <p className="text-gray-800">
// // //                     {new Date(forum.date_forum).toLocaleDateString("fr-FR", {
// // //                       weekday: "long",
// // //                       day: "numeric",
// // //                       month: "long",
// // //                       year: "numeric",
// // //                     })}
// // //                   </p>
// // //                 </div>

// // //                 <div>
// // //                   <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
// // //                     <ClockIcon className="h-3 w-3" />
// // //                     Horaires
// // //                   </p>
// // //                   <p className="text-gray-800">
// // //                     {extractTime(forum.date_debut)} - {extractTime(forum.date_fin)}
// // //                   </p>
// // //                 </div>

// // //                 <div>
// // //                   <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
// // //                     <MapPinIcon className="h-3 w-3" />
// // //                     Lieu
// // //                   </p>
// // //                   <p className="text-gray-800 mb-3">{forum.lieu}</p>
// // //                   <ForumMap location={forum.lieu} height="180px" />
// // //                   <a
// // //                     href={`https://maps.google.com/?q=${encodeURIComponent(forum.lieu)}`}
// // //                     target="_blank"
// // //                     rel="noopener noreferrer"
// // //                     className="mt-2 flex items-center justify-center gap-1 text-xs text-primary hover:underline"
// // //                   >
// // //                     Ouvrir dans Google Maps
// // //                   </a>
// // //                 </div>

// // //                 <div>
// // //                   <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
// // //                     <UsersIcon className="h-3 w-3" />
// // //                     Participants
// // //                   </p>
// // //                   <div className="flex items-center gap-2">
// // //                     <span className="text-gray-800 font-medium">
// // //                       {candidatsDuForum.length}/{forum.nombre_max}
// // //                     </span>
// // //                     {isFull && (
// // //                       <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red/10 text-red">
// // //                         Complet
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                   <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
// // //                     <div 
// // //                       className={`h-full transition-all duration-500 ${
// // //                         isFull ? "bg-red" : "bg-gradient-to-r from-primary to-purple"
// // //                       }`}
// // //                       style={{ width: `${Math.min((candidatsDuForum.length / forum.nombre_max) * 100, 100)}%` }}
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {forum.description && (
// // //                 <div>
// // //                   <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
// // //                     <InformationCircleIcon className="h-3 w-3" />
// // //                     Description
// // //                   </p>
// // //                   <p className="text-gray-600 text-sm break-words">{forum.description}</p>
// // //                 </div>
// // //               )}

// // //               {qrUrl && (
// // //                 <div className="flex flex-col items-center pt-4 border-t border-gray-100">
// // //                   <img 
// // //                     src={qrUrl} 
// // //                     alt="QR Code du forum" 
// // //                     className="w-32 h-32 object-contain" 
// // //                     loading="lazy"
// // //                   />
// // //                   <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
// // //                     <QrCodeIcon className="h-3 w-3" />
// // //                     Code QR du forum
// // //                   </p>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Inscription */}
// // //           <div className="lg:col-span-2">
// // //             <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
// // //               <h2 className="text-xl font-bold text-gray-800 mb-1">Inscription</h2>
// // //               <p className="text-sm text-gray-500 mb-4">
// // //                 {isFull 
// // //                   ? "Ce forum est complet. Vous ne pouvez plus vous inscrire."
// // //                   : hasSlots 
// // //                   ? `Choisissez un créneau disponible (${forum.duree} min chacun) puis confirmez votre inscription.`
// // //                   : "Ce forum ne nécessite pas de créneau horaire. Cliquez ci-dessous pour vous inscrire."
// // //               }</p>

// // //               {isFull && (
// // //                 <div className="bg-red/5 border border-red/20 rounded-lg p-4 mb-4 flex items-start gap-3">
// // //                   <ExclamationTriangleIcon className="h-5 w-5 text-red shrink-0 mt-0.5" />
// // //                   <div>
// // //                     <p className="text-sm font-medium text-red">Complet</p>
// // //                     <p className="text-sm text-red/70">
// // //                       Le nombre maximum de participants est atteint.
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {!isFull && hasSlots && (
// // //                 <SlotPicker
// // //                   forum={forum}
// // //                   slots={slots}
// // //                   candidatures={candidatures}
// // //                   selectedSlot={selectedSlot}
// // //                   onSelect={setSelectedSlot}
// // //                 />
// // //               )}

// // //               {submitError && (
// // //                 <div className="mt-4 bg-red/5 border border-red/20 rounded-lg p-3 text-sm text-red flex items-start gap-2">
// // //                   <ExclamationTriangleIcon className="h-4 w-4 shrink-0 mt-0.5" />
// // //                   {submitError}
// // //                 </div>
// // //               )}

// // //               <button
// // //                 type="button"
// // //                 onClick={handleRegister}
// // //                 disabled={submitting || isFull || (hasSlots && !selectedSlot)}
// // //                 className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-purple px-6 py-3 text-white font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
// // //               >
// // //                 {submitting ? (
// // //                   <>
// // //                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
// // //                     Inscription en cours...
// // //                   </>
// // //                 ) : (
// // //                   "Confirmer l'inscription"
// // //                 )}
// // //               </button>

// // //               {hasSlots && !selectedSlot && !isFull && !submitting && (
// // //                 <p className="mt-3 text-center text-sm text-red">
// // //                   Veuillez sélectionner un créneau pour confirmer votre inscription
// // //                 </p>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
















// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import { useParams } from "next/navigation";
// // import Link from "next/link";
// // import dynamic from "next/dynamic";
// // import { Forum, Candidature } from "@/types";
// // import { getForumById, getCandidatures, registerForum } from "@/services/forumService";
// // import { getMediaUrl } from "@/lib/media";
// // import { useCurrentUser } from "@/hooks/useCurrentUser";
// // import SlotPicker from "@/components/SlotPicker";
// // import {
// //   CalendarIcon,
// //   MapPinIcon,
// //   UsersIcon,
// //   InformationCircleIcon,
// //   ArrowLeftIcon,
// //   CheckCircleIcon,
// //   ExclamationTriangleIcon,
// //   QrCodeIcon,
// //   ClockIcon,
// //   ArrowUpRightIcon,
// //   SparklesIcon,
// // } from "@heroicons/react/24/outline";

// // /* ─── Composant Carte (SSR désactivé) ─── */
// // const ForumMap = dynamic(() => import("@/components/ForumMap"), {
// //   ssr: false,
// //   loading: () => (
// //     <div className="h-[180px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-400 animate-pulse">
// //       Chargement de la carte…
// //     </div>
// //   ),
// // });

// // /* ─── Helpers ─── */
// // function extractTime(value: string): string {
// //   const match = value?.match(/(\d{2}:\d{2})/);
// //   return match ? match[1] : value;
// // }

// // function generateTimeSlots(
// //   dateForum: string,
// //   start: string,
// //   end: string,
// //   intervalMinutes: number
// // ): string[] {
// //   if (!dateForum || !start || !end || !intervalMinutes) return [];

// //   const startTime = extractTime(start);
// //   const endTime = extractTime(end);

// //   let current = new Date(`${dateForum}T${startTime}`);
// //   const endDate = new Date(`${dateForum}T${endTime}`);

// //   if (isNaN(current.getTime()) || isNaN(endDate.getTime())) return [];
// //   if (endDate <= current) endDate.setDate(endDate.getDate() + 1);

// //   const slots: string[] = [];
// //   const fmt = (d: Date) =>
// //     `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

// //   while (current < endDate) {
// //     const next = new Date(current.getTime() + intervalMinutes * 60000);
// //     slots.push(`${fmt(current)} - ${fmt(next)}`);
// //     current = next;
// //   }
// //   return slots;
// // }

// // function formatDateLong(dateStr: string): string {
// //   return new Date(dateStr).toLocaleDateString("fr-FR", {
// //     weekday: "long",
// //     day: "numeric",
// //     month: "long",
// //     year: "numeric",
// //   });
// // }

// // /* ─── Skeleton Loader ─── */
// // function SkeletonForum() {
// //   return (
// //     <div className="min-h-screen bg-slate-50 py-10">
// //       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-6" />
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           <div className="lg:col-span-1 space-y-4">
// //             <div className="bg-white rounded-2xl p-6 space-y-5 shadow-sm border border-slate-100">
// //               <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse" />
// //               <div className="space-y-3">
// //                 {[1, 2, 3, 4].map((i) => (
// //                   <div key={i} className="space-y-1">
// //                     <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
// //                     <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
// //                   </div>
// //                 ))}
// //               </div>
// //               <div className="h-[180px] bg-slate-100 rounded-xl animate-pulse" />
// //             </div>
// //           </div>
// //           <div className="lg:col-span-2">
// //             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
// //               <div className="h-7 w-1/3 bg-slate-200 rounded animate-pulse" />
// //               <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
// //               <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
// //               <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
// //               <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ─── Page Principale ─── */
// // export default function ForumDetailPage() {
// //   const params = useParams<{ id: string }>();
// //   const forumId = Number(params.id);
// //   const user = useCurrentUser();

// //   const [forum, setForum] = useState<Forum | null>(null);
// //   const [candidatures, setCandidatures] = useState<Candidature[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [loadError, setLoadError] = useState<string | null>(null);

// //   const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [submitError, setSubmitError] = useState<string | null>(null);
// //   const [registered, setRegistered] = useState(false);
// //   const [showSuccess, setShowSuccess] = useState(false);

// //   /* Chargement initial */
// //   useEffect(() => {
// //     let active = true;
// //     Promise.all([getForumById(forumId), getCandidatures()])
// //       .then(([forumData, candData]) => {
// //         if (!active) return;
// //         setForum(forumData ?? null);
// //         setCandidatures(candData);
// //       })
// //       .catch(() => {
// //         if (active) setLoadError("Impossible de charger ce forum.");
// //       })
// //       .finally(() => {
// //         if (active) setLoading(false);
// //       });
// //     return () => { active = false; };
// //   }, [forumId]);

// //   /* Vérification inscription existante */
// //   useEffect(() => {
// //     if (user && forum) {
// //       const already = candidatures.some(
// //         (c) => c.forum === forum.id && c.email === user.email
// //       );
// //       if (already) setRegistered(true);
// //     }
// //   }, [user, forum, candidatures]);

// //   const hasSlots = !!forum && !!forum.duree && forum.duree !== 0;

// //   const slots = useMemo(() => {
// //     if (!forum || !hasSlots) return [];
// //     return generateTimeSlots(forum.date_forum, forum.date_debut, forum.date_fin, forum.duree);
// //   }, [forum, hasSlots]);

// //   const candidatsDuForum = useMemo(
// //     () => (forum ? candidatures.filter((c) => c.forum === forum.id) : []),
// //     [candidatures, forum]
// //   );

// //   const isFull = forum ? candidatsDuForum.length >= forum.nombre_max : false;
// //   const occupancyRate = forum
// //     ? Math.min((candidatsDuForum.length / forum.nombre_max) * 100, 100)
// //     : 0;

// //   const handleRegister = async () => {
// //     if (!forum) return;
// //     if (hasSlots && !selectedSlot) return;

// //     setSubmitting(true);
// //     setSubmitError(null);
// //     try {
// //       await registerForum({
// //         forum_nom: forum.nom,
// //         horaire: hasSlots ? selectedSlot : null,
// //       });
// //       setRegistered(true);
// //       setShowSuccess(true);
// //     } catch (err) {
// //       setSubmitError(err instanceof Error ? err.message : "L'inscription a échoué. Veuillez réessayer.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   /* ─── État : Chargement ─── */
// //   if (loading) return <SkeletonForum />;

// //   /* ─── État : Erreur / Introuvable ─── */
// //   if (loadError || !forum) {
// //     return (
// //       <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5 text-center p-6">
// //         <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
// //           <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
// //         </div>
// //         <div>
// //           <h2 className="text-xl font-semibold text-slate-800 mb-1">Oups !</h2>
// //           <p className="text-slate-500">{loadError || "Ce forum est introuvable."}</p>
// //         </div>
// //         <Link
// //           href="/user"
// //           className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
// //         >
// //           <ArrowLeftIcon className="h-4 w-4" />
// //           Retour à l&apos;accueil
// //         </Link>
// //       </div>
// //     );
// //   }

// //   /* ─── État : Inscription confirmée ─── */
// //   if (registered) {
// //     return (
// //       <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
// //         <div className={`transition-all duration-700 ${showSuccess ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
// //           <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-100">
// //             <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
// //           </div>
// //           <h1 className="text-3xl font-bold text-slate-900 mb-2">Inscription confirmée</h1>
// //           <p className="text-slate-500 mb-1">Vous êtes inscrit(e) au forum :</p>
// //           <p className="text-xl font-semibold text-indigo-600 mb-6">{forum.nom}</p>

// //           {selectedSlot && (
// //             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8 border border-indigo-100">
// //               <ClockIcon className="h-4 w-4" />
// //               Créneau : {selectedSlot}
// //             </div>
// //           )}

// //           <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
// //             <Link
// //               href="/user"
// //               className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
// //             >
// //               <ArrowLeftIcon className="h-4 w-4" />
// //               Retour à l&apos;accueil
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const qrUrl = getMediaUrl(forum.qrcode || forum.qrcode_img);

// //   /* ─── Rendu Principal ─── */
// //   return (
// //     <main className="min-h-screen bg-slate-50 py-10">
// //       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* Breadcrumb */}
// //         <nav className="mb-8">
// //           <Link
// //             href="/user"
// //             className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
// //           >
// //             <span className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
// //               <ArrowLeftIcon className="h-4 w-4" />
// //             </span>
// //             <span className="font-medium">Retour aux forums</span>
// //           </Link>
// //         </nav>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
// //           {/* ═══════════════════════════════════════
// //               COLONNE GAUCHE : Informations du forum
// //               ═══════════════════════════════════════ */}
// //           <aside className="lg:col-span-1 space-y-6">
// //             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
// //               {/* En-tête avec badge de statut */}
// //               <div className="p-6 pb-4 border-b border-slate-50">
// //                 <div className="flex items-start justify-between gap-3 mb-3">
// //                   <h1 className="text-xl font-bold text-slate-900 leading-tight">
// //                     {forum.nom}
// //                   </h1>
// //                   {isFull ? (
// //                     <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
// //                       <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
// //                       Complet
// //                     </span>
// //                   ) : (
// //                     <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
// //                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
// //                       Ouvert
// //                     </span>
// //                   )}
// //                 </div>
// //                 <p className="text-sm text-slate-500 flex items-center gap-1.5">
// //                   <SparklesIcon className="h-3.5 w-3.5 text-amber-500" />
// //                   Inscription {hasSlots ? "avec créneau horaire" : "libre"}
// //                 </p>
// //               </div>

// //               <div className="p-6 space-y-6">
// //                 {/* Date & Horaires */}
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
// //                     <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
// //                       <CalendarIcon className="h-3.5 w-3.5" />
// //                       Date
// //                     </p>
// //                     <p className="text-sm font-semibold text-slate-800">
// //                       {formatDateLong(forum.date_forum)}
// //                     </p>
// //                   </div>
// //                   <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
// //                     <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
// //                       <ClockIcon className="h-3.5 w-3.5" />
// //                       Horaires
// //                     </p>
// //                     <p className="text-sm font-semibold text-slate-800">
// //                       {extractTime(forum.date_debut)} - {extractTime(forum.date_fin)}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {/* Lieu + Carte */}
// //                 <div>
// //                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
// //                     <MapPinIcon className="h-3.5 w-3.5" />
// //                     Lieu
// //                   </p>
// //                   <p className="text-sm text-slate-700 font-medium mb-3">{forum.lieu}</p>
// //                   <div className="rounded-xl overflow-hidden border border-slate-100">
// //                     <ForumMap location={forum.lieu} height="160px" />
// //                   </div>
// //                   <a
// //                     href={`https://maps.google.com/?q=${encodeURIComponent(forum.lieu)}`}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     className="mt-2.5 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
// //                   >
// //                     Ouvrir dans Google Maps
// //                     <ArrowUpRightIcon className="h-3 w-3" />
// //                   </a>
// //                 </div>

// //                 {/* Participants avec barre de progression */}
// //                 <div>
// //                   <div className="flex items-center justify-between mb-2">
// //                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
// //                       <UsersIcon className="h-3.5 w-3.5" />
// //                       Participants
// //                     </p>
// //                     <span className="text-xs font-bold text-slate-700">
// //                       {candidatsDuForum.length}/{forum.nombre_max}
// //                     </span>
// //                   </div>
// //                   <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
// //                     <div
// //                       className={`h-full rounded-full transition-all duration-700 ease-out ${
// //                         isFull
// //                           ? "bg-red-500"
// //                           : occupancyRate > 80
// //                           ? "bg-amber-500"
// //                           : "bg-emerald-500"
// //                       }`}
// //                       style={{ width: `${occupancyRate}%` }}
// //                     />
// //                   </div>
// //                   <p className="mt-1.5 text-xs text-slate-400">
// //                     {isFull
// //                       ? "Nombre maximum de participants atteint"
// //                       : `${forum.nombre_max - candidatsDuForum.length} place${forum.nombre_max - candidatsDuForum.length > 1 ? 's' : ''} restante${forum.nombre_max - candidatsDuForum.length > 1 ? 's' : ''}`}
// //                   </p>
// //                 </div>

// //                 {/* Description */}
// //                 {forum.description && (
// //                   <div className="pt-4 border-t border-slate-100">
// //                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
// //                       <InformationCircleIcon className="h-3.5 w-3.5" />
// //                       Description
// //                     </p>
// //                     <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
// //                       {forum.description}
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* QR Code */}
// //                 {qrUrl && (
// //                   <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
// //                     <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
// //                       <img
// //                         src={qrUrl}
// //                         alt="QR Code du forum"
// //                         className="w-28 h-28 object-contain"
// //                         loading="lazy"
// //                       />
// //                     </div>
// //                     <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
// //                       <QrCodeIcon className="h-3 w-3" />
// //                       Code QR du forum
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </aside>

// //           {/* ═══════════════════════════════════════
// //               COLONNE DROITE : Inscription
// //               ═══════════════════════════════════════ */}
// //           <section className="lg:col-span-2">
// //             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
// //               <div className="p-6 pb-4 border-b border-slate-50">
// //                 <h2 className="text-lg font-bold text-slate-900">Inscription</h2>
// //                 <p className="text-sm text-slate-500 mt-1">
// //                   {isFull
// //                     ? "Ce forum est complet. Aucune inscription n'est possible pour le moment."
// //                     : hasSlots
// //                     ? `Choisissez un créneau disponible (${forum.duree} min chacun) puis confirmez votre inscription.`
// //                     : "Ce forum ne nécessite pas de créneau horaire. Cliquez ci-dessous pour vous inscrire."}
// //                 </p>
// //               </div>

// //               <div className="p-6">
// //                 {/* Alerte Complet */}
// //                 {isFull && (
// //                   <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
// //                     <div className="shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
// //                       <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
// //                     </div>
// //                     <div>
// //                       <p className="text-sm font-semibold text-red-800">Forum complet</p>
// //                       <p className="text-sm text-red-600 mt-0.5">
// //                         Le nombre maximum de participants ({forum.nombre_max}) est atteint.
// //                         Revenez plus tard pour vérifier si des places se libèrent.
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Alerte Places limitées */}
// //                 {!isFull && occupancyRate >= 80 && (
// //                   <div className="mb-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
// //                     <div className="shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
// //                       <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
// //                     </div>
// //                     <div>
// //                       <p className="text-sm font-semibold text-amber-800">Places limitées</p>
// //                       <p className="text-sm text-amber-700 mt-0.5">
// //                         Il ne reste que {forum.nombre_max - candidatsDuForum.length} place(s). Ne tardez pas !
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* SlotPicker */}
// //                 {!isFull && hasSlots && (
// //                   <div className="mb-6">
// //                     <SlotPicker
// //                       forum={forum}
// //                       slots={slots}
// //                       candidatures={candidatures}
// //                       selectedSlot={selectedSlot}
// //                       onSelect={setSelectedSlot}
// //                     />
// //                   </div>
// //                 )}

// //                 {/* Message créneau requis */}
// //                 {hasSlots && !selectedSlot && !isFull && (
// //                   <div className="mb-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
// //                     <InformationCircleIcon className="h-4 w-4 shrink-0" />
// //                     Veuillez sélectionner un créneau pour confirmer votre inscription
// //                   </div>
// //                 )}

// //                 {/* Erreur serveur */}
// //                 {submitError && (
// //                   <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 animate-[slideIn_0.3s_ease-out]">
// //                     <ExclamationTriangleIcon className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
// //                     <div>
// //                       <p className="text-sm font-semibold text-red-800">Erreur</p>
// //                       <p className="text-sm text-red-600 mt-0.5">{submitError}</p>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Bouton d'action */}
// //                 <button
// //                   type="button"
// //                   onClick={handleRegister}
// //                   disabled={submitting || isFull || (hasSlots && !selectedSlot)}
// //                   className={`w-full inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-white font-semibold shadow-lg transition-all duration-200
// //                     ${isFull
// //                       ? "bg-slate-300 cursor-not-allowed shadow-none"
// //                       : hasSlots && !selectedSlot
// //                       ? "bg-slate-300 cursor-not-allowed shadow-none"
// //                       : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 shadow-indigo-100"
// //                     }
// //                   `}
// //                 >
// //                   {submitting ? (
// //                     <>
// //                       <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2" />
// //                       Inscription en cours…
// //                     </>
// //                   ) : isFull ? (
// //                     <>
// //                       <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
// //                       Forum complet
// //                     </>
// //                   ) : hasSlots && !selectedSlot ? (
// //                     <>
// //                       <ClockIcon className="h-5 w-5 mr-2" />
// //                       Sélectionnez un créneau
// //                     </>
// //                   ) : (
// //                     <>
// //                       <CheckCircleIcon className="h-5 w-5 mr-2" />
// //                       Confirmer mon inscription
// //                     </>
// //                   )}
// //                 </button>

// //                 {/* Info sécurité */}
// //                 <p className="mt-4 text-center text-xs text-slate-400">
// //                   En vous inscrivant, vous acceptez de recevoir les informations relatives à ce forum.
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Carte de confiance / info additionnelle */}
// //             {!isFull && (
// //               <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
// //                 <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
// //                   <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
// //                     <ClockIcon className="h-5 w-5 text-indigo-600" />
// //                   </div>
// //                   <div>
// //                     <p className="text-xs font-semibold text-slate-700">Durée</p>
// //                     <p className="text-xs text-slate-500">{hasSlots ? `${forum.duree} min/crén.`: "Libre"}</p>
// //                   </div>
// //                 </div>
// //                 <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
// //                   <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
// //                     <UsersIcon className="h-5 w-5 text-emerald-600" />
// //                   </div>
// //                   <div>
// //                     <p className="text-xs font-semibold text-slate-700">Capacité</p>
// //                     <p className="text-xs text-slate-500">{forum.nombre_max} participants</p>
// //                   </div>
// //                 </div>
// //                 <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
// //                   <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
// //                     <MapPinIcon className="h-5 w-5 text-amber-600" />
// //                   </div>
// //                   <div>
// //                     <p className="text-xs font-semibold text-slate-700">Accès</p>
// //                     <p className="text-xs text-slate-500">Plan interactif</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </section>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }




// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import dynamic from "next/dynamic";
// import { Forum, Candidature } from "@/types";
// import { getForumById, getCandidatures, registerForum } from "@/services/forumService";
// import { getMediaUrl } from "@/lib/media";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import SlotPicker from "@/components/SlotPicker";
// import {
//   CalendarIcon,
//   MapPinIcon,
//   UsersIcon,
//   InformationCircleIcon,
//   ArrowLeftIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   QrCodeIcon,
//   ClockIcon,
//   ArrowUpRightIcon,
//   SparklesIcon,
//   ShieldCheckIcon,
//   BuildingOfficeIcon,
//   DocumentTextIcon,
// } from "@heroicons/react/24/outline";

// /* ─── Carte dynamique ─── */
// const ForumMap = dynamic(() => import("@/components/ForumMap"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[200px] flex items-center justify-center bg-slate-50/80 rounded-xl border border-slate-200 text-sm text-slate-400 animate-pulse">
//       <div className="flex flex-col items-center gap-2">
//         <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin" />
//         Chargement de la carte…
//       </div>
//     </div>
//   ),
// });

// /* ─── Helpers ─── */
// function extractTime(value: string): string {
//   const match = value?.match(/(\d{2}:\d{2})/);
//   return match ? match[1] : value;
// }

// function generateTimeSlots(
//   dateForum: string,
//   start: string,
//   end: string,
//   intervalMinutes: number
// ): string[] {
//   if (!dateForum || !start || !end || !intervalMinutes) return [];

//   const startTime = extractTime(start);
//   const endTime = extractTime(end);

//   let current = new Date(`${dateForum}T${startTime}`);
//   const endDate = new Date(`${dateForum}T${endTime}`);

//   if (isNaN(current.getTime()) || isNaN(endDate.getTime())) return [];
//   if (endDate <= current) endDate.setDate(endDate.getDate() + 1);

//   const slots: string[] = [];
//   const fmt = (d: Date) =>
//     `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

//   while (current < endDate) {
//     const next = new Date(current.getTime() + intervalMinutes * 60000);
//     slots.push(`${fmt(current)} - ${fmt(next)}`);
//     current = next;
//   }
//   return slots;
// }

// function formatDateLong(dateStr: string): string {
//   return new Date(dateStr).toLocaleDateString("fr-FR", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// }

// /* ─── Skeleton amélioré ─── */
// function SkeletonForum() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="h-5 w-40 bg-slate-200 rounded-lg animate-pulse mb-8" />
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white rounded-2xl p-6 space-y-5 shadow-sm border border-slate-100">
//               <div className="h-10 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
//               <div className="space-y-4">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} className="space-y-1.5">
//                     <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
//                     <div className="h-6 w-5/6 bg-slate-200 rounded animate-pulse" />
//                   </div>
//                 ))}
//               </div>
//               <div className="h-[200px] bg-slate-100 rounded-xl animate-pulse" />
//             </div>
//           </div>
//           <div className="lg:col-span-3">
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
//               <div className="h-8 w-1/3 bg-slate-200 rounded-lg animate-pulse" />
//               <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
//               <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
//               <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
//               <div className="h-14 bg-slate-200 rounded-xl animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Page Principale ─── */
// export default function ForumDetailPage() {
//   const params = useParams<{ id: string }>();
//   const forumId = Number(params.id);
//   const user = useCurrentUser();

//   const [forum, setForum] = useState<Forum | null>(null);
//   const [candidatures, setCandidatures] = useState<Candidature[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState<string | null>(null);

//   const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [registered, setRegistered] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   /* Chargement */
//   useEffect(() => {
//     let active = true;
//     Promise.all([getForumById(forumId), getCandidatures()])
//       .then(([forumData, candData]) => {
//         if (!active) return;
//         setForum(forumData ?? null);
//         setCandidatures(candData);
//       })
//       .catch(() => {
//         if (active) setLoadError("Impossible de charger ce forum.");
//       })
//       .finally(() => {
//         if (active) setLoading(false);
//       });
//     return () => { active = false; };
//   }, [forumId]);

//   /* Vérification inscription existante */
//   useEffect(() => {
//     if (user && forum) {
//       const already = candidatures.some(
//         (c) => c.forum === forum.id && c.email === user.email
//       );
//       if (already) setRegistered(true);
//     }
//   }, [user, forum, candidatures]);

//   const hasSlots = !!forum && !!forum.duree && forum.duree !== 0;

//   const slots = useMemo(() => {
//     if (!forum || !hasSlots) return [];
//     return generateTimeSlots(forum.date_forum, forum.date_debut, forum.date_fin, forum.duree);
//   }, [forum, hasSlots]);

//   const candidatsDuForum = useMemo(
//     () => (forum ? candidatures.filter((c) => c.forum === forum.id) : []),
//     [candidatures, forum]
//   );

//   const isFull = forum ? candidatsDuForum.length >= forum.nombre_max : false;
//   const occupancyRate = forum
//     ? Math.min((candidatsDuForum.length / forum.nombre_max) * 100, 100)
//     : 0;

//   const handleRegister = async () => {
//     if (!forum) return;
//     if (hasSlots && !selectedSlot) return;

//     setSubmitting(true);
//     setSubmitError(null);
//     try {
//       await registerForum({
//         forum_nom: forum.nom,
//         horaire: hasSlots ? selectedSlot : null,
//       });
//       setRegistered(true);
//       setShowSuccess(true);
//     } catch (err) {
//       setSubmitError(err instanceof Error ? err.message : "L'inscription a échoué. Veuillez réessayer.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ─── Chargement ─── */
//   if (loading) return <SkeletonForum />;

//   /* ─── Erreur ─── */
//   if (loadError || !forum) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center gap-6 text-center p-6">
//         <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center ring-4 ring-red-100">
//           <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900 mb-1">Forum introuvable</h2>
//           <p className="text-slate-500 max-w-md">{loadError || "Ce forum n'existe pas ou a été supprimé."}</p>
//         </div>
//         <Link
//           href="/user"
//           className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
//         >
//           <ArrowLeftIcon className="h-4 w-4" />
//           Retour à l&apos;accueil
//         </Link>
//       </div>
//     );
//   }

//   /* ─── Inscription confirmée ─── */
//   if (registered) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50 flex flex-col items-center justify-center text-center p-6">
//         <div className={`transition-all duration-700 ${showSuccess ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
//           <div className="h-28 w-28 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8 ring-4 ring-emerald-200">
//             <CheckCircleIcon className="h-14 w-14 text-emerald-600" />
//           </div>
//           <h1 className="text-3xl font-bold text-slate-900 mb-2">Inscription confirmée !</h1>
//           <p className="text-slate-500 mb-1">Vous êtes officiellement inscrit(e) au forum :</p>
//           <p className="text-2xl font-semibold text-indigo-600 mb-6">{forum.nom}</p>

//           {selectedSlot && (
//             <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-indigo-700 text-sm font-medium mb-8 border border-indigo-200 shadow-sm">
//               <ClockIcon className="h-4 w-4" />
//               Créneau réservé : {selectedSlot}
//             </div>
//           )}

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Link
//               href="/user"
//               className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
//             >
//               <ArrowLeftIcon className="h-4 w-4" />
//               Retour à l&apos;accueil
//             </Link>
//             <button
//               className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
//               onClick={() => window.print()}
//             >
//               <DocumentTextIcon className="h-4 w-4" />
//               Imprimer la confirmation
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const qrUrl = getMediaUrl(forum.qrcode || forum.qrcode_img);

//   /* ─── Rendu Principal ─── */
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Fil d'Ariane */}
//         <nav className="mb-8">
//           <Link
//             href="/user"
//             className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
//           >
//             <span className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
//               <ArrowLeftIcon className="h-4 w-4" />
//             </span>
//             <span className="font-medium">Retour aux forums</span>
//           </Link>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
//           {/* ════════════════════════════════
//               COLONNE GAUCHE (2/5) : Détails
//               ════════════════════════════════ */}
//           <aside className="lg:col-span-2 space-y-6">
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
              
//               {/* Header avec badge */}
//               <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
//                 <div className="flex items-start justify-between gap-3 mb-2">
//                   <h1 className="text-xl font-bold text-slate-900 leading-tight flex-1">
//                     {forum.nom}
//                   </h1>
//                   {isFull ? (
//                     <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
//                       <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
//                       Complet
//                     </span>
//                   ) : (
//                     <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
//                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                       {occupancyRate > 80 ? "Dernières places" : "Disponible"}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-sm text-slate-500 flex items-center gap-1.5">
//                   <SparklesIcon className="h-3.5 w-3.5 text-amber-500" />
//                   Inscription {hasSlots ? "avec créneau horaire" : "libre"}
//                 </p>
//               </div>

//               <div className="p-6 space-y-6">
                
//                 {/* Grille Date & Horaires */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
//                     <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
//                       <CalendarIcon className="h-3.5 w-3.5" />
//                       Date
//                     </p>
//                     <p className="text-sm font-semibold text-slate-800">
//                       {formatDateLong(forum.date_forum)}
//                     </p>
//                   </div>
//                   <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
//                     <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
//                       <ClockIcon className="h-3.5 w-3.5" />
//                       Horaires
//                     </p>
//                     <p className="text-sm font-semibold text-slate-800">
//                       {extractTime(forum.date_debut)} - {extractTime(forum.date_fin)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Lieu + Carte */}
//                 <div>
//                   <div className="flex items-center gap-1.5 mb-2">
//                     <MapPinIcon className="h-4 w-4 text-slate-400" />
//                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lieu</p>
//                   </div>
//                   <p className="text-sm text-slate-700 font-medium mb-3 flex items-center gap-2">
//                     <BuildingOfficeIcon className="h-4 w-4 text-slate-400" />
//                     {forum.lieu}
//                   </p>
//                   <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
//                     <ForumMap location={forum.lieu} height="180px" />
//                   </div>
//                   <a
//                     href={`https://maps.google.com/?q=${encodeURIComponent(forum.lieu)}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline"
//                   >
//                     Ouvrir dans Google Maps
//                     <ArrowUpRightIcon className="h-3 w-3" />
//                   </a>
//                 </div>

//                 {/* Participants avec barre de progression */}
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-1.5">
//                       <UsersIcon className="h-4 w-4 text-slate-400" />
//                       <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Participants</p>
//                     </div>
//                     <span className="text-xs font-bold text-slate-700">
//                       {candidatsDuForum.length}/{forum.nombre_max}
//                     </span>
//                   </div>
//                   <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50">
//                     <div
//                       className={`h-full rounded-full transition-all duration-700 ease-out ${
//                         isFull
//                           ? "bg-red-500"
//                           : occupancyRate > 80
//                           ? "bg-amber-500"
//                           : "bg-indigo-500"
//                       }`}
//                       style={{ width: `${occupancyRate}%` }}
//                     />
//                   </div>
//                   <p className="mt-2 text-xs text-slate-400">
//                     {isFull
//                       ? "Nombre maximum de participants atteint"
//                       : `${forum.nombre_max - candidatsDuForum.length} place${forum.nombre_max - candidatsDuForum.length > 1 ? 's' : ''} restante${forum.nombre_max - candidatsDuForum.length > 1 ? 's' : ''}`}
//                   </p>
//                 </div>

//                 {/* Description */}
//                 {forum.description && (
//                   <div className="pt-4 border-t border-slate-100">
//                     <div className="flex items-center gap-1.5 mb-2">
//                       <InformationCircleIcon className="h-4 w-4 text-slate-400" />
//                       <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</p>
//                     </div>
//                     <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
//                       {forum.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* QR Code */}
//                 {qrUrl && (
//                   <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
//                     <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
//                       <img
//                         src={qrUrl}
//                         alt="QR Code du forum"
//                         className="w-28 h-28 object-contain"
//                         loading="lazy"
//                       />
//                     </div>
//                     <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
//                       <QrCodeIcon className="h-3 w-3" />
//                       Code QR du forum
//                     </p>
//                   </div>
//                 )}

//                 {/* Badge sécurité */}
//                 <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400">
//                   <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
//                   <span>Informations certifiées par l&apos;organisateur</span>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* ════════════════════════════════
//               COLONNE DROITE (3/5) : Inscription
//               ════════════════════════════════ */}
//           <section className="lg:col-span-3">
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
              
//               <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/30 to-white">
//                 <div className="flex items-center gap-2">
//                   <h2 className="text-lg font-bold text-slate-900">Inscription</h2>
//                   <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold">Action</span>
//                 </div>
//                 <p className="text-sm text-slate-500 mt-1">
//                   {isFull
//                     ? "Ce forum est complet. Aucune inscription n'est possible pour le moment."
//                     : hasSlots
//                     ? `Choisissez un créneau disponible (${forum.duree} min chacun) puis confirmez votre inscription.`
//                     : "Ce forum ne nécessite pas de créneau horaire. Cliquez ci-dessous pour vous inscrire."}
//                 </p>
//               </div>

//               <div className="p-6 space-y-6">
                
//                 {/* Alerte Complet */}
//                 {isFull && (
//                   <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4">
//                     <div className="shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
//                       <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-red-800">Forum complet</p>
//                       <p className="text-sm text-red-600 mt-1">
//                         Le nombre maximum de participants ({forum.nombre_max}) est atteint.
//                         Revenez plus tard pour vérifier si des places se libèrent.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Alerte Places limitées */}
//                 {!isFull && occupancyRate >= 80 && (
//                   <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
//                     <div className="shrink-0 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
//                       <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-amber-800">Places limitées</p>
//                       <p className="text-sm text-amber-700 mt-1">
//                         Il ne reste que {forum.nombre_max - candidatsDuForum.length} place(s). Ne tardez pas !
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* SlotPicker avec conteneur stylisé */}
//                 {!isFull && hasSlots && (
//                   <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-4">
//                     <SlotPicker
//                       forum={forum}
//                       slots={slots}
//                       candidatures={candidatures}
//                       selectedSlot={selectedSlot}
//                       onSelect={setSelectedSlot}
//                     />
//                   </div>
//                 )}

//                 {/* Message créneau requis */}
//                 {hasSlots && !selectedSlot && !isFull && (
//                   <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50/80 px-4 py-3 rounded-lg border border-amber-200">
//                     <InformationCircleIcon className="h-5 w-5 shrink-0" />
//                     Veuillez sélectionner un créneau pour confirmer votre inscription
//                   </div>
//                 )}

//                 {/* Erreur serveur */}
//                 {submitError && (
//                   <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-[slideIn_0.3s_ease-out]">
//                     <ExclamationTriangleIcon className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-semibold text-red-800">Erreur</p>
//                       <p className="text-sm text-red-600 mt-0.5">{submitError}</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Bouton d'action principal */}
//                 <button
//                   type="button"
//                   onClick={handleRegister}
//                   disabled={submitting || isFull || (hasSlots && !selectedSlot)}
//                   className={`w-full inline-flex items-center justify-center rounded-xl px-6 py-4 text-white font-semibold shadow-lg transition-all duration-200
//                     ${isFull
//                       ? "bg-slate-300 cursor-not-allowed shadow-none"
//                       : hasSlots && !selectedSlot
//                       ? "bg-slate-300 cursor-not-allowed shadow-none"
//                       : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 shadow-indigo-100"
//                     }
//                   `}
//                 >
//                   {submitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2" />
//                       Inscription en cours…
//                     </>
//                   ) : isFull ? (
//                     <>
//                       <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
//                       Forum complet
//                     </>
//                   ) : hasSlots && !selectedSlot ? (
//                     <>
//                       <ClockIcon className="h-5 w-5 mr-2" />
//                       Sélectionnez un créneau
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircleIcon className="h-5 w-5 mr-2" />
//                       Confirmer mon inscription
//                     </>
//                   )}
//                 </button>

//                 {/* Information de sécurité */}
//                 <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
//                   <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
//                   <span>Votre inscription est sécurisée et protégée</span>
//                 </div>
//               </div>
//             </div>

//             {/* Cartes d'informations complémentaires */}
//             {!isFull && (
//               <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
//                   <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
//                     <ClockIcon className="h-6 w-6 text-indigo-600" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-slate-700">Durée</p>
//                     <p className="text-sm text-slate-500 font-medium">{hasSlots ? `${forum.duree} min / créneau` : "Libre"}</p>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
//                   <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
//                     <UsersIcon className="h-6 w-6 text-emerald-600" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-slate-700">Capacité</p>
//                     <p className="text-sm text-slate-500 font-medium">{forum.nombre_max} participants</p>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
//                   <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
//                     <MapPinIcon className="h-6 w-6 text-amber-600" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-slate-700">Accès</p>
//                     <p className="text-sm text-slate-500 font-medium">Plan interactif inclus</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }



"use client";

import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Forum, Candidature } from "@/types";
import { getForumById, getCandidatures, registerForum } from "@/services/forumService";
import { getMediaUrl } from "@/lib/media";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import SlotPicker from "@/components/SlotPicker";
import {
  CalendarIcon,
  MapPinIcon,
  MapIcon,
  UsersIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  ClockIcon,
  ArrowUpRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  TicketIcon,
  BellAlertIcon,
  ChevronDownIcon,
  ShareIcon,
  BookmarkIcon,
  StarIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

/* ═══════════════════════════════════════════
   Interfaces & Types
   ═══════════════════════════════════════════ */
interface FeedbackMessage {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  icon?: React.ReactNode;
}

/* ═══════════════════════════════════════════
   Carte dynamique (SSR désactivé)
   ═══════════════════════════════════════════ */
const ForumMap = dynamic(() => import("@/components/ForumMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[220px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 text-sm text-slate-400 gap-2">
      <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-400 animate-spin" />
      <span>Chargement de la carte…</span>
    </div>
  ),
});

/* ═══════════════════════════════════════════
   Composants memoïsés pour performance
   ═══════════════════════════════════════════ */
const QuickFact = memo(function QuickFact({
  icon,
  label,
  value,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div 
      className="flex items-center gap-2.5 shrink-0 rounded-2xl bg-slate-50/80 border border-slate-100 px-3.5 py-2.5 min-w-[148px] hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-default group"
      title={tooltip}
    >
      <div className="h-8 w-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shrink-0 group-hover:shadow-sm transition-shadow">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 mt-1 truncate">{value}</p>
      </div>
    </div>
  );
});

QuickFact.displayName = "QuickFact";

const OccupancyBar = memo(function OccupancyBar({
  current,
  max,
  isFull,
}: {
  current: number;
  max: number;
  isFull: boolean;
}) {
  const rate = Math.min((current / max) * 100, 100);
  const remaining = max - current;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Participants
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-800">
            {current}
            <span className="text-slate-300 font-medium">/{max}</span>
          </span>
          {isFull ? (
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 uppercase tracking-wide">
              Complet
            </span>
          ) : rate >= 80 ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100 uppercase tracking-wide animate-pulse">
              Bientôt complet
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 uppercase tracking-wide">
              {remaining} place{remaining > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
            isFull ? "bg-red-500" : rate >= 80 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${rate}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
});

OccupancyBar.displayName = "OccupancyBar";

const StepPill = memo(function StepPill({
  index,
  label,
  state,
}: {
  index: number;
  label: string;
  state: "done" | "active" | "upcoming";
}) {
  return (
    <div
      className={`flex items-center gap-2 ${
        state === "upcoming" ? "text-slate-300" : "text-indigo-600"
      }`}
    >
      <span
        className={`h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-colors ${
          state === "done"
            ? "bg-indigo-600 border-indigo-600 text-white"
            : state === "active"
            ? "border-indigo-500 text-indigo-600"
            : "border-slate-200"
        }`}
      >
        {state === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : index}
      </span>
      <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
    </div>
  );
});

StepPill.displayName = "StepPill";

/* ═══════════════════════════════════════════
   Nouveau composant : FeedbackMessage
   ═══════════════════════════════════════════ */
function FeedbackMessage({ type, title, message, icon }: FeedbackMessage) {
  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-emerald-50/80 border-emerald-100 text-emerald-800";
      case "warning":
        return "bg-amber-50/80 border-amber-100 text-amber-800";
      case "error":
        return "bg-red-50/80 border-red-100 text-red-800";
      default:
        return "bg-blue-50/80 border-blue-100 text-blue-800";
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "success":
        return "bg-emerald-100";
      case "warning":
        return "bg-amber-100";
      case "error":
        return "bg-red-100";
      default:
        return "bg-blue-100";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "text-emerald-600";
      case "warning":
        return "text-amber-600";
      case "error":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className={`mb-6 border rounded-2xl p-5 flex items-start gap-4 animate-[slideIn_0.4s_ease-out] ${getStyles()}`}>
      <div className={`shrink-0 h-10 w-10 rounded-xl ${getIconBg()} flex items-center justify-center`}>
        {icon || (
          type === "success" ? <CheckCircleIcon className={`h-5 w-5 ${getIconColor()}`} /> :
          type === "warning" ? <BellAlertIcon className={`h-5 w-5 ${getIconColor()}`} /> :
          type === "error" ? <ExclamationTriangleIcon className={`h-5 w-5 ${getIconColor()}`} /> :
          <InformationCircleIcon className={`h-5 w-5 ${getIconColor()}`} />
        )}
      </div>
      <div className="pt-0.5">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-sm opacity-80 mt-1 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Nouveau composant : ForumStatsCard
   ═══════════════════════════════════════════ */
function ForumStatsCard({ 
  forum, 
  candidatures,
  views = 1234,
  likes = 89,
}: { 
  forum: Forum; 
  candidatures: Candidature[];
  views?: number;
  likes?: number;
}) {
  const candidatsDuForum = candidatures.filter((c) => c.forum === forum.id);
  const participationRate = (candidatsDuForum.length / forum.nombre_max) * 100;
  
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Statistiques
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{candidatsDuForum.length}</div>
          <div className="text-xs text-slate-500 mt-1">Inscrits</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800">{Math.round(participationRate)}%</div>
          <div className="text-xs text-slate-500 mt-1">Taux</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800">{forum.nombre_max}</div>
          <div className="text-xs text-slate-500 mt-1">Max</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-4">
        <span className="flex items-center gap-1">
          <EyeIcon className="h-3.5 w-3.5" />
          {views}
        </span>
        <span className="flex items-center gap-1">
          <StarSolid className="h-3.5 w-3.5 text-amber-400" />
          {likes}
        </span>
        <span className="flex items-center gap-1">
          <ChatBubbleLeftIcon className="h-3.5 w-3.5" />
          {Math.floor(Math.random() * 20) + 5}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Nouveau composant : InfoBadge
   ═══════════════════════════════════════════ */
function InfoBadge({ children, icon, variant = "default" }: { children: React.ReactNode; icon?: React.ReactNode; variant?: "default" | "info" | "success" | "warning" }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${variants[variant]}`}>
      {icon}
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════
   Nouveau composant : DetailsCard amélioré
   ═══════════════════════════════════════════ */
function DetailsCard({ forum, qrUrl }: { forum: Forum; qrUrl: string | null }) {
  const [tab, setTab] = useState<"map" | "qr" | "info">("map");

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex border-b border-slate-100">
        <button
          type="button"
          onClick={() => setTab("map")}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
            tab === "map"
              ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <MapIcon className="h-4 w-4" />
          Plan
        </button>
        <button
          type="button"
          onClick={() => setTab("info")}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
            tab === "info"
              ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <DocumentTextIcon className="h-4 w-4" />
          Détails
        </button>
        {qrUrl && (
          <button
            type="button"
            onClick={() => setTab("qr")}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
              tab === "qr"
                ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <QrCodeIcon className="h-4 w-4" />
            QR Code
          </button>
        )}
      </div>

      <div className="p-5">
        {tab === "map" ? (
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border border-slate-100">
              <ForumMap location={forum.lieu} height="220px" />
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(forum.lieu)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
              >
                Ouvrir dans Google Maps
                <ArrowUpRightIcon className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(forum.lieu);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <PlusCircleIcon className="h-3 w-3" />
                Copier l'adresse
              </button>
            </div>
          </div>
        ) : tab === "info" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Capacité</p>
                <p className="text-sm font-bold text-slate-800">{forum.nombre_max} places</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Durée</p>
                <p className="text-sm font-bold text-slate-800">{forum.duree || 0} min</p>
              </div>
            </div>
            {forum.description && (
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-3">
                {forum.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <InfoBadge variant="info" icon={<SparklesIcon className="h-3 w-3" />}>
                Inscription {forum.duree ? "avec créneau" : "libre"}
              </InfoBadge>
              <InfoBadge variant="success" icon={<ShieldCheckIcon className="h-3 w-3" />}>
                Sécurisé
              </InfoBadge>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={qrUrl ?? ""}
                alt="QR Code du forum"
                className="w-36 h-36 object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-[220px]">
              Présentez ce code à l&apos;accueil le jour du forum.
            </p>
            <button
              onClick={() => {
                if (qrUrl) {
                  fetch(qrUrl)
                    .then(res => res.blob())
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `qr-code-${forum.nom}.png`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    });
                }
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <PlusCircleIcon className="h-3 w-3" />
              Télécharger le QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Helpers existants
   ═══════════════════════════════════════════ */
function extractTime(value: string): string {
  const match = value?.match(/(\d{2}:\d{2})/);
  return match ? match[1] : value;
}

function generateTimeSlots(
  dateForum: string,
  start: string,
  end: string,
  intervalMinutes: number
): string[] {
  if (!dateForum || !start || !end || !intervalMinutes) return [];

  const startTime = extractTime(start);
  const endTime = extractTime(end);

  let current = new Date(`${dateForum}T${startTime}`);
  const endDate = new Date(`${dateForum}T${endTime}`);

  if (isNaN(current.getTime()) || isNaN(endDate.getTime())) return [];
  if (endDate <= current) endDate.setDate(endDate.getDate() + 1);

  const slots: string[] = [];
  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  while (current < endDate) {
    const next = new Date(current.getTime() + intervalMinutes * 60000);
    slots.push(`${fmt(current)} - ${fmt(next)}`);
    current = next;
  }
  return slots;
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

/* ═══════════════════════════════════════════
   Skeleton Loader amélioré
   ═══════════════════════════════════════════ */
function SkeletonForum() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-9 w-40 bg-slate-200/80 rounded-xl animate-pulse mb-6" />

        {/* Hero skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 space-y-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="h-6 w-2/3 bg-slate-200/80 rounded-lg animate-pulse" />
            <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-14 w-36 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-14 w-36 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-14 w-36 bg-slate-100 rounded-2xl animate-pulse hidden sm:block" />
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 space-y-4">
              <div className="h-5 w-40 bg-slate-200/80 rounded-lg animate-pulse" />
              <div className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
              <div className="h-14 bg-slate-200/60 rounded-2xl animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 space-y-4">
              <div className="h-[180px] bg-slate-100 rounded-2xl animate-pulse" />
              <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Page Principale améliorée
   ═══════════════════════════════════════════ */
export default function ForumDetailPage() {
  const params = useParams<{ id: string }>();
  const forumId = Number(params.id);
  const user = useCurrentUser();

  // États
  const [forum, setForum] = useState<Forum | null>(null);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Bouton CTA observé pour piloter la barre d'inscription flottante (mobile)
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(true);

  /* ─── Chargement ─── */
  useEffect(() => {
    let active = true;
    Promise.all([getForumById(forumId), getCandidatures()])
      .then(([forumData, candData]) => {
        if (!active) return;
        setForum(forumData ?? null);
        setCandidatures(candData);
      })
      .catch(() => {
        if (active) setLoadError("Impossible de charger ce forum.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [forumId]);

  /* ─── Vérification inscription ─── */
  useEffect(() => {
    if (user && forum) {
      const already = candidatures.some(
        (c) => c.forum === forum.id && c.email === user.email
      );
      if (already) setRegistered(true);
    }
  }, [user, forum, candidatures]);

  /* ─── Observation du bouton principal pour la barre mobile ─── */
  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading]);

  // Helper pour vérifier si le forum a des créneaux
  const hasSlots = !!forum && !!forum.duree && forum.duree !== 0;

  // Génération des créneaux
  const slots = useMemo(() => {
    if (!forum || !hasSlots) return [];
    return generateTimeSlots(forum.date_forum, forum.date_debut, forum.date_fin, forum.duree);
  }, [forum, hasSlots]);

  // Filtrage des candidatures pour ce forum
  const candidatsDuForum = useMemo(
    () => (forum ? candidatures.filter((c) => c.forum === forum.id) : []),
    [candidatures, forum]
  );

  // Calculs d'occupation
  const isFull = forum ? candidatsDuForum.length >= forum.nombre_max : false;
  const occupancyRate = forum
    ? Math.min((candidatsDuForum.length / forum.nombre_max) * 100, 100)
    : 0;

  // Gestionnaire d'inscription
  const handleRegister = useCallback(async () => {
    if (!forum) return;
    if (hasSlots && !selectedSlot) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await registerForum({
        forum_nom: forum.nom,
        horaire: hasSlots ? selectedSlot : null,
      });
      setRegistered(true);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "L'inscription a échoué. Veuillez réessayer."
      );
    } finally {
      setSubmitting(false);
    }
  }, [forum, hasSlots, selectedSlot]);

  // Scroll vers le sélecteur de créneau
  const scrollToSlotPicker = () => {
    document
      .getElementById("slot-picker")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Copie de l'adresse
  const handleCopyAddress = () => {
    if (forum) {
      navigator.clipboard.writeText(forum.lieu);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // État de chargement
  if (loading) return <SkeletonForum />;

  // État d'erreur
  if (loadError || !forum) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="relative mx-auto mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50" />
            <div className="relative h-24 w-24 rounded-full bg-white border border-red-100 shadow-xl flex items-center justify-center mx-auto">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Forum introuvable</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {loadError || "Ce forum n'existe pas ou a été supprimé."}
          </p>
          <Link
            href="/user"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  // État d'inscription confirmée
  if (registered) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div
          className={`max-w-lg w-full text-center transition-all duration-700 ${
            showSuccess ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
          }`}
        >
          <div className="relative mx-auto mb-8">
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse" />
            <div className="relative h-28 w-28 rounded-full bg-white border-2 border-emerald-100 shadow-2xl flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircleIcon className="h-14 w-14 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Confirmé
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">Inscription confirmée</h1>
            <p className="text-slate-500 mb-1">Vous êtes inscrit(e) au forum</p>
            <p className="text-xl font-bold text-indigo-600 mb-6">{forum.nom}</p>

            {selectedSlot && (
              <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100">
                <ClockIcon className="h-5 w-5" />
                <span>Créneau sélectionné : {selectedSlot}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/user"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Retour à l&apos;accueil
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: forum.nom,
                      text: `Je suis inscrit(e) au forum ${forum.nom}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <ShareIcon className="h-4 w-4" />
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const qrUrl = getMediaUrl(forum.qrcode || forum.qrcode_img);

  const quickFacts = [
    {
      icon: <CalendarIcon className="h-4 w-4" />,
      label: "Date",
      value: formatDateShort(forum.date_forum),
      tooltip: "Date du forum"
    },
    {
      icon: <ClockIcon className="h-4 w-4" />,
      label: "Horaires",
      value: `${extractTime(forum.date_debut)} - ${extractTime(forum.date_fin)}`,
      tooltip: "Créneaux d'ouverture"
    },
    {
      icon: <MapPinIcon className="h-4 w-4" />,
      label: "Lieu",
      value: forum.lieu,
      tooltip: "Cliquez pour copier l'adresse"
    },
    hasSlots
      ? { icon: <TicketIcon className="h-4 w-4" />, label: "Créneaux", value: `${forum.duree} min`, tooltip: "Durée par créneau" }
      : { icon: <SparklesIcon className="h-4 w-4" />, label: "Mode", value: "Libre", tooltip: "Inscription sans créneau" },
  ];

  const ctaDisabled = submitting || isFull || (hasSlots && !selectedSlot);

  /* ═══════════════════════════════════════════
     RENDU PRINCIPAL
     ═══════════════════════════════════════════ */
  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-12">
      {/* ─── Top gradient ─── */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ═══════════════════════════════════════
            BREADCRUMB & ACTIONS
            ═══════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/user"
            className="group inline-flex items-center gap-2.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <span className="p-2 rounded-xl bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:shadow-sm transition-all">
              <ArrowLeftIcon className="h-4 w-4" />
            </span>
            <span className="font-medium hidden sm:inline">Retour aux forums</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                isBookmarked
                  ? "bg-amber-50 border-amber-200 text-amber-500 shadow-sm"
                  : "bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50"
              }`}
              title="Sauvegarder"
            >
              <BookmarkIcon className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: forum.nom, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              title="Partager"
            >
              <ShareIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            HERO — l'essentiel en un coup d'œil
            ═══════════════════════════════════════ */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="relative px-5 sm:px-7 pt-6 pb-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug break-words">
                  {forum.nom}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <InfoBadge variant="info" icon={<SparklesIcon className="h-3 w-3" />}>
                    {hasSlots ? "Créneaux" : "Libre"}
                  </InfoBadge>
                  <InfoBadge variant="success" icon={<ShieldCheckIcon className="h-3 w-3" />}>
                    Sécurisé
                  </InfoBadge>
                  {isFull && (
                    <InfoBadge variant="warning" icon={<ExclamationTriangleIcon className="h-3 w-3" />}>
                      Complet
                    </InfoBadge>
                  )}
                </div>
              </div>
              {isFull ? (
                <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-[11px] font-bold border border-red-100 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Complet
                </span>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Ouvert
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
              <SparklesIcon className="h-3.5 w-3.5 text-amber-500" />
              <span>Inscription {hasSlots ? "avec créneau horaire" : "libre"}</span>
            </div>

            {/* Infos clés — scrollables horizontalement sur mobile */}
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x sm:flex-wrap sm:overflow-visible scrollbar-hide">
              {quickFacts.map((fact, i) => (
                <div key={i} className="snap-start" onClick={fact.label === "Lieu" ? handleCopyAddress : undefined}>
                  <QuickFact 
                    icon={fact.icon} 
                    label={fact.label} 
                    value={fact.label === "Lieu" && copiedAddress ? "Copié !" : fact.value}
                    tooltip={fact.tooltip}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100">
              <OccupancyBar
                current={candidatsDuForum.length}
                max={forum.nombre_max}
                isFull={isFull}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            GRILLE PRINCIPALE
            ═══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ─── PRIMAIRE : Inscription ─── */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative p-6 pb-5 border-b border-slate-50">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-80" />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Inscription</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {isFull
                        ? "Ce forum est complet. Aucune inscription n'est possible pour le moment."
                        : hasSlots
                        ? `Choisissez un créneau (${forum.duree} min) puis confirmez.`
                        : "Aucun créneau requis. Confirmez votre inscription ci-dessous."}
                    </p>
                  </div>
                  <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-indigo-50 items-center justify-center shrink-0">
                    <TicketIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>

                {/* Étapes */}
                {!isFull && hasSlots && (
                  <div className="flex items-center gap-3 mt-5">
                    <StepPill
                      index={1}
                      label="Choisir un créneau"
                      state={selectedSlot ? "done" : "active"}
                    />
                    <div className="flex-1 h-px bg-slate-200" />
                    <StepPill
                      index={2}
                      label="Confirmer"
                      state={selectedSlot ? "active" : "upcoming"}
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Messages de feedback */}
                {isFull && (
                  <FeedbackMessage
                    type="warning"
                    title="Forum complet"
                    message={`Le nombre maximum de participants (${forum.nombre_max}) est atteint. Revenez plus tard pour vérifier si des places se libèrent.`}
                  />
                )}

                {!isFull && occupancyRate >= 80 && (
                  <FeedbackMessage
                    type="warning"
                    title="Places limitées"
                    message={`Plus que ${forum.nombre_max - candidatsDuForum.length} place${forum.nombre_max - candidatsDuForum.length > 1 ? "s" : ""} disponible${forum.nombre_max - candidatsDuForum.length > 1 ? "s" : ""} — ne tardez pas.`}
                  />
                )}

                {/* SlotPicker */}
                {!isFull && hasSlots && (
                  <div id="slot-picker" className="mb-2 scroll-mt-24">
                    <div className="flex items-center gap-2 mb-4">
                      <ClockIcon className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-bold text-slate-700">
                        Sélectionnez votre créneau
                      </span>
                    </div>
                    <SlotPicker
                      forum={forum}
                      slots={slots}
                      candidatures={candidatures}
                      selectedSlot={selectedSlot}
                      onSelect={setSelectedSlot}
                    />
                  </div>
                )}

                {/* Programme complet (repliable) */}
                {!isFull && hasSlots && slots.length > 0 && (
                  <div className="mb-5">
                    <button
                      type="button"
                      onClick={() => setShowSchedule((s) => !s)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-2 focus-visible:outline-none"
                    >
                      <span>Voir le programme complet ({slots.length} créneaux)</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          showSchedule ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showSchedule && (
                      <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 max-h-56 overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {slots.map((slot, idx) => {
                            const isSelected = selectedSlot === slot;
                            return (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => setSelectedSlot(slot)}
                                className={`text-xs font-semibold rounded-xl px-3 py-2 text-center transition-all duration-200 ${
                                  isSelected
                                    ? "bg-indigo-600 text-white transform scale-105"
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm"
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Message créneau requis */}
                {hasSlots && !selectedSlot && !isFull && (
                  <FeedbackMessage
                    type="info"
                    title="Créneau requis"
                    message="Sélectionnez un créneau pour activer la confirmation d'inscription."
                  />
                )}

                {/* Erreur serveur */}
                {submitError && (
                  <FeedbackMessage
                    type="error"
                    title="Erreur"
                    message={submitError}
                  />
                )}

                {/* Bouton d'action principal */}
                <button
                  ref={ctaRef}
                  type="button"
                  onClick={handleRegister}
                  disabled={ctaDisabled}
                  className={`relative w-full inline-flex items-center justify-center rounded-2xl px-8 py-4 text-white font-bold text-base shadow-lg transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                    ${
                      ctaDisabled
                        ? "bg-slate-300 cursor-not-allowed shadow-none"
                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                    }
                  `}
                >
                  {!ctaDisabled && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                  )}

                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3" />
                      <span>Inscription en cours…</span>
                    </>
                  ) : isFull ? (
                    <>
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2.5" />
                      <span>Forum complet</span>
                    </>
                  ) : hasSlots && !selectedSlot ? (
                    <>
                      <ClockIcon className="h-5 w-5 mr-2.5" />
                      <span>Sélectionnez un créneau</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2.5" />
                      <span>Confirmer mon inscription</span>
                    </>
                  )}
                </button>

                <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
                  En vous inscrivant, vous acceptez de recevoir les informations relatives à ce forum.
                  <br />
                  Vous pourrez vous désinscrire à tout moment depuis votre espace personnel.
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <ForumStatsCard forum={forum} candidatures={candidatures} />
          </section>

          {/* ─── SECONDAIRE : Détails ─── */}
          <aside className="lg:col-span-5 space-y-6">
            <DetailsCard forum={forum} qrUrl={qrUrl} />

            {forum.description && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <InformationCircleIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Description
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-6 hover:line-clamp-none transition-all cursor-pointer">
                  {forum.description}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="shrink-0 h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Inscription sécurisée</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Vos données sont protégées et ne seront utilisées que pour la gestion de votre
                  inscription.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="shrink-0 h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <StarIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Besoin d'aide ?</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Contactez le support à tout moment pour toute question concernant votre inscription.
                </p>
                <a href="mailto:support@forum.fr" className="mt-2 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  support@forum.fr
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Barre d'inscription flottante (mobile)
          ═══════════════════════════════════════ */}
      {!isFull && (
        <div
          className={`fixed bottom-0 inset-x-0 z-40 lg:hidden transition-transform duration-300 ${
            ctaVisible ? "translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide truncate">
                  {forum.nom}
                </p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {selectedSlot ? selectedSlot : hasSlots ? "Choisissez un créneau" : "Inscription libre"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => (hasSlots && !selectedSlot ? scrollToSlotPicker() : handleRegister())}
                disabled={submitting}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 shadow-md shadow-indigo-200 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                {submitting ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : hasSlots && !selectedSlot ? (
                  "Choisir"
                ) : (
                  "S'inscrire"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Styles additionnels pour animations et scrollbar ─── */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        
        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-6:hover {
          -webkit-line-clamp: unset;
        }
      `}</style>
    </main>
  );
}

