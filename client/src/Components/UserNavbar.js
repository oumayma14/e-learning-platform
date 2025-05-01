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
  console.log('user navbar =>', JSON.stringify(user, null, 2));
  console.log('User fetched from database =>', user);


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
      <Navbar.Brand as={Link} to="/dashboard">
      <img
        src={logo}
        alt="QuizPop Logo"
        height="40"
        width='auto'
        className="d-inline-block align-top"
      />
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
              <DarkMode />
              {user ? (
                <>
                  <div className="user-score" style={{color: 'white'}}>
                    <FaTrophy className="nav-icon" />
                    <strong >{user.score}</strong> pts
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