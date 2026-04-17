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
    <Link to={`/jobs/${job._id}`} style={{ 
      textDecoration: "none", 
      color: "inherit",
      display: "flex",
      width: "100%",
      minWidth: 0,
      height: "100%",
    }}>
      <div style={styles.card}>
        {/* Header with logo and save button */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              {job.companyName.charAt(0).toUpperCase()}
            </div>
          </div>
          <button
            style={{
              ...styles.saveButton,
              color: isSaved ? "#e74c3c" : "#ccc",
            }}
            onClick={handleSaveJob}
          >
            ♡
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
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    ":hover": {
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
    },
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: "8px",
    minWidth: 0,
  },
  logoContainer: {
    display: "flex",
    gap: "12px",
    minWidth: 0,
  },
  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "20px",
    flexShrink: 0,
  },
  saveButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    transition: "color 0.3s ease",
    flexShrink: 0,
  },
  titleSection: {
    marginBottom: "12px",
    minWidth: 0,
    flex: 1,
  },
  jobTitle: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  companyInfo: {
    margin: "0",
    fontSize: "14px",
    color: "#666",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tagsContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
    minWidth: 0,
  },
  tag: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
    whiteSpace: "nowrap",
  },
  description: {
    margin: "0 0 12px 0",
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    flex: 1,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #f0f0f0",
    gap: "8px",
    marginTop: "auto",
    minWidth: 0,
  },
  salary: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  postedTime: {
    fontSize: "13px",
    color: "#999",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "right",
  },
};

// Add dynamic tag colors
const tagStyles = `
  .entry-level {
    background: #f0e8ff !important;
    color: #7c3aed !important;
  }
  .full-time {
    background: #dcfce7 !important;
    color: #16a34a !important;
  }
  .timing {
    background: #fed7aa !important;
    color: #d97706 !important;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = tagStyles;
document.head.appendChild(styleSheet);

export default JobCard;