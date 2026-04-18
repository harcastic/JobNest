// features/applications/pages/AppliedJobs.jsx
import { useApplications } from "../hooks/useApplications";
import { deleteApplication } from "../services/applicationService";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const { applications, loading, error, refetch } = useApplications();
  const [userRole, setUserRole] = useState("user");
  const [deleting, setDeleting] = useState(null); // Track which app is being deleted
  const [deleteError, setDeleteError] = useState(null);

  // Check user role and redirect recruiters
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "recruiter") {
      setUserRole("recruiter");
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } else {
      setUserRole(role || "user");
    }
  }, [navigate]);

  const handleDelete = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    setDeleting(appId);
    setDeleteError(null);

    try {
      await deleteApplication(appId);
      // Refetch applications to update the list
      if (refetch) {
        refetch();
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete application");
    } finally {
      setDeleting(null);
    }
  };

  // Don't render if recruiter (will redirect)
  if (userRole === "recruiter") {
    return (
      <div style={styles.container}>
        <div style={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>Recruiters cannot view applications. Redirecting to jobs page...</p>
        </div>
      </div>
    );
  }

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
    <>
      <style>{`
        .browse-jobs-btn:hover {
          background: #0A5C63 !important;
        }
      `}</style>
      <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Applications</h1>
        <button onClick={() => navigate("/jobs")} style={styles.browseBtn} className="browse-jobs-btn">
          Browse Jobs
        </button>
      </div>

      {deleteError && (
        <div style={styles.deleteError}>
          <p>{deleteError}</p>
          <button onClick={() => setDeleteError(null)} style={styles.dismissBtn}>
            Dismiss
          </button>
        </div>
      )}

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
            <div
              key={app._id}
              style={styles.card}
              onClick={() => navigate(`/applications/${app._id}`)}
            >
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(app._id);
                  }}
                  disabled={deleting === app._id}
                  style={{
                    ...styles.deleteBtn,
                    opacity: deleting === app._id ? 0.6 : 1,
                    cursor: deleting === app._id ? "not-allowed" : "pointer",
                  }}
                >
                  {deleting === app._id ? "Withdrawing..." : "Withdraw"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
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
    background: "#1BA5A5",
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
    border: "1px solid #D9DDD4",
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
    border: "1px solid #D9DDD4",
    padding: "15px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
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
  deleteBtn: {
    padding: "6px 12px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  deleteError: {
    padding: "12px",
    background: "#ffebee",
    border: "1px solid #ef5350",
    borderRadius: "4px",
    color: "#c62828",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dismissBtn: {
    padding: "4px 8px",
    background: "transparent",
    color: "#c62828",
    border: "1px solid #c62828",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
  },
  accessDenied: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#ffebee",
    borderRadius: "8px",
    color: "#c62828",
    marginTop: "30px",
  },
};

export default AppliedJobs;