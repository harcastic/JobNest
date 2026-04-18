// features/applications/pages/ApplyJobPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applyToJob } from "../services/applicationService";

const ApplyJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("user");
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

  // Check user role and redirect recruiters
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "recruiter") {
      setUserRole("recruiter");
      setError("Recruiters cannot apply to jobs. Please go back.");
      // Redirect after 2 seconds
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
    setForm({ ...form, resume: e.target.files[0] });
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
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      <div style={styles.formCard}>
        <h1>Apply for Job</h1>
        <p style={styles.subtitle}>* Required fields</p>

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
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  style={styles.input}
                  required
                />
                <small style={styles.hint}>Accepted formats: PDF, DOC, DOCX</small>
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
            <button type="submit" disabled={loading} style={styles.submitBtn}>
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
    maxWidth: "700px",
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
  formCard: {
    border: "1px solid #D9DDD4",
    padding: "30px",
    borderRadius: "8px",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  subtitle: {
    fontSize: "12px",
    color: "#666",
    margin: "0 0 20px 0",
  },
  form: {
    display: "grid",
    gap: "20px",
    marginTop: "20px",
  },
  fieldset: {
    border: "1px solid #D9DDD4",
    padding: "15px",
    borderRadius: "4px",
  },
  legend: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#1BA5A5",
    padding: "0 10px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "15px",
  },
  column: {
    display: "grid",
    gap: "8px",
  },
  input: {
    padding: "10px",
    border: "1px solid #D9DDD4",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #D9DDD4",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
  },
  hint: {
    fontSize: "12px",
    color: "#999",
    marginTop: "5px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginTop: "15px",
  },
  checkbox: {
    marginTop: "5px",
    cursor: "pointer",
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#333",
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
    marginTop: "25px",
  },
  submitBtn: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: "12px 20px",
    background: "#D9DDD4",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  errorMessage: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#ffebee",
    borderRadius: "8px",
    color: "#c62828",
    marginTop: "30px",
  },
};

export default ApplyJobPage;
