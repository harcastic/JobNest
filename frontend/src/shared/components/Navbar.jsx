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
    return (
      <>
        <style>{`
          .nav-link-btn {
            position: relative;
            color: #4B5563;
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            padding: 8px 12px;
            border-radius: 8px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .nav-link-btn:hover {
            color: #0D9488;
            background: rgba(13, 148, 136, 0.06);
          }
          .logo-text {
            background: linear-gradient(135deg, #0D9488 0%, #0f766e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
            font-size: 24px;
            letter-spacing: -0.5px;
          }
          .btn-brand-primary {
            background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
            color: white;
            border: none;
            padding: 10px 22px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 14px rgba(13, 148, 136, 0.3);
          }
          .btn-brand-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(13, 148, 136, 0.5);
            background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%) !important;
          }
          .btn-brand-secondary {
            background: rgba(255, 255, 255, 0.85);
            color: #0F766E;
            border: 1px solid rgba(13, 148, 136, 0.3);
            padding: 10px 22px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
          }
          .btn-brand-secondary:hover {
            background: rgba(13, 148, 136, 0.08);
            transform: translateY(-2px);
            border-color: #0D9488;
          }
        `}</style>
        <nav style={styles.navbar}>
          <div style={styles.topContainer}>
            <div style={styles.logoSection} onClick={() => navigate("/")}>
              <div style={styles.logoCircle}>
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="logo-text">JobNest</div>
            </div>

            <div style={styles.navLinks}>
              <button onClick={() => navigate("/jobs")} className="nav-link-btn">Find Jobs</button>
              <button onClick={() => navigate("/about")} className="nav-link-btn">About Us</button>
            </div>

            <div style={styles.rightSection}>
              <button onClick={() => navigate("/login")} className="btn-brand-secondary" style={{ border: "none" }}>Sign In</button>
              <button onClick={() => navigate("/register")} className="btn-brand-primary">Join Now</button>
            </div>
          </div>
        </nav>
      </>
    );
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
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .nav-link-btn {
          position: relative;
          color: #4B5563;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link-btn:hover {
          color: #0D9488;
          background: rgba(13, 148, 136, 0.06);
        }
        .nav-link-btn.active {
          color: #0D9488;
          background: rgba(13, 148, 136, 0.12);
          font-weight: 600;
        }
        .navbar-search-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .navbar-search-btn:hover {
          background: linear-gradient(135deg, #0f766e 0%, #0b5c56 100%) !important;
          box-shadow: 0 4px 15px rgba(13, 148, 136, 0.45) !important;
          transform: translateY(-1px);
        }
        .logo-text {
          background: linear-gradient(135deg, #0D9488 0%, #0f766e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          font-size: 24px;
          letter-spacing: -0.5px;
        }
        .dropdown-item-hover {
          transition: all 0.2s ease !important;
        }
        .dropdown-item-hover:hover {
          background-color: #F8FAFC !important;
          color: #0D9488 !important;
          padding-left: 20px !important;
        }
        .logout-btn-hover {
          transition: all 0.2s ease !important;
        }
        .logout-btn-hover:hover {
          background-color: #FEF2F2 !important;
          color: #DC2626 !important;
          padding-left: 20px !important;
        }
        .search-input-wrapper-focus {
          border-color: #E2E8F0;
          transition: all 0.3s ease;
        }
        .search-input-wrapper-focus:focus-within {
          border-color: #0D9488 !important;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }
      `}</style>
      {/* Top Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.topContainer}>
          <div style={styles.logoSection} onClick={() => navigate("/jobs")}>
            <div style={styles.logoCircle}>
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="logo-text">JobNest</div>
          </div>

          <div style={styles.navLinks}>
            {userRole === "recruiter" ? (
              <>
                <button
                  onClick={() => navigate("/jobs")}
                  className={`nav-link-btn ${isActive("/jobs") && !isActive("/jobs/create") && !isActive("/recruiter/jobs") ? "active" : ""}`}
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => navigate("/recruiter/jobs")}
                  className={`nav-link-btn ${isActive("/recruiter/jobs") ? "active" : ""}`}
                >
                  My Jobs
                </button>
                <button
                  onClick={() => navigate("/jobs/create")}
                  className={`nav-link-btn ${isActive("/jobs/create") ? "active" : ""}`}
                >
                  Upload Job
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className={`nav-link-btn ${isActive("/about") ? "active" : ""}`}
                >
                  About Us
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/jobs")}
                  className={`nav-link-btn ${isActive("/jobs") ? "active" : ""}`}
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => navigate("/applications")}
                  className={`nav-link-btn ${isActive("/applications") ? "active" : ""}`}
                >
                  My Applications
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className={`nav-link-btn ${isActive("/about") ? "active" : ""}`}
                >
                  About Us
                </button>
              </>
            )}
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
                <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'}`} style={{ color: '#9CA3AF', fontSize: '12px', marginLeft: '4px' }}></i>
              </button>

              {showDropdown && (
                <div style={styles.dropdownMenu}>
                  <div style={styles.dropdownHeader}>
                    <p style={styles.dropdownName}>{userName || "User"}</p>
                    <p style={styles.dropdownEmail}>{userRole === 'recruiter' ? 'Recruiter Account' : 'Job Seeker Account'}</p>
                  </div>
                  <div style={styles.divider}></div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownItem}
                    className="dropdown-item-hover"
                  >
                    <i className="far fa-user" style={styles.dropdownIcon}></i> View Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile/edit");
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownItem}
                    className="dropdown-item-hover"
                  >
                    <i className="far fa-edit" style={styles.dropdownIcon}></i> Edit Profile
                  </button>
                  
                  {userRole !== 'recruiter' && (
                    <button
                      onClick={() => {
                        navigate("/applications");
                        setShowDropdown(false);
                      }}
                      style={styles.dropdownItem}
                      className="dropdown-item-hover"
                    >
                      <i className="far fa-file-alt" style={styles.dropdownIcon}></i> My Applications
                    </button>
                  )}
                  
                  <div style={styles.divider}></div>
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    style={{ ...styles.dropdownItem, ...styles.logoutItem, ...(logoutLoading ? styles.disabledButton : {}) }}
                    className="logout-btn-hover"
                  >
                    <i className="fas fa-sign-out-alt" style={styles.dropdownIcon}></i> {logoutLoading ? "Logging out..." : "Logout"}
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
            <form style={styles.searchForm} onSubmit={handleSearch} className="search-input-wrapper-focus">
              <div style={styles.searchInputWrapper}>
                <i className="fas fa-search" style={styles.searchIcon}></i>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.searchDivider}></div>

              <div style={styles.searchInputWrapper}>
                <i className="fas fa-location-dot" style={styles.searchIcon}></i>
                <input
                  type="text"
                  placeholder="City, state, or 'Remote'"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <button type="submit" style={styles.searchButton} className="navbar-search-btn">
                Find Jobs
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
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)"
  },
  topContainer: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    gap: "32px",
  },
  logoSection: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "opacity 0.2s ease",
  },
  logoCircle: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #0D9488 0%, #0f766e 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "18px",
    boxShadow: "0 4px 6px rgba(13, 148, 136, 0.2)",
  },
  navLinks: {
    display: "flex",
    gap: "8px",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  profileDropdown: {
    position: "relative",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "transparent",
    border: "1px solid transparent",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
  },
  userName: {
    color: "#111827",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "120px",
  },
  userRole: {
    color: "#6B7280",
    fontSize: "12px",
    fontWeight: "400",
  },
  avatarCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0D9488 0%, #0f766e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    flexShrink: 0,
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "2px solid #ffffff",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    minWidth: "220px",
    zIndex: 1000,
    overflow: "hidden",
    border: "1px solid rgba(229, 231, 235, 1)",
    animation: "dropdownSlide 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards",
  },
  dropdownHeader: {
    padding: "16px",
    background: "#F9FAFB",
  },
  dropdownName: {
    margin: 0,
    fontWeight: "600",
    color: "#111827",
    fontSize: "14px",
  },
  dropdownEmail: {
    margin: "4px 0 0 0",
    color: "#6B7280",
    fontSize: "12px",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "12px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    textAlign: "left",
    transition: "all 0.2s ease",
  },
  dropdownIcon: {
    width: "16px",
    textAlign: "center",
    fontSize: "14px",
    opacity: 0.7,
  },
  divider: {
    height: "1px",
    background: "#E5E7EB",
    margin: "0",
  },
  logoutItem: {
    color: "#EF4444",
  },
  searchSection: {
    background: "linear-gradient(to bottom, #F8FAFC, #FFFFFF)",
    borderBottom: "1px solid #E5E7EB",
    padding: "20px 0",
  },
  searchContainer: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 24px",
  },
  searchForm: {
    display: "flex",
    background: "white",
    borderRadius: "16px",
    padding: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)",
    alignItems: "center",
    border: "1.5px solid #E2E8F0",
    transition: "all 0.3s ease",
  },
  searchInputWrapper: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "transparent",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "16px",
    pointerEvents: "none",
    color: "#9CA3AF",
  },
  searchDivider: {
    width: "1px",
    height: "28px",
    background: "#E5E7EB",
    margin: "0 8px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 42px",
    border: "none",
    fontSize: "15px",
    outline: "none",
    color: "#111827",
    background: "transparent",
  },
  searchButton: {
    background: "linear-gradient(135deg, #0D9488 0%, #0f766e 100%)",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export default Navbar;
