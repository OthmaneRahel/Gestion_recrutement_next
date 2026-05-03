import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [datauser, setDatauser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getvalue = (event) => {
    setDatauser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const login = () => {
    axios
      .post("http://127.0.0.1:8000/api/auth/", datauser)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("token-login", response.data.access);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          if (response.data.user_type === "talent") navigate("/user");
          else navigate("/Recruteur");
        }
      })
      .catch(() => {
        setError("Email ou mot de passe incorrect");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-10">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Login
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
        )}

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={datauser.email}
            onChange={getvalue}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={datauser.password}
            onChange={getvalue}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        <button
          type="button"
          onClick={login}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 transition-colors shadow-md"
        >
          Sign In
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}