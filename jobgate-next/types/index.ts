// // // types/index.ts
// // export interface Forum {
// //   id: number;
// //   nom: string;
// //   date_forum: string;
// //   lieu: string;
// //   description: string;
// //   recruteurs: number[];
// //   nombre_max: number;
// //   universite_id: number;
// //   date_debut: string;
// //   date_fin: string;
// //   duree: number;
// //   currentNumber: number;
// //   qrcode_img?: string;
// //   isActive?: boolean;
// // }

// export interface Recruiter {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   entreprise?: string;
// }

// // export interface User {
// //   id: number;
// //   email: string;
// //   first_name: string;
// //   last_name: string;
// // }

// export interface Stats {
//   totalForums: number;
//   upcomingForums: number;
//   pastForums: number;
// }


// // types/index.ts

// export interface User {
//   id: number;
//   email: string;
//   first_name: string;
//   last_name: string;
// }

// export interface Forum {
//   id: number;
//   nom: string;
//   entreprise: string;
//   lieu: string;
//   date_forum: string;
//   date_debut: string;
//   date_fin: string;
//   heure_debut: string;
//   heure_fin: string;
//   description: string;
//   duree: number;
//   nombre_max: number;
//   organisateur: string;
//   qrcode: string;
//   recruteurs: string[];
//   currentNumber?: number;
//   slots?: string[];
// }

// export interface Candidature {
//   id: number;
//   forum: number;
//   email: string;
//   event_horaire: string | null;
//   first_name: string;
//   last_name: string;
//   forum_nom: string;
// }

// export interface InscriptionData {
//   forum_nom: string;
//   horaire: string | null;
// }

// export interface ApiResponse<T = any> {
//   data: T;
//   message?: string;
//   status: number;
// }

// export interface SlotInfo {
//   slot: string;
//   isFull: boolean;
//   availableCount: number;
// }

// types/index.ts
export interface Forum {
  id: number;
  nom: string;
  date_forum: string; // "YYYY-MM-DD"
  lieu: string;
  description: string;
  recruteurs: number[];
  nombre_max: number;
  universite_id: number;
  date_debut: string; // heure de début de la journée forum, ex "09:00"
  date_fin: string; // heure de fin de la journée forum, ex "17:00"
  duree: number; // durée d'un créneau en minutes, 0 (ou falsy) = pas de créneaux
  currentNumber: number; // nombre d'inscrits, renvoyé par le backend
  qrcode?: string; // chemin relatif renvoyé par Django, ex "/media/qrcodes/xxx.png"
  qrcode_img?: string; // conservé pour compat avec l'existant si déjà utilisé ailleurs
  entreprise?: string;
  isActive?: boolean;
}

export interface Recruiter {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  entreprise?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

// Une inscription / candidature à un forum (endpoint /list_cand/)
export interface Candidature {
  id: number;
  forum: number; // id du forum
  email: string;
  first_name: string;
  last_name: string;
  event_horaire: string | null; // créneau choisi, null si le forum n'a pas de créneaux
}

export interface Stats {
  totalForums: number;
  upcomingForums: number;
  pastForums: number;
}