// features/jobs/components/JobList.jsx
import JobCard from "./JobCard";

const JobList = ({ jobs }) => {
  return (
    <div style={styles.container}>
      {jobs && jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))
      ) : (
        <div style={styles.emptyState}>
          <p>No jobs found</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
    padding: "20px 0",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#666",
    fontSize: "16px",
  },
};

export default JobList;