import { useState } from "react";
import { loginUser, registerUser, logoutUser } from "../services/authService";

// Utility function to decode JWT token
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export const useAuth = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async(data) => {
        try{
            setError(null);
            setLoading(true);
            const response = await loginUser(data);

            console.log("Login response:", response);

            localStorage.setItem("token", response.token);
            
            // Store user information from response
            if (response.user) {
                console.log("Storing user data:", response.user);
                localStorage.setItem("userName", response.user.username);
                localStorage.setItem("userRole", response.user.role);
                if (response.user.profileImage) {
                    localStorage.setItem("userImage", response.user.profileImage);
                }
            } else {
                // Fallback: try to extract from token
                console.log("No user object in response, trying to decode token");
                const decoded = decodeToken(response.token);
                if (decoded && decoded.role) {
                    localStorage.setItem("userRole", decoded.role);
                    // Use email or identifier as username fallback
                    localStorage.setItem("userName", data.identifier || "User");
                }
            }
            
            // Verify what was stored
            console.log("Stored in localStorage:", {
                token: localStorage.getItem("token"),
                userName: localStorage.getItem("userName"),
                userRole: localStorage.getItem("userRole"),
                userImage: localStorage.getItem("userImage")
            });
            
            return response;
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
            const response = await registerUser(data);

            console.log("Register response:", response);

            localStorage.setItem("token", response.token);
            
            // Store user information from response
            if (response.user) {
                console.log("Storing user data:", response.user);
                localStorage.setItem("userName", response.user.username);
                localStorage.setItem("userRole", response.user.role);
                if (response.user.profileImage) {
                    localStorage.setItem("userImage", response.user.profileImage);
                }
            } else {
                // Fallback: extract from request data
                console.log("No user object in response, using form data");
                localStorage.setItem("userName", data.username || "User");
                localStorage.setItem("userRole", data.role || "user");
            }
            
            // Verify what was stored
            console.log("Stored in localStorage:", {
                token: localStorage.getItem("token"),
                userName: localStorage.getItem("userName"),
                userRole: localStorage.getItem("userRole"),
                userImage: localStorage.getItem("userImage")
            });
            
            return response;
        }
        catch(err){
            const errorMsg = err.response?.data?.message || err.message || "Register Failed";
            console.error("Register error:", err);
            setError(errorMsg);
        }finally{
            setLoading(false);
        }
    };

    const logout = async() => {
        try {
            setError(null);
            setLoading(true);
            
            // Call logout API
            await logoutUser();
            
            // Clear all user data from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userImage");
            
            // Dispatch custom event to notify all components about logout
            window.dispatchEvent(new CustomEvent('userLogout'));
            
            console.log("Logout successful, localStorage cleared, reloading page...");
            
            // Reload the page to clear all component state and redirect to login
            setTimeout(() => {
                window.location.href = "/login";
            }, 100);
            
            return { message: "Logout successful" };
        }
        catch(err){
            const errorMsg = err.response?.data?.message || err.message || "Logout Failed";
            console.error("Logout error:", err);
            setError(errorMsg);
            
            // Still clear localStorage even if API call fails
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userImage");
            window.dispatchEvent(new CustomEvent('userLogout'));
            
            // Reload the page to ensure clean state
            setTimeout(() => {
                window.location.href = "/login";
            }, 100);
        }finally{
            setLoading(false);
        }
    };

    return { login, register, logout, loading, error};
};