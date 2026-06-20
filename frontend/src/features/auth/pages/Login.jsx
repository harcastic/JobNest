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
    <div style={styles.authSplitPage}>
      {/* Global CSS Styles for auth page wrapper */}
      <style>{`
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.35; }
        }
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-split-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(135deg, #0F172A 0%, #0D9488 100%);
          padding: 60px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .auth-split-right {
          display: flex;
          align-items: center;
          justifyContent: center;
          padding: 40px 24px;
          background: #FFFFFF;
          position: relative;
        }

        .left-bg-pattern {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          animation: subtlePulse 8s infinite ease-in-out;
          pointer-events: none;
        }

        .left-bg-pattern-two {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, transparent 70%);
          bottom: -100px;
          right: -50px;
          animation: subtlePulse 6s infinite ease-in-out alternate;
          pointer-events: none;
        }

        .auth-left-content {
          animation: slideFadeIn 0.8s ease forwards;
          z-index: 2;
        }

        .glass-quote-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          margin-top: 40px;
          max-width: 460px;
          box-sizing: border-box;
          animation: slideFadeIn 1s ease forwards;
        }

        .auth-nav-link {
          color: #0D9488;
          font-weight: 700;
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 0;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .auth-nav-link:hover {
          color: #0F766E;
          text-decoration: underline;
        }

        .back-home-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748B;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          border: none;
          transition: all 0.2s ease;
          padding: 0;
          margin-bottom: 24px;
        }
        .back-home-btn:hover {
          color: #0D9488;
          transform: translateX(-2px);
        }

        .auth-error-banner {
          color: #EF4444;
          text-align: left;
          margin-top: 20px;
          padding: 12px 16px;
          background: #FEF2F2;
          border-left: 4px solid #EF4444;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .auth-split-left {
            display: none !important;
          }
          .auth-split-page {
            grid-template-columns: 1fr !important;
          }
          .auth-form-container {
            width: 100% !important;
            max-width: 420px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
            border: 1px solid #E2E8F0 !important;
            padding: 40px 30px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>

      {/* Left visual branding panel */}
      <div className="auth-split-left" style={styles.leftPanel}>
        <div className="left-bg-pattern"></div>
        <div className="left-bg-pattern-two"></div>

        {/* Brand header */}
        <div style={styles.brandHeader} onClick={() => navigate("/")}>
          <div style={styles.logoCircle}>
            <i className="fas fa-briefcase"></i>
          </div>
          <span style={styles.logoText}>JobNest</span>
        </div>

        {/* Visual middle pitch */}
        <div className="auth-left-content" style={styles.leftCenter}>
          <h2 style={styles.leftTitle}>Elevate your professional horizon.</h2>
          <p style={styles.leftSubtitle}>
            Browse verified listings, qualify through active pipeline screenings, and sync with recruiter networks directly.
          </p>

          <div className="glass-quote-card">
            <p style={styles.quoteText}>
              "JobNest has streamlined our developer sourcing process significantly. Instead of processing thousands of noisy resumes, we receive matched cohorts instantly."
            </p>
            <div style={styles.quoteAuthor}>
              <div style={styles.authorAvatarSquare}>ST</div>
              <div>
                <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "700", color: "#FFFFFF" }}>Helena Rostova</p>
                <p style={{ margin: "0", fontSize: "11px", color: "#CBD5E1" }}>Director of Engineering, Stripe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={styles.leftFooter}>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>&copy; 2026 JobNest Portal. Designed carefully and professionally.</p>
        </div>
      </div>

      {/* Right Form panel */}
      <div className="auth-split-right" style={styles.rightPanel}>
        <div style={styles.authFormContainer} className="auth-form-container">
          {/* Back button */}
          <button onClick={() => navigate("/")} className="back-home-btn">
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>

          {/* Headers */}
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Welcome Back</h1>
            <p style={styles.formSubtitle}>Sign in to access your profile and track active applications</p>
          </div>

          {/* Form */}
          <AuthForm type="login" onSubmit={handleLogin} />

          {/* Error display */}
          {(error || authError) && (
            <div className="auth-error-banner">
              <i className="fas fa-exclamation-circle" style={{ fontSize: "16px" }}></i>
              <span>{error || authError}</span>
            </div>
          )}

          {/* Footer navigator */}
          <div style={styles.formFooter}>
            <p style={{ margin: 0 }}>Don't have an account?</p>
            <button onClick={() => navigate("/register")} className="auth-nav-link">
              Create a free account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  authSplitPage: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    minHeight: "100vh",
    width: "100vw",
  },
  leftPanel: {
    boxSizing: "border-box",
  },
  rightPanel: {
    boxSizing: "border-box",
  },
  brandHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  logoCircle: {
    width: "36px",
    height: "36px",
    background: "#FFFFFF",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0D9488",
    fontSize: "18px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  logoText: {
    fontWeight: "800",
    fontSize: "24px",
    color: "#FFFFFF",
    letterSpacing: "-0.5px",
  },
  leftCenter: {
    maxWidth: "540px",
  },
  leftTitle: {
    fontSize: "36px",
    fontWeight: "900",
    lineHeight: "1.25",
    color: "#FFFFFF",
    margin: "0 0 16px 0",
    letterSpacing: "-0.5px",
  },
  leftSubtitle: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#E2E8F0",
    margin: "0 0 24px 0",
  },
  quoteText: {
    fontSize: "14px",
    fontStyle: "italic",
    lineHeight: "1.6",
    color: "#F8FAFC",
    margin: "0 0 20px 0",
  },
  quoteAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  authorAvatarSquare: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
  },
  authFormContainer: {
    width: "100%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
  },
  formHeader: {
    marginBottom: "28px",
  },
  formTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#64748B",
    lineHeight: "1.5",
    margin: 0,
  },
  formFooter: {
    textAlign: "center",
    marginTop: "28px",
    borderTop: "1px solid #F1F5F9",
    paddingTop: "24px",
    fontSize: "14.5px",
    color: "#475569",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};

export default Login;