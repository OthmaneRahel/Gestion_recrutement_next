"use client";

import axios from "axios";
import { useState } from "react";

export default function SignUpRecruteur() {
  let [recruteur, setrecruteur] = useState({
    first_name: "",
    last_name: "",
    email: "",
    numero_telephone: "",
    password: "",
    Entreprise: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getvalue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setrecruteur((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (error) setError("");
  };

  const Signuptalent = () => {
    // Validation
    if (!recruteur.first_name || !recruteur.last_name || !recruteur.email ||
        !recruteur.password || !recruteur.numero_telephone || !recruteur.Entreprise) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    axios
        .post("http://127.0.0.1:8000/api/signup/", recruteur)
        .then((response) => {
          console.log(response.data);
          setSuccess("Inscription réussie ! Redirection...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
          setError("Erreur lors de l'inscription. Vérifiez votre connexion.");
        })
        .finally(() => {
          setLoading(false);
        });
  };

  // Styles inline
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    maxWidth: "500px",
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

  const inputFocusStyle = {
    borderColor: "#667eea",
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

  const separatorStyle = {
    marginTop: "25px",
    textAlign: "center" as const,
    position: "relative" as const,
    borderTop: "1px solid #e0e0e0",
    paddingTop: "20px",
  };

  const googleButtonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "white",
    color: "#333",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s",
    marginTop: "15px",
  };

  return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={iconStyle}>
              👔
            </div>
            <h1 style={titleStyle}>Inscription Recruteur</h1>
            <p style={subtitleStyle}>Créez votre compte pour recruter les meilleurs talents</p>
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
                value={recruteur.first_name}
                onChange={getvalue}
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                placeholder="Jean"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Nom <span style={requiredStyle}>*</span>
            </label>
            <input
                type="text"
                name="last_name"
                value={recruteur.last_name}
                onChange={getvalue}
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                placeholder="Dupont"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Nom de l'entreprise <span style={requiredStyle}>*</span>
            </label>
            <input
                type="text"
                name="Entreprise"
                value={recruteur.Entreprise}
                onChange={getvalue}
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                placeholder="Ma Société SAS"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Email <span style={requiredStyle}>*</span>
            </label>
            <input
                type="email"
                name="email"
                value={recruteur.email}
                onChange={getvalue}
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                placeholder="jean.dupont@entreprise.com"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Numéro de téléphone <span style={requiredStyle}>*</span>
            </label>
            <input
                type="tel"
                name="numero_telephone"
                value={recruteur.numero_telephone}
                onChange={getvalue}
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                placeholder="06 12 34 56 78"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Mot de passe <span style={requiredStyle}>*</span>
            </label>
            <input
                type="password"
                name="password"
                value={recruteur.password}
                onChange={getvalue}
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                placeholder="••••••••"
            />
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

          <div style={separatorStyle}>
          <span style={{ backgroundColor: "white", padding: "0 10px", color: "#999", fontSize: "12px" }}>
            ou
          </span>
          </div>

          <button
              style={googleButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
                e.currentTarget.style.borderColor = "#667eea";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>
        </div>
      </div>
  );
}