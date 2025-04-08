import { Apropos } from "./Apropos";
import { Home } from "./Home";
import { Leaderboard } from "./Leaderboard";
import { Navbar } from "./Navbar";
import { Topquiz } from "./Topquiz";
import { Faq } from "./Faq";


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
        <Apropos />
        <Faq />
        <Topquiz />
        <Leaderboard />

        </div>
    );
}