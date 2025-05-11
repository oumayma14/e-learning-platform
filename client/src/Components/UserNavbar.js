import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import { Badge, Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { FaSearch, FaTrophy, FaComments, FaChartLine, FaBook} from 'react-icons/fa';
import '../Styles/UserNav.css';
import logo from '../assets/quizpop-high-resolution-logo-removebg-preview.png';
import DarkMode from './DarkMode/DarkMode'

const UserNavbar = () => {
  const { user, logout } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();
  const expand = 'md';

  const navLinks = [
    { path: '/dashboard', label: 'Accueil', exact: true, icon: <FaBook className="nav-icon" /> },
    {
      path: '/dashboard/catalogue/quiz-start', 
      label: 'Catalogue',
      icon: <FaSearch className="nav-icon" />,
    },
    {
      path: '/dashboard/progression',
      label: 'Progression',
      icon: <FaChartLine className="nav-icon" />,
      badge: user?.stats?.newAchievements,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <Navbar key={expand} expand={expand} sticky="top" style={{ backgroundColor: '#fe6363', color: '#ffffff' }}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" style={{ color: '#ffffff' }}>
          <img
            src={logo}
            alt="QuizPop Logo"
            height="40"
            width='auto'
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} style={{ backgroundColor: '#ffffff', color: '#fe6363' }} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
          style={{ backgroundColor: '#ffffff', color: '#515151' }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} style={{ color: '#515151' }}>
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
                    style={{ color: '#515151' }}
                  >
                    {link.subItems.map((sub) => (
                      <NavDropdown.Item
                        as={Link}
                        to={sub.path}
                        key={sub.path}
                        active={location.pathname === sub.path}
                        style={{ backgroundColor: '#ffffff', color: '#515151' }}
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
                    style={{ color: '#ffffff' }}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <Badge pill className="ms-2 new-badge" bg="dark" style={{ backgroundColor: '#be4d4d', color: '#ffffff' }}>
                        Nouveau!
                      </Badge>
                    )}
                  </Nav.Link>
                )
              )}
            </Nav>

            <div className="d-flex align-items-center gap-2 ms-auto user-actions mt-3 mt-md-0">
              <DarkMode />
              {user ? (
                <>
                  <div className="user-score" style={{ color: '#ffffff' }}>
                    <FaTrophy className="nav-icon" />
                    <strong>{user.score}</strong> pts
                  </div>

                  <UserProfile />
                </>
              ) : (
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
