// features/applications/pages/AppliedJobs.jsx
import { useApplications } from "../hooks/useApplications";
import { useNavigate } from "react-router-dom";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const { applications, loading, error } = useApplications();

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Applications</h1>
        <button onClick={() => navigate("/jobs")} style={styles.browseBtn}>
          Browse Jobs
        </button>
      </div>

      {!applications || applications.length === 0 ? (
        <div style={styles.noApplications}>
          <p>You haven't applied to any jobs yet.</p>
          <button onClick={() => navigate("/jobs")}>
            Start applying now!
          </button>
        </div>
      ) : (
        <div style={styles.applicationsList}>
          {applications.map((app) => (
            <div key={app._id} style={styles.card}>
              <div style={styles.cardContent}>
                <h3>{app.job?.title || "Job Deleted"}</h3>
                <p style={styles.company}>{app.job?.companyName}</p>
                <p style={styles.location}>{app.job?.location}</p>
              </div>
              <div style={styles.cardFooter}>
                <span style={getStatusStyle(app.status)}>
                  {app.status || "pending"}
                </span>
                <small>{new Date(app.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = {
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const statusStyles = {
    pending: { ...baseStyle, background: "#f39c12", color: "white" },
    accepted: { ...baseStyle, background: "#27ae60", color: "white" },
    rejected: { ...baseStyle, background: "#e74c3c", color: "white" },
    shortlisted: { ...baseStyle, background: "#3498db", color: "white" },
  };

  return statusStyles[status] || statusStyles.pending;
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  browseBtn: {
    padding: "10px 20px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  loadingText: {
    fontSize: "18px",
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: "16px",
    color: "#e74c3c",
  },
  noApplications: {
    textAlign: "center",
    padding: "40px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  applicationsList: {
    display: "grid",
    gap: "15px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "box-shadow 0.3s",
  },
  cardContent: {
    flex: 1,
  },
  company: {
    color: "#666",
    margin: "5px 0",
    fontSize: "14px",
  },
  location: {
    color: "#999",
    margin: "5px 0",
    fontSize: "14px",
  },
  cardFooter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
};

export default AppliedJobs;