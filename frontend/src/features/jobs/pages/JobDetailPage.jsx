// features/jobs/pages/JobDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../services/jobService";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [expandedResponsibilities, setExpandedResponsibilities] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Get user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  // Track window width for responsive changes
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (loading) return <p style={{textAlign: 'center', padding: '40px'}}>Loading job details...</p>;
  if (error) return <p style={{ color: "red", textAlign: 'center', padding: '40px' }}>{error}</p>;
  if (!job) return <p style={{textAlign: 'center', padding: '40px'}}>Job not found</p>;

  // Check if user is recruiter
  const isRecruiter = userRole === 'recruiter';
  const isMobile = windowWidth < 768;

  return (
    <div style={{...styles.container, ...getResponsiveContainerStyle(windowWidth)}}>
      <button onClick={() => navigate("/jobs")} style={styles.backBtn}>
        ← Back to Jobs
      </button>

      {/* Header Section */}
      <div style={{...styles.headerSection, ...getResponsiveHeaderStyle(windowWidth)}}>
        <div style={{...styles.headerTop, ...getResponsiveHeaderTop(windowWidth)}}>
          <div style={styles.logoCompanySection}>
            <div style={styles.companyLogo}>{job.companyName.substring(0, 2)}</div>
          </div>
          <div style={{...styles.headerActions, ...getResponsiveHeaderActions(windowWidth)}}>
            <button 
              style={{...styles.saveBtn, color: isSaved ? "#1976d2" : "#999"}}
              onClick={() => setIsSaved(!isSaved)}
              title="Save"
            >
              ♡
            </button>
            {isRecruiter ? (
              <button 
                style={{...styles.applyBtn, ...styles.disabledApplyBtn, cursor: 'not-allowed'}} 
                disabled
                title="Recruiters cannot apply to jobs"
              >
                Apply
              </button>
            ) : (
              <button style={styles.applyBtn} onClick={() => navigate("/apply/" + id)}>
                Apply
              </button>
            )}
          </div>
        </div>
        <h1 style={{...styles.jobTitle, ...getResponsiveJobTitle(windowWidth)}}>{job.title}</h1>
        <p style={{...styles.jobInfo, ...getResponsiveJobInfo(windowWidth)}}>
          {job.companyName} · {job.location} · Posted recently
        </p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div style={{...styles.mainContent, ...getResponsiveMainContent(windowWidth)}}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          {/* About the job */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>About the job</h2>
            <p style={styles.sectionContent}>{job.jobDescription}</p>
          </div>

          {/* Responsibilities */}
          {job.duration || job.timing ? (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Responsibilities</h2>
              <ul style={styles.bulletList}>
                {job.duration && <li>Duration: {job.duration}</li>}
                {job.timing && <li>Timing: {job.timing}</li>}
                {job.country && <li>Location: {job.country}</li>}
              </ul>
              {expandedResponsibilities && (
                <div>
                  <p style={styles.expandedContent}>
                    This position offers a great opportunity to grow your skills and contribute to meaningful projects. 
                    You'll work with a talented team in a dynamic environment. Key responsibilities include:
                  </p>
                  <ul style={styles.bulletList}>
                    <li>Lead and manage cross-functional teams</li>
                    <li>Deliver high-quality solutions on time</li>
                    <li>Collaborate with stakeholders to understand requirements</li>
                    <li>Mentor junior team members</li>
                    <li>Contribute to process improvements</li>
                  </ul>
                </div>
              )}
              <button 
                style={styles.seeMoreBtn}
                onClick={() => setExpandedResponsibilities(!expandedResponsibilities)}
              >
                {expandedResponsibilities ? "See less" : "See more"}
              </button>
            </div>
          ) : null}

          {/* Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Skills</h2>
              <div style={styles.skillsGrid}>
                {job.skillsRequired.map((skill, i) => (
                  <span key={i} style={styles.skillBadge}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* About company */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>About company</h2>
            <p style={styles.sectionContent}>{job.aboutCompany}</p>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div style={styles.rightColumn}>
          {/* Salary */}
          {job.salary && (
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>Salary</h3>
              <p style={styles.salaryText}>${job.salary}k/year</p>
            </div>
          )}

          {/* Contact */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Contact</h3>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>✉️</span>
              <div>
                <p style={styles.contactLabel}>Email</p>
                <p style={styles.contactValue}>jobs@{job.companyName.toLowerCase().replace(/\s/g, '')}.com</p>
              </div>
            </div>
          </div>

          {/* Job Details Tags */}
          <div style={styles.sidebarCard}>
            <div style={styles.tagsContainer}>
              {job.jobType && (
                <div style={styles.detailTag}>
                  <span style={styles.tagIcon}>💼</span>
                  <span>{job.jobType}</span>
                </div>
              )}
              <div style={styles.detailTag}>
                <span style={styles.tagIcon}>🏢</span>
                <span>Software & Services</span>
              </div>
              {job.duration && (
                <div style={styles.detailTag}>
                  <span style={styles.tagIcon}>⏱️</span>
                  <span>{job.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Card */}
          <div style={styles.sidebarCard}>
            <div style={styles.companyCardContent}>
              <div style={styles.companyCardLogo}>{job.companyName.substring(0, 2)}</div>
              <h3 style={styles.companyCardName}>{job.companyName}</h3>
              <p style={styles.companyFollowers}>14,000,752 followers</p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    background: "#f5f7fa",
    minHeight: "100vh",
    boxSizing: "border-box",
    width: "100%",
  },
  backBtn: {
    padding: "10px 16px",
    marginBottom: "20px",
    cursor: "pointer",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.3s ease",
    boxSizing: "border-box",
    width: "auto",
    minWidth: 0,
  },
  // Header Section
  headerSection: {
    background: "white",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
    width: "100%",
    boxSizing: "border-box",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    gap: "12px",
    minWidth: 0,
  },
  logoCompanySection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },
  companyLogo: {
    width: "64px",
    height: "64px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    flexShrink: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexShrink: 0,
  },
  saveBtn: {
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    padding: "8px 12px",
    transition: "color 0.3s ease",
  },
  applyBtn: {
    background: "#1976d2",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease",
    whiteSpace: "nowrap",
  },
  disabledApplyBtn: {
    background: "#ccc",
    color: "#666",
    cursor: "not-allowed",
  },
  jobTitle: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a1a",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  jobInfo: {
    margin: "0",
    fontSize: "13px",
    color: "#999",
    wordWrap: "break-word",
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  // Main Content Layout
  mainContent: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "24px",
    width: "100%",
    boxSizing: "border-box",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    minWidth: 0,
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  // Sections
  section: {
    background: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
    overflowX: "auto",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  sectionTitle: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    wordWrap: "break-word",
  },
  sectionContent: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  expandedContent: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    fontStyle: "italic",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  bulletList: {
    margin: "0 0 16px 0",
    paddingLeft: "20px",
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
  },
  seeMoreBtn: {
    background: "transparent",
    color: "#1976d2",
    border: "none",
    padding: "8px 0",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  skillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    minWidth: 0,
  },
  skillBadge: {
    background: "#e8f0fe",
    color: "#1976d2",
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "13px",
    fontWeight: "500",
    wordWrap: "break-word",
    whiteSpace: "normal",
  },
  // Sidebar
  sidebarCard: {
    background: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  sidebarTitle: {
    margin: "0 0 12px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    wordWrap: "break-word",
  },
  salaryText: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1976d2",
    wordWrap: "break-word",
  },
  contactItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    minWidth: 0,
    wordWrap: "break-word",
  },
  contactIcon: {
    fontSize: "20px",
    marginTop: "2px",
    flexShrink: 0,
  },
  contactLabel: {
    margin: "0 0 2px 0",
    fontSize: "12px",
    color: "#999",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  contactValue: {
    margin: "0",
    fontSize: "13px",
    color: "#1a1a1a",
    fontWeight: "500",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    minWidth: 0,
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  detailTag: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#666",
    flexWrap: "wrap",
    wordWrap: "break-word",
  },
  tagIcon: {
    fontSize: "16px",
    flexShrink: 0,
  },
  companyCardContent: {
    textAlign: "center",
    wordWrap: "break-word",
  },
  companyCardLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    margin: "0 auto 12px",
    flexShrink: 0,
  },
  companyCardName: {
    margin: "0 0 6px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  companyFollowers: {
    margin: "0",
    fontSize: "12px",
    color: "#999",
    wordWrap: "break-word",
  },
};

// Responsive helper functions
const getResponsiveContainerStyle = (width) => {
  if (width < 640) {
    return {
      padding: "12px",
    };
  } else if (width < 768) {
    return {
      padding: "16px",
    };
  }
  return {};
};

const getResponsiveHeaderStyle = (width) => {
  if (width < 640) {
    return {
      padding: "16px",
      marginBottom: "16px",
    };
  }
  return {};
};

const getResponsiveHeaderTop = (width) => {
  if (width < 640) {
    return {
      flexDirection: "column",
      gap: "12px",
    };
  }
  return {};
};

const getResponsiveHeaderActions = (width) => {
  if (width < 640) {
    return {
      width: "100%",
      justifyContent: "flex-end",
    };
  }
  return {};
};

const getResponsiveJobTitle = (width) => {
  if (width < 640) {
    return {
      fontSize: "18px",
    };
  } else if (width < 768) {
    return {
      fontSize: "20px",
    };
  }
  return {};
};

const getResponsiveJobInfo = (width) => {
  if (width < 640) {
    return {
      fontSize: "12px",
      flexWrap: "wrap",
    };
  }
  return {};
};

const getResponsiveMainContent = (width) => {
  if (width < 768) {
    return {
      gridTemplateColumns: "1fr",
      gap: "16px",
    };
  }
  return {};
};

export default JobDetailPage;
