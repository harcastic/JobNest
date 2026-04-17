// shared/components/Navbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState("U");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Get user name from localStorage or set default
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
      setUserAvatar(storedUserName.charAt(0).toUpperCase());
    }
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
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

  return (
    <>
      {/* Top Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.topContainer}>
          <div style={styles.logoSection} onClick={() => navigate("/jobs")}>
            <div style={styles.logo}>∞</div>
          </div>

          <div style={styles.navLinks}>
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
              onClick={() => navigate("/jobs")}
              style={styles.navLink}
            >
              Find Talent
            </button>
            <button
              onClick={() => navigate("/jobs/create")}
              style={styles.navLink}
            >
              Upload Job
            </button>
            <button
              onClick={() => navigate("/about")}
              style={styles.navLink}
            >
              About us
            </button>
          </div>

          <div style={styles.rightSection}>
            <button style={styles.notificationBtn} title="Notifications">
              🔔
            </button>

            <div style={styles.profileDropdown}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={styles.profileButton}
              >
                <span style={styles.userName}>{userName}</span>
                <div style={styles.avatarCircle}>{userAvatar}</div>
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
                  <button
                    onClick={() => {
                      navigate("/applications");
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    My Applications
                  </button>
                  <div style={styles.divider}></div>
                  <button
                    onClick={handleLogout}
                    style={{ ...styles.dropdownItem, ...styles.logoutItem }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar Section */}
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <form style={styles.searchForm} onSubmit={handleSearch}>
            <div style={styles.searchInputWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.searchInputWrapper}>
              <span style={styles.searchIcon}>📍</span>
              <input
                type="text"
                placeholder="Add country or city"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <button type="submit" style={styles.searchButton}>
              Search
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const styles = {
  navbar: {
    background: "#1a1d2e",
    color: "white",
    padding: "12px 0",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
    position: "sticky",
    top: 0,
    zIndex: 100,
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
    fontSize: "32px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #5b7bff 0%, #4a5fff 100%)",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    color: "white",
  },
  navLinks: {
    display: "flex",
    gap: "30px",
    flex: 1,
    justifyContent: "center",
  },
  navLink: {
    background: "transparent",
    color: "#e0e0e0",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    padding: "8px 0",
    transition: "color 0.3s ease, border-bottom 0.3s ease",
    borderBottom: "2px solid transparent",
    ":hover": {
      color: "#ffffff",
    },
  },
  activeLink: {
    color: "#5b7bff",
    borderBottom: "2px solid #5b7bff",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  notificationBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "background 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileDropdown: {
    position: "relative",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "background 0.3s ease",
  },
  userName: {
    color: "#e0e0e0",
    fontSize: "14px",
    fontWeight: "500",
  },
  avatarCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    flexShrink: 0,
  },
  dropdownMenu: {
    position: "absolute",
    top: "50px",
    right: 0,
    background: "white",
    color: "#333",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    minWidth: "200px",
    zIndex: 1000,
    overflow: "hidden",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: "#333",
    textAlign: "left",
    transition: "background 0.2s ease",
  },
  divider: {
    height: "1px",
    background: "#e0e0e0",
    margin: "4px 0",
  },
  logoutItem: {
    color: "#e74c3c",
    fontWeight: "500",
  },
  // Search Section Styles
  searchSection: {
    background: "#1a1d2e",
    borderTop: "1px solid #2a2f42",
    borderBottom: "1px solid #2a2f42",
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
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "18px",
    pointerEvents: "none",
    color: "#999",
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
    background: "linear-gradient(135deg, #5b7bff 0%, #4a5fff 100%)",
    color: "white",
    border: "none",
    padding: "14px 40px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 15px rgba(91, 123, 255, 0.3)",
  },
};

export default Navbar;
