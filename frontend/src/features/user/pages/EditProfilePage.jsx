// features/user/pages/EditProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../services/userService";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    username: "",
    bio: "",
    location: "",
    skills: "",
    experienceLevel: "",
    companyName: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        setForm({
          username: userData.username || "",
          bio: userData.bio || "",
          location: userData.location || "",
          skills: userData.skills ? userData.skills.join(", ") : "",
          experienceLevel: userData.experienceLevel || "",
          companyName: userData.companyName || "",
        });
        // Initialize image preview with existing profile image
        if (userData.profileImage) {
          setImagePreview(userData.profileImage);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPG, PNG, or GIF)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Use FormData for multipart file upload
      const formData = new FormData();
      
      // Add all form fields
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      formData.append("location", form.location);
      formData.append("experienceLevel", form.experienceLevel);
      formData.append("companyName", form.companyName);
      
      // Add skills as JSON array
      const skills = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
      formData.append("skills", JSON.stringify(skills));

      // Add image file if selected
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const updatedUser = await updateUserProfile(formData);
      
      // Update localStorage with new profile image
      if (updatedUser.profileImage) {
        localStorage.setItem("userImage", updatedUser.profileImage);
        
        // Dispatch custom event to notify navbar of image change
        const event = new CustomEvent("userImageChanged", {
          detail: { userImage: updatedUser.profileImage }
        });
        window.dispatchEvent(event);
      }
      
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/profile")} style={styles.backBtn}>
        ← Back to Profile
      </button>

      <div style={styles.formCard}>
        <h1>Edit Profile</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Basic Information */}
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Basic Information</legend>

            <div>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                style={styles.input}
                disabled
              />
              <small style={styles.hint}>Username cannot be changed</small>
            </div>

            <div>
              <label>Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows="4"
                style={styles.textarea}
              />
            </div>

            <div>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
                style={styles.input}
              />
            </div>

            {/* Profile Image Upload */}
            <div>
              <label>Profile Picture</label>
              <div style={styles.imageUploadSection}>
                {imagePreview && (
                  <div style={styles.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={styles.imagePreview}
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      style={styles.clearImageBtn}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />
                <small style={styles.hint}>
                  JPG, PNG, or GIF • Max 5MB
                </small>
              </div>
            </div>
          </fieldset>

          {/* Professional Information */}
          {user?.role === "user" && (
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>Professional Information</legend>

              <div>
                <label>Experience Level</label>
                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select experience level</option>
                  <option value="entry-level">Entry Level</option>
                  <option value="mid-level">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label>Skills (comma-separated)</label>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                  rows="3"
                  style={styles.textarea}
                />
              </div>
            </fieldset>
          )}

          {/* Recruiter Information */}
          {user?.role === "recruiter" && (
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>Company Information</legend>

              <div>
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  style={styles.input}
                />
              </div>
            </fieldset>
          )}

          <div style={styles.buttonGroup}>
            <button type="submit" disabled={submitting} style={styles.submitBtn}>
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  backBtn: {
    padding: "8px 16px",
    marginBottom: "20px",
    cursor: "pointer",
    background: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  formCard: {
    border: "1px solid #ddd",
    padding: "30px",
    borderRadius: "8px",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  form: {
    display: "grid",
    gap: "20px",
    marginTop: "20px",
  },
  fieldset: {
    border: "1px solid #eee",
    padding: "15px",
    borderRadius: "4px",
  },
  legend: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#667eea",
    padding: "0 10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  hint: {
    fontSize: "12px",
    color: "#999",
    marginTop: "5px",
  },
  error: {
    color: "#e74c3c",
    padding: "10px",
    background: "#fadbd8",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
  },
  submitBtn: {
    padding: "12px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: "12px 20px",
    background: "#ccc",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  loadingText: {
    fontSize: "18px",
    color: "#666",
    textAlign: "center",
  },
  imageUploadSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },
  imagePreviewContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "4px",
    border: "1px solid #eee",
  },
  imagePreview: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #667eea",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  clearImageBtn: {
    padding: "6px 12px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  fileInput: {
    padding: "8px",
    border: "2px solid #667eea",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default EditProfilePage;
