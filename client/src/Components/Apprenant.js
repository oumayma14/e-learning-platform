import { Home } from "./Home";
import { Topquiz } from "./Topquiz";
import { Leaderboard } from "./Leaderboard";
import { Routes, Route } from "react-router-dom";
import MyProfile from "./MyProfile";
import { QuizStart } from "./QuizStart";
import { Layout } from "./Layout";
import ProgressChart from "./ProgressCHart";

export const Apprenant = () => {
  return (
    <Layout>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route
            index
            element={
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Home />
                <Topquiz />
                <Leaderboard />
              </div>
            }
          />
          <Route path="profile" element={<MyProfile />} />
          <Route path="catalogue/quiz-start/*" element={<QuizStart />} />
          <Route path="progression" element={<ProgressChart />} />
        </Routes>
      </div>
    </Layout>
  );
};
