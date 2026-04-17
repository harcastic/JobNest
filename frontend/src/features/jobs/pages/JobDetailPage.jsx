// features/jobs/pages/JobDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../services/jobService";

const getStatusStyle = (status) => {
  const baseStyle = {
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const statusStyles = {
    open: { ...baseStyle, background: "#27ae60", color: "white" },
    closed: { ...baseStyle, background: "#e74c3c", color: "white" },
    expired: { ...baseStyle, background: "#f39c12", color: "white" },
  };

  return statusStyles[status] || statusStyles.open;
};

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data.job || data);
      } catch (err) {
        console.error("Failed to fetch job", err);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/jobs")} style={styles.backBtn}>
        ← Back to Jobs
      </button>

      <div style={styles.jobDetail}>
        <h1>{job.title}</h1>
        <p style={styles.company}>{job.companyName}</p>

        <div style={styles.info}>
          <span>📍 {job.location}</span>
          <span>🕐 {job.jobType}</span>
          {job.salary && <span>💰 ₹ {job.salary}</span>}
        </div>

        <h3>About Company</h3>
        <p>{job.aboutCompany}</p>

        <h3>Job Description</h3>
        <p>{job.jobDescription}</p>

        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <>
            <h3>Skills Required</h3>
            <div style={styles.skillsContainer}>
              {job.skillsRequired.map((skill, i) => (
                <span key={i} style={styles.skillTag}>{skill}</span>
              ))}
            </div>
          </>
        )}

        <div style={styles.additionalInfo}>
          {job.country && (
            <div>
              <strong>Country:</strong> {job.country}
            </div>
          )}
          {job.duration && (
            <div>
              <strong>Duration:</strong> {job.duration}
            </div>
          )}
          {job.timing && (
            <div>
              <strong>Timing:</strong> {job.timing}
            </div>
          )}
          {job.status && (
            <div>
              <strong>Status:</strong> <span style={getStatusStyle(job.status)}>{job.status}</span>
            </div>
          )}
        </div>

        {job.importantDates && (
          <>
            <h3>Important Dates</h3>
            <div>
              {job.importantDates.applicationDeadline && (
                <p>📅 Application Deadline: {new Date(job.importantDates.applicationDeadline).toLocaleDateString()}</p>
              )}
              {job.importantDates.startDate && (
                <p>🚀 Start Date: {new Date(job.importantDates.startDate).toLocaleDateString()}</p>
              )}
            </div>
          </>
        )}

        {job.recruiter && (
          <>
            <h3>Posted by</h3>
            <p>{job.recruiter?.username || "Recruiter"}</p>
          </>
        )}

        <button style={styles.applyBtn} onClick={() => navigate("/apply/" + id)}>
          Apply Now
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  backBtn: {
    padding: "8px 16px",
    marginBottom: "20px",
    cursor: "pointer",
    background: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  jobDetail: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "8px",
  },
  company: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px",
  },
  info: {
    display: "flex",
    gap: "20px",
    margin: "15px 0",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    flexWrap: "wrap",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "15px 0",
  },
  skillTag: {
    background: "#e8f0fe",
    color: "#667eea",
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  additionalInfo: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "4px",
    margin: "20px 0",
    borderLeft: "4px solid #667eea",
  },
  applyBtn: {
    padding: "10px 20px",
    marginTop: "20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default JobDetailPage;
