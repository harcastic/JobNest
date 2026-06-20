// features/user/pages/ProfilePage.jsx
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading profile...</p>
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

  if (!user) {
    return (
      <div style={styles.container}>
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        .profile-edit-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .profile-edit-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 18px rgba(13, 148, 136, 0.4) !important;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%) !important;
        }
        .profile-back-btn {
          transition: all 0.25s ease !important;
        }
        .profile-back-btn:hover {
          background: #F8FAFC !important;
          border-color: #CBD5E1 !important;
          color: #1E293B !important;
        }
        .profile-delete-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .profile-delete-btn:hover {
          transform: translateY(-1.5px);
          background: #DC2626 !important;
          box-shadow: 0 6px 18px rgba(239, 68, 68, 0.3) !important;
        }
        .resume-widget {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: rgba(13, 148, 136, 0.05);
          border: 1.5px solid rgba(13, 148, 136, 0.15);
          border-radius: 12px;
          color: #0D9488;
          text-decoration: none;
          font-weight: 700;
          font-size: 14.5px;
          transition: all 0.25s ease;
        }
        .resume-widget:hover {
          background: #0D9488;
          color: white;
          border-color: #0D9488;
          box-shadow: 0 6px 16px rgba(13, 148, 136, 0.2);
          transform: translateY(-1px);
        }
      `}</style>

      <div style={styles.header}>
        <h1 style={styles.pageHeading}>My Profile</h1>
        <div style={styles.actions}>
          <button
            onClick={() => navigate("/profile/edit")}
            style={styles.editBtn}
            className="profile-edit-btn"
          >
            Edit Profile <i className="fas fa-edit" style={{ marginLeft: "6px", fontSize: "13px" }}></i>
          </button>
          <button 
            onClick={() => navigate("/jobs")} 
            style={styles.backBtn}
            className="profile-back-btn"
          >
            Back to Jobs
          </button>
        </div>
      </div>

      <div style={styles.profileCard}>
        {/* Profile Header with Circular Picture */}
        <div style={styles.profileHeader}>
          <div style={styles.profileImageContainer}>
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                style={styles.circularImage}
              />
            ) : (
              <div style={styles.placeholderImage}>
                <span style={styles.placeholderText}>
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div style={styles.profileHeaderInfo}>
            <h2 style={styles.userName}>{user.username}</h2>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
              <span style={styles.roleBadge}>{user.role === "recruiter" ? "Recruiter" : "Job Seeker"}</span>
              {user.role === "recruiter" && user.isVerifiedRecruiter && (
                <span style={styles.verifiedBadge}><i className="fas fa-check-circle"></i> Verified Employer</span>
              )}
            </div>
            <p style={styles.userEmail}><i className="far fa-envelope" style={{ marginRight: "8px" }}></i>{user.email}</p>
            {user.location && (
              <p style={styles.userLocation}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: "8px", color: "#94A3B8" }}></i> {user.location}
              </p>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <section style={styles.section}>
          <h3 style={styles.sectionHeading}>Basic Information</h3>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Username</label>
              <p style={styles.fieldValue}>{user.username}</p>
            </div>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Email Address</label>
              <p style={styles.fieldValue}>{user.email}</p>
            </div>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Account Type</label>
              <p style={styles.fieldValue}><span style={styles.roleValueBadge}>{user.role}</span></p>
            </div>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Primary Location</label>
              <p style={styles.fieldValue}>{user.location || "Not specified"}</p>
            </div>
          </div>
        </section>

        {/* Professional Information */}
        <section style={styles.section}>
          <h3 style={styles.sectionHeading}>Professional Details</h3>
          <div style={styles.grid}>
            <div style={styles.fieldFull}>
              <label style={styles.fieldLabel}>Short Biography</label>
              <p style={{ ...styles.fieldValue, lineHeight: "1.6" }}>{user.bio || "No biography added yet"}</p>
            </div>
            {user.role === "recruiter" && (
              <>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Affiliated Company</label>
                  <p style={styles.fieldValue}>{user.companyName || "Not specified"}</p>
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Verification Status</label>
                  <p style={styles.fieldValue}>
                    {user.isVerifiedRecruiter ? (
                      <span style={{ color: "#10B981", fontWeight: "700" }}><i className="fas fa-check-circle" style={{ marginRight: "6px" }}></i> Verified Employer</span>
                    ) : (
                      <span style={{ color: "#94A3B8", fontWeight: "600" }}><i className="far fa-circle" style={{ marginRight: "6px" }}></i> Unverified</span>
                    )}
                  </p>
                </div>
              </>
            )}
            {user.role === "user" && (
              <>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Experience Level</label>
                  <p style={styles.fieldValue}><span style={styles.experienceBadge}>{user.experienceLevel || "Not specified"}</span></p>
                </div>
                <div style={styles.fieldFull}>
                  <label style={styles.fieldLabel}>Professional Skills</label>
                  <div style={styles.skillsTags}>
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, i) => (
                        <span key={i} style={styles.skillTag}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p style={{ margin: "0", fontSize: "14px", color: "#94A3B8", fontStyle: "italic" }}>No skills added</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Additional Information */}
        {user.resume && (
          <section style={styles.section}>
            <h3 style={styles.sectionHeading}>Uploaded Resume</h3>
            <div style={{ marginTop: "12px" }}>
              <a href={user.resume} target="_blank" rel="noopener noreferrer" className="resume-widget">
                <i className="far fa-file-pdf" style={{ fontSize: "18px" }}></i>
                <span>Download Attached Resume</span>
                <i className="fas fa-download" style={{ fontSize: "13px", marginLeft: "4px" }}></i>
              </a>
            </div>
          </section>
        )}

        {/* Account Actions */}
        <section style={{ ...styles.section, borderBottom: "none", paddingBottom: "0", marginBottom: "0" }}>
          <h3 style={styles.sectionHeading}>Account Settings</h3>
          <p style={styles.deleteWarning}>
            Warning: Deleting your account will remove all application tracking records and is completely irreversible.
          </p>
          <button
            onClick={() => navigate("/profile/delete")}
            style={styles.deleteBtn}
            className="profile-delete-btn"
          >
            <i className="fas fa-trash-alt" style={{ marginRight: "8px" }}></i> Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "32px 20px",
    maxWidth: "850px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  pageHeading: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#0F172A",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  editBtn: {
    padding: "12px 22px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14.5px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(13, 148, 136, 0.25)",
  },
  backBtn: {
    padding: "12px 22px",
    background: "#FFFFFF",
    color: "#475569",
    border: "1.5px solid #E2E8F0",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14.5px",
    cursor: "pointer",
  },
  profileCard: {
    border: "1.5px solid #E2E8F0",
    padding: "40px",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
    boxSizing: "border-box",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    marginBottom: "40px",
    paddingBottom: "32px",
    borderBottom: "1.5px solid #F1F5F9",
  },
  profileImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  circularImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3.5px solid #FFFFFF",
    boxShadow: "0 8px 24px rgba(13, 148, 136, 0.18)",
    background: "#F8FAFC",
  },
  placeholderImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3.5px solid #FFFFFF",
    boxShadow: "0 8px 24px rgba(13, 148, 136, 0.18)",
  },
  placeholderText: {
    fontSize: "44px",
    fontWeight: "800",
    color: "white",
  },
  profileHeaderInfo: {
    flex: 1,
    textAlign: "left",
  },
  userName: {
    margin: "0 0 6px 0",
    fontSize: "26px",
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: "-0.5px",
  },
  roleBadge: {
    background: "rgba(13, 148, 136, 0.08)",
    color: "#0D9488",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12.5px",
    fontWeight: "700",
  },
  verifiedBadge: {
    background: "rgba(16, 185, 129, 0.08)",
    color: "#10B981",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12.5px",
    fontWeight: "700",
  },
  userEmail: {
    margin: "0 0 8px 0",
    fontSize: "14.5px",
    color: "#475569",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  userLocation: {
    margin: "0",
    fontSize: "14px",
    color: "#64748B",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  section: {
    marginBottom: "36px",
    paddingBottom: "36px",
    borderBottom: "1.5px solid #F1F5F9",
  },
  sectionHeading: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "800",
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px 32px",
    marginTop: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    textAlign: "left",
  },
  fieldFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    textAlign: "left",
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  fieldValue: {
    margin: 0,
    fontSize: "15px",
    color: "#1E293B",
    fontWeight: "500",
  },
  roleValueBadge: {
    background: "rgba(13, 148, 136, 0.08)",
    color: "#0D9488",
    padding: "3px 10px",
    borderRadius: "6px",
    display: "inline-block",
    fontSize: "13.5px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  experienceBadge: {
    background: "rgba(249, 115, 22, 0.08)",
    color: "#F97316",
    padding: "3px 10px",
    borderRadius: "6px",
    display: "inline-block",
    fontSize: "13.5px",
    fontWeight: "600",
  },
  skillsTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  skillTag: {
    background: "rgba(13, 148, 136, 0.08)",
    color: "#0D9488",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13.5px",
    fontWeight: "600",
    border: "1px solid rgba(13, 148, 136, 0.12)",
  },
  deleteBtn: {
    padding: "12px 24px",
    background: "#EF4444",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14.5px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
    display: "inline-flex",
    alignItems: "center",
  },
  deleteWarning: {
    color: "#64748B",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0 0 20px 0",
    textAlign: "left",
  },
  loadingText: {
    fontSize: "18px",
    color: "#64748B",
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
};

export default ProfilePage;
