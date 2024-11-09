import React, { Fragment, memo, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SignUpPage = memo(() => {
  const { t } = useTranslation();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirm_password: "",
    terms: false,
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors({ ...errors, [name]: "" }); // Clear error when input changes
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirm_password: t("form.passwords_mismatch"),
      }));
      setLoading(false);
      return;
    }

    // Log the form data before submission
    console.log("Form Data Submitted:", formData);

    const response = await fetch(`${apiUrl}/api/users`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      setFormData({
        full_name: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        confirm_password: "",
        terms: false,
      });
      setError(null);
      console.log("New User added");
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <main className="main-content">
        <div
          className="vh-100"
          style={{
            backgroundImage: "url(assets/images/pages/01.webp)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "relative",
            minHeight: "500px",
          }}
        >
          <Container>
            <Row className="justify-content-center align-items-center height-self-center vh-100">
              <Col lg="8" md="12" className="align-self-center">
                <form
                  className="user-login-card bg-body"
                  onSubmit={handleSubmit}
                >
                  <h4 className="text-center mb-5">
                    {t("form.create_account")}
                  </h4>
                  {error && <p className="text-primary text-center">{error}</p>}
                  <Row lg="2" className="row-cols-1 g-2 g-lg-5">
                    <Col>
                      <Form.Label className="text-white fw-500 mb-2">
                        {t("form.full_name")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="rounded-0"
                        required
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                      />
                      {errors.full_name && (
                        <p className="text-danger">{errors.full_name}</p>
                      )}
                    </Col>
                    <Col>
                      <Form.Label className="text-white fw-500 mb-2">
                        {t("form.username")} *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="rounded-0"
                        required
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      {errors.username && (
                        <p className="text-danger">{errors.username}</p>
                      )}
                    </Col>
                    <Col>
                      <Form.Label className="text-white fw-500 mb-2">
                        {t("form.email")} *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        className="rounded-0"
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <p className="text-danger">{errors.email}</p>
                      )}
                    </Col>
                    <Col>
                      <Form.Label className="text-white fw-500 mb-2">
                        {t("form.phone")} *
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        className="rounded-0"
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <p className="text-danger">{errors.phone}</p>
                      )}
                    </Col>
                    <Col>
                      <Form.Label className="text-white fw-500 mb-2">
                        {t("form.password")} *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        className="rounded-0"
                        required
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && (
                        <p className="text-danger">{errors.password}</p>
                      )}
                    </Col>
                    <Col>
                      <Form.Label className="text-white fw-500 mb-2">
                        {t("form.confirm_password")} *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        className="rounded-0"
                        required
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                      />
                      {errors.confirm_password && (
                        <p className="text-danger">{errors.confirm_password}</p>
                      )}
                    </Col>
                  </Row>
                  <Form.Label className="list-group-item d-flex align-items-center mt-5 mb-3 text-white">
                    <Form.Check.Input
                      className="m-0 me-2"
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                    />
                    {t("form.read_and_accept")}
                    <Link to="/terms-of-use" className="ms-1">
                      {t("form.terms_conditions")}
                    </Link>
                  </Form.Label>
                  <Row className="text-center">
                    <Col lg="3"></Col>
                    <Col lg="6">
                      <div className="full-button">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          disabled={loading}
                        >
                          <span className="button-text">
                            {t("form.sign_up")}
                          </span>
                          <i className="fa-solid fa-play"></i>
                        </button>
                        <p className="mt-2 mb-0 fw-normal">
                          {t("form.already_account")}?
                          <Link to="/login" className="ms-1">
                            {t("shop.login")}
                          </Link>
                        </p>
                      </div>
                    </Col>
                    <Col lg="3"></Col>
                  </Row>
                </form>
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    </Fragment>
  );
});

SignUpPage.displayName = "SignUpPage";
export default SignUpPage;
