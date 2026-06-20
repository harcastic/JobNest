// features/landing/pages/LandingPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [activeTab, setActiveTab] = useState("seeker");
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append("title", searchTitle);
    if (searchLocation) params.append("location", searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/jobs?title=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?title=${encodeURIComponent(categoryName)}`);
  };

  const handleGetStarted = (role) => {
    if (token) {
      if (userRole === "recruiter") {
        navigate("/recruiter/jobs");
      } else {
        navigate("/jobs");
      }
    } else {
      navigate(`/register${role ? `?role=${role}` : ""}`);
    }
  };

  return (
    <div style={styles.landingWrapper}>
      {/* Global CSS Styles injected dynamically */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(13, 148, 136, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 25px rgba(13, 148, 136, 0.7);
            transform: scale(1.03);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        /* Hover behaviors */
        .hover-nav-link {
          color: #4B5563;
          font-weight: 500;
          font-size: 15px;
          transition: all 0.2s ease;
          position: relative;
          cursor: pointer;
        }
        .hover-nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: #0D9488;
          transition: width 0.2s ease;
        }
        .hover-nav-link:hover {
          color: #0D9488;
        }
        .hover-nav-link:hover::after {
          width: 100%;
        }

        .cta-primary {
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.3);
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 148, 136, 0.5);
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
        }

        .cta-secondary {
          background: rgba(255, 255, 255, 0.85);
          color: #0F766E;
          border: 1px solid rgba(13, 148, 136, 0.3);
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        .cta-secondary:hover {
          background: rgba(13, 148, 136, 0.08);
          transform: translateY(-2px);
          border-color: #0D9488;
        }

        .tag-pill {
          background: rgba(13, 148, 136, 0.08);
          color: #0F766E;
          border: 1px solid rgba(13, 148, 136, 0.15);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tag-pill:hover {
          background: #0D9488;
          color: white;
          transform: translateY(-1px);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(13, 148, 136, 0.1);
          border-color: rgba(13, 148, 136, 0.2);
        }

        .cta-action-card-hover:hover {
          background: #FFFFFF !important;
          box-shadow: 0 10px 25px rgba(13, 148, 136, 0.08) !important;
          border-color: #E2E8F0 !important;
          transform: translateX(4px);
        }
        .cta-action-card-hover:hover .cta-arrow {
          transform: translateX(4px);
        }

        .category-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 28px 24px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
          border-color: #E2E8F0;
        }
        .category-card:hover .cat-icon {
          transform: scale(1.15);
          background: rgba(13, 148, 136, 0.1);
          color: #0D9488;
        }

        .cat-icon {
          width: 52px;
          height: 52px;
          background: #F3F4F6;
          color: #4B5563;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .testimonial-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #D1D5DB;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .testimonial-dot.active {
          background: #0D9488;
          width: 24px;
          border-radius: 10px;
        }

        .pulse-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(13, 148, 136, 0.1);
          color: #0D9488;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .pulse-indicator {
          width: 8px;
          height: 8px;
          background-color: #0D9488;
          border-radius: 50%;
          animation: pulseGlow 1.5s infinite;
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
        }

        .input-glass {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px 14px 44px;
          font-size: 15px;
          width: 100%;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-glass:focus {
          border-color: #0D9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }
      `}</style>

      {/* Navigation Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logoSection} onClick={() => navigate("/")}>
            <div style={styles.logoCircle}>
              <i className="fas fa-briefcase"></i>
            </div>
            <span style={styles.logoText}>JobNest</span>
          </div>

          <nav style={styles.navMenu}>
            <span onClick={() => navigate("/jobs")} className="hover-nav-link">Find Jobs</span>
            <span onClick={() => handleGetStarted("recruiter")} className="hover-nav-link">Post a Job</span>
            <span className="hover-nav-link">Companies</span>
            <span className="hover-nav-link">Resources</span>
          </nav>

          <div style={styles.authButtons}>
            {token ? (
              <>
                <span style={styles.welcomeUser}>Hi, <strong>{userName || "User"}</strong></span>
                <button 
                  onClick={() => navigate(userRole === "recruiter" ? "/recruiter/jobs" : "/jobs")} 
                  className="cta-primary"
                  style={{ padding: "10px 22px" }}
                >
                  Dashboard <i className="fas fa-arrow-right" style={{ marginLeft: "6px", fontSize: "12px" }}></i>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate("/login")} 
                  className="cta-secondary"
                  style={{ padding: "10px 22px", border: "none" }}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate("/register")} 
                  className="cta-primary"
                  style={{ padding: "10px 22px" }}
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={{ ...styles.heroContent, opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease" }}>
            <div className="pulse-badge">
              <span className="pulse-indicator"></span>
              Join 12,000+ top companies hiring today
            </div>
            <h1 style={styles.heroTitle}>
              Connecting talent with <br />
              <span style={styles.highlightText}>Infinite Opportunity</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Welcome to <strong>JobNest</strong>, the premium job ecosystem. Whether you're an ambitious professional searching for a career milestone or a scaling enterprise seeking elite talent, we build the bridge.
            </p>

            {/* Interactive Search Bar Mockup */}
            <form onSubmit={handleSearchSubmit} style={styles.searchContainer}>
              <div style={styles.searchInputGroup}>
                <i className="fas fa-search" style={styles.searchIcon}></i>
                <input
                  type="text"
                  placeholder="Job title, skills, or company..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="input-glass"
                />
              </div>
              <div style={styles.searchDivider}></div>
              <div style={styles.searchInputGroup}>
                <i className="fas fa-map-marker-alt" style={styles.searchIcon}></i>
                <input
                  type="text"
                  placeholder="City, state, or Remote..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="input-glass"
                />
              </div>
              <button type="submit" className="cta-primary" style={{ height: "100%", whiteSpace: "nowrap" }}>
                Search Jobs <i className="fas fa-search" style={{ marginLeft: "8px" }}></i>
              </button>
            </form>

            {/* Popular Tags */}
            <div style={styles.popularTags}>
              <span style={styles.tagsLabel}>Popular Searches:</span>
              <span onClick={() => handleTagClick("React Developer")} className="tag-pill">React Developer</span>
              <span onClick={() => handleTagClick("Remote")} className="tag-pill">Remote</span>
              <span onClick={() => handleTagClick("Product Manager")} className="tag-pill">Product Manager</span>
              <span onClick={() => handleTagClick("UI/UX Designer")} className="tag-pill">UI Designer</span>
            </div>
          </div>

          {/* Premium Animated SVG / Mock Dashboard Graphic */}
          <div style={styles.heroGraphicWrapper} className="floating-element">
            <div style={styles.glassDashboard}>
              {/* Top Bar */}
              <div style={styles.dashboardHeader}>
                <div style={styles.windowDots}>
                  <span style={{ ...styles.windowDot, background: "#FF5F56" }}></span>
                  <span style={{ ...styles.windowDot, background: "#FFBD2E" }}></span>
                  <span style={{ ...styles.windowDot, background: "#27C93F" }}></span>
                </div>
                <div style={styles.dashboardTitleText}>JobNest Talent Hub</div>
                <div style={{ width: "40px" }}></div>
              </div>

              {/* Main Content Area */}
              <div style={styles.dashboardGrid}>
                {/* Left Mini Sidebar */}
                <div style={styles.dashSidebar}>
                  <div style={{ ...styles.dashSidebarItem, background: "rgba(13, 148, 136, 0.1)", color: "#0D9488" }}>
                    <i className="fas fa-columns" style={{ marginRight: "8px" }}></i> Overview
                  </div>
                  <div style={styles.dashSidebarItem}>
                    <i className="fas fa-paper-plane" style={{ marginRight: "8px" }}></i> Applied
                  </div>
                  <div style={styles.dashSidebarItem}>
                    <i className="fas fa-bookmark" style={{ marginRight: "8px" }}></i> Saved Jobs
                  </div>
                  <div style={styles.dashSidebarItem}>
                    <i className="fas fa-cog" style={{ marginRight: "8px" }}></i> Settings
                  </div>
                </div>

                {/* Main panel */}
                <div style={styles.dashMain}>
                  <div style={styles.mainPanelHeader}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>Active Listings</span>
                    <span style={{ fontSize: "12px", color: "#0D9488", fontWeight: "600", cursor: "pointer" }}>View All</span>
                  </div>

                  {/* Mock job rows */}
                  <div style={styles.mockJobRow}>
                    <div style={styles.mockCompanyLogo}>St</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "700", color: "#1E293B" }}>Lead Product Designer</p>
                      <p style={{ margin: "0", fontSize: "11px", color: "#64748B" }}>Stripe · Remote · Full-time</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={styles.mockSalaryBadge}>$140k - $185k</span>
                    </div>
                  </div>

                  <div style={styles.mockJobRow}>
                    <div style={{ ...styles.mockCompanyLogo, background: "linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)" }}>Go</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "700", color: "#1E293B" }}>Senior Software Engineer</p>
                      <p style={{ margin: "0", fontSize: "11px", color: "#64748B" }}>Google · Tech · Permanent</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={styles.mockSalaryBadge}>$160k - $210k</span>
                    </div>
                  </div>

                  <div style={styles.mockJobRow}>
                    <div style={{ ...styles.mockCompanyLogo, background: "linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)" }}>Me</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "700", color: "#1E293B" }}>Senior AI Architect</p>
                      <p style={{ margin: "0", fontSize: "11px", color: "#64748B" }}>Meta AI · Hybrid · Full-time</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={styles.mockSalaryBadge}>$190k - $240k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Float Card 1: Job Applied successfully */}
            <div style={{ ...styles.floatCard, top: "20px", left: "-40px", animationDelay: "1s" }}>
              <div style={styles.floatCardIcon}>🎉</div>
              <div>
                <p style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "700", color: "#1E293B" }}>Application Sent!</p>
                <p style={{ margin: "0", fontSize: "10px", color: "#64748B" }}>Sent to Stripe recruitment</p>
              </div>
            </div>

            {/* Overlapping Float Card 2: Interview scheduled */}
            <div style={{ ...styles.floatCard, bottom: "40px", right: "-30px", animationDelay: "2.5s" }}>
              <div style={{ ...styles.floatCardIcon, background: "#FEF3C7" }}>📅</div>
              <div>
                <p style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "700", color: "#1E293B" }}>Interview Scheduled</p>
                <p style={{ margin: "0", fontSize: "10px", color: "#64748B" }}>Tomorrow at 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Divider */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div className="stat-card">
            <h3 style={styles.statNumber}>15,240+</h3>
            <p style={styles.statLabel}>Active Positions</p>
          </div>
          <div className="stat-card">
            <h3 style={styles.statNumber}>3,850+</h3>
            <p style={styles.statLabel}>Verified Employers</p>
          </div>
          <div className="stat-card">
            <h3 style={styles.statNumber}>98.2%</h3>
            <p style={styles.statLabel}>Placement Success</p>
          </div>
          <div className="stat-card">
            <h3 style={styles.statNumber}>24 Mins</h3>
            <p style={styles.statLabel}>Avg. Application Response</p>
          </div>
        </div>
      </section>

      {/* Audience Section (Seeker vs Recruiter Toggled Workflows) */}
      <section style={styles.workflowSection}>
        <div style={styles.workflowContainer}>
          <div style={styles.workflowHeader}>
            <div className="pulse-badge">
              <span className="pulse-indicator"></span> Tailored Experiences
            </div>
            <h2 style={styles.sectionTitle}>Two Sides, One Seamless Hub</h2>
            <p style={styles.sectionSubtitle}>
              Choose your pathway and see how JobNest simplifies either finding your next dream job or landing elite talent for your company.
            </p>

            {/* Tab Toggler */}
            <div style={styles.tabContainer}>
              <button 
                onClick={() => setActiveTab("seeker")}
                style={{
                  ...styles.tabButton,
                  background: activeTab === "seeker" ? "#0D9488" : "transparent",
                  color: activeTab === "seeker" ? "white" : "#4B5563",
                  fontWeight: activeTab === "seeker" ? "700" : "500",
                }}
              >
                <i className="fas fa-user-tie" style={{ marginRight: "8px" }}></i> For Job Seekers
              </button>
              <button 
                onClick={() => setActiveTab("recruiter")}
                style={{
                  ...styles.tabButton,
                  background: activeTab === "recruiter" ? "#0D9488" : "transparent",
                  color: activeTab === "recruiter" ? "white" : "#4B5563",
                  fontWeight: activeTab === "recruiter" ? "700" : "500",
                }}
              >
                <i className="fas fa-building" style={{ marginRight: "8px" }}></i> For Recruiters / Employers
              </button>
            </div>
          </div>

          {/* Tab Contents */}
          <div style={{ ...styles.workflowLayout, display: "flex", flexDirection: activeTab === "seeker" ? "row" : "row-reverse" }}>
            {/* Step list details */}
            <div style={styles.workflowDetails}>
              {activeTab === "seeker" ? (
                <>
                  <div style={styles.workflowStep}>
                    <div style={styles.stepNum}>1</div>
                    <div>
                      <h4 style={styles.stepTitle}>Build a Standout Profile</h4>
                      <p style={styles.stepDesc}>Highlight your skills, background, and availability. Set your preferences to enable recruiters to discover you directly.</p>
                    </div>
                  </div>
                  <div style={styles.workflowStep}>
                    <div style={styles.stepNum}>2</div>
                    <div>
                      <h4 style={styles.stepTitle}>Explore and Filter Recommendations</h4>
                      <p style={styles.stepDesc}>Browse thousands of listings. Leverage our advanced filter controls to find matches tailored to your exact salary, location, and experience metrics.</p>
                    </div>
                  </div>
                  <div style={styles.workflowStep}>
                    <div style={styles.stepNum}>3</div>
                    <div>
                      <h4 style={styles.stepTitle}>Quick-Apply with One Click</h4>
                      <p style={styles.stepDesc}>Submit structured applications instantly with pre-loaded resumes, work authorization, and customized questionnaires.</p>
                    </div>
                  </div>
                  <button onClick={() => handleGetStarted("user")} className="cta-primary" style={{ marginTop: "20px" }}>
                    Get Hired Now <i className="fas fa-arrow-right" style={{ marginLeft: "8px" }}></i>
                  </button>
                </>
              ) : (
                <>
                  <div style={styles.workflowStep}>
                    <div style={{ ...styles.stepNum, background: "#0F766E" }}>1</div>
                    <div>
                      <h4 style={styles.stepTitle}>Create and Upload Job Listings</h4>
                      <p style={styles.stepDesc}>Define job requirements, responsibilities, salary range, and candidate specifications in under five minutes.</p>
                    </div>
                  </div>
                  <div style={styles.workflowStep}>
                    <div style={{ ...styles.stepNum, background: "#0F766E" }}>2</div>
                    <div>
                      <h4 style={styles.stepTitle}>Manage Candidates Centrally</h4>
                      <p style={styles.stepDesc}>View candidates, filter applications, download resumes, and check candidate qualifications on a unified panel.</p>
                    </div>
                  </div>
                  <div style={styles.workflowStep}>
                    <div style={{ ...styles.stepNum, background: "#0F766E" }}>3</div>
                    <div>
                      <h4 style={styles.stepTitle}>Hire with Confidence</h4>
                      <p style={styles.stepDesc}>Directly engage qualified applicants, communicate terms, schedule interviews, and build your company presence.</p>
                    </div>
                  </div>
                  <button onClick={() => handleGetStarted("recruiter")} className="cta-primary" style={{ marginTop: "20px" }}>
                    Start Recruiting <i className="fas fa-arrow-right" style={{ marginLeft: "8px" }}></i>
                  </button>
                </>
              )}
            </div>

            {/* SVG/Animation Interactive Panel */}
            <div style={styles.workflowGraphicPanel}>
              {activeTab === "seeker" ? (
                /* Job Seeker interactive pipeline card */
                <div style={styles.interactivePipelineCard}>
                  <h4 style={{ margin: "0 0 20px 0", color: "#1E293B", fontSize: "15px", fontWeight: "700" }}>Application Progress Tracker</h4>
                  
                  {/* Timeline Nodes */}
                  <div style={styles.pipelineTimeline}>
                    <div style={styles.timelineNode}>
                      <div style={{ ...styles.timelineIconActive, background: "#0D9488" }}>
                        <i className="fas fa-paper-plane" style={{ fontSize: "11px", color: "white" }}></i>
                      </div>
                      <div style={styles.timelineContent}>
                        <p style={{ margin: "0", fontSize: "12px", fontWeight: "700", color: "#1E293B" }}>Submitted Application</p>
                        <p style={{ margin: "0", fontSize: "10px", color: "#64748B" }}>June 20, 2026</p>
                      </div>
                    </div>

                    <div style={styles.timelineLine}></div>

                    <div style={styles.timelineNode}>
                      <div style={{ ...styles.timelineIconActive, background: "#0D9488" }}>
                        <i className="fas fa-search" style={{ fontSize: "11px", color: "white" }}></i>
                      </div>
                      <div style={styles.timelineContent}>
                        <p style={{ margin: "0", fontSize: "12px", fontWeight: "700", color: "#1E293B" }}>Resume Screened</p>
                        <p style={{ margin: "0", fontSize: "10px", color: "#64748B" }}>Approved by HR Lead</p>
                      </div>
                    </div>

                    <div style={styles.timelineLine}></div>

                    <div style={styles.timelineNode}>
                      <div style={{ ...styles.timelineIconActive, background: "#0D9488", boxShadow: "0 0 10px rgba(13, 148, 136, 0.4)", animation: "pulseGlow 2s infinite" }}>
                        <i className="fas fa-calendar-check" style={{ fontSize: "11px", color: "white" }}></i>
                      </div>
                      <div style={styles.timelineContent}>
                        <p style={{ margin: "0", fontSize: "12px", fontWeight: "700", color: "#0D9488" }}>Interview Scheduled</p>
                        <p style={{ margin: "0", fontSize: "10px", color: "#64748B" }}>Technical panel round</p>
                      </div>
                    </div>

                    <div style={{ ...styles.timelineLine, background: "#E2E8F0" }}></div>

                    <div style={styles.timelineNode}>
                      <div style={{ ...styles.timelineIconActive, background: "#E2E8F0" }}>
                        <i className="fas fa-check" style={{ fontSize: "11px", color: "#94A3B8" }}></i>
                      </div>
                      <div style={styles.timelineContent}>
                        <p style={{ margin: "0", fontSize: "12px", fontWeight: "700", color: "#94A3B8" }}>Hired / Offered</p>
                        <p style={{ margin: "0", fontSize: "10px", color: "#94A3B8" }}>Awaiting final signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Recruiter interactive card showing list matching score */
                <div style={styles.interactivePipelineCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h4 style={{ margin: "0", color: "#1E293B", fontSize: "15px", fontWeight: "700" }}>Applicant Pool Matching</h4>
                    <span style={{ fontSize: "11px", background: "rgba(13, 148, 136, 0.1)", color: "#0D9488", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>AI Filter Active</span>
                  </div>

                  <div style={styles.candidateRow}>
                    <div style={styles.candidateAvatar}>AS</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "700", color: "#1E293B" }}>Alex Smith</p>
                      <p style={{ margin: "0", fontSize: "10px", color: "#64748B" }}>Skills: React, Redux, Node.js</p>
                    </div>
                    <div style={styles.scoreContainer}>
                      <span style={styles.scoreNum}>96%</span>
                      <span style={styles.scoreLabel}>Match Score</span>
                    </div>
                  </div>

                  <div style={styles.candidateRow}>
                    <div style={{ ...styles.candidateAvatar, background: "#EC4899" }}>MH</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "700", color: "#1E293B" }}>Maya Hansen</p>
                      <p style={{ margin: "0", fontSize: "10px", color: "#64748B" }}>Skills: Product Strategy, UX Design</p>
                    </div>
                    <div style={styles.scoreContainer}>
                      <span style={styles.scoreNum}>91%</span>
                      <span style={styles.scoreLabel}>Match Score</span>
                    </div>
                  </div>

                  <div style={styles.candidateRow}>
                    <div style={{ ...styles.candidateAvatar, background: "#3B82F6" }}>DC</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "700", color: "#1E293B" }}>David Chen</p>
                      <p style={{ margin: "0", fontSize: "10px", color: "#64748B" }}>Skills: AWS, Node.js, Express</p>
                    </div>
                    <div style={{ ...styles.scoreContainer, borderColor: "#FEF3C7" }}>
                      <span style={{ ...styles.scoreNum, color: "#D97706" }}>84%</span>
                      <span style={styles.scoreLabel}>Match Score</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section style={styles.categoriesSection}>
        <div style={styles.categoriesContainer}>
          <div style={styles.categoriesHeader}>
            <div className="pulse-badge">
              <span className="pulse-indicator"></span> Categorized Positions
            </div>
            <h2 style={styles.sectionTitle}>Explore Roles by Industry</h2>
            <p style={styles.sectionSubtitle}>
              Dive into your chosen workspace. Click any category to find jobs tailored to your skills.
            </p>
          </div>

          <div style={styles.categoriesGrid}>
            {jobCategories.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => handleCategoryClick(cat.searchQuery)}
                className="category-card"
              >
                <div className="cat-icon">
                  <i className={cat.icon}></i>
                </div>
                <h4 style={styles.categoryCardTitle}>{cat.name}</h4>
                <p style={styles.categoryCardCount}>{cat.jobsCount} Open Positions</p>
                <span style={styles.categoryCardLink}>
                  Explore jobs <i className="fas fa-arrow-right" style={{ marginLeft: "4px", fontSize: "11px" }}></i>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section style={styles.testimonialSection}>
        <div style={styles.testimonialContainer}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div className="pulse-badge" style={{ margin: "0 auto 20px" }}>
              <span className="pulse-indicator"></span> Success Stories
            </div>
            <h2 style={styles.sectionTitle}>What Our Users Say</h2>
          </div>

          <div style={styles.testimonialDisplay}>
            <div style={styles.testimonialCard}>
              <div style={styles.stars}>
                {[...Array(testimonials[activeTestimonial].stars)].map((_, i) => (
                  <i key={i} className="fas fa-star" style={{ color: "#FBBF24", marginRight: "4px" }}></i>
                ))}
              </div>
              <p style={styles.quote}>"{testimonials[activeTestimonial].quote}"</p>
              <div style={styles.userProfile}>
                <div style={styles.userAvatarSquare}>
                  {testimonials[activeTestimonial].name.substring(0, 2).toUpperCase()}
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={styles.profileName}>{testimonials[activeTestimonial].name}</p>
                  <p style={styles.profileRole}>{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Slider Dots */}
            <div style={styles.testimonialDots}>
              {testimonials.map((_, i) => (
                <span 
                  key={i} 
                  onClick={() => setActiveTestimonial(i)}
                  className={`testimonial-dot ${activeTestimonial === i ? "active" : ""}`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={styles.ctaBannerSection}>
        <div style={styles.ctaCardContainer}>
          <div style={styles.ctaCardLeft}>
            <div className="pulse-badge" style={{ marginBottom: "16px" }}>
              <span className="pulse-indicator"></span> Elevate Your Career
            </div>
            <h2 style={styles.ctaNewTitle}>Start your career leap today</h2>
            <p style={styles.ctaNewSubtitle}>
              Join thousands of professionals securing interviews and scaling recruiters hiring directly on JobNest.
            </p>
          </div>
          
          <div style={styles.ctaCardRight}>
            <div 
              onClick={() => handleGetStarted("user")} 
              style={styles.ctaActionCard}
              className="cta-action-card-hover"
            >
              <div style={styles.ctaActionIcon}>
                <i className="fas fa-briefcase"></i>
              </div>
              <div style={{ textAlign: "left" }}>
                <h4 style={styles.ctaActionTitle}>Find Your Dream Job</h4>
                <p style={styles.ctaActionDesc}>Browse 15k+ active listings and get matched with elite tech companies.</p>
              </div>
              <div style={styles.ctaArrow} className="cta-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>

            <div 
              onClick={() => handleGetStarted("recruiter")} 
              style={styles.ctaActionCard}
              className="cta-action-card-hover"
            >
              <div style={{ ...styles.ctaActionIcon, background: "rgba(15, 118, 110, 0.08)", color: "#0F766E" }}>
                <i className="fas fa-building"></i>
              </div>
              <div style={{ textAlign: "left" }}>
                <h4 style={{ ...styles.ctaActionTitle, color: "#0F766E" }}>Post a Position</h4>
                <p style={styles.ctaActionDesc}>Sponsor postings, screen candidates centrally, and hire qualified leaders.</p>
              </div>
              <div style={{ ...styles.ctaArrow, color: "#0F766E" }} className="cta-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div style={styles.footerColumnLogo}>
              <div style={styles.logoSection}>
                <div style={styles.logoCircle}>
                  <i className="fas fa-briefcase"></i>
                </div>
                <span style={{ ...styles.logoText, color: "#F8FAFC" }}>JobNest</span>
              </div>
              <p style={styles.footerText}>
                Elevating the job matching ecosystem with top-tier candidate tracking, recruiter workflow modules, and automated placements.
              </p>
              <div style={styles.socialRow}>
                <span style={styles.socialIcon}><i className="fab fa-twitter"></i></span>
                <span style={styles.socialIcon}><i className="fab fa-linkedin-in"></i></span>
                <span style={styles.socialIcon}><i className="fab fa-facebook-f"></i></span>
                <span style={styles.socialIcon}><i className="fab fa-instagram"></i></span>
              </div>
            </div>

            <div style={styles.footerColumn}>
              <h5 style={styles.footerColTitle}>For Job Seekers</h5>
              <span onClick={() => navigate("/jobs")} style={styles.footerLink}>Browse Jobs</span>
              <span onClick={() => navigate("/applications")} style={styles.footerLink}>My Applications</span>
              <span style={styles.footerLink}>Career Advice</span>
              <span style={styles.footerLink}>Salary Calculator</span>
            </div>

            <div style={styles.footerColumn}>
              <h5 style={styles.footerColTitle}>For Employers</h5>
              <span onClick={() => handleGetStarted("recruiter")} style={styles.footerLink}>Post a Job</span>
              <span style={styles.footerLink}>Sourcing Solutions</span>
              <span style={styles.footerLink}>Success Stories</span>
              <span style={styles.footerLink}>Pricing Plans</span>
            </div>

            <div style={styles.footerColumn}>
              <h5 style={styles.footerColTitle}>Company</h5>
              <span style={styles.footerLink}>About Us</span>
              <span style={styles.footerLink}>Contact Support</span>
              <span style={styles.footerLink}>Privacy Policy</span>
              <span style={styles.footerLink}>Terms of Service</span>
            </div>
          </div>

          <div style={styles.footerBottom}>
            <p style={styles.copyrightText}>&copy; 2026 JobNest Portal. All Rights Reserved. Designed carefully and professionally.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const jobCategories = [
  { name: "Software Development", icon: "fas fa-code", jobsCount: "4,821", searchQuery: "Developer" },
  { name: "Design & UX", icon: "fas fa-paint-brush", jobsCount: "1,290", searchQuery: "Designer" },
  { name: "Product Management", icon: "fas fa-tasks", jobsCount: "952", searchQuery: "Product Manager" },
  { name: "Marketing & Growth", icon: "fas fa-chart-line", jobsCount: "1,840", searchQuery: "Marketing" },
  { name: "Finance & Accounting", icon: "fas fa-wallet", jobsCount: "740", searchQuery: "Finance" },
  { name: "Customer Success", icon: "fas fa-headset", jobsCount: "1,120", searchQuery: "Customer" },
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Senior React Engineer @ Netflix",
    quote: "JobNest revolutionized my job search! Within 4 days of profile completion, I was headhunted by recruiters directly and landed a dream role with complete compensation parity.",
    stars: 5,
  },
  {
    name: "Marcus Vance",
    role: "Head of Talent Acquisition @ Stripe",
    quote: "The recruiter matching metrics are incredibly precise. Instead of reviewing hundreds of unaligned CVs, JobNest matches us instantly with high-scoring applicant cohorts. Outstanding experience.",
    stars: 5,
  },
  {
    name: "Aisha Patel",
    role: "UX Researcher @ Microsoft",
    quote: "The interface feels premium, and the transparency of the application tracker is top notch. You're never left in the dark about review states. Highly recommend to tech professionals.",
    stars: 5,
  },
];

const styles = {
  landingWrapper: {
    fontFamily: "'Lato', sans-serif",
    color: "#1E293B",
    background: "#F8FAFC",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  // Header styles
  header: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(16px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid rgba(229, 231, 235, 0.7)",
  },
  headerContainer: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoCircle: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "18px",
    boxShadow: "0 4px 6px rgba(13, 148, 136, 0.2)",
  },
  logoText: {
    fontWeight: "800",
    fontSize: "24px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },
  navMenu: {
    display: "flex",
    gap: "28px",
    alignItems: "center",
  },
  authButtons: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  welcomeUser: {
    fontSize: "14px",
    color: "#4B5563",
    marginRight: "8px",
  },

  // Hero section
  heroSection: {
    padding: "60px 24px",
    maxWidth: "1280px",
    margin: "0 auto",
    background: "radial-gradient(circle at top right, rgba(13, 148, 136, 0.05), transparent 60%)",
  },
  heroContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "48px",
    alignItems: "center",
  },
  heroContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "900",
    lineHeight: "1.15",
    color: "#0F172A",
    margin: "0 0 20px 0",
    letterSpacing: "-1.5px",
  },
  highlightText: {
    background: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "17px",
    lineHeight: "1.6",
    color: "#475569",
    margin: "0 0 32px 0",
  },
  searchContainer: {
    display: "flex",
    background: "white",
    borderRadius: "16px",
    padding: "8px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
    alignItems: "center",
    border: "1px solid #E2E8F0",
    width: "100%",
    gap: "8px",
    boxSizing: "border-box",
  },
  searchInputGroup: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    color: "#94A3B8",
    fontSize: "16px",
  },
  searchDivider: {
    width: "1px",
    height: "28px",
    background: "#E2E8F0",
  },
  popularTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "24px",
    alignItems: "center",
  },
  tagsLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748B",
    marginRight: "4px",
  },

  // Hero Graphic Layout
  heroGraphicWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  glassDashboard: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "520px",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  },
  dashboardHeader: {
    background: "rgba(241, 245, 249, 0.6)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid #E2E8F0",
  },
  windowDots: {
    display: "flex",
    gap: "6px",
  },
  windowDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  dashboardTitleText: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748B",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
  },
  dashSidebar: {
    background: "rgba(248, 250, 252, 0.6)",
    borderRight: "1px solid #E2E8F0",
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  dashSidebarItem: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#475569",
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  dashMain: {
    padding: "20px",
    background: "white",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  mainPanelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  mockJobRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    border: "1px solid #F1F5F9",
    borderRadius: "10px",
    transition: "transform 0.2s ease",
  },
  mockCompanyLogo: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "12px",
  },
  mockSalaryBadge: {
    background: "rgba(13, 148, 136, 0.08)",
    color: "#0D9488",
    padding: "2px 8px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },
  floatCard: {
    position: "absolute",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(8px)",
    borderRadius: "14px",
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
    border: "1px solid #E2E8F0",
    zIndex: 10,
    animation: "float 6s ease-in-out infinite",
  },
  floatCardIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#D1FAE5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },

  // Stats
  statsSection: {
    maxWidth: "1280px",
    margin: "0 auto 40px",
    padding: "0 24px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#0D9488",
    margin: "0 0 6px 0",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748B",
    margin: 0,
    fontWeight: "600",
  },

  // Workflow section
  workflowSection: {
    background: "#FFFFFF",
    padding: "80px 24px",
    borderTop: "1px solid #E2E8F0",
    borderBottom: "1px solid #E2E8F0",
  },
  workflowContainer: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  workflowHeader: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 48px",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 16px 0",
    letterSpacing: "-0.5px",
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "#64748B",
    lineHeight: "1.6",
    margin: 0,
  },
  tabContainer: {
    display: "inline-flex",
    background: "#F1F5F9",
    padding: "6px",
    borderRadius: "14px",
    marginTop: "24px",
    border: "1px solid #E2E8F0",
  },
  tabButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
  },
  workflowLayout: {
    alignItems: "center",
    gap: "60px",
    marginTop: "20px",
  },
  workflowDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    textAlign: "left",
  },
  workflowStep: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },
  stepNum: {
    width: "36px",
    height: "36px",
    background: "#0D9488",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    flexShrink: 0,
    boxShadow: "0 4px 10px rgba(13, 148, 136, 0.2)",
  },
  stepTitle: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1E293B",
  },
  stepDesc: {
    margin: "0",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#64748B",
  },
  workflowGraphicPanel: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  interactivePipelineCard: {
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "28px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
  },
  pipelineTimeline: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  timelineNode: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  timelineIconActive: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineContent: {
    textAlign: "left",
  },
  timelineLine: {
    width: "2px",
    height: "20px",
    background: "#0D9488",
    marginLeft: "13px",
  },
  candidateRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    background: "white",
    marginBottom: "10px",
  },
  candidateAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#0D9488",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
  },
  scoreContainer: {
    borderLeft: "1px solid #E2E8F0",
    paddingLeft: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  scoreNum: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#0D9488",
  },
  scoreLabel: {
    fontSize: "9px",
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "600",
  },

  // Categories
  categoriesSection: {
    padding: "80px 24px",
    background: "#F8FAFC",
  },
  categoriesContainer: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  categoriesHeader: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 48px",
  },
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },
  categoryCardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 6px 0",
    color: "#1E293B",
  },
  categoryCardCount: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 20px 0",
  },
  categoryCardLink: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0D9488",
  },

  // Testimonials
  testimonialSection: {
    padding: "80px 24px",
    background: "#FFFFFF",
    borderTop: "1px solid #E2E8F0",
  },
  testimonialContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  testimonialDisplay: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  testimonialCard: {
    textAlign: "center",
    padding: "20px 0",
  },
  stars: {
    marginBottom: "20px",
  },
  quote: {
    fontSize: "20px",
    lineHeight: "1.6",
    fontWeight: "500",
    fontStyle: "italic",
    color: "#334155",
    margin: "0 0 28px 0",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  userAvatarSquare: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
  },
  profileName: {
    margin: "0 0 2px 0",
    fontSize: "15px",
    fontWeight: "700",
    color: "#1E293B",
  },
  profileRole: {
    margin: "0",
    fontSize: "13px",
    color: "#64748B",
  },
  testimonialDots: {
    display: "flex",
    gap: "8px",
    marginTop: "24px",
  },

  // CTA call-out banner
  ctaBannerSection: {
    padding: "40px 24px 80px",
    background: "#F8FAFC",
  },
  ctaCardContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "#FFFFFF",
    borderRadius: "24px",
    border: "1px solid #E2E8F0",
    padding: "50px 48px",
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: "48px",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
    position: "relative",
    overflow: "hidden",
  },
  ctaCardLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
  },
  ctaNewTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 16px 0",
    lineHeight: "1.25",
    letterSpacing: "-0.5px",
  },
  ctaNewSubtitle: {
    fontSize: "16px",
    color: "#64748B",
    margin: 0,
    lineHeight: "1.6",
  },
  ctaCardRight: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  ctaActionCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "24px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  ctaActionIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(13, 148, 136, 0.08)",
    color: "#0D9488",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  ctaActionTitle: {
    margin: "0 0 4px 0",
    fontSize: "16.5px",
    fontWeight: "700",
    color: "#0D9488",
  },
  ctaActionDesc: {
    margin: 0,
    fontSize: "13.5px",
    color: "#64748B",
    lineHeight: "1.45",
  },
  ctaArrow: {
    fontSize: "16px",
    color: "#0D9488",
    marginLeft: "auto",
    transition: "transform 0.25s ease",
    flexShrink: 0,
  },

  // Footer
  footer: {
    background: "#0F172A",
    color: "#94A3B8",
    padding: "80px 24px 40px",
    borderTop: "1px solid #1E293B",
  },
  footerContainer: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr repeat(3, 1fr)",
    gap: "48px",
    marginBottom: "60px",
  },
  footerColumnLogo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "20px",
  },
  footerText: {
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0,
    textAlign: "left",
  },
  socialRow: {
    display: "flex",
    gap: "12px",
  },
  socialIcon: {
    width: "36px",
    height: "36px",
    background: "#1E293B",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#F8FAFC",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  footerColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "14px",
  },
  footerColTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#F8FAFC",
    margin: "0 0 4px 0",
  },
  footerLink: {
    fontSize: "14px",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  footerBottom: {
    borderTop: "1px solid #1E293B",
    paddingTop: "30px",
    textAlign: "center",
  },
  copyrightText: {
    fontSize: "13px",
    margin: 0,
  },
};

export default LandingPage;
