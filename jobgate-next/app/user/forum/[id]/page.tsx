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

/* ==========================================
   Interfaces and Types
   ========================================== */
interface FeedbackMessage {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  icon?: React.ReactNode;
}

/* ==========================================
   Dynamic Map (SSR Disabled)
   ========================================== */
const ForumMap = dynamic(() => import("@/components/ForumMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[220px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 text-sm text-slate-400 gap-2">
      <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-400 animate-spin" />
      <span>Loading map...</span>
    </div>
  ),
});

/* ==========================================
   Memoized Components for Performance
   ========================================== */
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
              Full
            </span>
          ) : rate >= 80 ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100 uppercase tracking-wide animate-pulse">
              Almost full
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 uppercase tracking-wide">
              {remaining} spot{remaining > 1 ? "s" : ""}
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

/* ==========================================
   FeedbackMessage Component
   ========================================== */
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

/* ==========================================
   ForumStatsCard Component
   ========================================== */
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
        Statistics
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{candidatsDuForum.length}</div>
          <div className="text-xs text-slate-500 mt-1">Registered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800">{Math.round(participationRate)}%</div>
          <div className="text-xs text-slate-500 mt-1">Occupancy</div>
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

/* ==========================================
   InfoBadge Component
   ========================================== */
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

/* ==========================================
   DetailsCard Component
   ========================================== */
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
          Map
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
          Details
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
                Open in Google Maps
                <ArrowUpRightIcon className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(forum.lieu);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <PlusCircleIcon className="h-3 w-3" />
                Copy address
              </button>
            </div>
          </div>
        ) : tab === "info" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Capacity</p>
                <p className="text-sm font-bold text-slate-800">{forum.nombre_max} spots</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Duration</p>
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
                Registration {forum.duree ? "with slot" : "open"}
              </InfoBadge>
              <InfoBadge variant="success" icon={<ShieldCheckIcon className="h-3 w-3" />}>
                Secure
              </InfoBadge>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={qrUrl ?? ""}
                alt="Forum QR Code"
                className="w-36 h-36 object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-[220px]">
              Present this code at reception on the day of the forum.
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
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   Existing Helpers
   ========================================== */
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
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

/* ==========================================
   Skeleton Loader
   ========================================== */
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

/* ==========================================
   Main Page Component
   ========================================== */
export default function ForumDetailPage() {
  const params = useParams<{ id: string }>();
  const forumId = Number(params.id);
  const user = useCurrentUser();

  // States
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

  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(true);

  /* Loading */
  useEffect(() => {
    let active = true;
    Promise.all([getForumById(forumId), getCandidatures()])
      .then(([forumData, candData]) => {
        if (!active) return;
        setForum(forumData ?? null);
        setCandidatures(candData);
      })
      .catch(() => {
        if (active) setLoadError("Unable to load this forum.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [forumId]);

  /* Verification */
  useEffect(() => {
    if (user && forum) {
      const already = candidatures.some(
        (c) => c.forum === forum.id && c.email === user.email
      );
      if (already) setRegistered(true);
    }
  }, [user, forum, candidatures]);

  /* Observer */
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

  const hasSlots = !!forum && !!forum.duree && forum.duree !== 0;

  const slots = useMemo(() => {
    if (!forum || !hasSlots) return [];
    return generateTimeSlots(forum.date_forum, forum.date_debut, forum.date_fin, forum.duree);
  }, [forum, hasSlots]);

  const candidatsDuForum = useMemo(
    () => (forum ? candidatures.filter((c) => c.forum === forum.id) : []),
    [candidatures, forum]
  );

  const isFull = forum ? candidatsDuForum.length >= forum.nombre_max : false;
  const occupancyRate = forum
    ? Math.min((candidatsDuForum.length / forum.nombre_max) * 100, 100)
    : 0;

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
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }, [forum, hasSlots, selectedSlot]);

  const scrollToSlotPicker = () => {
    document
      .getElementById("slot-picker")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCopyAddress = () => {
    if (forum) {
      navigator.clipboard.writeText(forum.lieu);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  if (loading) return <SkeletonForum />;

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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Forum not found</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {loadError || "This forum does not exist or has been deleted."}
          </p>
          <Link
            href="/user"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

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
              Confirmed
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">Registration confirmed</h1>
            <p className="text-slate-500 mb-1">You are registered for the forum</p>
            <p className="text-xl font-bold text-indigo-600 mb-6">{forum.nom}</p>

            {selectedSlot && (
              <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100">
                <ClockIcon className="h-5 w-5" />
                <span>Selected slot: {selectedSlot}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/user"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to home
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: forum.nom,
                      text: `I am registered for the forum ${forum.nom}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <ShareIcon className="h-4 w-4" />
                Share
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
      tooltip: "Forum date"
    },
    {
      icon: <ClockIcon className="h-4 w-4" />,
      label: "Opening slots",
      value: `${extractTime(forum.date_debut)} - ${extractTime(forum.date_fin)}`,
      tooltip: "Opening slots"
    },
    {
      icon: <MapPinIcon className="h-4 w-4" />,
      label: "Location",
      value: forum.lieu,
      tooltip: "Click to copy address"
    },
    hasSlots
      ? { icon: <TicketIcon className="h-4 w-4" />, label: "Slots", value: `${forum.duree} min`, tooltip: "Duration per slot" }
      : { icon: <SparklesIcon className="h-4 w-4" />, label: "Mode", value: "Open", tooltip: "Registration without slot" },
  ];

  const ctaDisabled = submitting || isFull || (hasSlots && !selectedSlot);

  const formatDateLong = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* Rendu Principal */
  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-12">
      {/* Top gradient */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* BREADCRUMB & ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/user"
            className="group inline-flex items-center gap-2.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <span className="p-2 rounded-xl bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:shadow-sm transition-all">
              <ArrowLeftIcon className="h-4 w-4" />
            </span>
            <span className="font-medium hidden sm:inline">Back to forums</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                isBookmarked
                  ? "bg-amber-50 border-amber-200 text-amber-500 shadow-sm"
                  : "bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50"
              }`}
              title="Save"
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
              title="Share"
            >
              <ShareIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* HERO */}
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
                    {hasSlots ? "Slots" : "Open"}
                  </InfoBadge>
                  <InfoBadge variant="success" icon={<ShieldCheckIcon className="h-3 w-3" />}>
                    Secure
                  </InfoBadge>
                  {isFull && (
                    <InfoBadge variant="warning" icon={<ExclamationTriangleIcon className="h-3 w-3" />}>
                      Full
                    </InfoBadge>
                  )}
                </div>
              </div>
              {isFull ? (
                <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-[11px] font-bold border border-red-100 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Full
                </span>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
              <SparklesIcon className="h-3.5 w-3.5 text-amber-500" />
              <span>Registration {hasSlots ? "with time slot" : "open"}</span>
            </div>

            {/* Infos cles */}
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x sm:flex-wrap sm:overflow-visible scrollbar-hide">
              {quickFacts.map((fact, i) => (
                <div key={i} className="snap-start" onClick={fact.label === "Location" ? handleCopyAddress : undefined}>
                  <QuickFact 
                    icon={fact.icon} 
                    label={fact.label} 
                    value={fact.label === "Location" && copiedAddress ? "Copied!" : fact.value}
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

        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PRIMAIRE : Inscription */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative p-6 pb-5 border-b border-slate-50">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-80" />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Registration</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {isFull
                        ? "This forum is full. No registration is possible at the moment."
                        : hasSlots
                        ? `Choose a slot (${forum.duree} min) then confirm.`
                        : "No slot required. Confirm your registration below."}
                    </p>
                  </div>
                  <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-indigo-50 items-center justify-center shrink-0">
                    <TicketIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>

                {/* Etapes */}
                {!isFull && hasSlots && (
                  <div className="flex items-center gap-3 mt-5">
                    <StepPill
                      index={1}
                      label="Choose a slot"
                      state={selectedSlot ? "done" : "active"}
                    />
                    <div className="flex-1 h-px bg-slate-200" />
                    <StepPill
                      index={2}
                      label="Confirm"
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
                    title="Forum full"
                    message={`The maximum number of participants (${forum.nombre_max}) has been reached. Please check back later in case spots open up.`}
                  />
                )}

                {!isFull && occupancyRate >= 80 && (
                  <FeedbackMessage
                    type="warning"
                    title="Limited spots"
                    message={`Only ${forum.nombre_max - candidatsDuForum.length} spot${forum.nombre_max - candidatsDuForum.length > 1 ? "s" : ""} available — don't wait.`}
                  />
                )}

                {/* SlotPicker */}
                {!isFull && hasSlots && (
                  <div id="slot-picker" className="mb-2 scroll-mt-24">
                    <div className="flex items-center gap-2 mb-4">
                      <ClockIcon className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-bold text-slate-700">
                        Select your slot
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

                {/* Programme complet */}
                {!isFull && hasSlots && slots.length > 0 && (
                  <div className="mb-5">
                    <button
                      type="button"
                      onClick={() => setShowSchedule((s) => !s)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-2 focus-visible:outline-none"
                    >
                      <span>View full schedule ({slots.length} slots)</span>
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

                {/* Message creneau requis */}
                {hasSlots && !selectedSlot && !isFull && (
                  <FeedbackMessage
                    type="info"
                    title="Slot required"
                    message="Select a slot to enable registration confirmation."
                  />
                )}

                {/* Erreur serveur */}
                {submitError && (
                  <FeedbackMessage
                    type="error"
                    title="Error"
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
                      <span>Registering...</span>
                    </>
                  ) : isFull ? (
                    <>
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2.5" />
                      <span>Forum full</span>
                    </>
                  ) : hasSlots && !selectedSlot ? (
                    <>
                      <ClockIcon className="h-5 w-5 mr-2.5" />
                      <span>Select a slot</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2.5" />
                      <span>Confirm registration</span>
                    </>
                  )}
                </button>

                <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
                  By registering, you agree to receive information related to this forum.
                  <br />
                  You can unsubscribe at any time from your personal space.
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <ForumStatsCard forum={forum} candidatures={candidatures} />
          </section>

          {/* SECONDAIRE : Details */}
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
                <p className="text-sm font-semibold text-slate-800">Secure registration</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your data is protected and will only be used to manage your registration.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="shrink-0 h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <StarIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Need help?</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Contact support at any time for any questions regarding your registration.
                </p>
                <a href="mailto:support@forum.fr" className="mt-2 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  support@forum.fr
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Barre d'inscription flottante (mobile) */}
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
                  {selectedSlot ? selectedSlot : hasSlots ? "Choose a slot" : "Open registration"}
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
                  "Choose"
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles additionnels pour animations et scrollbar */}
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
