// features/auth/components/AuthForm.jsx
import { useState } from "react";
import "./auth.css";

const AuthForm = ({ type, onSubmit }) => {
  const [form, setForm] = useState({
    identifier: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="auth-form"
      onSubmit={(e) => {
        e.preventDefault();
        const submitData = type === "login" 
          ? { identifier: form.identifier, password: form.password }
          : { username: form.username, email: form.email, password: form.password, role: form.role };
        onSubmit(submitData);
      }}
      style={styles.form}
    >
      <input
        name={type === "login" ? "identifier" : "email"}
        placeholder={type === "login" ? "Email or Username" : "Email"}
        onChange={handleChange}
        value={type === "login" ? form.identifier : form.email}
        style={styles.input}
        required
      />

      {type === "register" && (
        <>
          <input
            name="username"
            placeholder="Username (3-15 characters)"
            onChange={handleChange}
            value={form.username}
            style={styles.input}
            required
          />
          <select name="role" onChange={handleChange} value={form.role} style={styles.input}>
            <option value="user">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </>
      )}

      <input
        name="password"
        type="password"
        placeholder="Password (min 8 chars, uppercase, lowercase, number, special char)"
        onChange={handleChange}
        value={form.password}
        style={styles.input}
        required
      />

      <button type="submit" style={styles.button}>
        {type === "login" ? "Login" : "Create Account"}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: "grid",
    gap: "15px",
  },
  input: {
    padding: "12px",
    border: "1px solid #D9DDD4",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "#F5F6F7",
    transition: "border-color 0.3s ease, background-color 0.3s ease",
    color: "#333",
  },
  button: {
    padding: "12px",
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 15px rgba(27, 165, 165, 0.2)",
  },
};

export default AuthForm;