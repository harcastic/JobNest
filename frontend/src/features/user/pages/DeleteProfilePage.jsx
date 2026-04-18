// features/user/pages/DeleteProfilePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserProfile } from "../services/userService";

const DeleteProfilePage = () => {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!confirmed) {
      setError("Please confirm that you want to delete your account");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteUserProfile();
      // Clear token and redirect to login
      localStorage.removeItem("token");
      alert("Account deleted successfully");
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account", err);
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/profile")} style={styles.backBtn}>
        ← Back to Profile
      </button>

      <div style={styles.alertCard}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>⚠️</span>
        </div>

        <h1 style={styles.title}>Delete Account</h1>
        <p style={styles.subtitle}>This action is permanent and cannot be undone</p>

        <div style={styles.warningBox}>
          <p style={styles.warningTitle}>Before you go...</p>
          <ul style={styles.warningList}>
            <li>Your profile and all personal data will be permanently deleted</li>
            <li>All your job applications will be removed</li>
            <li>You will not be able to recover this account</li>
            <li>This action cannot be undone</li>
          </ul>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.confirmContainer}>
          <input
            type="checkbox"
            id="confirm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="confirm" style={styles.confirmLabel}>
            I understand that this action will permanently delete my account and
            all associated data
          </label>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={handleDelete}
            disabled={!confirmed || loading}
            style={{
              ...styles.deleteBtn,
              opacity: !confirmed || loading ? 0.5 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete My Account"}
          </button>
          <button onClick={() => navigate("/profile")} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  backBtn: {
    padding: "8px 16px",
    marginBottom: "20px",
    cursor: "pointer",
    background: "#F5F6F7",
    border: "1px solid #D9DDD4",
    borderRadius: "4px",
  },
  alertCard: {
    border: "2px solid #e74c3c",
    padding: "30px",
    borderRadius: "8px",
    background: "#fff5f5",
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: "20px",
  },
  icon: {
    fontSize: "48px",
  },
  title: {
    color: "#e74c3c",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "20px",
  },
  warningBox: {
    background: "white",
    border: "1px solid #e74c3c",
    padding: "15px",
    borderRadius: "4px",
    textAlign: "left",
    marginBottom: "20px",
  },
  warningTitle: {
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: "10px",
  },
  warningList: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "14px",
    color: "#333",
  },
  confirmContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "20px",
    padding: "15px",
    background: "white",
    borderRadius: "4px",
    border: "1px solid #D9DDD4",
  },
  checkbox: {
    marginTop: "5px",
    cursor: "pointer",
  },
  confirmLabel: {
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
  },
  error: {
    color: "#e74c3c",
    padding: "10px",
    background: "#fadbd8",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  deleteBtn: {
    padding: "12px 20px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: "12px 20px",
    background: "#F5F6F7",
    border: "1px solid #D9DDD4",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
};

export default DeleteProfilePage;
