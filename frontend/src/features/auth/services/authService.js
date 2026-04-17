import api from '@/shared/api/apiClient.js';

export const loginUser = async(data) =>{
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const registerUser = async(data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};