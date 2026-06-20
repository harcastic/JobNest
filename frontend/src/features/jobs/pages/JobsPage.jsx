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
    <div style={styles.outerContainer}>
      {/* Full-width header with title and sort */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.pageTitle}>Recommended jobs</h1>
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
        <button style={styles.sortButton}>
          🔀 Most recent
        </button>
      </div>

      {/* Grid with sidebar and main content */}
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
              <button onClick={handleClearAllFilters} style={styles.clearAllBtn} className="clear-all-btn-hover">
                Clear all
              </button>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.checkboxLabel} className="filter-checkbox-hover">
                <input
                  type="checkbox"
                  checked={jobType.fullTime}
                  onChange={() => handleJobTypeChange("fullTime")}
                />
                Full time
              </label>
              <label style={styles.checkboxLabel} className="filter-checkbox-hover">
                <input
                  type="checkbox"
                  checked={jobType.partTime}
                  onChange={() => handleJobTypeChange("partTime")}
                />
                Part time
              </label>
              <label style={styles.checkboxLabel} className="filter-checkbox-hover">
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
                className="range-slider-accent"
              />
              <input
                type="range"
                min="0"
                max="200"
                value={salaryRange[1]}
                onChange={(e) => handleSalaryRangeChange([salaryRange[0], parseInt(e.target.value)])}
                style={styles.slider}
                className="range-slider-accent"
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
              <label style={styles.checkboxLabelWithCount} className="filter-checkbox-hover">
                <input
                  type="checkbox"
                  checked={experienceLevel.entryLevel}
                  onChange={() => handleExperienceLevelChange("entryLevel")}
                />
                <span>Entry level</span>
                <span style={styles.jobCount}>392</span>
              </label>
              <label style={styles.checkboxLabelWithCount} className="filter-checkbox-hover">
                <input
                  type="checkbox"
                  checked={experienceLevel.intermediate}
                  onChange={() => handleExperienceLevelChange("intermediate")}
                />
                <span>Intermediate</span>
                <span style={styles.jobCount}>124</span>
              </label>
              <label style={styles.checkboxLabelWithCount} className="filter-checkbox-hover">
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
          <style>{`
            .filter-checkbox-hover:hover {
              color: #0D9488 !important;
            }
            .filter-checkbox-hover input[type="checkbox"] {
              accent-color: #0D9488;
            }
            .range-slider-accent {
              accent-color: #0D9488;
            }
            .clear-all-btn-hover {
              transition: all 0.25s ease !important;
            }
            .clear-all-btn-hover:hover {
              background: rgba(239, 68, 68, 0.15) !important;
            }
            .pagination-btn-hover {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            .pagination-btn-hover:hover:not(:disabled) {
              transform: translateY(-1.5px) !important;
              box-shadow: 0 6px 18px rgba(13, 148, 136, 0.35) !important;
              background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%) !important;
            }
          `}</style>
          <div style={styles.container}>
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
                      className="pagination-btn-hover"
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
                      className="pagination-btn-hover"
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
    </div>
  );
};

const styles = {
  outerContainer: {
    padding: "32px 20px",
    maxWidth: "1280px",
    margin: "0 auto",
    background: "#F8FAFC",
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32px",
    gap: "20px",
  },
  pageWrapper: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "32px",
    width: "100%",
    boxSizing: "border-box",
    minWidth: 0,
  },
  sidebar: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    height: "fit-content",
    position: "sticky",
    top: "100px",
    minWidth: 0,
    border: "1.5px solid #E2E8F0",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
    zIndex: 50,
    maxHeight: "calc(100vh - 120px)",
    overflowY: "auto",
  },
  filterSection: {
    marginBottom: "28px",
    paddingBottom: "24px",
    borderBottom: "1px solid #F3F4F6",
  },
  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  filterTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    margin: "0",
  },
  clearAllBtn: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "none",
    color: "#EF4444",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "background 0.2s",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#4B5563",
    padding: "6px 0",
    transition: "color 0.2s",
  },
  checkboxLabelWithCount: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#4B5563",
    justifyContent: "space-between",
    padding: "6px 0",
    transition: "color 0.2s",
  },
  jobCount: {
    color: "#0D9488",
    fontSize: "12px",
    marginLeft: "auto",
    fontWeight: "600",
    background: "rgba(13, 148, 136, 0.08)",
    padding: "2px 8px",
    borderRadius: "12px",
  },
  sliderContainer: {
    position: "relative",
    marginBottom: "16px",
    height: "6px",
    background: "#E5E7EB",
    borderRadius: "3px",
  },
  slider: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "3px",
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
    fontSize: "14px",
    color: "#374151",
    marginTop: "12px",
    fontWeight: "600",
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
  pageTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 8px 0",
    letterSpacing: "-0.02em",
  },
  sortButton: {
    padding: "10px 16px",
    background: "#ffffff",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#374151",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    height: "fit-content",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  filterInfo: {
    fontSize: "15px",
    color: "#6B7280",
    margin: "12px 0 0 0",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  clearBtn: {
    background: "#FEF2F2",
    color: "#EF4444",
    border: "none",
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  loadingText: {
    fontSize: "18px",
    color: "#6B7280",
    textAlign: "center",
    padding: "40px",
    fontWeight: "500",
  },
  errorText: {
    fontSize: "16px",
    color: "#EF4444",
    textAlign: "center",
    padding: "40px",
  },
  noJobsText: {
    fontSize: "16px",
    color: "#9CA3AF",
    textAlign: "center",
    padding: "60px 40px",
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px dashed #E5E7EB",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    padding: "40px 20px",
    marginTop: "32px",
    borderTop: "1px solid #E5E7EB",
  },
  paginationBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)",
  },
  paginationBtnDisabled: {
    background: "#E5E7EB",
    color: "#9CA3AF",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  pageInfo: {
    fontSize: "15px",
    color: "#4B5563",
    fontWeight: "600",
    minWidth: "150px",
    textAlign: "center",
  },
};

export default JobsPage;