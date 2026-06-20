// types/index.ts
export interface Forum {
  id: number;
  nom: string;
  date_forum: string;
  lieu: string;
  description: string;
  recruteurs: number[];
  nombre_max: number;
  universite_id: number;
  date_debut: string;
  date_fin: string;
  duree: number;
  currentNumber: number;
  qrcode_img?: string;
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

export interface Stats {
  totalForums: number;
  upcomingForums: number;
  pastForums: number;
}