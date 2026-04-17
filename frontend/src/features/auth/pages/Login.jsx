// features/auth/pages/Login.jsx
import AuthForm from "../components/authForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");

  const handleLogin = async (data) => {
    try {
      console.log("Attempting login with:", data);
      const res = await login(data);
      console.log("Login result:", res);
      
      if (res && res.token) {
        console.log("Login successful, reloading page to get fresh user data...");
        // Reload page after a short delay to ensure localStorage is set
        setTimeout(() => {
          window.location.href = "/jobs";
        }, 100);
      } else {
        setAuthError("Login failed - no token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <h1 style={styles.title}>JobNest</h1>
        <p style={styles.subtitle}>Find Your Dream Job</p>
        
        <AuthForm type="login" onSubmit={handleLogin} />
        
        {(error || authError) && <p style={styles.error}>{error || authError}</p>}
        
        <div style={styles.footer}>
          <p>Don't have an account?</p>
          <button onClick={() => navigate("/register")} style={styles.link}>
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  authCard: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
  },
  title: {
    textAlign: "center",
    color: "#667eea",
    marginBottom: "5px",
    fontSize: "32px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
    fontSize: "14px",
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginTop: "15px",
    padding: "10px",
    background: "#fadbd8",
    borderRadius: "4px",
    fontSize: "14px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    borderTop: "1px solid #eee",
    paddingTop: "20px",
  },
  link: {
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default Login;