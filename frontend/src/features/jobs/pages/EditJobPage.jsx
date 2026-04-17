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
    company: "",
    description: "",
    location: "",
    salary: "",
    jobType: "full-time",
    experienceLevel: "entry-level",
    requirements: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        const job = data.job || data;
        setForm({
          title: job.title || "",
          company: job.company || "",
          description: job.description || "",
          location: job.location || "",
          salary: job.salary || "",
          jobType: job.jobType || "full-time",
          experienceLevel: job.experienceLevel || "entry-level",
          requirements: job.requirements?.join(", ") || "",
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
        ...form,
        requirements: form.requirements.split(",").map((req) => req.trim()),
        salary: parseInt(form.salary),
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
          <label>Company *</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company name"
            required
          />
        </div>

        <div>
          <label>Job Description *</label>
          <textarea
            name="description"
            value={form.description}
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
              placeholder="City, Country"
              required
            />
          </div>

          <div>
            <label>Salary (₹) *</label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="Annual salary"
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label>Job Type *</label>
            <select name="jobType" value={form.jobType} onChange={handleChange}>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label>Experience Level *</label>
            <select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
            >
              <option value="entry-level">Entry Level</option>
              <option value="mid-level">Mid Level</option>
              <option value="senior">Senior</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>

        <div>
          <label>Requirements (comma-separated)</label>
          <textarea
            name="requirements"
            value={form.requirements}
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
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "#ccc",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
};

export default EditJobPage;
