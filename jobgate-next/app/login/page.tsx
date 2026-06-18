"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, clearSession, getDashboardPath, saveSession, validateSession } from "@/lib/auth";

export default function LoginPage() {
    const [datauser, setDatauser] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const [resetMessageType, setResetMessageType] = useState<"success" | "error">("success");

    // États pour le flux de vérification à 2 étapes
    const [showVerifyCode, setShowVerifyCode] = useState(false);
    const [resetEmailTemp, setResetEmailTemp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    useEffect(() => {
        let isActive = true;

        const redirectLoggedInUser = async () => {
            const session = await validateSession();

            if (isActive && session) {
                router.replace(getDashboardPath(session.userType));
            }
        };

        redirectLoggedInUser();

        return () => {
            isActive = false;
        };
    }, [router]);

    const getvalue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDatauser((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
        if (error) setError("");
    };

    const login = async () => {
        if (!datauser.email || !datauser.password) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
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
            } else if (error.code === 'ERR_NETWORK') {
                setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré.");
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Étape 1: Envoyer le code de vérification
    // const sendVerificationCode = async () => {
    //     if (!resetEmail) {
    //         setResetMessage("Veuillez entrer votre email");
    //         setResetMessageType("error");
    //         return;
    //     }

    //     setLoading(true);
    //     setResetMessage("");

    //     try {
    //         console.log("Envoi à:", "http://127.0.0.1:8000/api/send-verification-code/");

    //         const response = await axios.post("http://127.0.0.1:8000/api/send-verification-code/", {
    //             email: resetEmail
    //         });

    //         console.log("Réponse:", response.data);

    //         setResetEmailTemp(resetEmail);
    //         setShowVerifyCode(true);
    //         setShowForgotPassword(false);
    //         setResetMessage("");

    //     } catch (error: any) {
    //         console.error("Erreur:", error);
    //         setResetMessage(error.response?.data?.message || "Une erreur est survenue");
    //         setResetMessageType("error");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const sendVerificationCode = async () => {
        if (!resetEmail) {
            setResetMessage("Veuillez entrer votre email");
            setResetMessageType("error");
            return;
        }

        setLoading(true);
        setResetMessage("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/send-verification-code/", {
                email: resetEmail
            });

            console.log("Réponse:", response.data);

            // Pour le développement - le code est retourné directement
            if (response.data.code) {
                alert(`🔐 VOTRE CODE: ${response.data.code}\n\nUtilisez ce code pour réinitialiser votre mot de passe.`);
            }

            setResetEmailTemp(resetEmail);
            setShowVerifyCode(true);
            setShowForgotPassword(false);
            setResetMessage("");

        } catch (error: any) {
            console.error("Erreur:", error);
            setResetMessage(error.response?.data?.message || "Une erreur est survenue");
            setResetMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // Étape 2: Vérifier le code
    const handleVerifyCode = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            setResetMessage("Veuillez entrer le code à 6 chiffres");
            setResetMessageType("error");
            return;
        }

        setLoading(true);
        setResetMessage("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/verify-code/", {
                email: resetEmailTemp,
                code: verificationCode
            },
            { withCredentials: true }
        );

            if (response.data.reset_token) {
                setResetToken(response.data.reset_token);
                setShowVerifyCode(false);
                setShowNewPassword(true);
                setResetMessage("");
            }
        } catch (error: any) {
            setResetMessage(error.response?.data?.message || "Code invalide");
            setResetMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // Étape 3: Réinitialiser le mot de passe
    // const handleResetPassword = async () => {
    //     if (!newPassword || !confirmPassword) {
    //         setResetMessage("Veuillez remplir tous les champs");
    //         setResetMessageType("error");
    //         return;
    //     }

    //     if (newPassword !== confirmPassword) {
    //         setResetMessage("Les mots de passe ne correspondent pas");
    //         setResetMessageType("error");
    //         return;
    //     }

    //     if (newPassword.length < 6) {
    //         setResetMessage("Le mot de passe doit contenir au moins 6 caractères");
    //         setResetMessageType("error");
    //         return;
    //     }

    //     setLoading(true);
    //     setResetMessage("");

    //     try {
    //         await axios.post("http://127.0.0.1:8000/api/reset-password-with-code/", {
    //             token: resetToken,
    //             email: resetEmailTemp,
    //             new_password: newPassword,
    //             confirm_password: confirmPassword
    //         });

    //         setResetMessage("Mot de passe réinitialisé avec succès !");
    //         setResetMessageType("success");

    //         setTimeout(() => {
    //             setShowForgotPassword(false);
    //             setShowVerifyCode(false);
    //             setShowNewPassword(false);
    //             setResetEmail("");
    //             setResetEmailTemp("");
    //             setResetToken("");
    //             setVerificationCode("");
    //             setNewPassword("");
    //             setConfirmPassword("");
    //             setResetMessage("");
    //             router.push("/login");
    //         }, 2000);

    //     } catch (error: any) {
    //         setResetMessage(error.response?.data?.message || "Une erreur est survenue");
    //         setResetMessageType("error");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleResetPassword = async () => {
        console.log("=== RÉINITIALISATION ===");
        console.log("Token:", resetToken);
        console.log("Email:", resetEmailTemp);

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

        setLoading(true);
        setResetMessage("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/reset-password-with-code/", {
                token: resetToken,
                email: resetEmailTemp,
                new_password: newPassword,
                confirm_password: confirmPassword
            },
            { withCredentials: true }
        );

            console.log("Réponse reset:", response.data);

            setResetMessage("Mot de passe réinitialisé avec succès !");
            setResetMessageType("success");

            setTimeout(() => {
                setShowForgotPassword(false);
                setShowVerifyCode(false);
                setShowNewPassword(false);
                setResetEmail("");
                setResetEmailTemp("");
                setResetToken("");
                setVerificationCode("");
                setNewPassword("");
                setConfirmPassword("");
                setResetMessage("");
                router.push("/login");
            }, 2000);

        } catch (error: any) {
            console.error("Erreur reset:", error.response?.data);
            setResetMessage(error.response?.data?.message || "Une erreur est survenue");
            setResetMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // Renvoyer le code
    const resendCode = async () => {
        setLoading(true);
        try {
            await axios.post("http://127.0.0.1:8000/api/send-verification-code/", {
                email: resetEmailTemp
            },
            { withCredentials: true }
        );
            setResetMessage("Un nouveau code a été envoyé à votre email");
            setResetMessageType("success");
            setTimeout(() => setResetMessage(""), 3000);
        } catch (error: any) {
            setResetMessage("Impossible d'envoyer le code");
            setResetMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // Réinitialiser le flux
    const resetFlow = () => {
        setShowForgotPassword(false);
        setShowVerifyCode(false);
        setShowNewPassword(false);
        setResetEmail("");
        setResetEmailTemp("");
        setResetToken("");
        setVerificationCode("");
        setNewPassword("");
        setConfirmPassword("");
        setResetMessage("");
    };

    // Styles (je garde les mêmes que vous aviez)
    const pageStyle = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    };

    const cardStyle = {
        maxWidth: "450px",
        width: "100%",
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    };

    const headerStyle = {
        textAlign: "center" as const,
        marginBottom: "30px",
    };

    const iconStyle = {
        width: "70px",
        height: "70px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        fontSize: "30px",
    };

    const titleStyle = {
        margin: 0,
        color: "#333",
        fontSize: "28px",
        fontWeight: "bold",
    };

    const subtitleStyle = {
        color: "#666",
        marginTop: "10px",
        fontSize: "14px",
    };

    const formGroupStyle = {
        marginBottom: "20px",
    };

    const labelStyle = {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#555",
        fontSize: "14px",
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box" as const,
        outline: "none",
    };

    const codeInputStyle = {
        width: "100%",
        padding: "12px",
        fontSize: "24px",
        textAlign: "center" as const,
        letterSpacing: "10px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        outline: "none",
    };

    const errorStyle = {
        backgroundColor: "#fee",
        borderLeft: "4px solid #e74c3c",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "8px",
        color: "#c0392b",
        fontSize: "14px",
    };

    const successStyle = {
        backgroundColor: "#e8f5e9",
        borderLeft: "4px solid #4caf50",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "8px",
        color: "#2e7d32",
        fontSize: "14px",
    };

    const buttonStyle = {
        width: "100%",
        padding: "14px",
        backgroundColor: "#667eea",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s",
    };

    const buttonDisabledStyle = {
        backgroundColor: "#999",
        cursor: "not-allowed",
        opacity: 0.7,
    };

    const linkStyle = {
        textAlign: "center" as const,
        marginTop: "20px",
        color: "#666",
        fontSize: "14px",
    };

    const linkTextStyle = {
        color: "#667eea",
        textDecoration: "none",
        fontWeight: "bold",
        cursor: "pointer",
    };

    const forgotLinkStyle = {
        textAlign: "right" as const,
        marginTop: "5px",
        marginBottom: "20px",
    };

    const forgotButtonStyle = {
        background: "none",
        border: "none",
        color: "#667eea",
        fontSize: "13px",
        cursor: "pointer",
        textDecoration: "underline",
    };

    const modalOverlayStyle = {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    };

    const modalStyle = {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "30px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    };

    // Modal d'envoi du code
    if (showForgotPassword && !showVerifyCode && !showNewPassword) {
        return (
            <div style={pageStyle}>
                <div style={modalOverlayStyle} onClick={resetFlow}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={headerStyle}>
                            <div style={iconStyle}>🔐</div>
                            <h2 style={titleStyle}>Mot de passe oublié</h2>
                            <p style={subtitleStyle}>Entrez votre email pour recevoir un code de vérification</p>
                        </div>

                        {resetMessage && (
                            <div style={resetMessageType === "success" ? successStyle : errorStyle}>
                                {resetMessage}
                            </div>
                        )}

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Email</label>
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                style={inputStyle}
                                placeholder="votre@email.com"
                                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                                onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                            />
                        </div>

                        <button
                            onClick={sendVerificationCode}
                            disabled={loading}
                            style={{
                                ...buttonStyle,
                                ...(loading ? buttonDisabledStyle : {}),
                                marginBottom: "10px",
                            }}
                        >
                            {loading ? "Envoi en cours..." : "Envoyer le code"}
                        </button>

                        <button
                            onClick={resetFlow}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "transparent",
                                color: "#667eea",
                                border: "2px solid #667eea",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Retour à la connexion
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Modal de vérification du code
    if (showVerifyCode) {
        return (
            <div style={pageStyle}>
                <div style={modalOverlayStyle} onClick={resetFlow}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={headerStyle}>
                            <div style={iconStyle}>📧</div>
                            <h2 style={titleStyle}>Vérification</h2>
                            <p style={subtitleStyle}>
                                Entrez le code à 6 chiffres envoyé à <strong>{resetEmailTemp}</strong>
                            </p>
                        </div>

                        {resetMessage && (
                            <div style={resetMessageType === "success" ? successStyle : errorStyle}>
                                {resetMessage}
                            </div>
                        )}

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Code de vérification</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                style={codeInputStyle}
                                placeholder="000000"
                                disabled={loading}
                            />
                        </div>

                        <button
                            onClick={handleVerifyCode}
                            disabled={loading}
                            style={{
                                ...buttonStyle,
                                ...(loading ? buttonDisabledStyle : {}),
                                marginBottom: "10px",
                            }}
                        >
                            {loading ? "Vérification..." : "Vérifier le code"}
                        </button>

                        <button
                            onClick={resendCode}
                            disabled={loading}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#667eea",
                                cursor: "pointer",
                                textDecoration: "underline",
                                marginBottom: "10px",
                                width: "100%",
                            }}
                        >
                            Renvoyer le code
                        </button>

                        <button
                            onClick={() => {
                                setShowVerifyCode(false);
                                setShowForgotPassword(true);
                                setResetMessage("");
                            }}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "transparent",
                                color: "#999",
                                border: "2px solid #e0e0e0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Modal de nouveau mot de passe
    if (showNewPassword) {
        return (
            <div style={pageStyle}>
                <div style={modalOverlayStyle} onClick={resetFlow}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={headerStyle}>
                            <div style={iconStyle}>🔑</div>
                            <h2 style={titleStyle}>Nouveau mot de passe</h2>
                            <p style={subtitleStyle}>Créez un nouveau mot de passe pour votre compte</p>
                        </div>

                        {resetMessage && (
                            <div style={resetMessageType === "success" ? successStyle : errorStyle}>
                                {resetMessage}
                            </div>
                        )}

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={inputStyle}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={inputStyle}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            style={{
                                ...buttonStyle,
                                ...(loading ? buttonDisabledStyle : {}),
                                marginBottom: "10px",
                            }}
                        >
                            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                        </button>

                        <button
                            onClick={() => {
                                setShowNewPassword(false);
                                setShowForgotPassword(true);
                                setResetMessage("");
                                setNewPassword("");
                                setConfirmPassword("");
                            }}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "transparent",
                                color: "#999",
                                border: "2px solid #e0e0e0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Page de login principale
    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div style={headerStyle}>
                    <div style={iconStyle}>🔑</div>
                    <h1 style={titleStyle}>Connexion</h1>
                    <p style={subtitleStyle}>Connectez-vous à votre compte</p>
                </div>

                {error && (
                    <div style={errorStyle}>⚠️ {error}</div>
                )}

                <div style={formGroupStyle}>
                    <label style={labelStyle}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={datauser.email}
                        onChange={getvalue}
                        style={inputStyle}
                        placeholder="votre@email.com"
                        disabled={loading}
                    />
                </div>

                <div style={formGroupStyle}>
                    <label style={labelStyle}>Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={datauser.password}
                        onChange={getvalue}
                        style={inputStyle}
                        placeholder="••••••••"
                        disabled={loading}
                    />
                </div>

                <div style={forgotLinkStyle}>
                    <button onClick={() => setShowForgotPassword(true)} style={forgotButtonStyle}>
                        Mot de passe oublié ?
                    </button>
                </div>

                <button
                    onClick={login}
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        ...(loading ? buttonDisabledStyle : {}),
                    }}
                >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button>

                <div style={linkStyle}>
                    Vous n'avez pas de compte ?{" "}
                    <span
                        style={linkTextStyle}
                        onClick={() => router.push("/signup/talent")}
                    >
                        Inscrivez-vous
                    </span>
                </div>

                <div style={{ textAlign: "center", marginTop: "10px", fontSize: "12px", color: "#999" }}>
                    <span>Recruteur ? </span>
                    <span
                        style={{ color: "#667eea", cursor: "pointer", fontWeight: "bold" }}
                        onClick={() => router.push("/signup/recruteur")}
                    >
                        Inscription recruteur
                    </span>
                </div>
            </div>
        </div>
    );
}
