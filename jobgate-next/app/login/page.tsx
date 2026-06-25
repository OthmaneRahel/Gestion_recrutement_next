"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    User,
    ArrowRight,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    Building2,
    Zap,
    ChevronRight,
    Loader2,
    ArrowLeft,
    CheckCircle2,
    Shield,
    Fingerprint,
    Globe,
    Rocket,
    Target,
    Users,
    TrendingUp,
} from "lucide-react";
import {
    API_BASE_URL,
    clearSession,
    getDashboardPath,
    saveSession,
    validateSession,
} from "@/lib/auth";
import axios from "axios";

// ─── Types ───────────────────────────────────────────────
type UserType = "talent" | "recruteur";

interface LoginData {
    email: string;
    password: string;
}

// ─── Composants d'illustration modernes ─────────────────
const TalentIllustration = () => (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Fond animé */}
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-pink-600/30"
            animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Particules flottantes */}
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                    y: [0, -30, 0],
                    x: [0, Math.sin(i * 60) * 20, 0],
                    opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                }}
                style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                }}
            />
        ))}

        <div className="relative z-10 text-center space-y-8">
            <motion.div
                className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Sparkles className="w-14 h-14 text-white" />
            </motion.div>

            <div className="space-y-3">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white font-display drop-shadow-lg"
                >
                    Développez votre carrière
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80 max-w-xs mx-auto text-sm leading-relaxed"
                >
                    Accédez à des opportunités exclusives et faites briller vos compétences
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-2"
            >
                {["React", "Python", "Design", "Marketing"].map((skill, i) => (
                    <motion.span
                        key={skill}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white border border-white/20 shadow-lg"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                    >
                        {skill}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    </div>
);

const RecruiterIllustration = () => (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Fond animé */}
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-cyan-600/30"
            animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />

        {/* Particules flottantes */}
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                    y: [0, -30, 0],
                    x: [0, Math.cos(i * 60) * 20, 0],
                    opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3 + 0.5,
                }}
                style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                }}
            />
        ))}

        <div className="relative z-10 text-center space-y-8">
            <motion.div
                className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Building2 className="w-14 h-14 text-white" />
            </motion.div>

            <div className="space-y-3">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white font-display drop-shadow-lg"
                >
                    Recrutez les meilleurs
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80 max-w-xs mx-auto text-sm leading-relaxed"
                >
                    Trouvez les talents qui feront la différence dans votre entreprise
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-2"
            >
                {["CV", "Entretien", "Matching", "Analytics"].map((feature, i) => (
                    <motion.span
                        key={feature}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white border border-white/20 shadow-lg"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                    >
                        {feature}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    </div>
);

// ─── Composant principal ─────────────────────────────────
export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<UserType>("talent");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [datauser, setDatauser] = useState<LoginData>({ email: "", password: "" });

    // États pour le mot de passe oublié
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetStep, setResetStep] = useState<"email" | "code" | "password">("email");
    const [resetEmail, setResetEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const [resetMessageType, setResetMessageType] = useState<"success" | "error">("success");

    useEffect(() => {
        let isActive = true;
        const redirectLoggedInUser = async () => {
            const session = await validateSession();
            if (isActive && session) {
                router.replace(getDashboardPath(session.userType));
            }
        };
        redirectLoggedInUser();
        return () => { isActive = false; };
    }, [router]);

    const getvalue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDatauser((prev) => ({ ...prev, [event.target.name]: event.target.value }));
        if (error) setError("");
    };

    const login = async () => {
        if (!datauser.email || !datauser.password) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/`, datauser);

            if (response.status === 200) {
                if (
                    !response.data.access ||
                    !response.data.user ||
                    (response.data.user_type !== "talent" && response.data.user_type !== "recruteur")
                ) {
                    clearSession();
                    setError("Réponse d'authentification invalide");
                    return;
                }

                clearSession();
                saveSession(response.data);
                router.replace(getDashboardPath(response.data.user_type));
            }
        } catch (error: any) {
            clearSession();
            if (error.response?.status === 400 || error.response?.status === 401) {
                setError("Email ou mot de passe incorrect");
            } else if (error.code === "ERR_NETWORK") {
                setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré.");
            }else if (error.code === "ERR_BAD_REQUEST") {
                setError("Votre compte a été désactivé. Veuillez contacter l'administrateur.");
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Mot de passe oublié ────────────────────────────────
    const sendVerificationCode = async () => {
        if (!resetEmail) {
            setResetMessage("Veuillez entrer votre email");
            setResetMessageType("error");
            return;
        }
        setIsLoading(true);
        setResetMessage("");
        try {
            const response = await axios.post(`${API_BASE_URL}/send-verification-code/`, { email: resetEmail });
            if (response.data.code) {
                alert(`🔐 VOTRE CODE: ${response.data.code}\n\nUtilisez ce code pour réinitialiser votre mot de passe.`);
            }
            setResetStep("code");
            setResetMessage("");
        } catch (error: any) {
            setResetMessage(error.response?.data?.message || "Une erreur est survenue");
            setResetMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            setResetMessage("Veuillez entrer le code à 6 chiffres");
            setResetMessageType("error");
            return;
        }
        setIsLoading(true);
        setResetMessage("");
        try {
            const response = await axios.post(
                `${API_BASE_URL}/verify-code/`,
                { email: resetEmail, code: verificationCode },
                { withCredentials: true }
            );
            if (response.data.reset_token) {
                setResetToken(response.data.reset_token);
                setResetStep("password");
                setResetMessage("");
            }
        } catch (error: any) {
            setResetMessage(error.response?.data?.message || "Code invalide");
            setResetMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetToken) {
            setResetMessage("Session expirée. Veuillez recommencer.");
            setResetMessageType("error");
            return;
        }
        if (!newPassword || !confirmPassword) {
            setResetMessage("Veuillez remplir tous les champs");
            setResetMessageType("error");
            return;
        }
        if (newPassword !== confirmPassword) {
            setResetMessage("Les mots de passe ne correspondent pas");
            setResetMessageType("error");
            return;
        }
        if (newPassword.length < 6) {
            setResetMessage("Le mot de passe doit contenir au moins 6 caractères");
            setResetMessageType("error");
            return;
        }
        setIsLoading(true);
        setResetMessage("");
        try {
            await axios.post(
                `${API_BASE_URL}/reset-password-with-code/`,
                {
                    token: resetToken,
                    email: resetEmail,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                },
                { withCredentials: true }
            );
            setResetMessage("Mot de passe réinitialisé avec succès !");
            setResetMessageType("success");
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetStep("email");
                setResetEmail("");
                setResetToken("");
                setVerificationCode("");
                setNewPassword("");
                setConfirmPassword("");
                setResetMessage("");
            }, 2000);
        } catch (error: any) {
            setResetMessage(error.response?.data?.message || "Une erreur est survenue");
            setResetMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const resendCode = async () => {
        setIsLoading(true);
        try {
            await axios.post(
                `${API_BASE_URL}/send-verification-code/`,
                { email: resetEmail },
                { withCredentials: true }
            );
            setResetMessage("Un nouveau code a été envoyé à votre email");
            setResetMessageType("success");
            setTimeout(() => setResetMessage(""), 3000);
        } catch (error: any) {
            setResetMessage("Impossible d'envoyer le code");
            setResetMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const resetFlow = () => {
        setShowForgotPassword(false);
        setResetStep("email");
        setResetEmail("");
        setResetToken("");
        setVerificationCode("");
        setNewPassword("");
        setConfirmPassword("");
        setResetMessage("");
    };

    // ─── Rendu ──────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-white/20">

                {/* ─── Panneau gauche : Illustration ───────────────── */}
                <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                    {/* Dégradé animé */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Toggle switch pour mobile/tablette */}
                    <div className="lg:hidden p-8 relative z-20">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 shadow-xl">
                            <button
                                onClick={() => setActiveTab("talent")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                    activeTab === "talent"
                                        ? "bg-white text-gray-900 shadow-lg"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                <User className="w-4 h-4" />
                                Talent
                            </button>
                            <button
                                onClick={() => setActiveTab("recruteur")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                    activeTab === "recruteur"
                                        ? "bg-white text-gray-900 shadow-lg"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                <Briefcase className="w-4 h-4" />
                                Recruteur
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === "talent" ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: activeTab === "talent" ? 20 : -20 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            className="h-64 lg:h-full flex items-center justify-center p-8 lg:p-12"
                        >
                            {activeTab === "talent" ? <TalentIllustration /> : <RecruiterIllustration />}
                        </motion.div>
                    </AnimatePresence>

                    {/* Indicateurs de slide */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 lg:hidden">
                        <motion.div
                            animate={{
                                scale: activeTab === "talent" ? 1 : 0.6,
                                opacity: activeTab === "talent" ? 1 : 0.4,
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                activeTab === "talent" ? "bg-white" : "bg-white/40"
                            }`}
                        />
                        <motion.div
                            animate={{
                                scale: activeTab === "recruteur" ? 1 : 0.6,
                                opacity: activeTab === "recruteur" ? 1 : 0.4,
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                activeTab === "recruteur" ? "bg-white" : "bg-white/40"
                            }`}
                        />
                    </div>
                </div>

                {/* ─── Panneau droit : Formulaire ─────────────────── */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative bg-white/50 backdrop-blur-xl">

                    {/* Toggle desktop */}
                    <div className="hidden lg:flex mb-10 bg-gradient-to-r from-gray-100 to-blue-50 rounded-2xl p-1.5 border border-gray-200/50 shadow-inner">
                        <button
                            onClick={() => setActiveTab("talent")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                activeTab === "talent"
                                    ? "bg-white text-gray-900 shadow-lg"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                            }`}
                        >
                            <User className="w-4 h-4" />
                            Je suis un Talent
                        </button>
                        <button
                            onClick={() => setActiveTab("recruteur")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                activeTab === "recruteur"
                                    ? "bg-white text-gray-900 shadow-lg"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                            }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Je suis Recruteur
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {!showForgotPassword ? (
                            <motion.div
                                key="login-form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                                className="space-y-6"
                            >
                                {/* Header */}
                                <div className="space-y-3">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                        className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl"
                                    >
                                        {activeTab === "talent" ? (
                                            <Zap className="w-7 h-7 text-white" />
                                        ) : (
                                            <Building2 className="w-7 h-7 text-white" />
                                        )}
                                    </motion.div>
                                    <h1 className="text-3xl font-bold text-gray-900 font-display">
                                        {activeTab === "talent" ? "Espace Talent" : "Espace Recruteur"}
                                    </h1>
                                    <p className="text-gray-500 text-sm">
                                        {activeTab === "talent"
                                            ? "Connectez-vous pour accéder à vos opportunités"
                                            : "Connectez-vous pour gérer vos recrutements"}
                                    </p>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 rounded-xl p-4 flex items-start gap-3 shadow-sm"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-red-600 text-xs font-bold">!</span>
                                            </div>
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Form */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-blue-500" />
                                            Adresse email
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                name="email"
                                                value={datauser.email}
                                                onChange={getvalue}
                                                placeholder="vous@exemple.com"
                                                disabled={isLoading}
                                                className="w-full pl-4 pr-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg transition-all duration-200 disabled:opacity-50"
                                                onKeyDown={(e) => e.key === "Enter" && login()}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-blue-500" />
                                            Mot de passe
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={datauser.password}
                                                onChange={getvalue}
                                                placeholder="••••••••"
                                                disabled={isLoading}
                                                className="w-full pl-4 pr-12 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg transition-all duration-200 disabled:opacity-50"
                                                onKeyDown={(e) => e.key === "Enter" && login()}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-6 h-6 border-2 border-gray-300 rounded-lg peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 peer-checked:border-transparent transition-all duration-200 shadow-sm" />
                                                <CheckCircle2 className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Se souvenir de moi</span>
                                        </label>
                                        <button
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-sm text-blue-500 hover:text-blue-700 font-semibold transition-colors"
                                        >
                                            Mot de passe oublié ?
                                        </button>
                                    </div>

                                    <motion.button
                                        onClick={login}
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Connexion en cours...
                                            </>
                                        ) : (
                                            <>
                                                Se connecter
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-4 bg-white/50 backdrop-blur-sm text-gray-400">ou</span>
                                    </div>
                                </div>

                                {/* Sign up link */}
                                <div className="text-center space-y-4">
                                    <p className="text-sm text-gray-500">
                                        Vous n'avez pas de compte ?{" "}
                                        <button
                                            onClick={() => router.push(`/signup/${activeTab}`)}
                                            className="text-blue-500 hover:text-blue-700 font-bold transition-colors inline-flex items-center gap-1 group"
                                        >
                                            S'inscrire
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </p>

                                    {/* Switch account type */}
                                    <button
                                        onClick={() => setActiveTab(activeTab === "talent" ? "recruteur" : "talent")}
                                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1 mx-auto"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        {activeTab === "talent" ? "Vous êtes recruteur ?" : "Vous êtes talent ?"}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="forgot-password"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                                className="space-y-6"
                            >
                                {/* Header */}
                                <div className="space-y-3">
                                    <button
                                        onClick={resetFlow}
                                        className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-sm mb-2 group"
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        Retour
                                    </button>
                                    <h2 className="text-2xl font-bold text-gray-900 font-display">
                                        {resetStep === "email" && "Mot de passe oublié"}
                                        {resetStep === "code" && "Vérification"}
                                        {resetStep === "password" && "Nouveau mot de passe"}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {resetStep === "email" && "Entrez votre email pour recevoir un code de vérification"}
                                        {resetStep === "code" && `Entrez le code à 6 chiffres envoyé à ${resetEmail}`}
                                        {resetStep === "password" && "Créez un nouveau mot de passe sécurisé"}
                                    </p>
                                </div>

                                {/* Message */}
                                <AnimatePresence>
                                    {resetMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`border-l-4 rounded-xl p-4 flex items-start gap-3 shadow-sm backdrop-blur-sm ${
                                                resetMessageType === "success"
                                                    ? "bg-yellow-50/80 border-yellow-500"
                                                    : "bg-red-50/80 border-red-500"
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                resetMessageType === "success" ? "bg-yellow-100" : "bg-red-100"
                                            }`}>
                        <span className={`text-xs font-bold ${
                            resetMessageType === "success" ? "text-yellow-600" : "text-red-600"
                        }`}>!</span>
                                            </div>
                                            <p className={`text-sm ${
                                                resetMessageType === "success" ? "text-yellow-700" : "text-red-700"
                                            }`}>{resetMessage}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Step Email */}
                                {resetStep === "email" && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-blue-500" />
                                                Email
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    placeholder="vous@exemple.com"
                                                    disabled={isLoading}
                                                    className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg transition-all disabled:opacity-50"
                                                    onKeyDown={(e) => e.key === "Enter" && sendVerificationCode()}
                                                />
                                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={sendVerificationCode}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    Envoyer le code
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                )}

                                {/* Step Code */}
                                {resetStep === "code" && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Code de vérification</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                                                    placeholder="000000"
                                                    disabled={isLoading}
                                                    className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-900 text-center text-2xl tracking-[0.5em] placeholder:text-gray-300 placeholder:tracking-normal focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg transition-all disabled:opacity-50"
                                                    onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                                                />
                                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={handleVerifyCode}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>Vérifier le code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </motion.button>
                                        <button
                                            onClick={resendCode}
                                            disabled={isLoading}
                                            className="w-full text-center text-sm text-blue-500 hover:text-blue-700 font-semibold transition-colors disabled:opacity-50"
                                        >
                                            Renvoyer le code
                                        </button>
                                    </div>
                                )}

                                {/* Step Password */}
                                {resetStep === "password" && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Nouveau mot de passe</label>
                                            <div className="relative group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    disabled={isLoading}
                                                    className="w-full pl-4 pr-12 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg transition-all disabled:opacity-50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Confirmer le mot de passe</label>
                                            <div className="relative group">
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    disabled={isLoading}
                                                    className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg transition-all disabled:opacity-50"
                                                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                                                />
                                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={handleResetPassword}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>Réinitialiser <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
