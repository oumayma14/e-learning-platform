import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import { Badge } from 'react-bootstrap';
import { 
  FaSearch, 
  FaTrophy, 
  FaComments, 
  FaChartLine, 
  FaBook,
  FaBell,
  FaUserCircle
} from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import '../Styles/UserNav.css';

const UserNavbar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navbarRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const StandardIcon = ({ icon: Icon }) => (
        <Icon className="nav-icon" />
    );

    const navLinks = [
        { path: '/', label: 'Accueil', exact: true, icon: <StandardIcon icon={FaBook} /> },
        { 
            path: '/quiz', 
            label: 'Catalogue', 
            icon: <StandardIcon icon={FaSearch} />,
            subItems: [
                { path: '/quiz/recherche', label: 'Recherche avancée' },
                { path: '/quiz/thematiques', label: 'Par Thématique' },
                { path: '/quiz/niveaux', label: 'Par Niveau de difficulté' }
            ]
        },
        { 
            path: '/progress', 
            label: 'Progression', 
            icon: <StandardIcon icon={FaChartLine} />,
            badge: user?.stats?.newAchievements 
        },
        { 
            path: '/classement', 
            label: 'Classements', 
            icon: <StandardIcon icon={FaTrophy} />,
            subItems: [
                { path: '/classement/global', label: 'Classement global' },
                { path: '/classement/defis', label: 'Défis en cours' },
                { path: '/classement/amis', label: 'Entre amis' }
            ]
        },
        { 
            path: '/forum', 
            label: 'Communauté', 
            icon: <StandardIcon icon={FaComments} />,
            subItems: [
                { path: '/forum/discussions', label: 'Forum de discussion' },
                { path: '/forum/messagerie', label: 'Messagerie privée' },
                { path: '/forum/experiences', label: 'Partages d\'expérience' }
            ]
        }
    ];

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <nav 
            ref={navbarRef}
            className={`navbar navbar-expand-lg ${scrolled ? 'scrolled' : ''}`}
            aria-label="Main navigation"
        >
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <span className="logo-text">QuizMaster</span>
                    {user?.badgeCount > 0 && (
                        <Badge pill className="ms-2 notification-badge">
                            {user.badgeCount}
                        </Badge>
                    )}
                </Link>

                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {navLinks.map((link, index) => (
                            <li 
                                className={`nav-item dropdown ${link.subItems ? 'dropdown-hover' : ''}`} 
                                key={link.path}
                                onMouseEnter={() => link.subItems && setActiveDropdown(index)}
                                onMouseLeave={() => link.subItems && activeDropdown === index && setActiveDropdown(null)}
                            >
                                <NavLink 
                                    className={({ isActive }) => 
                                        `nav-link ${isActive ? 'active' : ''}`
                                    }
                                    to={link.path}
                                    end={link.exact}
                                    onClick={() => link.subItems && toggleDropdown(index)}
                                    aria-haspopup={link.subItems ? "true" : "false"}
                                    aria-expanded={activeDropdown === index ? "true" : "false"}
                                >
                                    <span className="nav-content">
                                        {link.icon}
                                        <span className="nav-text">{link.label}</span>
                                        {link.badge && (
                                            <Badge pill className="ms-2 new-badge">
                                                Nouveau!
                                            </Badge>
                                        )}
                                    </span>
                                </NavLink>
                                
                                {link.subItems && (
                                    <ul 
                                        className={`dropdown-menu ${activeDropdown === index ? 'show' : ''}`}
                                        aria-labelledby={`dropdown-${index}`}
                                    >
                                        {link.subItems.map((subItem) => (
                                            <li key={subItem.path}>
                                                <Link 
                                                    className={`dropdown-item ${location.pathname === subItem.path ? 'active' : ''}`}
                                                    to={subItem.path}
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-3 ms-auto">
                        {user ? (
                            <>
                                <Link 
                                    to="/notifications" 
                                    className="btn notification-btn position-relative"
                                    aria-label="Notifications"
                                >
                                    <StandardIcon icon={FaBell} />
                                    {user.unreadNotifications > 0 && (
                                        <Badge pill className="position-absolute notification-count">
                                            {user.unreadNotifications}
                                        </Badge>
                                    )}
                                </Link>
                                <UserProfile />
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/connecter" 
                                    className="btn login-btn"
                                    aria-label="Se connecter"
                                >
                                    <span className="d-none d-md-inline">Connexion</span>
                                    <StandardIcon icon={FaUserCircle} className="d-md-none" />
                                </Link>
                                <Link 
                                    to="/inscrire" 
                                    className="btn signup-btn"
                                    aria-label="S'inscrire"
                                >
                                    <span className="d-none d-md-inline">Inscription</span>
                                    <StandardIcon icon={FaUserCircle} className="d-md-none" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;