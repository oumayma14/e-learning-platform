import { Link } from 'react-router-dom';  // Removed the trailing /
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';

const UserNavbar = () => {
    const { user } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Mon App
                </Link>
                
                <div className="d-flex align-items-center">
                    {user ? (
                        <UserProfile />
                    ) : (
                        <Link 
                            to="/connecter" 
                            className="btn btn-outline-primary"
                            aria-label="Se connecter"
                        >
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;  