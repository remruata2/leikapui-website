import React, { Fragment, memo, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import BreadCrumbWidget from "../../components/BreadcrumbWidget";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import "./ContactUs.css";

const ContactUs = memo(() => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
  };

  return (
    <Fragment>
      <div className="section-padding contact-us">
        <Container>
          <div className="contact-header">
            <h1>Get in Touch</h1>
            <p className="intro">
              Have questions or need assistance? We're here to help! Reach out
              to us through any of the following channels.
            </p>
          </div>

          <Row className="contact-content">
            <Col lg={4} md={12}>
              <div className="contact-info">
                <div className="info-item">
                  <FaMapMarkerAlt className="icon" />
                  <h3>Our Location</h3>
                  <p>
                    D/Z 31 Dinthar
                    <br />
                    Aizawl, Mizoram
                    <br />
                    India
                  </p>
                </div>

                <div className="info-item">
                  <FaPhone className="icon" />
                  <h3>Phone Number</h3>
                  <p>+91-7085979047</p>
                  <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                </div>

                <div className="info-item">
                  <FaEnvelope className="icon" />
                  <h3>Email Address</h3>
                  <p>support@leikapuistudios.com</p>
                </div>
              </div>
            </Col>

            <Col lg={8} md={12}>
              <div className="contact-form">
                <h2>Send us a Message</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button type="submit" className="submit-btn">
                    Send Message
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
});

ContactUs.displayName = "ContactUs";
export default ContactUs;
