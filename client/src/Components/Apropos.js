import { useState, useEffect, useRef } from "react";
import "../Styles/Apropos.css";
import CountUp from "react-countup";

export const Apropos = () => {
  const [counterOn, setCounterOn] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setCounterOn(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="aboutus" ref={sectionRef} id="a-propos-de-nous">
      <h1>A propos de nous</h1>
      <p>
      Vous cherchez un meilleur moyen de vous faire remarquer par les recruteurs ? <strong>QuizPop</strong> vous permet de prouver vos compétences par le biais de quiz et de rejoindre le classement. Au lieu de comparer des CV, les entreprises peuvent recruter les meilleurs talents sur la base de leurs performances réelles. <br />
      <strong>Vos compétences vous ouvrent les portes de nouvelles opportunités !</strong>
      </p>
      <div className="counter-container">
        <div className="counter">
          <h1>{counterOn && <CountUp start={0} end={30} duration={2} delay={0} />}+ Utilisateurs</h1>
        </div>
        <div className="counter">
        <h1>
        {counterOn && <CountUp start={0} end={45} duration={2} delay={0} />}
        + <br /> Quizzes
        </h1>

        </div>
      </div>
    </div>
  );
};
