import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaUser, FaEnvelope, FaPhone, FaEdit } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { setUser } from "../../store/user/actions";
import { updateUserProfile } from "../../utilities/authUtils";
import "./Profile.css";

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Ensure form data is updated if Redux state changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the centralized utility function instead of direct axios call
      const updatedUserData = await updateUserProfile(formData);

      // Update Redux store
      dispatch(setUser(updatedUserData));

      Swal.fire({
        icon: "success",
        title: t("profile.update_success"),
        showConfirmButton: false,
        timer: 1500,
      });
      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("profile.update_error"),
        text: error.response?.data?.message || t("common.error_occurred"),
      });
    }
  };

  return (
    <Container className="profile-container py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="profile-card">
            <Card.Header className="text-center">
              <h2>{t("profile.title")}</h2>
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser className="me-2" />
                      {t("profile.full_name")}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaEnvelope className="me-2" />
                      {t("profile.email")}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaPhone className="me-2" />
                      {t("profile.phone")}
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button variant="primary" type="submit">
                      {t("common.save")}
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="profile-info">
                  <div className="info-item">
                    <FaUser className="icon" />
                    <div>
                      <h5>{t("profile.full_name")}</h5>
                      <p>{user?.full_name}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaEnvelope className="icon" />
                    <div>
                      <h5>{t("profile.email")}</h5>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaPhone className="icon" />
                    <div>
                      <h5>{t("profile.phone")}</h5>
                      <p>{user?.phone}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <Button variant="primary" onClick={handleEdit}>
                      <FaEdit className="me-2" />
                      {t("common.edit")}
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
