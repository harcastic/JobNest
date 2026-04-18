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
      <div style={styles.header}>
        <h1>My Profile</h1>
        <div style={styles.actions}>
          <button
            onClick={() => navigate("/profile/edit")}
            style={styles.editBtn}
          >
            Edit Profile
          </button>
          <button onClick={() => navigate("/jobs")} style={styles.backBtn}>
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
            <h1 style={styles.userName}>{user.username}</h1>
            <p style={styles.userRole}>{user.role}</p>
            <p style={styles.userEmail}>{user.email}</p>
            {user.location && <p style={styles.userLocation}>📍 {user.location}</p>}
          </div>
        </div>

        {/* Basic Information */}
        <section style={styles.section}>
          <h2>Basic Information</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label>Username</label>
              <p>{user.username}</p>
            </div>
            <div style={styles.field}>
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div style={styles.field}>
              <label>Role</label>
              <p style={styles.role}>{user.role}</p>
            </div>
            <div style={styles.field}>
              <label>Location</label>
              <p>{user.location || "Not specified"}</p>
            </div>
          </div>
        </section>

        {/* Professional Information */}
        <section style={styles.section}>
          <h2>Professional Information</h2>
          <div style={styles.grid}>
            <div style={styles.fieldFull}>
              <label>Bio</label>
              <p>{user.bio || "No bio added"}</p>
            </div>
            {user.role === "recruiter" && (
              <>
                <div style={styles.field}>
                  <label>Company</label>
                  <p>{user.companyName || "Not specified"}</p>
                </div>
                <div style={styles.field}>
                  <label>Verified Recruiter</label>
                  <p>{user.isVerifiedRecruiter ? "✓ Yes" : "✗ No"}</p>
                </div>
              </>
            )}
            {user.role === "user" && (
              <>
                <div style={styles.field}>
                  <label>Experience Level</label>
                  <p>{user.experienceLevel || "Not specified"}</p>
                </div>
                <div style={styles.fieldFull}>
                  <label>Skills</label>
                  <div style={styles.skillsTags}>
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, i) => (
                        <span key={i} style={styles.skillTag}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No skills added</p>
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
            <h2>Resume</h2>
            <a href={user.resume} target="_blank" rel="noopener noreferrer" style={styles.link}>
              Download Resume
            </a>
          </section>
        )}

        {/* Account Actions */}
        <section style={styles.section}>
          <h2>Account Settings</h2>
          <button
            onClick={() => navigate("/profile/delete")}
            style={styles.deleteBtn}
          >
            Delete Account
          </button>
          <p style={styles.deleteWarning}>
            Warning: This action cannot be undone.
          </p>
        </section>
      </div>
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
    marginBottom: "30px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  editBtn: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(27, 165, 165, 0.2)",
  },
  backBtn: {
    padding: "10px 20px",
    background: "#FFFFFF",
    border: "1px solid #D9DDD4",
    borderRadius: "4px",
    cursor: "pointer",
  },
  profileCard: {
    border: "1px solid #D9DDD4",
    padding: "30px",
    borderRadius: "8px",
    background: "white",
    boxShadow: "0 2px 8px rgba(27, 165, 165, 0.1)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    marginBottom: "40px",
    paddingBottom: "30px",
    borderBottom: "2px solid #D9DDD4",
  },
  profileImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  circularImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #1BA5A5",
    boxShadow: "0 4px 12px rgba(27, 165, 165, 0.3)",
  },
  placeholderImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "4px solid #1BA5A5",
    boxShadow: "0 4px 12px rgba(27, 165, 165, 0.3)",
  },
  placeholderText: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "white",
  },
  profileHeaderInfo: {
    flex: 1,
  },
  userName: {
    margin: "0 0 10px 0",
    fontSize: "28px",
    color: "#333",
  },
  userRole: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    color: "#1BA5A5",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  userEmail: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    color: "#666",
  },
  userLocation: {
    margin: "0",
    fontSize: "14px",
    color: "#999",
  },
  section: {
    marginBottom: "30px",
    paddingBottom: "30px",
    borderBottom: "1px solid #D9DDD4",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "15px",
  },
  field: {
    display: "grid",
    gap: "8px",
  },
  fieldFull: {
    gridColumn: "1 / -1",
    display: "grid",
    gap: "8px",
  },
  role: {
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    display: "inline-block",
    fontSize: "14px",
  },
  skillsTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  skillTag: {
    background: "#D4F3F3",
    color: "#0D7A86",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  link: {
    color: "#1BA5A5",
    textDecoration: "none",
    fontWeight: "bold",
  },
  deleteBtn: {
    padding: "10px 20px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteWarning: {
    color: "#e74c3c",
    fontSize: "12px",
    marginTop: "10px",
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
};

export default ProfilePage;
