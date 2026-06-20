// features/applications/pages/ApplicationDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplicationById, updateApplication } from "../services/applicationService";

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [canUpdate, setCanUpdate] = useState(true);
  const [deadlineMessage, setDeadlineMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    portfolio: "",
    experience: "",
    skills: "",
    availability: "",
    salaryExpectation: "",
    workAuthorization: false,
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const data = await getApplicationById(id);
        setApplication(data.application);
        
        // Check if deadline has passed
        if (data.application.job?.importantDates?.applicationDeadline) {
          const deadline = new Date(data.application.job.importantDates.applicationDeadline);
          const now = new Date();
          
          if (now > deadline) {
            setCanUpdate(false);
            setDeadlineMessage(`Deadline passed on ${deadline.toLocaleDateString()}`);
          } else {
            setDeadlineMessage(`Application deadline: ${deadline.toLocaleDateString()}`);
          }
        }

        // Also check if status is in terminal state
        if (data.application.status === "accepted" || data.application.status === "rejected") {
          setCanUpdate(false);
        }

        // Initialize form data
        setFormData({
          fullName: data.application.fullName || "",
          email: data.application.email || "",
          phone: data.application.phone || "",
          location: data.application.location || "",
          portfolio: data.application.portfolio || "",
          experience: data.application.experience || "",
          skills: data.application.skills || "",
          availability: data.application.availability || "",
          salaryExpectation: data.application.salaryExpectation || "",
          workAuthorization: data.application.workAuthorization || false,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching application:", err);
        setError(err.response?.data?.message || "Failed to load application");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError(null);

    try {
      const result = await updateApplication(id, formData);
      setApplication(result.application);
      setIsEditing(false);
      alert("Application updated successfully!");
    } catch (err) {
      console.error("Error updating application:", err);
      setUpdateError(err.response?.data?.message || "Failed to update application");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
          <button onClick={() => navigate("/applications")} style={styles.backBtn} className="app-back-btn">
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Application not found</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .app-back-btn {
          transition: all 0.25s ease !important;
        }
        .app-back-btn:hover {
          background: #F1F5F9 !important;
          border-color: #CBD5E1 !important;
          color: #1E293B !important;
        }
        .app-edit-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .app-edit-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 18px rgba(13, 148, 136, 0.4) !important;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%) !important;
        }
        .app-input-field {
          width: 100%;
          padding: 12px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 14.5px;
          font-family: inherit;
          color: #1E293B;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }
        .app-input-field:focus {
          outline: none;
          background: #FFFFFF;
          border-color: #0D9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }
        .app-submit-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.25);
        }
        .app-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(13, 148, 136, 0.4);
        }
        .app-cancel-btn {
          padding: 12px 24px;
          background: #F1F5F9;
          color: #475569;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .app-cancel-btn:hover {
          background: #E2E8F0;
        }
        .app-resume-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: rgba(13, 148, 136, 0.06);
          border: 1.5px solid rgba(13, 148, 136, 0.15);
          border-radius: 12px;
          color: #0D9488;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.25s ease;
        }
        .app-resume-download-btn:hover {
          background: #0D9488;
          color: white;
          border-color: #0D9488;
          box-shadow: 0 6px 16px rgba(13, 148, 136, 0.25);
          transform: translateY(-1px);
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate("/applications")} style={styles.backBtn} className="app-back-btn">
            <i className="fas fa-arrow-left" style={{ marginRight: "6px" }}></i> Back
          </button>
          <h1 style={styles.pageTitle}>Application Details</h1>
          {!isEditing && canUpdate && (
            <button onClick={() => setIsEditing(true)} style={styles.editBtn} className="app-edit-btn">
              Edit Details <i className="fas fa-edit" style={{ marginLeft: "6px", fontSize: "12px" }}></i>
            </button>
          )}
        </div>

        {/* Job Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Applied Position</h2>
          <div style={styles.jobInfo}>
            <div style={styles.jobInfoLeft}>
              <div style={styles.companyLogo}>
                {application.job?.companyName ? application.job.companyName.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <h3 style={styles.jobTitleText}>{application.job?.title || "Job Unavailable"}</h3>
                <p style={styles.company}>{application.job?.companyName}</p>
                <p style={styles.location}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: "6px", color: "#94A3B8" }}></i>
                  {application.job?.location}
                </p>
                {application.job?.salary && (
                  <p style={styles.salary}><i className="fas fa-money-bill-wave" style={{ marginRight: "6px" }}></i>${application.job.salary}k/year</p>
                )}
              </div>
            </div>
            <div style={styles.jobMeta}>
              <div style={{ alignSelf: "flex-end" }}>
                <span style={getStatusStyle(application.status)}>
                  {application.status}
                </span>
              </div>
              <p style={styles.deadline}>{deadlineMessage}</p>
            </div>
          </div>
        </div>

        {/* Update Error Message */}
        {updateError && (
          <div style={styles.updateErrorBox}>
            <p style={{ margin: 0, fontWeight: "600" }}><i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i>{updateError}</p>
          </div>
        )}

        {/* Disable Update Message */}
        {!canUpdate && (
          <div style={styles.warningBox}>
            <p style={{ margin: 0, fontWeight: "500" }}><i className="fas fa-info-circle" style={{ marginRight: "8px" }}></i>This application is locked. {application.status === "accepted" || application.status === "rejected" ? `The status is marked as ${application.status}.` : "The application deadline has passed."}</p>
          </div>
        )}

        {/* Application Details */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Candidate Profile Data</h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="app-input-field"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="app-input-field"
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="app-input-field"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>City / Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="app-input-field"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Portfolio URL</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="app-input-field"
                  placeholder="https://example.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Experience (Years)</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="app-input-field"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Professional Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows="3"
                  className="app-input-field"
                  style={{ resize: "vertical" }}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Availability</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="app-input-field"
                  placeholder="e.g., Immediate, 2 weeks"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Salary Expectation</label>
                <input
                  type="text"
                  name="salaryExpectation"
                  value={formData.salaryExpectation}
                  onChange={handleChange}
                  className="app-input-field"
                  placeholder="e.g., ₹50,000 - ₹70,000"
                />
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="workAuthorization"
                  checked={formData.workAuthorization}
                  onChange={handleChange}
                  id="workAuthCheck"
                  style={{ accentColor: "#0D9488", cursor: "pointer", width: "16px", height: "16px" }}
                />
                <label htmlFor="workAuthCheck" style={{ fontSize: "14.5px", color: "#1E293B", cursor: "pointer", fontWeight: "500" }}>
                  I confirm that I have work authorization for this location
                </label>
              </div>

              <div style={styles.formActions}>
                <button type="submit" disabled={updating} className="app-submit-btn">
                  {updating ? "Updating..." : "Save Modifications"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="app-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={styles.detailsView}>
              <DetailRow label="Full Name" value={application.fullName} />
              <DetailRow label="Email" value={application.email} />
              <DetailRow label="Phone" value={application.phone} />
              <DetailRow label="Location" value={application.location} />
              <DetailRow label="Portfolio" value={application.portfolio} isLink />
              <DetailRow label="Experience" value={application.experience} />
              <DetailRow label="Skills" value={application.skills} />
              <DetailRow label="Availability" value={application.availability} />
              <DetailRow label="Salary Expectation" value={application.salaryExpectation} />
              <DetailRow
                label="Work Authorization"
                value={application.workAuthorization ? "Yes" : "No"}
              />
              {application.resume && (
                <DetailRow
                  label="Resume"
                  value="Download Attached Resume"
                  isDownload
                  downloadUrl={application.resume}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const DetailRow = ({ label, value, isLink = false, isDownload = false, downloadUrl = "" }) => {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>
        {isDownload ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="app-resume-download-btn"
          >
            <i className="far fa-file-pdf" style={{ fontSize: "16px" }}></i>
            <span>{value}</span>
            <i className="fas fa-download" style={{ fontSize: "12px", marginLeft: "2px" }}></i>
          </a>
        ) : isLink && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={styles.link} className="detail-link">
            {value} <i className="fas fa-external-link-alt" style={{ fontSize: "11px", marginLeft: "4px" }}></i>
          </a>
        ) : (
          value || "—"
        )}
      </span>
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = { 
    fontWeight: "700", 
    padding: "6px 14px", 
    borderRadius: "20px",
    fontSize: "12.5px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "inline-block"
  };
  const statusColors = {
    pending: { ...baseStyle, color: "#D97706", backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.15)" },
    accepted: { ...baseStyle, color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.15)" },
    rejected: { ...baseStyle, color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)" },
    shortlisted: { ...baseStyle, color: "#3B82F6", backgroundColor: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.15)" },
    reviewed: { ...baseStyle, color: "#8B5CF6", backgroundColor: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.15)" },
  };
  return statusColors[status] || statusColors.pending;
};

const styles = {
  container: {
    padding: "32px 20px",
    maxWidth: "850px",
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
    gap: "15px",
  },
  backBtn: {
    padding: "12px 22px",
    background: "#FFFFFF",
    color: "#475569",
    border: "1.5px solid #E2E8F0",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14.5px",
    cursor: "pointer",
  },
  editBtn: {
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
  errorBox: {
    padding: "30px 20px",
    background: "#FEF2F2",
    border: "1.5px solid #EF4444",
    borderRadius: "16px",
    textAlign: "center",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: "16px",
    fontWeight: "600",
  },
  loadingText: {
    fontSize: "18px",
    color: "#64748B",
    textAlign: "center",
    padding: "40px",
    fontWeight: "500",
  },
  section: {
    marginBottom: "32px",
    padding: "32px",
    background: "#FFFFFF",
    borderRadius: "16px",
    border: "1.5px solid #E2E8F0",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
  },
  sectionHeading: {
    margin: "0 0 20px 0",
    fontSize: "15px",
    fontWeight: "800",
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "left",
  },
  jobInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  jobInfoLeft: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    textAlign: "left",
  },
  companyLogo: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
    boxShadow: "0 6px 14px rgba(13, 148, 136, 0.2)",
    flexShrink: 0,
  },
  jobTitleText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#0F172A",
  },
  jobMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
    flexShrink: 0,
  },
  company: {
    color: "#475569",
    fontSize: "15px",
    fontWeight: "600",
    margin: "5px 0",
  },
  location: {
    color: "#64748B",
    fontSize: "14px",
    margin: "5px 0",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  salary: {
    color: "#0D9488",
    fontWeight: "700",
    fontSize: "15px",
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
  },
  deadline: {
    fontSize: "13px",
    color: "#64748B",
    fontWeight: "600",
  },
  warningBox: {
    padding: "16px",
    background: "rgba(245, 158, 11, 0.08)",
    border: "1.5px solid rgba(245, 158, 11, 0.15)",
    borderRadius: "12px",
    color: "#D97706",
    marginBottom: "20px",
    textAlign: "left",
  },
  updateErrorBox: {
    padding: "14px",
    background: "#FEF2F2",
    border: "1.5px solid #EF4444",
    borderRadius: "12px",
    color: "#EF4444",
    marginBottom: "15px",
    textAlign: "left",
  },
  detailsView: {
    display: "grid",
    gap: "4px",
  },
  detailRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    gap: "24px",
    padding: "16px 0",
    borderBottom: "1.5px solid #F1F5F9",
    textAlign: "left",
    alignItems: "center",
  },
  detailLabel: {
    fontWeight: "700",
    color: "#64748B",
    fontSize: "12.5px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: {
    color: "#1E293B",
    wordBreak: "break-word",
    fontSize: "15.5px",
    fontWeight: "500",
  },
  link: {
    color: "#0D9488",
    textDecoration: "none",
    fontWeight: "700",
  },
  form: {
    display: "grid",
    gap: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    textAlign: "left",
  },
  formLabel: {
    fontSize: "12.5px",
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },
};

export default ApplicationDetailPage;
