"use client";

import axios from "axios";
import { useState } from "react";

export default function SignUpTalent() {
    let [talent, settalent] = useState({
        first_name: "",
        last_name: "",
        cv: null as File | null,
        email: "",
        numero_telephone: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fileName, setFileName] = useState("");

    const getvalue = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'cv') {
            const file = event.target.files?.[0];
            if (file) {
                if (file.type !== 'application/pdf') {
                    setError("Seuls les fichiers PDF sont acceptés");
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    setError("Le fichier ne doit pas dépasser 5 Mo");
                    return;
                }
                settalent((prev) => ({
                    ...prev,
                    cv: file,
                }));
                setFileName(file.name);
                setError("");
            }
        } else {
            settalent((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
            }));
            if (error) setError("");
        }
    };

    const Signuptalent = async () => {
        // Validation
        if (!talent.first_name || !talent.last_name || !talent.email ||
            !talent.password || !talent.numero_telephone || !talent.cv) {
            setError("Veuillez remplir tous les champs et télécharger votre CV");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const formdata = new FormData();
        formdata.append('first_name', talent.first_name);
        formdata.append('last_name', talent.last_name);
        formdata.append('cv', talent.cv);
        formdata.append('email', talent.email);
        formdata.append('numero_telephone', talent.numero_telephone);
        formdata.append('password', talent.password);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/signup/', formdata, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 30000, // 30 secondes pour l'upload du CV
            });

            console.log(response.data);
            setSuccess("Inscription réussie ! Redirection vers la page de connexion...");

            // Réinitialiser le formulaire
            settalent({
                first_name: "",
                last_name: "",
                cv: null,
                email: "",
                numero_telephone: "",
                password: "",
            });
            setFileName("");

            // Rediriger après 2 secondes
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);

        } catch (error: any) {
            console.error(error);
            if (error.code === 'ERR_NETWORK') {
                setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré.");
            } else if (error.response) {
                setError(error.response.data.message || "Une erreur est survenue lors de l'inscription");
            } else {
                setError("Une erreur est survenue");
            }
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const pageStyle = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    };

    const cardStyle = {
        maxWidth: "550px",
        margin: "0 auto",
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

    const requiredStyle = {
        color: "#e74c3c",
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box" as const,
        transition: "border-color 0.3s",
        outline: "none",
    };

    const fileInputStyle = {
        width: "100%",
        padding: "10px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box" as const,
        backgroundColor: "#f9f9f9",
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
        marginTop: "10px",
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
    };

    const fileNameStyle = {
        marginTop: "5px",
        fontSize: "12px",
        color: "#666",
        fontStyle: "italic" as const,
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div style={headerStyle}>
                    <div style={iconStyle}>
                        🎯
                    </div>
                    <h1 style={titleStyle}>Inscription Talent</h1>
                    <p style={subtitleStyle}>Rejoignez notre communauté et trouvez votre prochaine opportunité</p>
                </div>

                {error && (
                    <div style={errorStyle}>
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div style={successStyle}>
                        ✓ {success}
                    </div>
                )}

                <div style={formGroupStyle}>
                    <label style={labelStyle}>
                        Prénom <span style={requiredStyle}>*</span>
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        value={talent.first_name}
                        onChange={getvalue}
                        style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                        placeholder="Jean"
                        disabled={loading}
                    />
                </div>

                <div style={formGroupStyle}>
                    <label style={labelStyle}>
                        Nom <span style={requiredStyle}>*</span>
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        value={talent.last_name}
                        onChange={getvalue}
                        style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                        placeholder="Dupont"
                        disabled={loading}
                    />
                </div>

                <div style={formGroupStyle}>
                    <label style={labelStyle}>
                        CV (PDF) <span style={requiredStyle}>*</span>
                    </label>
                    <input
                        type="file"
                        name="cv"
                        accept="application/pdf"
                        onChange={getvalue}
                        style={fileInputStyle}
                        disabled={loading}
                    />
                    {fileName && (
                        <div style={fileNameStyle}>
                            📄 Fichier sélectionné: {fileName}
                        </div>
                    )}
                    <div style={{ fontSize: "11px", color: "#999", marginTop: "5px" }}>
                        Format PDF uniquement, taille max: 5 Mo
                    </div>
                </div>

                <div style={formGroupStyle}>
                    <label style={labelStyle}>
                        Email <span style={requiredStyle}>*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={talent.email}
                        onChange={getvalue}
                        style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                        placeholder="jean.dupont@email.com"
                        disabled={loading}
                    />
                </div>

                <div style={formGroupStyle}>
                    <label style={labelStyle}>
                        Numéro de téléphone <span style={requiredStyle}>*</span>
                    </label>
                    <input
                        type="tel"
                        name="numero_telephone"
                        value={talent.numero_telephone}
                        onChange={getvalue}
                        style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                        placeholder="06 12 34 56 78"
                        disabled={loading}
                    />
                </div>

                <div style={formGroupStyle}>
                    <label style={labelStyle}>
                        Mot de passe <span style={requiredStyle}>*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={talent.password}
                        onChange={getvalue}
                        style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                        placeholder="••••••••"
                        disabled={loading}
                    />
                    <div style={{ fontSize: "11px", color: "#999", marginTop: "5px" }}>
                        Minimum 6 caractères
                    </div>
                </div>

                <button
                    onClick={Signuptalent}
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        ...(loading ? buttonDisabledStyle : {}),
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.backgroundColor = "#5a67d8";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            e.currentTarget.style.backgroundColor = "#667eea";
                            e.currentTarget.style.transform = "translateY(0)";
                        }
                    }}
                >
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                </button>

                <div style={linkStyle}>
                    Déjà un compte ?{" "}
                    <a href="/login" style={linkTextStyle}>
                        Connectez-vous
                    </a>
                </div>
            </div>
        </div>
    );
}