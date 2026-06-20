// features/jobs/components/JobCard.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

const JobCard = ({ job, applicantsCount = 0 }) => {
  const [isSaved, setIsSaved] = useState(false);

  const calculatePostedTime = (createdAt) => {
    const now = new Date();
    const posted = new Date(createdAt);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "Posted yesterday";
    return `Posted ${diffDays} days ago`;
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Link to={`/jobs/${job._id}`} className="job-card-link" style={{ 
      textDecoration: "none", 
      color: "inherit",
      display: "flex",
      width: "100%",
      minWidth: 0,
      height: "100%",
    }}>
      <div style={styles.card} className="job-card">
        {/* Header with logo and save button */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              {job.recruiter?.profileImage ? (
                <img 
                  src={job.recruiter.profileImage} 
                  alt={job.recruiter.username || "Recruiter"}
                  style={styles.logoImage}
                />
              ) : (
                job.companyName.charAt(0).toUpperCase()
              )}
            </div>
          </div>
          <button
            className="save-btn"
            style={{
              ...styles.saveButton,
              color: isSaved ? "#EF4444" : "#9CA3AF",
              background: isSaved ? "#FEF2F2" : "rgba(243, 244, 246, 0.8)",
            }}
            onClick={handleSaveJob}
          >
            <i className={`${isSaved ? 'fas' : 'far'} fa-heart`} style={{ fontSize: '18px' }}></i>
          </button>
        </div>

        {/* Title and Company Info */}
        <div style={styles.titleSection}>
          <h3 style={styles.jobTitle}>{job.title}</h3>
          <p style={styles.companyInfo}>
            {job.companyName} • {applicantsCount} Applicants
          </p>
        </div>

        {/* Job Type Tags */}
        <div style={styles.tagsContainer}>
          <span style={styles.tag} className="entry-level">
            Entry Level
          </span>
          <span style={styles.tag} className="full-time">
            {job.jobType}
          </span>
          {job.timing && (
            <span style={styles.tag} className="timing">
              {job.timing}
            </span>
          )}
        </div>

        {/* Description */}
        <p style={styles.description}>
          {truncateText(job.jobDescription)}
        </p>

        {/* Footer with salary and posted time */}
        <div style={styles.footer}>
          <span style={styles.salary}>
            {job.salary ? `$${job.salary}/hr` : "Salary TBD"}
          </span>
          <span style={styles.postedTime}>
            {calculatePostedTime(job.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #E2E8F0",
    borderRadius: "16px",
    padding: "24px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: 1,
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    gap: "8px",
    minWidth: 0,
  },
  logoContainer: {
    display: "flex",
    gap: "12px",
    minWidth: 0,
  },
  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "22px",
    flexShrink: 0,
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(13, 148, 136, 0.2)",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
  },
  saveButton: {
    background: "rgba(243, 244, 246, 0.8)",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    marginBottom: "16px",
    minWidth: 0,
    flex: 1,
  },
  jobTitle: {
    margin: "0 0 6px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    lineHeight: "1.3",
  },
  companyInfo: {
    margin: "0",
    fontSize: "14px",
    color: "#6B7280",
    fontWeight: "500",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tagsContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
    minWidth: 0,
  },
  tag: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
    whiteSpace: "nowrap",
  },
  description: {
    margin: "0 0 20px 0",
    fontSize: "14px",
    color: "#4B5563",
    lineHeight: "1.6",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    flex: 1,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #F3F4F6",
    gap: "8px",
    marginTop: "auto",
    minWidth: 0,
  },
  salary: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0D9488",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  postedTime: {
    fontSize: "13px",
    color: "#9CA3AF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "right",
    fontWeight: "500",
  },
};

const tagStyles = `
  .job-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  .job-card:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 16px 28px -6px rgba(13, 148, 136, 0.12), 0 6px 12px -4px rgba(13, 148, 136, 0.08) !important;
    border-color: #0D9488 !important;
  }
  .save-btn {
    transition: all 0.2s ease !important;
  }
  .save-btn:hover {
    transform: scale(1.1);
    background: #FEF2F2 !important;
    color: #EF4444 !important;
  }
  .entry-level {
    background: rgba(13, 148, 136, 0.08) !important;
    color: #0D9488 !important;
    font-weight: 600;
  }
  .full-time {
    background: rgba(16, 185, 129, 0.08) !important;
    color: #10B981 !important;
    font-weight: 600;
  }
  .timing {
    background: rgba(249, 115, 22, 0.08) !important;
    color: #F97316 !important;
    font-weight: 600;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = tagStyles;
document.head.appendChild(styleSheet);

export default JobCard;