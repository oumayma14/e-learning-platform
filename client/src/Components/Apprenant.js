import { Home } from "./Home";
import { Topquiz } from "./Topquiz";
import { Leaderboard } from "./Leaderboard";
import UserNavbar from "./UserNavbar";
import { Routes, Route } from "react-router-dom";
import MyProfile from "./MyProfile";

export const Apprenant = () => {
    return(
        <> 
            <UserNavbar />
            <Routes>
                <Route index element={<><Home /><Topquiz /><Leaderboard /></>} />
                <Route path="testprofile" element={<MyProfile />} />
            </Routes>
        </>
    )
}