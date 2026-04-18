// shared/components/Navbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, loading: logoutLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userImage, setUserImage] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const token = localStorage.getItem("token");

  // Load user data immediately and set up listener
  useEffect(() => {
    // Load data directly from localStorage
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    const image = localStorage.getItem("userImage");

    console.log("Navbar useEffect - Loading from localStorage:", { name, role, image });

    if (name) setUserName(name);
    if (role) setUserRole(role);
    if (image) setUserImage(image);

    // Force update on window focus in case changed in another tab
    const handleFocus = () => {
      const focusName = localStorage.getItem("userName");
      const focusRole = localStorage.getItem("userRole");
      const focusImage = localStorage.getItem("userImage");
      
      if (focusName) setUserName(focusName);
      if (focusRole) setUserRole(focusRole);
      if (focusImage) setUserImage(focusImage);
    };

    // Listen for custom event when user image changes (same page)
    const handleImageChange = (event) => {
      console.log("userImageChanged event received:", event.detail);
      setUserImage(event.detail.userImage);
    };

    // Listen for logout event to reset user data
    const handleLogoutEvent = () => {
      console.log("userLogout event received, resetting navbar");
      setUserName("");
      setUserRole("user");
      setUserImage("");
    };

    // Listen for localStorage changes (from other tabs)
    const handleStorageChange = () => {
      const updatedImage = localStorage.getItem("userImage");
      if (updatedImage) setUserImage(updatedImage);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("userImageChanged", handleImageChange);
    window.addEventListener("userLogout", handleLogoutEvent);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("userImageChanged", handleImageChange);
      window.removeEventListener("userLogout", handleLogoutEvent);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Clear input fields when filters are cleared (URL has no search params)
    const params = new URLSearchParams(location.search);
    const hasFilters = params.toString() !== "";
    
    if (!hasFilters && location.pathname.includes("/jobs")) {
      setSearchTitle("");
      setSearchLocation("");
    }
  }, [location.search, location.pathname]);

  const handleLogout = async () => {
    try {
      setShowDropdown(false);
      await logout();
      // logout() function will reload the page, no need to navigate
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append("title", searchTitle);
    if (searchLocation) params.append("location", searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Hide navbar on login/register pages
  if (location.pathname === "/login" || location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  if (!token) {
    return null;
  }

  // Render navigation items based on user role
  const renderNavItems = () => {
    if (userRole === "recruiter") {
      return (
        <>
          <button
            onClick={() => navigate("/jobs")}
            style={{
              ...styles.navLink,
              ...(isActive("/jobs") ? styles.activeLink : {}),
            }}
          >
            Find Jobs
          </button>
          <button
            onClick={() => navigate("/recruiter/jobs")}
            style={{
              ...styles.navLink,
              ...(isActive("/recruiter/jobs") ? styles.activeLink : {}),
            }}
          >
            My Jobs
          </button>
          <button
            onClick={() => navigate("/jobs/create")}
            style={{
              ...styles.navLink,
              ...(isActive("/jobs/create") ? styles.activeLink : {}),
            }}
          >
            Upload Job
          </button>
          <button
            onClick={() => navigate("/about")}
            style={styles.navLink}
          >
            About Us
          </button>
        </>
      );
    } else {
      // Job Seeker (user) navbar
      return (
        <>
          <button
            onClick={() => navigate("/jobs")}
            style={{
              ...styles.navLink,
              ...(isActive("/jobs") ? styles.activeLink : {}),
            }}
          >
            Find Jobs
          </button>
          <button
            onClick={() => navigate("/applications")}
            style={{
              ...styles.navLink,
              ...(isActive("/applications") ? styles.activeLink : {}),
            }}
          >
            My Applications
          </button>
          <button
            onClick={() => navigate("/about")}
            style={styles.navLink}
          >
            About Us
          </button>
        </>
      );
    }
  };

  return (
    <>
      <style>{`
        .navbar-search-btn:hover {
          background: linear-gradient(135deg, #0A5C63 0%, #003D40 100%) !important;
          box-shadow: 0 6px 20px rgba(10, 92, 99, 0.5) !important;
        }
      `}</style>
      {/* Top Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.topContainer}>
          <div style={styles.logoSection} onClick={() => navigate("/jobs")}>
            <div style={styles.logo}>Job Nest</div>
          </div>

          <div style={styles.navLinks}>
            {renderNavItems()}
          </div>

          <div style={styles.rightSection}>
            <div style={styles.profileDropdown}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={styles.profileButton}
              >
                <div style={styles.userInfo}>
                  <span style={styles.userName}>
                    {userName || "User"}
                  </span>
                  <span style={styles.userRole}>
                    {userRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                  </span>
                </div>
                <div style={styles.avatarCircle}>
                  {userImage ? (
                    <img 
                      src={userImage} 
                      alt="User"
                      style={styles.avatarImage}
                    />
                  ) : (
                    <span>{(userName || "U").charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </button>

              {showDropdown && (
                <div style={styles.dropdownMenu}>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile/edit");
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    Edit Profile
                  </button>
                  
                  {/* Show "My Applications" only for Job Seekers, not Recruiters */}
                  {userRole !== 'recruiter' && (
                    <button
                      onClick={() => {
                        navigate("/applications");
                        setShowDropdown(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      My Applications
                    </button>
                  )}
                  
                  <div style={styles.divider}></div>
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    style={{ ...styles.dropdownItem, ...styles.logoutItem, ...(logoutLoading ? styles.disabledButton : {}) }}
                  >
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar Section - Only for Job Seekers on Jobs Page */}
      {userRole !== 'recruiter' && location.pathname === "/jobs" && (
        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <form style={styles.searchForm} onSubmit={handleSearch}>
              <div style={styles.searchInputWrapper}>
                <i className="fas fa-magnifying-glass" style={styles.searchIcon}></i>
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.searchInputWrapper}>
                <i className="fas fa-location-dot" style={styles.searchIcon}></i>
                <input
                  type="text"
                  placeholder="Add country or city"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <button type="submit" style={styles.searchButton} className="navbar-search-btn">
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  navbar: {
    background: "#FFFFFF",
    color: "#2C3E50",
    padding: "12px 0",
    boxShadow: "0 2px 12px rgba(27, 165, 165, 0.12)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "2px solid #1BA5A5",
  },
  topContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    gap: "40px",
  },
  logoSection: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "scale(1.05)",
    },
  },
  logo: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1BA5A5",
    width: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    letterSpacing: "-1px",
  },
  navLinks: {
    display: "flex",
    gap: "30px",
    flex: 1,
    justifyContent: "center",
  },
  navLink: {
    background: "transparent",
    color: "#2C3E50",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    padding: "8px 0",
    transition: "color 0.3s ease, border-bottom 0.3s ease",
    borderBottom: "2px solid transparent",
    ":hover": {
      color: "#1BA5A5",
    },
  },
  activeLink: {
    color: "#1BA5A5",
    borderBottom: "2px solid #1BA5A5",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  profileDropdown: {
    position: "relative",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "background 0.3s ease",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
    minWidth: "80px",
  },
  userName: {
    color: "#1F3A7D",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
  },
  userRole: {
    color: "#999",
    fontSize: "11px",
    fontWeight: "400",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
  },
  avatarCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    flexShrink: 0,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dropdownMenu: {
    position: "absolute",
    top: "50px",
    right: 0,
    background: "white",
    color: "#2C3E50",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(27, 165, 165, 0.15)",
    minWidth: "200px",
    zIndex: 1000,
    overflow: "hidden",
    border: "1px solid #D9DDD4",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: "#2C3E50",
    textAlign: "left",
    transition: "background 0.2s ease",
  },
  divider: {
    height: "1px",
    background: "#D9DDD4",
    margin: "4px 0",
  },
  logoutItem: {
    color: "#e74c3c",
    fontWeight: "500",
  },
  // Search Section Styles
  searchSection: {
    background: "#FFFFFF",
    borderTop: "1px solid #D9DDD4",
    borderBottom: "1px solid #D9DDD4",
    padding: "24px 0",
    position: "sticky",
    top: 70,
    zIndex: 99,
  },
  searchContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 40px",
  },
  searchForm: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchInputWrapper: {
    flex: 1,
    minWidth: "200px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(27, 165, 165, 0.1)",
    border: "2px solid #1BA5A5",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "18px",
    pointerEvents: "none",
    color: "#1BA5A5",
  },
  searchInput: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    border: "none",
    fontSize: "14px",
    outline: "none",
    color: "#333",
    background: "white",
    transition: "background 0.3s ease",
  },
  searchButton: {
    background: "linear-gradient(135deg, #1BA5A5 0%, #0D7A86 100%)",
    color: "white",
    border: "none",
    padding: "14px 40px",
    borderRadius: "25px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 15px rgba(27, 165, 165, 0.3)",
  },
  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export default Navbar;
