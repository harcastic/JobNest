// features/auth/components/AuthForm.jsx
import { useState } from "react";

const AuthForm = ({ type, onSubmit }) => {
  const [form, setForm] = useState({
    identifier: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (selectedRole) => {
    setForm({ ...form, role: selectedRole });
  };

  return (
    <form
      className="auth-form-card"
      onSubmit={(e) => {
        e.preventDefault();
        const submitData = type === "login" 
          ? { identifier: form.identifier, password: form.password }
          : { username: form.username, email: form.email, password: form.password, role: form.role };
        onSubmit(submitData);
      }}
      style={styles.form}
    >
      {/* Scope-specific Styles injected dynamically */}
      <style>{`
        .input-wrapper {
          position: relative;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          font-size: 15px;
          transition: color 0.3s ease;
          pointer-events: none;
        }
        .auth-input-field {
          width: 100%;
          padding: 14px 16px 14px 42px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-size: 14px;
          font-family: inherit;
          color: #1E293B;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }
        .auth-input-field:focus {
          outline: none;
          background: #FFFFFF;
          border-color: #0D9488;
          box-shadow: 0 0 0 3.5px rgba(13, 148, 136, 0.15);
        }
        .auth-input-field:focus + .input-icon {
          color: #0D9488;
        }
        .eye-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          cursor: pointer;
          font-size: 15px;
          transition: color 0.2s ease;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justifyContent: center;
        }
        .eye-toggle-btn:hover {
          color: #0D9488;
        }

        /* Role Selector Tabs */
        .role-tabs-container {
          display: flex;
          background: #F1F5F9;
          padding: 5px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          margin-bottom: 5px;
          position: relative;
        }
        .role-tab-btn {
          flex: 1;
          padding: 12px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          border-radius: 9px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 6px;
        }
        .role-tab-btn.active {
          background: #FFFFFF;
          color: #0D9488;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .auth-submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 8px;
          box-sizing: border-box;
        }
        .auth-submit-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 18px rgba(13, 148, 136, 0.45);
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
        }
      `}</style>

      {/* Role Selection (Register Only) */}
      {type === "register" && (
        <div className="role-tabs-container">
          <button
            type="button"
            className={`role-tab-btn ${form.role === "user" ? "active" : ""}`}
            onClick={() => handleRoleToggle("user")}
          >
            <i className="fas fa-user-tie"></i> Job Seeker
          </button>
          <button
            type="button"
            className={`role-tab-btn ${form.role === "recruiter" ? "active" : ""}`}
            onClick={() => handleRoleToggle("recruiter")}
          >
            <i className="fas fa-building"></i> Recruiter
          </button>
        </div>
      )}

      {/* Username Input (Register Only) */}
      {type === "register" && (
        <div className="input-wrapper">
          <input
            name="username"
            placeholder="Username (3-15 characters)"
            onChange={handleChange}
            value={form.username}
            className="auth-input-field"
            required
            autoComplete="username"
          />
          <i className="fas fa-user input-icon"></i>
        </div>
      )}

      {/* Email / Identifier Input */}
      <div className="input-wrapper">
        <input
          name={type === "login" ? "identifier" : "email"}
          type={type === "login" ? "text" : "email"}
          placeholder={type === "login" ? "Email or Username" : "Email address"}
          onChange={handleChange}
          value={type === "login" ? form.identifier : form.email}
          className="auth-input-field"
          required
          autoComplete={type === "login" ? "username" : "email"}
        />
        <i className={`fas ${type === "login" ? "fa-user-circle" : "fa-envelope"} input-icon`}></i>
      </div>

      {/* Password Input with Show/Hide Toggle */}
      <div className="input-wrapper">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder={type === "login" ? "Password" : "Choose Password"}
          onChange={handleChange}
          value={form.password}
          className="auth-input-field"
          required
          autoComplete={type === "login" ? "current-password" : "new-password"}
        />
        <i className="fas fa-lock input-icon"></i>
        <button
          type="button"
          className="eye-toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex="-1"
        >
          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
        </button>
      </div>

      {/* Submit Button */}
      <button type="submit" className="auth-submit-btn">
        {type === "login" ? (
          <>
            Sign In <i className="fas fa-sign-in-alt"></i>
          </>
        ) : (
          <>
            Create Account <i className="fas fa-user-plus"></i>
          </>
        )}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: "grid",
    gap: "18px",
  },
};

export default AuthForm;