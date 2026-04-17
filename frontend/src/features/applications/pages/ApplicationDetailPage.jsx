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
            setDeadlineMessage(`Application deadline passed on ${deadline.toLocaleDateString()}`);
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
          <button onClick={() => navigate("/applications")} style={styles.backBtn}>
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
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate("/applications")} style={styles.backBtn}>
          ← Back to Applications
        </button>
        <h1>Application Details</h1>
        {!isEditing && canUpdate && (
          <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
            Edit Application
          </button>
        )}
      </div>

      {/* Job Information */}
      <div style={styles.section}>
        <h2>Applied Job</h2>
        <div style={styles.jobInfo}>
          <div>
            <h3>{application.job?.title}</h3>
            <p style={styles.company}>{application.job?.companyName}</p>
            <p style={styles.location}>{application.job?.location}</p>
            {application.job?.salary && (
              <p style={styles.salary}>Salary: {application.job.salary}</p>
            )}
          </div>
          <div style={styles.jobMeta}>
            <p style={getStatusStyle(application.status)}>
              Status: {application.status}
            </p>
            <p style={styles.deadline}>{deadlineMessage}</p>
          </div>
        </div>
      </div>

      {/* Update Error Message */}
      {updateError && (
        <div style={styles.updateErrorBox}>
          <p>{updateError}</p>
        </div>
      )}

      {/* Disable Update Message */}
      {!canUpdate && (
        <div style={styles.warningBox}>
          <p>⚠️ This application cannot be updated. {application.status === "accepted" || application.status === "rejected" ? `Status is ${application.status}.` : "The application deadline has passed."}</p>
        </div>
      )}

      {/* Application Details */}
      <div style={styles.section}>
        <h2>Your Application</h2>
        {isEditing ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label>Portfolio URL</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Experience (Years)</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label>Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Availability</label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                placeholder="e.g., Immediate, 2 weeks"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Salary Expectation</label>
              <input
                type="text"
                name="salaryExpectation"
                value={formData.salaryExpectation}
                onChange={handleChange}
                placeholder="e.g., ₹50,000 - ₹70,000"
              />
            </div>

            <div style={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="workAuthorization"
                  checked={formData.workAuthorization}
                  onChange={handleChange}
                />
                I have work authorization
              </label>
            </div>

            <div style={styles.formActions}>
              <button type="submit" disabled={updating} style={styles.submitBtn}>
                {updating ? "Updating..." : "Update Application"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={styles.cancelBtn}
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
                value="Download Resume"
                isDownload
                downloadUrl={application.resume}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, isLink = false, isDownload = false, downloadUrl = "" }) => {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}:</span>
      <span style={styles.detailValue}>
        {isDownload ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            {value}
          </a>
        ) : isLink && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {value}
          </a>
        ) : (
          value || "—"
        )}
      </span>
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = { fontWeight: "bold", padding: "4px 8px", borderRadius: "4px" };
  const statusColors = {
    pending: { ...baseStyle, color: "#f39c12", backgroundColor: "#fff3cd" },
    accepted: { ...baseStyle, color: "#27ae60", backgroundColor: "#d4edda" },
    rejected: { ...baseStyle, color: "#e74c3c", backgroundColor: "#f8d7da" },
    shortlisted: { ...baseStyle, color: "#3498db", backgroundColor: "#d1ecf1" },
    reviewed: { ...baseStyle, color: "#8e44ad", backgroundColor: "#e2d1f3" },
  };
  return statusColors[status] || statusColors.pending;
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
    gap: "15px",
  },
  backBtn: {
    padding: "10px 15px",
    background: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  editBtn: {
    padding: "10px 20px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  errorBox: {
    padding: "20px",
    background: "#ffebee",
    border: "1px solid #ef5350",
    borderRadius: "8px",
    textAlign: "center",
  },
  errorText: {
    color: "#c62828",
    marginBottom: "15px",
  },
  loadingText: {
    fontSize: "18px",
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    background: "#f5f5f5",
    borderRadius: "8px",
  },
  jobInfo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  jobMeta: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "10px",
  },
  company: {
    color: "#666",
    fontSize: "14px",
    margin: "5px 0",
  },
  location: {
    color: "#999",
    fontSize: "14px",
    margin: "5px 0",
  },
  salary: {
    color: "#27ae60",
    fontWeight: "bold",
    fontSize: "14px",
    margin: "5px 0",
  },
  deadline: {
    fontSize: "13px",
    color: "#555",
  },
  warningBox: {
    padding: "12px",
    background: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "4px",
    color: "#856404",
    marginBottom: "20px",
  },
  updateErrorBox: {
    padding: "12px",
    background: "#ffebee",
    border: "1px solid #ef5350",
    borderRadius: "4px",
    color: "#c62828",
    marginBottom: "15px",
  },
  detailsView: {
    display: "grid",
    gap: "12px",
  },
  detailRow: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: "15px",
    paddingBottom: "12px",
    borderBottom: "1px solid #e0e0e0",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  detailValue: {
    color: "#666",
    wordBreak: "break-word",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
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
    gap: "5px",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  formActions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  submitBtn: {
    padding: "12px 20px",
    background: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: "12px 20px",
    background: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ApplicationDetailPage;
