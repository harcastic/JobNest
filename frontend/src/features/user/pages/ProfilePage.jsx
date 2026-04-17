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
        {user.profileImage && (
          <section style={styles.section}>
            <h2>Profile Picture</h2>
            <img
              src={user.profileImage}
              alt="Profile"
              style={styles.profileImage}
            />
          </section>
        )}

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
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  backBtn: {
    padding: "10px 20px",
    background: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
  },
  profileCard: {
    border: "1px solid #ddd",
    padding: "30px",
    borderRadius: "8px",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "30px",
    paddingBottom: "30px",
    borderBottom: "1px solid #eee",
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
    background: "#667eea",
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
    background: "#e8f0fe",
    color: "#667eea",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  profileImage: {
    maxWidth: "200px",
    borderRadius: "8px",
  },
  link: {
    color: "#667eea",
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
