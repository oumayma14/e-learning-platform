import UserNavbar from "./UserNavbar";
export const Layout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      width: '100vw',  
      margin: 0,       
      padding: 0,       
      overflowX: 'hidden' 
    }}>
      <UserNavbar />
      
      <main style={{
        flex: 1,
        overflowY: 'auto',
        width: '100vw', 
      }}>
        {children}
      </main>
    </div>
  );
};