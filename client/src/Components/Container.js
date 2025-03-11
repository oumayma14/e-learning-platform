import { Home } from "./Home";
import { Navbar } from "./Navbar";
import { Topquiz } from "./Topquiz";

export const Container = () =>{
    const container={
        display:"flex",
        flexDirection:"column",
        margin:"0",
        padding:"0"
    }
    return(
        <div style={container}>
        <Navbar />
        <Home />
        <Topquiz />
        </div>
    );
}