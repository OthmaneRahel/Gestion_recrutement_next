// services/forumService.ts
import API from "./api";
import { Forum, Candidature } from "@/types";

// Le backend n'expose (pour l'instant) que la liste complète des forums,
// pas de route /forums_talent/:id/. On récupère donc tout et on filtre
// côté client, comme le faisait l'ancien code React. Si une route dédiée
// existe côté Django, on pourra simplifier getForumById.
export const getForums = async (): Promise<Forum[]> => {
  const res = await API.get<Forum[]>("forums_talent/");
  return res.data;
};

export const getForumById = async (id: number): Promise<Forum | undefined> => {
  const forums = await getForums();
  return forums.find((f) => f.id === id);
};

// Toutes les candidatures (inscriptions), tous forums confondus.
export const getCandidatures = async (): Promise<Candidature[]> => {
  const res = await API.get<Candidature[]>("list_cand/");
  return res.data;
};

export interface RegisterPayload {
  forum_nom: string;
  horaire: string | null; // null si le forum n'a pas de créneaux
}

export const registerForum = async (payload: RegisterPayload) => {
  // Le token est déjà ajouté automatiquement par l'intercepteur dans services/api.ts
  const res = await API.post("InscriptionForum/", payload);
  return res.data;
};