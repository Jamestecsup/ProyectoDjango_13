import axios from "axios";

// Single place where the API base URL is configured.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
});

export default apiClient;
