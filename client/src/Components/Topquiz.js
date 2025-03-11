import React from "react";
import devops from '../assets/devops.png';
import cloud from '../assets/cloud.png';
import flutter from '../assets/flutter.jpg';
import react from '../assets/react.jpg';
import springboot from '../assets/springboot.png';
import Slider from "react-slick";
import "../Styles/Topquiz.css"

export const Topquiz = () => {
    const data = [
        {
            name: 'Devops Quiz',
            img: devops,
            description: 'Test your knowledge of DevOps principles, CI/CD, Docker, Kubernetes, cloud computing, and automation. Sharpen your skills and level up your expertise!'
        },
        {
            name: 'Cloud Quiz',
            img: cloud,
            description: 'Assess your skills in AWS, Azure, GCP, and cloud computing fundamentals. Test your knowledge and level up!'
        },
        {
            name: 'Flutter Quiz',
            img: flutter,
            description: 'Test your understanding of React, JSX, components, state management, hooks, and modern frontend development practices.'
        },
        {
            name: 'React Quiz',
            img: react,
            description: 'Test your knowledge of DevOps principles, CI/CD, Docker, Kubernetes, cloud computing, and automation. Sharpen your skills and level up your expertise!'
        },
        {
            name: 'Springboot Quiz',
            img: springboot,
            description: 'Evaluate your knowledge of Spring Boot, REST APIs, Spring Security, databases, and building scalable backend applications.'
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    return (
        <section className="quiz">
            <div className="topquiz">
                <Slider {...settings}>
                    {data.map((d, index) => (
                        <div key={index} className="card">
                            <div className="card-header">
                                <img src={d.img} alt={d.name} className="card-img" loading="lazy" />
                            </div>
                            <div className="card-body">
                                <p className="card-title">{d.name}</p>
                                <p className="card-description">{d.description}</p>
                                <button className="card-button">Lire plus</button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};
