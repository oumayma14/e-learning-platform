import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import "../Styles/Contact.css"

export const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const name = formData.get("from_name").trim();
    const email = formData.get("from_email").trim();
    const message = formData.get("message").trim();

    if (!name || !email || !message) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    setLoading(true);

    try {
      await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_1czjd5n',
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_9v4g8cq',
        form.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'QNx3iZHS3x9vr5Nav'
      );

      toast.success("Email sent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      form.current.reset();
    } catch (error) {
      toast.error(`Failed to send email: ${error.text || "Unknown error"}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }

    setLoading(false);
  };

  return (
    <div className='cont'>
    <Container className='mt-4'>
      <div className='contact-bx'>
        <Form ref={form} onSubmit={sendEmail}>
          <Form.Group controlId="name">
            <Form.Label className='label'>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" name='from_name' required />
          </Form.Group>

          <Form.Group controlId="email" className="mt-3">
            <Form.Label className='label'>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" name='from_email' required />
          </Form.Group>

          <Form.Group controlId="message" className="mt-3">
            <Form.Label className='label'>Message</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Write your message here..." name='message' required />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3" id='send-button' disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Send"}
          </Button>
        </Form>
      </div>
    </Container>
    </div>
  );
};
