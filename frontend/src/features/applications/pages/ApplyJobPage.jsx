// features/applications/pages/ApplyJobPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applyToJob, parseResumeWithAI } from "../services/applicationService";

const ApplyJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const autoFillInputRef = useRef(null);
  const manualResumeInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    resume: null,
    portfolio: "",
    experience: "",
    skills: "",
    availability: "",
    salaryExpectation: "",
    workAuthorization: false,
  });

  // Check user role and redirect recruiters/guests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login or create an account first to apply for jobs!");
      navigate("/login");
      return;
    }
    const role = localStorage.getItem("userRole");
    if (role === "recruiter") {
      setUserRole("recruiter");
      setError("Recruiters cannot apply to jobs. Please go back.");
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } else {
      setUserRole(role || "user");
    }
  }, [navigate]);

  // Don't render if recruiter (will redirect)
  if (userRole === "recruiter") {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>
          <h2>Access Denied</h2>
          <p>Recruiters cannot apply to jobs. Redirecting to jobs page...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, resume: file });
    }
  };

  // Helper to map extracted availability text to select options
  const mapAvailability = (availStr) => {
    if (!availStr) return "";
    const lower = availStr.toLowerCase();
    if (lower.includes("immed") || lower.includes("now") || lower.includes("0")) return "immediate";
    if (lower.includes("2") || lower.includes("two") || lower.includes("15")) return "2weeks";
    if (lower.includes("1 month") || lower.includes("one month") || lower.includes("30")) return "1month";
    if (lower.includes("3 month") || lower.includes("three month") || lower.includes("90")) return "3months";
    return "";
  };

  // Helper to clean salary numbers
  const cleanSalary = (salaryStr) => {
    if (!salaryStr) return "";
    const match = String(salaryStr).replace(/,/g, "").match(/\d+/);
    return match ? match[0] : "";
  };

  // Handler for Resume Auto-Fill
  const handleAutoFillResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate that it's a PDF
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setParseError("Please upload a PDF format resume for AI auto-fill extraction.");
      return;
    }

    setParsingResume(true);
    setParseError(null);
    setParseSuccess(false);

    try {
      const response = await parseResumeWithAI(file);
      const data = response.data || {};

      setForm((prev) => ({
        ...prev,
        fullName: data.fullName || prev.fullName,
        email: data.email || prev.email,
        phone: data.phone || prev.phone,
        location: data.location || prev.location,
        experience: data.experience || prev.experience,
        skills: data.skills || prev.skills,
        portfolio: data.portfolio || prev.portfolio,
        availability: mapAvailability(data.availability) || prev.availability,
        salaryExpectation: cleanSalary(data.salaryExpectation) || prev.salaryExpectation,
        resume: file, // Keep the uploaded resume file attached
      }));

      setParseSuccess(true);
      setError(null);
    } catch (err) {
      console.error("Auto-fill resume error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to extract details from resume.";
      setParseError(errMsg);
    } finally {
      setParsingResume(false);
      // Reset input value so same file can be re-selected if desired
      if (autoFillInputRef.current) {
        autoFillInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!form.fullName || !form.email || !form.phone || !form.location) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!form.experience) {
      setError("Please describe your experience");
      setLoading(false);
      return;
    }

    if (!form.resume) {
      setError("Resume file is required");
      setLoading(false);
      return;
    }

    if (!form.workAuthorization) {
      setError("You must confirm work authorization");
      setLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("location", form.location);
      formData.append("resume", form.resume);
      formData.append("portfolio", form.portfolio);
      formData.append("experience", form.experience);
      formData.append("skills", form.skills);
      formData.append("availability", form.availability);
      formData.append("salaryExpectation", form.salaryExpectation);
      formData.append("workAuthorization", form.workAuthorization);

      await applyToJob(id, formData);
      alert("Application submitted successfully!");
      navigate("/applications");
    } catch (err) {
      console.error("Failed to apply", err);
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(27, 165, 165, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(27, 165, 165, 0); }
          100% { box-shadow: 0 0 0 0 rgba(27, 165, 165, 0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .ai-autofill-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 122, 134, 0.25);
          background: linear-gradient(135deg, #0D7A86 0%, #064A52 100%) !important;
        }
        .ai-autofill-card {
          transition: all 0.3s ease;
        }
        .ai-autofill-card:hover {
          border-color: #1BA5A5 !important;
          box-shadow: 0 6px 20px rgba(27, 165, 165, 0.12) !important;
        }
      `}</style>

      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      <div style={styles.formCard}>
        <h1>Apply for Job</h1>
        <p style={styles.subtitle}>* Required fields</p>

        {/* AI Resume Auto-Fill Banner / Dropzone */}
        <div style={styles.autoFillCard} className="ai-autofill-card">
          <div style={styles.autoFillHeader}>
            <div style={styles.autoFillIconCircle}>
              <i className="fas fa-magic" style={{ color: "#1BA5A5", fontSize: "16px" }}></i>
            </div>
            <div>
              <h3 style={styles.autoFillTitle}>Auto-Fill Application with AI</h3>
              <p style={styles.autoFillDescription}>
                Upload your Resume / CV (PDF). Our AI will parse your details and automatically populate the fields below.
              </p>
            </div>
          </div>

          <div style={styles.autoFillActionRow}>
            <input
              type="file"
              ref={autoFillInputRef}
              onChange={handleAutoFillResume}
              accept=".pdf"
              style={{ display: "none" }}
              id="autofill-resume-input"
              disabled={parsingResume}
            />
            <label
              htmlFor="autofill-resume-input"
              style={{
                ...styles.autoFillBtn,
                opacity: parsingResume ? 0.7 : 1,
                cursor: parsingResume ? "not-allowed" : "pointer",
              }}
              className="ai-autofill-btn"
            >
              {parsingResume ? (
                <>
                  <span style={styles.spinner}></span>
                  Analyzing Resume with AI...
                </>
              ) : (
                <>
                  <i className="fas fa-file-upload" style={{ marginRight: "8px" }}></i>
                  Upload Resume to Auto-Fill
                </>
              )}
            </label>

            {form.resume && (
              <span style={styles.attachedBadge}>
                <i className="fas fa-check-circle" style={{ color: "#10B981", marginRight: "6px" }}></i>
                Attached: <strong>{form.resume.name}</strong>
              </span>
            )}
          </div>

          {parseSuccess && (
            <div style={styles.parseSuccessMessage}>
              <i className="fas fa-sparkles" style={{ marginRight: "8px", color: "#059669" }}></i>
              ✨ <strong>Application Auto-Filled!</strong> Please review and adjust the extracted details below before submitting.
            </div>
          )}

          {parseError && (
            <div style={styles.parseErrorMessage}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: "8px" }}></i>
              {parseError}
            </div>
          )}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Personal Information Section */}
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Personal Information</legend>

            <div style={styles.row}>
              <div style={styles.column}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.column}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.column}>
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 xxxx xxx xxx"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.column}>
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  style={styles.input}
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Experience & Skills Section */}
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Experience & Skills</legend>

            <div>
              <label>Experience *</label>
              <textarea
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Describe your professional experience"
                rows="4"
                style={styles.textarea}
                required
              />
            </div>

            <div>
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.column}>
                <label>Resume *</label>
                <input
                  type="file"
                  name="resume"
                  ref={manualResumeInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  style={styles.input}
                  required={!form.resume}
                />
                {form.resume ? (
                  <p style={styles.selectedFileNotice}>
                    <i className="fas fa-file-pdf" style={{ color: "#EF4444", marginRight: "6px" }}></i>
                    Current file: <strong>{form.resume.name}</strong>
                  </p>
                ) : (
                  <small style={styles.hint}>Accepted formats: PDF, DOC, DOCX</small>
                )}
              </div>
              <div style={styles.column}>
                <label>Portfolio URL</label>
                <input
                  type="url"
                  name="portfolio"
                  value={form.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  style={styles.input}
                />
              </div>
            </div>
          </fieldset>

          {/* Additional Information Section */}
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Additional Information</legend>

            <div style={styles.row}>
              <div style={styles.column}>
                <label>Availability</label>
                <select name="availability" value={form.availability} onChange={handleChange} style={styles.input}>
                  <option value="">Select availability</option>
                  <option value="immediate">Immediate</option>
                  <option value="2weeks">2 Weeks</option>
                  <option value="1month">1 Month</option>
                  <option value="3months">3 Months</option>
                </select>
              </div>
              <div style={styles.column}>
                <label>Salary Expectation (₹)</label>
                <input
                  type="number"
                  name="salaryExpectation"
                  value={form.salaryExpectation}
                  onChange={handleChange}
                  placeholder="Annual salary expectation"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="workAuthorization"
                checked={form.workAuthorization}
                onChange={handleChange}
                style={styles.checkbox}
                required
              />
              <label style={styles.checkboxLabel}>
                I confirm that I have the legal right to work in this location *
              </label>
            </div>
          </fieldset>

          <div style={styles.buttonGroup}>
            <button type="submit" disabled={loading || parsingResume} style={styles.submitBtn}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "720px",
    margin: "0 auto",
  },
  backBtn: {
    padding: "8px 16px",
    marginBottom: "20px",
    cursor: "pointer",
    background: "#F5F6F7",
    border: "1px solid #D9DDD4",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    transition: "all 0.2s ease",
  },
  formCard: {
    border: "1px solid #E5E7EB",
    padding: "32px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },
  subtitle: {
    fontSize: "13px",
    color: "#6B7280",
    margin: "4px 0 20px 0",
  },
  autoFillCard: {
    background: "linear-gradient(135deg, rgba(27, 165, 165, 0.06) 0%, rgba(13, 122, 134, 0.02) 100%)",
    border: "1.5px dashed #1BA5A5",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
  },
  autoFillHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "16px",
  },
  autoFillIconCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "rgba(27, 165, 165, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  autoFillTitle: {
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#0F766E",
  },
  autoFillDescription: {
    margin: 0,
    fontSize: "13.5px",
    color: "#4B5563",
    lineHeight: "1.4",
  },
  autoFillActionRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "14px",
  },
  autoFillBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    color: "white",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    boxShadow: "0 2px 8px rgba(27, 165, 165, 0.25)",
    transition: "all 0.2s ease",
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "white",
    animation: "spin 0.8s linear infinite",
    marginRight: "8px",
  },
  attachedBadge: {
    fontSize: "13px",
    color: "#065F46",
    background: "#D1FAE5",
    padding: "6px 12px",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
  },
  parseSuccessMessage: {
    marginTop: "14px",
    padding: "10px 14px",
    background: "#ECFDF5",
    border: "1px solid #A7F3D0",
    borderRadius: "8px",
    fontSize: "13.5px",
    color: "#065F46",
  },
  parseErrorMessage: {
    marginTop: "14px",
    padding: "10px 14px",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "8px",
    fontSize: "13.5px",
    color: "#991B1B",
  },
  selectedFileNotice: {
    fontSize: "12.5px",
    color: "#0F766E",
    margin: "6px 0 0 0",
  },
  form: {
    display: "grid",
    gap: "22px",
    marginTop: "10px",
  },
  fieldset: {
    border: "1px solid #E5E7EB",
    padding: "18px",
    borderRadius: "8px",
    background: "#FAFAFA",
  },
  legend: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0D7A86",
    padding: "0 8px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "14px",
  },
  column: {
    display: "grid",
    gap: "6px",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "white",
    color: "#111827",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "white",
    color: "#111827",
    resize: "vertical",
    outline: "none",
    marginTop: "6px",
    marginBottom: "14px",
  },
  hint: {
    fontSize: "12px",
    color: "#6B7280",
    marginTop: "4px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginTop: "12px",
  },
  checkbox: {
    marginTop: "4px",
    cursor: "pointer",
  },
  checkboxLabel: {
    fontSize: "13.5px",
    color: "#374151",
    lineHeight: "1.4",
  },
  error: {
    color: "#991B1B",
    padding: "10px 14px",
    background: "#FEF2F2",
    borderRadius: "6px",
    border: "1px solid #FECACA",
    marginBottom: "15px",
    fontSize: "14px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },
  submitBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
    fontWeight: "700",
    fontSize: "15px",
    boxShadow: "0 2px 8px rgba(27, 165, 165, 0.3)",
  },
  cancelBtn: {
    padding: "12px 24px",
    background: "#E5E7EB",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
    fontWeight: "600",
    fontSize: "15px",
    color: "#374151",
  },
  errorMessage: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#FEF2F2",
    borderRadius: "8px",
    color: "#991B1B",
    marginTop: "30px",
  },
};

export default ApplyJobPage;
