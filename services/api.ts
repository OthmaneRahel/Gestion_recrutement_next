// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
// });

// export default api;

// service/api.ts
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/",
// });

// // Add token interceptor
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token-login");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/",
});

// Add token interceptor (safe for SSR)
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token-login");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default API;