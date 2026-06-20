import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token) config.headers.Authorization = `Bearer ${token}`;
    
    // Don't override Content-Type if FormData is being sent
    // (axios automatically sets it to multipart/form-data)
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    
    return config;
});

export default api;