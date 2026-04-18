// features/jobs/pages/EditJobPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById, updateJob } from "../services/jobService";

const EditJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    aboutCompany: "",
    jobDescription: "",
    location: "",
    country: "",
    salary: "",
    jobType: "Onsite",
    skillsRequired: "",
    duration: "",
    timing: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        const job = data.job || data;
        setForm({
          title: job.title || "",
          companyName: job.companyName || "",
          aboutCompany: job.aboutCompany || "",
          jobDescription: job.jobDescription || "",
          location: job.location || "",
          country: job.country || "",
          salary: job.salary || "",
          jobType: job.jobType || "Onsite",
          skillsRequired: job.skillsRequired?.join(", ") || "",
          duration: job.duration || "",
          timing: job.timing || "",
        });
      } catch (err) {
        console.error("Failed to fetch job", err);
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const jobData = {
        title: form.title,
        companyName: form.companyName,
        aboutCompany: form.aboutCompany,
        jobDescription: form.jobDescription,
        location: form.location,
        country: form.country,
        salary: form.salary,
        jobType: form.jobType,
        skillsRequired: form.skillsRequired
          ? form.skillsRequired.split(",").map((skill) => skill.trim())
          : [],
        duration: form.duration || undefined,
        timing: form.timing || undefined,
      };

      await updateJob(id, jobData);
      alert("Job updated successfully!");
      navigate("/recruiter/jobs");
    } catch (err) {
      console.error("Failed to update job", err);
      setError(err.response?.data?.message || "Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading job details...</p>;

  return (
    <div style={styles.container}>
      <h1>Edit Job</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label>Job Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Senior React Developer"
            required
          />
        </div>

        <div>
          <label>Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>

        <div>
          <label>About Company *</label>
          <textarea
            name="aboutCompany"
            value={form.aboutCompany}
            onChange={handleChange}
            placeholder="Brief description about the company"
            rows="3"
            required
          />
        </div>

        <div>
          <label>Job Description *</label>
          <textarea
            name="jobDescription"
            value={form.jobDescription}
            onChange={handleChange}
            placeholder="Describe the role and responsibilities"
            rows="5"
            required
          />
        </div>

        <div style={styles.row}>
          <div>
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City"
              required
            />
          </div>

          <div>
            <label>Country *</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label>Salary (₹)</label>
            <input
              type="text"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g., 50000-70000"
            />
          </div>

          <div>
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g., 6 months"
            />
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label>Job Type *</label>
            <select name="jobType" value={form.jobType} onChange={handleChange}>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label>Timing</label>
            <input
              type="text"
              name="timing"
              value={form.timing}
              onChange={handleChange}
              placeholder="e.g., Full-time, Part-time"
            />
          </div>
        </div>

        <div>
          <label>Skills Required (comma-separated)</label>
          <textarea
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
            rows="3"
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={submitting} style={styles.submitBtn}>
            {submitting ? "Updating..." : "Update Job"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/recruiter/jobs")}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    background: "#FFFFFF",
    minHeight: "100vh",
  },
  form: {
    display: "grid",
    gap: "15px",
    marginTop: "20px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  submitBtn: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
    boxShadow: "0 4px 12px rgba(27, 165, 165, 0.2)",
    transition: "box-shadow 0.3s ease",
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "#F5F6F7",
    border: "1px solid #D9DDD4",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
    color: "#333",
    transition: "background 0.3s ease",
  },
};

export default EditJobPage;
