// features/jobs/pages/JobsPage.jsx
import { useJobs } from "../hooks/useJobs";
import JobList from "../components/JobList";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isRecruiter } from "@/shared/utils/authUtils";
import { useState, useEffect } from "react";

const JobsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { jobs, loading, error, totalPages, currentPage } = useJobs();
  const userIsRecruiter = isRecruiter();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [jobType, setJobType] = useState({
    fullTime: false,
    partTime: false,
    internship: false,
  });

  const [salaryRange, setSalaryRange] = useState([0, 200]);
  const [salaryFilterActive, setSalaryFilterActive] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState({
    entryLevel: false,
    intermediate: false,
    expert: false,
  });

  const title = searchParams.get("title");
  const location = searchParams.get("location");
  // Only show "Showing results" for search-based filters (title/location), not sidebar filters
  const hasFilters = Boolean(title || location);

  const clearFilters = () => {
    navigate("/jobs");
    setJobType({
      fullTime: false,
      partTime: false,
      internship: false,
    });
    setSalaryRange([0, 200]);
    setSalaryFilterActive(false);
    setExperienceLevel({
      entryLevel: false,
      intermediate: false,
      expert: false,
    });
  };

  const handleJobTypeChange = (type) => {
    setJobType({ ...jobType, [type]: !jobType[type] });
  };

  const handleSalaryRangeChange = (newRange) => {
    setSalaryRange(newRange);
    setSalaryFilterActive(true);
  };

  const handleExperienceLevelChange = (level) => {
    setExperienceLevel({ ...experienceLevel, [level]: !experienceLevel[level] });
  };

  const handleClearAllFilters = () => {
    // Navigate to /jobs to clear all sidebar filters from URL
    navigate("/jobs");
    setJobType({
      fullTime: false,
      partTime: false,
      internship: false,
    });
    setSalaryRange([0, 200]);
    setSalaryFilterActive(false);
    setExperienceLevel({
      entryLevel: false,
      intermediate: false,
      expert: false,
    });
  };

  // Apply filters to URL params for backend filtering
  useEffect(() => {
    // Only update URL if sidebar filters have actually changed
    // This prevents interfering with navbar search
    const existingParams = new URLSearchParams(searchParams.toString());
    
    // Build what the new params should be with current sidebar filter state
    const shouldUpdate = { changed: false };
    
    // Add employment type filters
    const employmentTypes = [];
    if (jobType.fullTime) employmentTypes.push("full-time");
    if (jobType.partTime) employmentTypes.push("part-time");
    if (jobType.internship) employmentTypes.push("internship");

    if (employmentTypes.length > 0) {
      const newValue = employmentTypes.join(",");
      const oldValue = existingParams.get("employmentType");
      if (newValue !== oldValue) shouldUpdate.changed = true;
      existingParams.set("employmentType", newValue);
    } else {
      if (existingParams.has("employmentType")) shouldUpdate.changed = true;
      existingParams.delete("employmentType");
    }

    // Add salary range filters only if user has explicitly changed them
    if (salaryFilterActive) {
      if (salaryRange[0] > 0) {
        const newValue = salaryRange[0] * 1000;
        const oldValue = existingParams.get("salaryMin");
        if (newValue.toString() !== oldValue) shouldUpdate.changed = true;
        existingParams.set("salaryMin", newValue);
      } else {
        if (existingParams.has("salaryMin")) shouldUpdate.changed = true;
        existingParams.delete("salaryMin");
      }
      
      if (salaryRange[1] < 200) {
        const newValue = salaryRange[1] * 1000;
        const oldValue = existingParams.get("salaryMax");
        if (newValue.toString() !== oldValue) shouldUpdate.changed = true;
        existingParams.set("salaryMax", newValue);
      } else {
        if (existingParams.has("salaryMax")) shouldUpdate.changed = true;
        existingParams.delete("salaryMax");
      }
    } else {
      if (existingParams.has("salaryMin") || existingParams.has("salaryMax")) {
        shouldUpdate.changed = true;
      }
      existingParams.delete("salaryMin");
      existingParams.delete("salaryMax");
    }

    // Add experience level filters
    const experienceLevels = [];
    if (experienceLevel.entryLevel) experienceLevels.push("entry-level");
    if (experienceLevel.intermediate) experienceLevels.push("mid-level");
    if (experienceLevel.expert) experienceLevels.push("senior");

    if (experienceLevels.length > 0) {
      const newValue = experienceLevels.join(",");
      const oldValue = existingParams.get("experienceLevel");
      if (newValue !== oldValue) shouldUpdate.changed = true;
      existingParams.set("experienceLevel", newValue);
    } else {
      if (existingParams.has("experienceLevel")) shouldUpdate.changed = true;
      existingParams.delete("experienceLevel");
    }

    // Only navigate if something actually changed in sidebar filters
    if (shouldUpdate.changed) {
      navigate(`/jobs?${existingParams.toString()}`, { replace: true });
    }
  }, [jobType, salaryRange, salaryFilterActive, experienceLevel, navigate]);

  // Handle page navigation
  const handlePageChange = (newPage) => {
    // Get current search params
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    
    // Navigate to the new page
    navigate(`/jobs?${params.toString()}`);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter jobs based on selected criteria
  const getFilteredJobs = () => {
    // All filtering is now done on the backend via URL parameters
    // Backend returns exactly 12 jobs per page that match all filter criteria
    // No need for additional client-side filtering
    return jobs;
  };

  const filteredJobs = getFilteredJobs();

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
    <div style={{
      ...styles.pageWrapper,
      gridTemplateColumns: windowWidth < 1024 ? "1fr" : "280px 1fr",
      gap: windowWidth < 1024 ? "0" : "30px",
    }}>
      {/* Left Sidebar - Filters */}
      <div style={{
        ...styles.sidebar,
        display: windowWidth < 1024 ? "none" : "block",
      }}>
        <div style={styles.filterSection}>
          <div style={styles.filterHeader}>
            <h3 style={styles.filterTitle}>Job Type</h3>
            <button onClick={handleClearAllFilters} style={styles.clearAllBtn}>
              Clear all
            </button>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={jobType.fullTime}
                onChange={() => handleJobTypeChange("fullTime")}
              />
              Full time
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={jobType.partTime}
                onChange={() => handleJobTypeChange("partTime")}
              />
              Part time
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={jobType.internship}
                onChange={() => handleJobTypeChange("internship")}
              />
              Internship
            </label>
          </div>
        </div>

        {/* Salary Range */}
        <div style={styles.filterSection}>
          <h3 style={styles.filterTitle}>Salary Range</h3>
          <div style={styles.sliderContainer}>
            <input
              type="range"
              min="0"
              max="200"
              value={salaryRange[0]}
              onChange={(e) => handleSalaryRangeChange([parseInt(e.target.value), salaryRange[1]])}
              style={styles.slider}
            />
            <input
              type="range"
              min="0"
              max="200"
              value={salaryRange[1]}
              onChange={(e) => handleSalaryRangeChange([salaryRange[0], parseInt(e.target.value)])}
              style={styles.slider}
            />
          </div>
          <div style={styles.salaryDisplay}>
            <span>${salaryRange[0]}k</span>
            <span>${salaryRange[1]}k</span>
          </div>
        </div>

        {/* Experience Level */}
        <div style={styles.filterSection}>
          <h3 style={styles.filterTitle}>Experience Level</h3>
          <div style={styles.filterGroup}>
            <label style={styles.checkboxLabelWithCount}>
              <input
                type="checkbox"
                checked={experienceLevel.entryLevel}
                onChange={() => handleExperienceLevelChange("entryLevel")}
              />
              <span>Entry level</span>
              <span style={styles.jobCount}>392</span>
            </label>
            <label style={styles.checkboxLabelWithCount}>
              <input
                type="checkbox"
                checked={experienceLevel.intermediate}
                onChange={() => handleExperienceLevelChange("intermediate")}
              />
              <span>Intermediate</span>
              <span style={styles.jobCount}>124</span>
            </label>
            <label style={styles.checkboxLabelWithCount}>
              <input
                type="checkbox"
                checked={experienceLevel.expert}
                onChange={() => handleExperienceLevelChange("expert")}
              />
              <span>Expert</span>
              <span style={styles.jobCount}>3921</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
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
          </div>

          {filteredJobs && filteredJobs.length > 0 ? (
            <>
              <JobList jobs={filteredJobs} />
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      ...styles.paginationBtn,
                      ...(currentPage === 1 ? styles.paginationBtnDisabled : {}),
                    }}
                  >
                    ← Previous
                  </button>
                  
                  <span style={styles.pageInfo}>
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      ...styles.paginationBtn,
                      ...(currentPage === totalPages ? styles.paginationBtnDisabled : {}),
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={styles.noJobsText}>
              {hasFilters ? "No jobs found matching your filters." : "No jobs available at the moment."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "30px",
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
    minWidth: 0,
  },
  sidebar: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "8px",
    height: "fit-content",
    position: "sticky",
    top: "100px",
    minWidth: 0,
  },
  filterSection: {
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  filterTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 12px 0",
  },
  clearAllBtn: {
    background: "none",
    border: "none",
    color: "#e74c3c",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "underline",
    padding: "0",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#666",
  },
  checkboxLabelWithCount: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#666",
    justifyContent: "space-between",
  },
  jobCount: {
    color: "#999",
    fontSize: "13px",
    marginLeft: "auto",
  },
  sliderContainer: {
    position: "relative",
    marginBottom: "12px",
    height: "5px",
  },
  slider: {
    position: "absolute",
    width: "100%",
    height: "5px",
    borderRadius: "2px",
    background: "transparent",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    zIndex: 5,
  },
  salaryDisplay: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#666",
    marginTop: "10px",
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
  },
  container: {
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  header: {
    marginBottom: "30px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "30px 20px",
    marginTop: "40px",
    borderTop: "1px solid #e0e0e0",
  },
  paginationBtn: {
    padding: "10px 20px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background 0.3s ease, transform 0.2s ease",
    ":hover": {
      background: "#1565c0",
      transform: "translateY(-2px)",
    },
  },
  paginationBtnDisabled: {
    background: "#ccc",
    color: "#999",
    cursor: "not-allowed",
    ":hover": {
      background: "#ccc",
      transform: "none",
    },
  },
  pageInfo: {
    fontSize: "15px",
    color: "#333",
    fontWeight: "500",
    minWidth: "150px",
    textAlign: "center",
  },
};

export default JobsPage;