// features/auth/pages/Register.jsx
import AuthForm from "../components/authForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");

  const handleRegister = async (data) => {
    try {
      console.log("Attempting register with:", data);
      const res = await register(data);
      console.log("Register result:", res);
      
      if (res && res.token) {
        console.log("Registration successful, reloading page to get fresh user data...");
        // Reload page after a short delay to ensure localStorage is set
        setTimeout(() => {
          window.location.href = "/jobs";
        }, 100);
      } else {
        setAuthError("Registration failed - no token received");
      }
    } catch (err) {
      console.error("Register error:", err);
      setAuthError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <h1 style={styles.title}>JobNest</h1>
        <p style={styles.subtitle}>Create Your Account</p>
        
        <AuthForm type="register" onSubmit={handleRegister} />
        
        {(error || authError) && <p style={styles.error}>{error || authError}</p>}
        
        <div style={styles.footer}>
          <p>Already have an account?</p>
          <button onClick={() => navigate("/login")} style={styles.link}>
            Login here
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
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
  },
  authCard: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(27, 165, 165, 0.3)",
    border: "1px solid #D9DDD4",
  },
  title: {
    textAlign: "center",
    color: "#1BA5A5",
    marginBottom: "5px",
    fontSize: "32px",
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: "30px",
    fontSize: "14px",
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginTop: "15px",
    padding: "10px",
    background: "#fadbd8",
    borderRadius: "6px",
    fontSize: "14px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    borderTop: "1px solid #D9DDD4",
    paddingTop: "20px",
  },
  link: {
    background: "none",
    border: "none",
    color: "#1BA5A5",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default Register;