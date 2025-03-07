import { Navbar } from "./Navbar";
/**Styles */

export const Home = () => {

    return (
        <div className="home" style={{
            backgroundColor: '#f0f0f0', height: "100vh"
        }}>
            <Navbar />
            <h1>home Component</h1>
      </div>
    );
}