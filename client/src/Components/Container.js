import { Apropos } from "./Apropos";
import { Home } from "./Home";
import { Leaderboard } from "./Leaderboard";
import { Navbar } from "./Navbar";
import { Topquiz } from "./Topquiz";
import { Faq } from "./Faq";
import ParticlesComponent from "./ParticlesComponent";

export const Container = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    margin: "0",
    padding: "0",
    position: "relative", // important!
    minHeight: "100vh",
    overflow: "hidden",   // prevent scroll bars from particle canvas
  };

  return (
    <div style={containerStyle}>
      <ParticlesComponent id="tsparticles" />
      <Navbar />
      <Home />
      <Apropos />
      <Faq />
      <Topquiz />
      <Leaderboard />
    </div>
  );
};
