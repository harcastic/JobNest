// features/jobs/components/JobList.jsx
import JobCard from "./JobCard";
import { useState, useEffect } from "react";

const JobList = ({ jobs }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine grid columns based on screen size
  const getGridColumns = () => {
    if (windowWidth < 640) {
      return "1fr"; // 1 column on mobile
    } else if (windowWidth < 1024) {
      return "repeat(2, 1fr)"; // 2 columns on tablet
    } else {
      return "repeat(3, 1fr)"; // 3 columns on desktop - FIXED to 3
    }
  };

  const getResponsiveGap = () => {
    if (windowWidth < 640) {
      return "16px";
    }
    return "20px";
  };

  return (
    <div style={{
      ...styles.container, 
      gridTemplateColumns: getGridColumns(),
      gap: getResponsiveGap()
    }}>
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
    padding: "20px 0",
    width: "100%",
    boxSizing: "border-box",
    autoRows: "1fr",
    gridAutoFlow: "row",
    minWidth: 0,
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#666",
    fontSize: "16px",
    gridColumn: "1 / -1",
  },
};

export default JobList;