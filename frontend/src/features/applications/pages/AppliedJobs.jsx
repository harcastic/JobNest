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
        .browse-jobs-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .browse-jobs-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 18px rgba(13, 148, 136, 0.4) !important;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%) !important;
        }
        .app-list-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .app-list-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 28px -6px rgba(13, 148, 136, 0.12), 0 6px 12px -4px rgba(13, 148, 136, 0.08) !important;
          border-color: #0D9488 !important;
        }
        .app-withdraw-btn {
          transition: all 0.25s ease !important;
        }
        .app-withdraw-btn:hover:not(:disabled) {
          background: #DC2626 !important;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25) !important;
        }
        .start-app-btn {
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.2);
          margin-top: 16px;
        }
        .start-app-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(13, 148, 136, 0.35);
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>My Applications</h1>
          <button onClick={() => navigate("/jobs")} style={styles.browseBtn} className="browse-jobs-btn">
            Browse Jobs <i className="fas fa-search" style={{ marginLeft: "6px", fontSize: "13px" }}></i>
          </button>
        </div>

        {deleteError && (
          <div style={styles.deleteError}>
            <p style={{ margin: 0, fontWeight: "500" }}><i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i>{deleteError}</p>
            <button onClick={() => setDeleteError(null)} style={styles.dismissBtn}>
              Dismiss
            </button>
          </div>
        )}

        {!applications || applications.length === 0 ? (
          <div style={styles.noApplications}>
            <p style={{ fontSize: "16px", color: "#64748B", margin: "0 0 10px 0", fontWeight: "500" }}>You haven't submitted any applications yet.</p>
            <button onClick={() => navigate("/jobs")} className="start-app-btn">
              Start applying now!
            </button>
          </div>
        ) : (
          <div style={styles.applicationsList}>
            {applications.map((app) => (
              <div
                key={app._id}
                style={styles.card}
                className="app-list-card"
                onClick={() => navigate(`/applications/${app._id}`)}
              >
                {/* Visual Company Logo Container */}
                <div style={styles.logoContainer}>
                  <div style={styles.companyLogo}>
                    {app.job?.companyName ? app.job.companyName.charAt(0).toUpperCase() : "?"}
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.jobTitle}>{app.job?.title || "Job Unavailable"}</h3>
                  <p style={styles.company}>{app.job?.companyName || "Unknown Company"}</p>
                  <p style={styles.location}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: "6px", color: "#94A3B8" }}></i>
                    {app.job?.location || "Remote"}
                  </p>
                </div>

                <div style={styles.cardFooter}>
                  <span style={getStatusStyle(app.status)}>
                    {app.status || "pending"}
                  </span>
                  <small style={styles.dateText}>Applied {new Date(app.createdAt).toLocaleDateString()}</small>
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
                    className="app-withdraw-btn"
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
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "inline-block",
  };

  const statusStyles = {
    pending: { 
      ...baseStyle, 
      background: "rgba(245, 158, 11, 0.08)", 
      color: "#D97706",
      border: "1px solid rgba(245, 158, 11, 0.15)"
    },
    accepted: { 
      ...baseStyle, 
      background: "rgba(16, 185, 129, 0.08)", 
      color: "#10B981",
      border: "1px solid rgba(16, 185, 129, 0.15)"
    },
    rejected: { 
      ...baseStyle, 
      background: "rgba(239, 68, 68, 0.08)", 
      color: "#EF4444",
      border: "1px solid rgba(239, 68, 68, 0.15)"
    },
    shortlisted: { 
      ...baseStyle, 
      background: "rgba(59, 130, 246, 0.08)", 
      color: "#3B82F6",
      border: "1px solid rgba(59, 130, 246, 0.15)"
    },
  };

  return statusStyles[status] || statusStyles.pending;
};

const styles = {
  container: {
    padding: "32px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  pageTitle: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#0F172A",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  browseBtn: {
    padding: "12px 22px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14.5px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(13, 148, 136, 0.25)",
  },
  loadingText: {
    fontSize: "18px",
    color: "#64748B",
    textAlign: "center",
    padding: "40px",
    fontWeight: "500",
  },
  errorText: {
    fontSize: "16px",
    color: "#EF4444",
    textAlign: "center",
    padding: "40px",
  },
  noApplications: {
    textAlign: "center",
    padding: "60px 40px",
    background: "#FFFFFF",
    borderRadius: "16px",
    border: "1.5px dashed #E2E8F0",
  },
  applicationsList: {
    display: "grid",
    gap: "18px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1.5px solid #E2E8F0",
    padding: "24px",
    borderRadius: "16px",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
    gap: "20px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  companyLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
    boxShadow: "0 4px 10px rgba(13, 148, 136, 0.18)",
  },
  cardContent: {
    flex: 1,
    textAlign: "left",
    minWidth: 0,
  },
  jobTitle: {
    margin: "0 0 6px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#0F172A",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  company: {
    color: "#475569",
    margin: "0 0 6px 0",
    fontSize: "14.5px",
    fontWeight: "600",
  },
  location: {
    color: "#64748B",
    margin: 0,
    fontSize: "13.5px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  cardFooter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
    flexShrink: 0,
  },
  dateText: {
    fontSize: "12.5px",
    color: "#94A3B8",
    fontWeight: "500",
  },
  deleteBtn: {
    padding: "6px 14px",
    background: "rgba(239, 68, 68, 0.08)",
    color: "#EF4444",
    border: "1px solid rgba(239, 68, 68, 0.15)",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  deleteError: {
    padding: "14px",
    background: "#FEF2F2",
    border: "1.5px solid #EF4444",
    borderRadius: "12px",
    color: "#EF4444",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dismissBtn: {
    padding: "4px 10px",
    background: "transparent",
    color: "#EF4444",
    border: "1px solid #EF4444",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },
  accessDenied: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#FEF2F2",
    borderRadius: "16px",
    color: "#EF4444",
  },
};

export default AppliedJobs;