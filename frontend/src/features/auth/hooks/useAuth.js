import { useState } from "react";
import { loginUser, registerUser } from "../services/authService";

export const useAuth = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async(data) => {
        try{
            setError(null);
            setLoading(true);
            const user = await loginUser(data);

            localStorage.setItem("token", user.token);
            return user;
        }
        catch(err){
            const errorMsg = err.response?.data?.message || err.message || "Login Failed";
            console.error("Login error:", err);
            setError(errorMsg);
        }finally{
            setLoading(false);
        }
    };

    const register = async(data) => {
        try{
            setError(null);
            setLoading(true);
            const user = await registerUser(data);

            localStorage.setItem("token", user.token);
            return user;
        }
        catch(err){
            const errorMsg = err.response?.data?.message || err.message || "Register Failed";
            console.error("Register error:", err);
            setError(errorMsg);
        }finally{
            setLoading(false);
        }
    };

    return { login, register, loading, error};
};