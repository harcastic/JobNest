import api from '@/shared/api/apiClient.js';

export const loginUser = async(data) =>{
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const registerUser = async(data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};

export const logoutUser = async() => {
    try {
        const res = await api.post("/auth/logout");
        return res.data;
    } catch (error) {
        // Even if the API call fails, we'll still clear the frontend
        console.error("Logout API error:", error);
        return { message: "Logout completed" };
    }
};