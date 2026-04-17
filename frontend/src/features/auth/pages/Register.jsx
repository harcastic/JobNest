// features/auth/pages/Register.jsx
import AuthForm from "../components/authForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    const res = await register(data);
    if (res) navigate("/jobs");
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <h1 style={styles.title}>JobNest</h1>
        <p style={styles.subtitle}>Create Your Account</p>
        
        <AuthForm type="register" onSubmit={handleRegister} />
        
        {error && <p style={styles.error}>{error}</p>}
        
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

export default Register;