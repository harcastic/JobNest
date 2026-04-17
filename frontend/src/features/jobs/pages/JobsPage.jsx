// features/jobs/pages/JobsPage.jsx
import { useJobs } from "../hooks/useJobs";
import JobList from "../components/JobList";
import { useNavigate, useSearchParams } from "react-router-dom";

const JobsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobs, loading, error, totalPages, currentPage } = useJobs();

  const hasFilters = searchParams.toString() !== "";
  const title = searchParams.get("title");
  const location = searchParams.get("location");

  const clearFilters = () => {
    navigate("/jobs");
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading jobs...</p>
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
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1>Available Jobs</h1>
          {hasFilters && (
            <p style={styles.filterInfo}>
              Showing results {title && `for "${title}"`} {location && `in ${location}`}
              <button 
                onClick={clearFilters} 
                style={styles.clearBtn}
              >
                Clear Filters
              </button>
            </p>
          )}
        </div>
        <button onClick={() => navigate("/recruiter/jobs")} style={styles.recruiterBtn}>
          Recruiter Dashboard
        </button>
      </div>

      {jobs && jobs.length > 0 ? (
        <>
          <JobList jobs={jobs} />
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          )}
        </>
      ) : (
        <p style={styles.noJobsText}>
          {hasFilters ? "No jobs found matching your filters." : "No jobs available at the moment."}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
    gap: "20px",
  },
  filterInfo: {
    fontSize: "14px",
    color: "#666",
    margin: "8px 0 0 0",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  clearBtn: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "background 0.3s ease",
  },
  recruiterBtn: {
    padding: "10px 20px",
    background: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    whiteSpace: "nowrap",
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
  noJobsText: {
    fontSize: "16px",
    color: "#95a5a6",
    textAlign: "center",
    padding: "40px",
  },
  pagination: {
    textAlign: "center",
    padding: "20px",
    color: "#666",
    fontSize: "14px",
  },
};

export default JobsPage;