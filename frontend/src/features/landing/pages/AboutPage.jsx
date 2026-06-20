// features/landing/pages/AboutPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setIsLoaded(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (token) {
      navigate(userRole === "recruiter" ? "/recruiter/jobs" : "/jobs");
    } else {
      navigate("/register");
    }
  };

  return (
    <div style={styles.aboutWrapper}>
      {/* Global CSS Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes hoverCardGlow {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          }
          50% {
            box-shadow: 0 10px 30px rgba(13, 148, 136, 0.12);
          }
        }

        .about-animate-fade {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .nav-link-about {
          color: #4B5563;
          font-weight: 500;
          font-size: 15px;
          transition: all 0.2s ease;
          position: relative;
          cursor: pointer;
        }
        .nav-link-about::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: #0D9488;
          transition: width 0.2s ease;
        }
        .nav-link-about:hover {
          color: #0D9488;
        }
        .nav-link-about:hover::after {
          width: 100%;
        }

        .btn-brand-primary {
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
        .btn-brand-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 148, 136, 0.5);
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
        }

        .btn-brand-secondary {
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
        .btn-brand-secondary:hover {
          background: rgba(13, 148, 136, 0.08);
          transform: translateY(-2px);
          border-color: #0D9488;
        }

        .value-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 30px 24px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .value-card:hover {
          transform: translateY(-6px);
          border-color: #0D9488;
          box-shadow: 0 12px 30px rgba(13, 148, 136, 0.08);
        }

        .value-icon {
          width: 56px;
          height: 56px;
          background: rgba(13, 148, 136, 0.08);
          color: #0D9488;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin: 0 auto 20px;
          transition: all 0.3s ease;
        }
        .value-card:hover .value-icon {
          background: #0D9488;
          color: white;
          transform: scale(1.1);
        }

        .team-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .team-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
          border-color: #CBD5E1;
        }

        .team-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          margin: 0 auto 16px;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .team-card:hover .team-avatar {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(13, 148, 136, 0.2);
        }

        .team-social-icon {
          width: 32px;
          height: 32px;
          background: #F1F5F9;
          color: #64748B;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .team-social-icon:hover {
          background: #0D9488;
          color: white;
        }

        .milestone-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0D9488;
          border: 4px solid white;
          box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.2);
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .slide-indicator-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #CBD5E1;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .slide-indicator-dot.active {
          background: #0D9488;
          width: 24px;
          border-radius: 10px;
        }

        .about-badge {
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
      `}</style>

      {/* RENDER HEADER ONLY IF USER IS NOT LOGGED IN */}
      {!token && (
        <header style={styles.header}>
          <div style={styles.headerContainer}>
            <div style={styles.logoSection} onClick={() => navigate("/")}>
              <div style={styles.logoCircle}>
                <i className="fas fa-briefcase"></i>
              </div>
              <span style={styles.logoText}>JobNest</span>
            </div>

            <nav style={styles.navMenu}>
              <span onClick={() => navigate("/jobs")} className="nav-link-about">Find Jobs</span>
              <span onClick={() => navigate("/")} className="nav-link-about">Home</span>
              <span onClick={() => navigate("/about")} className="nav-link-about" style={{ color: "#0D9488" }}>About Us</span>
            </nav>

            <div style={styles.authButtons}>
              <button 
                onClick={() => navigate("/login")} 
                className="btn-brand-secondary"
                style={{ padding: "10px 22px", border: "none" }}
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate("/register")} 
                className="btn-brand-primary"
                style={{ padding: "10px 22px" }}
              >
                Join Now
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section style={{ ...styles.heroSection, paddingTop: token ? "40px" : "80px" }}>
        <div style={styles.heroContainer} className="about-animate-fade">
          <div className="about-badge">Our Story</div>
          <h1 style={styles.heroTitle}>
            Redefining Career Connections <br />
            with <span style={styles.highlightText}>JobNest</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Founded in 2026, JobNest was built to eliminate friction in the employment cycle. We connect elite job seekers with high-growth organizations through highly localized talent matchmaking, candidate pipelines, and transparent employer hubs.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section style={styles.missionSection}>
        <div style={styles.gridContainer}>
          <div style={styles.missionCard} className="about-animate-fade" style={{ animationDelay: "0.2s" }}>
            <div style={styles.missionIcon}><i className="fas fa-bullseye"></i></div>
            <h3 style={styles.cardTitle}>Our Mission</h3>
            <p style={styles.cardDesc}>
              To empower professionals globally by granting direct, transparent access to career-defining roles, and providing employers with intuitive, automated tools to attract, qualify, and hire top-tier talent.
            </p>
          </div>

          <div style={styles.missionCard} className="about-animate-fade" style={{ animationDelay: "0.4s" }}>
            <div style={{ ...styles.missionIcon, background: "rgba(15, 118, 110, 0.08)", color: "#0F766E" }}><i className="fas fa-eye"></i></div>
            <h3 style={styles.cardTitle}>Our Vision</h3>
            <p style={styles.cardDesc}>
              To establish the world's most trusted, highly efficient career coordination network. A unified portal where skills speak louder than status, and recruiting cycles are reduced from weeks to minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones / Core Metrics Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="about-badge">JobNest by the numbers</div>
            <h2 style={styles.sectionTitle}>Milestones We've Achieved</h2>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>15k+</span>
              <span style={styles.statLabel}>Active Seekers</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>3.8k+</span>
              <span style={styles.statLabel}>Verified Employers</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>280k</span>
              <span style={styles.statLabel}>Applications Tracked</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>98.2%</span>
              <span style={styles.statLabel}>Placement Success</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section style={styles.valuesSection}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="about-badge">Core Pillars</div>
            <h2 style={styles.sectionTitle}>What We Stand For</h2>
            <p style={styles.sectionSubtitle}>These principles guide every feature we ship and every match we make.</p>
          </div>

          <div style={styles.valuesGrid}>
            <div className="value-card">
              <div className="value-icon"><i className="fas fa-shield-alt"></i></div>
              <h4 style={styles.valueCardTitle}>Uncompromised Trust</h4>
              <p style={styles.valueCardDesc}>We verify every employer and listing to guarantee a spam-free, secure application workspace.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><i className="fas fa-bolt"></i></div>
              <h4 style={styles.valueCardTitle}>Maximum Efficiency</h4>
              <p style={styles.valueCardDesc}>Our quick-apply schemas and screening grids eliminate bloated pipelines for faster decisions.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><i className="fas fa-handshake"></i></div>
              <h4 style={styles.valueCardTitle}>True Transparency</h4>
              <p style={styles.valueCardDesc}>We keep seekers fully updated on their application status at every phase—no more ghosting.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><i className="fas fa-users"></i></div>
              <h4 style={styles.valueCardTitle}>Inclusivity & Growth</h4>
              <p style={styles.valueCardDesc}>We build accessible features to foster equal career opportunity for all skill levels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Testimonials Section */}
      <section style={styles.testimonialsSection}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="about-badge">Testimonials</div>
            <h2 style={styles.sectionTitle}>Ecosystem Validation</h2>
            <p style={styles.sectionSubtitle}>Hear directly from the companies scaling and seekers climbing on JobNest.</p>
          </div>

          {/* Testimonial Carousel Card */}
          <div style={styles.testimonialSliderWrapper}>
            <div style={styles.testimonialSliderCard}>
              <div style={styles.ratingRow}>
                {[...Array(testimonials[activeTestimonial].stars)].map((_, i) => (
                  <i key={i} className="fas fa-star" style={{ color: "#FBBF24", marginRight: "4px" }}></i>
                ))}
              </div>
              <p style={styles.testimonialQuote}>"{testimonials[activeTestimonial].quote}"</p>
              
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>
                  {testimonials[activeTestimonial].name.substring(0,2).toUpperCase()}
                </div>
                <div style={{ textAlign: "left" }}>
                  <h4 style={styles.authorName}>{testimonials[activeTestimonial].name}</h4>
                  <p style={styles.authorRole}>{testimonials[activeTestimonial].role}</p>
                </div>
                <div style={styles.authorCompanyBadge}>
                  {testimonials[activeTestimonial].company}
                </div>
              </div>
            </div>

            {/* Carousel Dots */}
            <div style={styles.sliderDots}>
              {testimonials.map((_, i) => (
                <span 
                  key={i} 
                  onClick={() => setActiveTestimonial(i)}
                  className={`slide-indicator-dot ${activeTestimonial === i ? "active" : ""}`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Leadership Section */}
      <section style={styles.teamSection}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="about-badge">The Team</div>
            <h2 style={styles.sectionTitle}>Driven Leaders</h2>
            <p style={styles.sectionSubtitle}>Meet the core builders mapping the future of recruitments.</p>
          </div>

          <div style={styles.teamGrid}>
            <div className="team-card">
              <div className="team-avatar">JD</div>
              <h4 style={styles.teamName}>Jonathan Doe</h4>
              <p style={styles.teamRole}>CEO & Co-Founder</p>
              <div style={{ marginTop: "12px" }}>
                <span className="team-social-icon"><i className="fab fa-linkedin-in"></i></span>
                <span className="team-social-icon"><i className="fab fa-twitter"></i></span>
              </div>
            </div>

            <div className="team-card">
              <div className="team-avatar" style={{ background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)" }}>AS</div>
              <h4 style={styles.teamName}>Amara Singh</h4>
              <p style={styles.teamRole}>Chief Technology Officer</p>
              <div style={{ marginTop: "12px" }}>
                <span className="team-social-icon"><i className="fab fa-linkedin-in"></i></span>
                <span className="team-social-icon"><i className="fab fa-github"></i></span>
              </div>
            </div>

            <div className="team-card">
              <div className="team-avatar" style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)" }}>RL</div>
              <h4 style={styles.teamName}>Robert Lin</h4>
              <p style={styles.teamRole}>VP of Product Design</p>
              <div style={{ marginTop: "12px" }}>
                <span className="team-social-icon"><i className="fab fa-linkedin-in"></i></span>
                <span className="team-social-icon"><i className="fab fa-dribbble"></i></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaBanner}>
          <h2 style={styles.ctaBannerTitle}>Experience JobNest today</h2>
          <p style={styles.ctaBannerSubtitle}>Join verified seekers and recruiters building active matching grids right now.</p>
          <button onClick={handleGetStarted} className="btn-brand-primary" style={{ background: "white", color: "#0D9488" }}>
            {token ? "Go to Dashboard" : "Create Free Account"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div style={styles.footerColMain}>
              <div style={styles.logoSection}>
                <div style={styles.logoCircle}>
                  <i className="fas fa-briefcase"></i>
                </div>
                <span style={{ ...styles.logoText, color: "#F8FAFC" }}>JobNest</span>
              </div>
              <p style={styles.footerText}>
                Elevating career matching standards globally. Streamlining job tracking and recruitment screening pipelines.
              </p>
            </div>
            <div style={styles.footerCol}>
              <h5 style={styles.footerColTitle}>Navigation</h5>
              <span onClick={() => navigate("/")} style={styles.footerLink}>Home</span>
              <span onClick={() => navigate("/jobs")} style={styles.footerLink}>Find Jobs</span>
              <span onClick={() => navigate("/about")} style={styles.footerLink}>About Us</span>
            </div>
            <div style={styles.footerCol}>
              <h5 style={styles.footerColTitle}>Ecosystem</h5>
              <span onClick={handleGetStarted} style={styles.footerLink}>Dashboard</span>
              <span style={styles.footerLink}>Privacy Policy</span>
              <span style={styles.footerLink}>Terms of Service</span>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={{ fontSize: "13px", margin: 0 }}>&copy; 2026 JobNest Portal. Designed carefully and professionally.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const testimonials = [
  {
    quote: "Finding qualified candidates with specific engineering skill sets used to require weeks of screening. JobNest's automated scorecard matching reduced our recruitment loop to exactly three days.",
    name: "Helena Rostova",
    role: "Director of Engineering",
    company: "Stripe",
    stars: 5
  },
  {
    quote: "The interface makes tracking your applications completely transparent. I received updates on resume review and interview schedules directly, removing all anxiety from the process.",
    name: "Akash Mehta",
    role: "Senior Full Stack Seeker",
    company: "Job Seeker",
    stars: 5
  },
  {
    quote: "JobNest has become our primary source for talent acquisition. The platform's layout is visually stunning, clean, and highly intuitive for candidate reviews.",
    name: "Tariq Vance",
    role: "Lead Tech Recruiter",
    company: "Meta Platforms",
    stars: 5
  }
];

const styles = {
  aboutWrapper: {
    fontFamily: "'Lato', sans-serif",
    color: "#1E293B",
    background: "#F8FAFC",
    minHeight: "100vh",
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

  // Hero Section
  heroSection: {
    padding: "60px 24px 40px",
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
  },
  heroContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: "44px",
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: "1.2",
    letterSpacing: "-1px",
    margin: "0 0 20px 0",
  },
  highlightText: {
    background: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "17px",
    color: "#475569",
    lineHeight: "1.6",
    maxWidth: "800px",
    margin: 0,
  },

  // Mission
  missionSection: {
    padding: "40px 24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  missionCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "36px 30px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.02)",
    textAlign: "left",
  },
  missionIcon: {
    width: "48px",
    height: "48px",
    background: "rgba(13, 148, 136, 0.08)",
    color: "#0D9488",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: "24px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1E293B",
    margin: "0 0 12px 0",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#64748B",
    lineHeight: "1.65",
    margin: 0,
  },

  // Stats
  statsSection: {
    background: "#FFFFFF",
    padding: "80px 24px",
    borderTop: "1px solid #E2E8F0",
    borderBottom: "1px solid #E2E8F0",
  },
  statsContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 12px 0",
    letterSpacing: "-0.5px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#0D9488",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748B",
  },

  // Values
  valuesSection: {
    padding: "80px 24px",
    background: "#F8FAFC",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "#64748B",
    maxWidth: "500px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    marginTop: "48px",
  },
  valueCardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1E293B",
    margin: "0 0 8px 0",
  },
  valueCardDesc: {
    fontSize: "13px",
    color: "#64748B",
    lineHeight: "1.6",
    margin: 0,
  },

  // Testimonials
  testimonialsSection: {
    background: "#FFFFFF",
    padding: "80px 24px",
    borderTop: "1px solid #E2E8F0",
    borderBottom: "1px solid #E2E8F0",
  },
  testimonialSliderWrapper: {
    maxWidth: "750px",
    margin: "32px auto 0",
    textAlign: "center",
  },
  testimonialSliderCard: {
    background: "rgba(248, 250, 252, 0.7)",
    border: "1px solid #E2E8F0",
    borderRadius: "24px",
    padding: "40px 36px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
    position: "relative",
  },
  ratingRow: {
    marginBottom: "20px",
  },
  testimonialQuote: {
    fontSize: "18px",
    fontWeight: "500",
    fontStyle: "italic",
    lineHeight: "1.65",
    color: "#334155",
    margin: "0 0 32px 0",
  },
  testimonialAuthor: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
  },
  authorAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
  },
  authorName: {
    margin: "0 0 2px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#1E293B",
  },
  authorRole: {
    margin: "0",
    fontSize: "12px",
    color: "#64748B",
  },
  authorCompanyBadge: {
    marginLeft: "auto",
    background: "rgba(13, 148, 136, 0.08)",
    color: "#0D9488",
    padding: "4px 12px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "700",
  },
  sliderDots: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    marginTop: "24px",
  },

  // Team
  teamSection: {
    padding: "80px 24px",
    background: "#F8FAFC",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
    marginTop: "48px",
  },
  teamName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1E293B",
    margin: "0 0 2px 0",
  },
  teamRole: {
    fontSize: "13px",
    color: "#64748B",
    margin: 0,
  },

  // CTA
  ctaSection: {
    padding: "0 24px 60px",
    background: "#F8FAFC",
  },
  ctaBanner: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)",
    borderRadius: "24px",
    padding: "50px 40px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 20px 40px rgba(13, 148, 136, 0.15)",
  },
  ctaBannerTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 12px 0",
  },
  ctaBannerSubtitle: {
    fontSize: "16px",
    opacity: 0.9,
    margin: "0 auto 28px",
    maxWidth: "500px",
    lineHeight: "1.6",
  },

  // Footer
  footer: {
    background: "#0F172A",
    color: "#94A3B8",
    padding: "60px 24px 30px",
    borderTop: "1px solid #1E293B",
  },
  footerContainer: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "2fr repeat(2, 1fr)",
    gap: "48px",
    marginBottom: "40px",
  },
  footerColMain: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "16px",
  },
  footerText: {
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0,
    textAlign: "left",
  },
  footerCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "12px",
  },
  footerLink: {
    fontSize: "14px",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  footerBottom: {
    borderTop: "1px solid #1E293B",
    paddingTop: "24px",
    textAlign: "center",
  },
};

export default AboutPage;
