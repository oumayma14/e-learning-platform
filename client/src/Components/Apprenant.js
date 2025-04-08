import { Home } from "./Home";
import { Topquiz } from "./Topquiz";
import { Leaderboard } from "./Leaderboard";
import  UserNavbar  from "./UserNavbar";

export const Apprenant = () => {
    return(
        <> 
        <UserNavbar />
        <Home />
        <Topquiz />
        <Leaderboard />
        </>

    )
}