import axios from "axios";

const API = axios.create({
  // Vercel proxies production /api calls to the Render service. This keeps the
  // browser on one origin and avoids cross-origin/CORS failures.
  baseURL: import.meta.env.PROD
    ? "/api"
    : import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
