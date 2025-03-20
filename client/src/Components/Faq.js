import {faq} from "../faq";
import "../Styles/Faq.css";
import Accordion from "react-bootstrap/Accordion";
export const Faq = () =>{
    return (
        <div className="main" id="FAQ">
          <div className="container mt-4">
            <h1 className="text-center mb-3">Foire aux Questions</h1>
            <Accordion defaultActiveKey="0" >
              {faq.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={index} >
                  <Accordion.Header>{item.question}</Accordion.Header>
                  <Accordion.Body>{item.response}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
          </div>
        );
};