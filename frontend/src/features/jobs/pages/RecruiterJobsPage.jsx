// features/jobs/pages/RecruiterJobsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecruiterJobs, deleteJob } from "../services/jobService";

const RecruiterJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const fetchRecruiterJobs = async () => {
    try {
      const data = await getRecruiterJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch recruiter jobs", err);
      setError("Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (err) {
        console.error("Failed to delete job", err);
        alert("Failed to delete job");
      }
    }
  };

  if (loading) return <p>Loading your jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Jobs</h2>
        <button onClick={() => navigate("/jobs/create")} style={styles.createBtn}>
          + Create New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <div style={styles.jobsList}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.jobCard}>
              <div>
                <h3>{job.title}</h3>
                <p>{job.company} • {job.location}</p>
                <p style={styles.salary}>₹ {job.salary}</p>
              </div>
              <div style={styles.actions}>
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  style={styles.viewBtn}
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/jobs/edit/${job._id}`)}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
    marginBottom: "20px",
  },
  createBtn: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #92DBF3 0%, #CDECF3 100%)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  jobsList: {
    display: "grid",
    gap: "15px",
  },
  jobCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #E1E7E0",
    padding: "15px",
    borderRadius: "8px",
  },
  salary: {
    color: "#27ae60",
    fontWeight: "bold",
    marginTop: "5px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  viewBtn: {
    padding: "8px 12px",
    background: "#92DBF3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editBtn: {
    padding: "8px 12px",
    background: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "8px 12px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default RecruiterJobsPage;
