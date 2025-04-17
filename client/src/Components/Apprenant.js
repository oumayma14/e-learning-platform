import { Home } from "./Home";
import { Topquiz } from "./Topquiz";
import { Leaderboard } from "./Leaderboard";
import { Routes, Route } from "react-router-dom";
import MyProfile from "./MyProfile";
import QuizzesArea from "./QuizzesArea";
import { QuizStart } from "./QuizStart";
import { Layout } from "./Layout"; 

export const Apprenant = () => {
    return (
        <Layout>
            <Routes>
                <Route index element={<><Home /><Topquiz /><Leaderboard /></>} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="catalogue" element={<QuizzesArea />} />
                <Route path="catalogue/quiz-start/*" element={<QuizStart />} />
            </Routes>
        </Layout>
    )
}