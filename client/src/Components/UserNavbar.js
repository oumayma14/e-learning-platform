import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import { Badge, Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { FaSearch, FaTrophy, FaComments, FaChartLine, FaBook, FaUserCircle } from 'react-icons/fa';
import '../Styles/UserNav.css';

const UserNavbar = () => {
  const { user, logout } = useAuth(); // Assuming logout function is available in the context
  const location = useLocation();
  const navigate = useNavigate();
  const expand = 'md';

  const navLinks = [
    { path: '/dashboard', label: 'Accueil', exact: true, icon: <FaBook className="nav-icon" /> },
    {
      path: '/quiz',
      label: 'Catalogue',
      icon: <FaSearch className="nav-icon" />,
      subItems: [
        { path: '/quiz/recherche', label: 'Recherche avancée' },
        { path: '/quiz/thematiques', label: 'Par Thématique' },
        { path: '/quiz/niveaux', label: 'Par Niveau' },
      ],
    },
    {
      path: '/progress',
      label: 'Progression',
      icon: <FaChartLine className="nav-icon" />,
      badge: user?.stats?.newAchievements,
    },
    {
      path: '/classement',
      label: 'Classements',
      icon: <FaTrophy className="nav-icon" />,
      subItems: [
        { path: '/classement/global', label: 'Global' },
        { path: '/classement/defis', label: 'Défis en cours' },
        { path: '/classement/amis', label: 'Entre amis' },
      ],
    },
    {
      path: '/forum',
      label: 'Communauté',
      icon: <FaComments className="nav-icon" />,
      subItems: [
        { path: '/forum/discussions', label: 'Discussions' },
        { path: '/forum/messagerie', label: 'Messagerie' },
        { path: '/forum/experiences', label: 'Expériences' },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the homepage
  };

  return (
    <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3" sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          QuizMaster
          {user?.badgeCount > 0 && (
            <Badge pill className="ms-2 notification-badge">
              {user.badgeCount}
            </Badge>
          )}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-start flex-grow-1 pe-3">
              {navLinks.map((link) =>
                link.subItems ? (
                  <NavDropdown
                    key={link.path}
                    title={
                      <>
                        {link.icon}
                        <span>{link.label}</span>
                      </>
                    }
                    id={`offcanvasNavbarDropdown-${link.label}`}
                    className="nav-dropdown"
                  >
                    {link.subItems.map((sub) => (
                      <NavDropdown.Item
                        as={Link}
                        to={sub.path}
                        key={sub.path}
                        active={location.pathname === sub.path}
                      >
                        {sub.label}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                ) : (
                  <Nav.Link
                    as={NavLink}
                    to={link.path}
                    end={link.exact}
                    key={link.path}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <Badge pill className="ms-2 new-badge">
                        Nouveau!
                      </Badge>
                    )}
                  </Nav.Link>
                )
              )}
            </Nav>

            <div className="d-flex align-items-center gap-2 ms-auto user-actions mt-3 mt-md-0">
              {user ? (
                <>
                  <UserProfile />
                </>
              ) : (
                // Removed the Connexion and Inscription buttons
                null
              )}
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
