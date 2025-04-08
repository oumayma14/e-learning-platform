import React, { useRef, useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { authService } from "../services/apiService";
import defaultAvatar from "../assets/default-avatar.png";
import "../Styles/UserNav.css";

const UserNavbar = () => {
  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState({
    name: "Chargement...",
    status: "offline",
    isPremium: false,
    avatar: defaultAvatar
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser({
          name: userData.name || userData.username,
          status: "online",
          isPremium: userData.isPremium || false,
          avatar: userData.image
            ? `${process.env.REACT_APP_API_URL}/uploads/${userData.image}`
            : defaultAvatar
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
        setUser({
          name: "Invité",
          status: "offline",
          isPremium: false,
          avatar: defaultAvatar
        });
      }
    };

    if (localStorage.getItem("token")) {
      fetchUserData();
    }
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [location]);

  // Toggle dropdown
  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className={`ultimate-header ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="logo-container">
          <Link to="/">
            <div className="logo-gradient">QuizPoP</div>
          </Link>
        </div>

        <nav ref={navRef} className="ultimate-nav">
          {/* Quizzes Dropdown */}
          <div
            className={`nav-item dropdown-container ${activeDropdown === "quizzes" ? "active" : ""}`}
            onMouseEnter={() => toggleDropdown("quizzes")}
            onMouseLeave={() => toggleDropdown("quizzes")}
          >
            <button className="nav-link" onClick={() => toggleDropdown("quizzes")}>
              <span>Découvrir</span>
            </button>
            <div className="mega-menu">
              <div className="mega-menu-content">
                <div className="mega-menu-section">
                  <h4>Par catégorie</h4>
                  <ul>
                    <li><Link to="/quizzes/technology">Technologie</Link></li>
                    <li><Link to="/quizzes/science">Science</Link></li>
                    <li><Link to="/quizzes/history">Histoire</Link></li>
                    <li><Link to="/quizzes/business">Business</Link></li>
                  </ul>
                </div>
                <div className="mega-menu-section">
                  <h4>Par difficulté</h4>
                  <ul>
                    <li><Link to="/quizzes/beginner">Débutant</Link></li>
                    <li><Link to="/quizzes/intermediate">Intermédiaire</Link></li>
                    <li><Link to="/quizzes/advanced">Avancé</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Link to="/leaderboard" className="nav-link">
            <span>Classement</span>
          </Link>

          {/* Community Dropdown */}
          <div
            className={`nav-item dropdown-container ${activeDropdown === "community" ? "active" : ""}`}
            onMouseEnter={() => toggleDropdown("community")}
            onMouseLeave={() => toggleDropdown("community")}
          >
            <button className="nav-link" onClick={() => toggleDropdown("community")}>
              <span>Communauté</span>
            </button>
            <div className="dropdown-menu">
              <Link to="/forum" className="dropdown-item">Forum de discussion</Link>
              <Link to="/groups" className="dropdown-item">Groupes d'étude</Link>
              <Link to="/events" className="dropdown-item">Événements en direct</Link>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="user-nav-section">
            <div
              className={`nav-item dropdown-container ${activeDropdown === "user" ? "active" : ""}`}
              onMouseEnter={() => toggleDropdown("user")}
              onMouseLeave={() => toggleDropdown("user")}
            >
              <button className="user-profile-btn" onClick={() => toggleDropdown("user")}>
                <div className="user-avatar-wrapper">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-avatar"
                    onError={(e) => (e.target.src = defaultAvatar)}
                  />
                  <span className={`user-status ${user.status}`}></span>
                </div>
                <span className="user-name">{user.name}</span>
                {user.isPremium && <span className="premium-badge">Premium</span>}
              </button>

              <div className="dropdown-menu user-menu">
                <div className="user-menu-header">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    onError={(e) => (e.target.src = defaultAvatar)}
                  />
                  <div>
                    <h5>{user.name}</h5>
                    <p>{user.isPremium ? "Membre Premium" : "Membre Standard"}</p>
                  </div>
                </div>

                <div className="user-menu-body">
                  <Link to="/profile" className="dropdown-item">Mon profil</Link>
                  <Link to="/settings" className="dropdown-item">Paramètres du compte</Link>
                  <Link to="/progress" className="dropdown-item">Ma progression</Link>
                  <Link to="/achievements" className="dropdown-item">Mes succès</Link>
                </div>

                <div className="user-menu-footer">
                  {!user.isPremium && (
                    <Button variant="outline-primary" size="sm">
                      Passer à Premium
                    </Button>
                  )}
                  {user.status === "online" ? (
                    <button className="logout-btn" onClick={handleLogout}>
                      Déconnexion
                    </button>
                  ) : (
                    <Link to="/login" className="login-btn">
                      Connexion
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button className="nav-btn nav-close-btn" onClick={showNavbar}>×</button>
        </nav>

        <button className="nav-btn" onClick={showNavbar}>☰</button>
      </div>
    </header>
  );
};

export default UserNavbar;
