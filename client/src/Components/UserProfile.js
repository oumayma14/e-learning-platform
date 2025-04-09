import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dropdown } from 'react-bootstrap';
import defaultAvatar from "../assets/default-avatar.png";
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const apiUrl = process.env.REACT_APP_API_URL;
    const uploadsPath = process.env.REACT_APP_UPLOADS_PATH;

    const imageUrl = user.image 
        ? `${apiUrl}${uploadsPath}/${user.image}`
        : defaultAvatar;

    return (
        <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-user">
                <img 
                    src={imageUrl}
                    alt="Profil"
                    width="32" 
                    height="32" 
                    className="rounded-circle me-2"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = defaultAvatar;
                    }} 
                />
                <span>{user.username}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item as={Link} to="testprofile">
            Mon Profil
            </Dropdown.Item>
                <Dropdown.Item href="/settings">Paramètres</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Déconnexion</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default UserProfile;