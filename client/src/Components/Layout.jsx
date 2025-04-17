// Layout.jsx
import UserNavbar from "./UserNavbar";
import {Footer} from "./Footer"; 

export const Layout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%'
    }}>
      <UserNavbar />
      
      <main style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto'
      }}>
        {children}
      </main>
      
    </div>
  );
};