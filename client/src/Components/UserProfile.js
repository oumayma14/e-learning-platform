// src/components/UserProfile.js
import { useAuth } from '../context/AuthContext';
import { Dropdown } from 'react-bootstrap';

const UserProfile = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-user">
                <img 
                    src={user.image || '/default-avatar.png'} 
                    alt={user.username} 
                    width="32" 
                    height="32" 
                    className="rounded-circle me-2"
                />
                <span>{user.username}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/profile">Mon Profil</Dropdown.Item>
                <Dropdown.Item href="/settings">Paramètres</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>Déconnexion</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default UserProfile;