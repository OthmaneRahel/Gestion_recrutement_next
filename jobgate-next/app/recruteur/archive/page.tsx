"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown, FiChevronUp, FiUsers, FiMail, FiPhone, FiFile,
  FiArrowLeft, FiX, FiSearch, FiCalendar, FiMapPin, FiBriefcase,
  FiEye, FiArchive, FiDownload, FiGrid, FiList, FiStar,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface Forum {
  id: number;
  forum_id: number;
  nom: string;
  entreprise: string;
  lieu: string;
  date_forum: string;
  description?: string;
}

interface Candidat {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  numero_telephone?: string;
  cv: string;
  note?: string;
  etat?: string;
  forum_id: number;
}

export default function ArchivePage() {
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated, logout } = useAuth("recruteur");

  const [forums, setForums] = useState<Forum[]>([]);
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [expandedForumId, setExpandedForumId] = useState<number | null>(null);
  const [selectedCandidats, setSelectedCandidats] = useState<Candidat[]>([]);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [selectedForumName, setSelectedForumName] = useState("");
  const [recherche, setRecherche] = useState("");
  const [rechercheCand, setRechercheCand] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Forum; direction: "asc" | "desc" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forumsRes, candidatsRes] = await Promise.all([
          api.get("/archive_forums/"),
          api.get("/archive_candidats/"),
        ]);
        setForums(forumsRes.data);
        setCandidats(candidatsRes.data);
      } catch (err) {
        console.error("Erreur chargement archives:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleSort = (key: keyof Forum) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) return { key, direction: "asc" };
      return { key, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  };

  const getSortedForums = () => {
    let filtered = forums.filter((f) => {
      const q = recherche.toLowerCase();
      return (
        q === "" ||
        f.nom?.toLowerCase().includes(q) ||
        f.entreprise?.toLowerCase().includes(q) ||
        f.lieu?.toLowerCase().includes(q)
      );
    });
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key] ?? "";
        const bVal = b[sortConfig.key] ?? "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  };

  const getForumCandidates = (forumId: number) =>
    candidats.filter((c) => c.forum_id === forumId);

  const openCandidatesModal = (forum: Forum) => {
    setSelectedCandidats(getForumCandidates(forum.forum_id));
    setSelectedForumName(forum.nom);
    setShowCandidatesModal(true);
    setRechercheCand("");
  };

  const getFilteredCandidates = () => {
    const q = rechercheCand.toLowerCase();
    if (!q) return selectedCandidats;
    return selectedCandidats.filter((c) => {
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      return (
        c.first_name?.toLowerCase().includes(q) ||
        c.last_name?.toLowerCase().includes(q) ||
        fullName.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.etat?.toLowerCase().includes(q)
      );
    });
  };

  const exportToCSV = () => {
    const headers = ["Prénom", "Nom", "Email", "Téléphone", "Statut", "Note"];
    const rows = getFilteredCandidates().map((c) => [
      c.first_name, c.last_name, c.email,
      c.numero_telephone || "N/A", c.etat || "N/A", c.note || "N/A",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `candidats_${selectedForumName.replace(/\s+/g, "_")}.csv`;
    link.click();
  };

  const statutBadge = (etat: string) => {
    const e = etat.toLowerCase();
    if (e.includes("accept")) return "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200";
    if (e.includes("refus"))  return "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg shadow-red-200";
    if (e.includes("attente")) return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-200";
    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200";
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FiArchive className="text-blue-600 text-xl" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Chargement des archives…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const sortedForums = getSortedForums();

  const SortIcon = ({ col }: { col: keyof Forum }) =>
    sortConfig?.key === col ? (
      sortConfig.direction === "asc"
        ? <FiChevronUp className="text-blue-600" />
        : <FiChevronDown className="text-blue-600" />
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-4">
              <Link
                href="/recruteur"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 rounded-xl transition-all hover:text-blue-600 hover:bg-blue-50/50 group"
              >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Retour
              </Link>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-xl opacity-30" />
                  <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-200">
                    <FiArchive className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Archives
                  </h1>
                  <p className="text-xs text-gray-500">
                    {forums.length} forum{forums.length !== 1 ? "s" : ""} archivé{forums.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Rechercher un forum…"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 text-sm border-0 bg-gray-100/50 rounded-xl transition-all focus:bg-white focus:ring-2 focus:ring-blue-400/50 focus:shadow-lg focus:shadow-blue-100"
                />
              </div>
              <div className="flex items-center gap-1 p-1 bg-gray-100/50 rounded-xl">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow-md text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiList className="text-sm" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-md text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiGrid className="text-sm" />
                </button>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium rounded-xl transition-all text-red-600 bg-red-50/50 hover:bg-red-100/50 hover:shadow-lg hover:shadow-red-100"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main ───────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedForums.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30" />
              <div className="relative p-6 bg-white rounded-full shadow-xl">
                <FiArchive className="text-4xl text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun forum archivé</h2>
            <p className="text-gray-500 text-sm">Les forums archivés apparaîtront ici.</p>
          </motion.div>
        ) : (
          <>
            {viewMode === "table" ? (
              // ─── Tableau forums ────────────────────────────────────
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-100/50 border border-gray-200/50 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-200/50">
                        {([
                          { key: "nom" as keyof Forum, label: "Forum", icon: null },
                          { key: "entreprise" as keyof Forum, label: "Entreprise", icon: <FiBriefcase className="text-gray-400" /> },
                          { key: "lieu" as keyof Forum, label: "Lieu", icon: <FiMapPin className="text-gray-400" /> },
                          { key: "date_forum" as keyof Forum, label: "Date", icon: <FiCalendar className="text-gray-400" /> },
                        ]).map(({ key, label, icon }) => (
                          <th key={key} className="px-6 py-4 text-left">
                            <button
                              onClick={() => handleSort(key)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider transition-all hover:text-blue-600 group"
                            >
                              {icon}
                              {label}
                              <span className="group-hover:opacity-100 opacity-0 transition-opacity">
                                <SortIcon col={key} />
                              </span>
                            </button>
                          </th>
                        ))}
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidats</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {sortedForums.map((forum, index) => {
                        const forumCandidates = getForumCandidates(forum.forum_id);
                        const isExpanded = expandedForumId === forum.id;
                        return (
                          <motion.tr
                            key={forum.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setExpandedForumId(isExpanded ? null : forum.id)}
                            className={`cursor-pointer transition-all hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 ${isExpanded ? "bg-gradient-to-r from-blue-50/40 to-purple-50/40" : ""}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${forumCandidates.length > 0 ? "bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-200" : "bg-gray-300"}`} />
                                <p className="font-semibold text-foreground">{forum.nom}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{forum.entreprise}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{forum.lieu || "—"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {forum.date_forum
                                ? new Date(forum.date_forum).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                                : "—"}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                forumCandidates.length > 0
                                  ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200"
                                  : "bg-gray-100 text-gray-500"
                              }`}>
                                <FiUsers className="text-xs" />
                                {forumCandidates.length}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); openCandidatesModal(forum); }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:scale-105"
                                >
                                  <FiEye className="text-xs" />
                                  Voir
                                </button>
                                {isExpanded
                                  ? <FiChevronUp className="text-blue-600" />
                                  : <FiChevronDown className="text-gray-400" />}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-blue-50/30 to-purple-50/30 border-t border-gray-200/50 text-xs text-gray-500">
                  Affichage de {sortedForums.length} forum{sortedForums.length !== 1 ? "s" : ""}
                </div>
              </motion.div>
            ) : (
              // ─── Vue Grille ──────────────────────────────────────
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sortedForums.map((forum, index) => {
                  const forumCandidates = getForumCandidates(forum.forum_id);
                  return (
                    <motion.div
                      key={forum.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-100/50 border border-gray-200/50 p-6 hover:shadow-xl hover:shadow-blue-200/50 transition-all hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                            {forum.nom[0]}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{forum.nom}</h3>
                            <p className="text-xs text-gray-500">{forum.entreprise}</p>
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          forumCandidates.length > 0
                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {forumCandidates.length} candidat{forumCandidates.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p className="flex items-center gap-2">
                          <FiMapPin className="text-gray-400" />
                          {forum.lieu || "Lieu non spécifié"}
                        </p>
                        <p className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {forum.date_forum
                            ? new Date(forum.date_forum).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                            : "Date non spécifiée"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => openCandidatesModal(forum)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-105"
                        >
                          <FiUsers className="text-xs" />
                          Voir les candidats
                        </button>
                        <button
                          onClick={() => setExpandedForumId(expandedForumId === forum.id ? null : forum.id)}
                          className="p-2 rounded-xl bg-gray-100/50 hover:bg-gray-200/50 transition-all"
                        >
                          {expandedForumId === forum.id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedForumId === forum.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-4 pt-4 border-t border-gray-100"
                          >
                            {forumCandidates.slice(0, 3).map((cand) => (
                              <div key={cand.id} className="flex items-center gap-2 py-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-medium shadow-lg shadow-green-200">
                                  {cand.first_name[0]}{cand.last_name[0]}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{cand.first_name} {cand.last_name}</p>
                                  <p className="text-xs text-gray-500">{cand.etat || "Statut inconnu"}</p>
                                </div>
                              </div>
                            ))}
                            {forumCandidates.length > 3 && (
                              <p className="text-xs text-blue-600 mt-2">+ {forumCandidates.length - 3} autres</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* ─── Aperçu rapide (expandable) ──────────────────────── */}
            <AnimatePresence>
              {expandedForumId && viewMode === "table" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  {(() => {
                    const forum = forums.find((f) => f.id === expandedForumId);
                    if (!forum) return null;
                    const candidates = getForumCandidates(forum.forum_id);
                    return (
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-100/50 border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Aperçu des candidats — {forum.nom}
                          </h3>
                          <button
                            onClick={() => openCandidatesModal(forum)}
                            className="text-sm text-blue-600 font-medium underline underline-offset-2 hover:opacity-80 transition-all"
                          >
                            Voir tout →
                          </button>
                        </div>
                        {candidates.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-8">Aucun candidat pour ce forum.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {candidates.slice(0, 6).map((c) => (
                              <div
                                key={c.id}
                                className="group p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all hover:-translate-y-0.5"
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-green-200">
                                    {c.first_name[0]}{c.last_name[0]}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-foreground">{c.first_name} {c.last_name}</p>
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${statutBadge(c.etat || "inconnu")}`}>
                                      {c.etat || "Statut inconnu"}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-1 text-xs text-gray-600">
                                  <p className="flex items-center gap-1.5">
                                    <FiMail className="text-gray-400" />{c.email}
                                  </p>
                                  {c.numero_telephone && (
                                    <p className="flex items-center gap-1.5">
                                      <FiPhone className="text-gray-400" />{c.numero_telephone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {candidates.length > 6 && (
                              <div className="flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm text-gray-500">+{candidates.length - 6} autres candidats</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════
          MODAL : Tableau des Candidats
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showCandidatesModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCandidatesModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-xl w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-xl opacity-30" />
                    <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-200">
                      <FiUsers className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Candidats — {selectedForumName}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedCandidats.length} candidat{selectedCandidats.length !== 1 ? "s" : ""} au total
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-105"
                  >
                    <FiDownload className="text-xs" />
                    Exporter CSV
                  </button>
                  <button
                    onClick={() => setShowCandidatesModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-6 py-3 border-b border-gray-200/50">
                <div className="relative max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, statut…"
                    value={rechercheCand}
                    onChange={(e) => setRechercheCand(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border-0 bg-gray-100/50 rounded-xl transition-all focus:bg-white focus:ring-2 focus:ring-blue-400/50 focus:shadow-lg focus:shadow-blue-100"
                  />
                </div>
              </div>

              {/* Tableau Candidats */}
              <div className="flex-1 overflow-auto">
                {getFilteredCandidates().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <FiUsers className="text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">Aucun candidat trouvé</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50/30 to-purple-50/30 sticky top-0">
                      <tr className="border-b border-gray-200/50">
                        {["Candidat", "Contact", "Téléphone", "Statut", "Note", "CV"].map((h, i) => (
                          <th
                            key={h}
                            className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {getFilteredCandidates().map((cand, idx) => (
                        <motion.tr
                          key={cand.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-green-200">
                                {cand.first_name[0]}{cand.last_name[0]}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-foreground">{cand.first_name} {cand.last_name}</p>
                                <p className="text-xs text-gray-500">ID: #{cand.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={`mailto:${cand.email}`}
                              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-all"
                            >
                              <FiMail className="text-gray-400 text-xs" />
                              {cand.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {cand.numero_telephone ? (
                              <span className="flex items-center gap-1.5">
                                <FiPhone className="text-gray-400 text-xs" />
                                {cand.numero_telephone}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {cand.etat ? (
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statutBadge(cand.etat)}`}>
                                {cand.etat}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {cand.note
                              ? <p className="text-sm text-gray-600 max-w-xs truncate">{cand.note}</p>
                              : <span className="text-gray-400 text-sm">—</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}/${cand.cv}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:scale-105"
                            >
                              <FiFile className="text-xs" />
                              Voir CV
                            </a>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-gray-200/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {getFilteredCandidates().length} résultat{getFilteredCandidates().length !== 1 ? "s" : ""} affiché{getFilteredCandidates().length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setShowCandidatesModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all text-gray-600 bg-white/80 border border-gray-200/50 hover:bg-gray-100/50 hover:shadow-lg"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}