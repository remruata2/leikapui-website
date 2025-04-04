import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaFilm, FaPlay, FaClock, FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Purchases.css";

const Purchases = () => {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const fetchPurchases = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/purchases`
      );
      setPurchases(response.data.purchases || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setError(error.response?.data?.message || t("common.error_occurred"));
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const getRemainingTime = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return t("purchases.expired");
    if (diffDays === 0) return t("purchases.expires_today");
    return t("purchases.days_remaining", { days: diffDays });
  };

  const getStatusBadge = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const isExpired = expiry < now;

    return (
      <Badge bg={isExpired ? "danger" : "success"} className="status-badge">
        {isExpired ? t("purchases.expired") : t("purchases.active")}
      </Badge>
    );
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <Container className="purchases-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t("common.loading")}</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="purchases-container">
        <div className="text-center py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="purchases-container py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="purchases-card">
            <Card.Header className="text-center">
              <h2>{t("purchases.title")}</h2>
              <p className="text-muted mb-0">
                {userData?.name
                  ? t("purchases.subtitle_with_name", { name: userData.name })
                  : t("purchases.subtitle")}
              </p>
            </Card.Header>
            <Card.Body>
              {!purchases?.length ? (
                <div className="text-center py-4">
                  <FaFilm className="no-purchases-icon" />
                  <p className="mt-3">{t("purchases.no_purchases")}</p>
                  <Link to="/" className="btn btn-primary mt-2">
                    {t("purchases.browse_movies")}
                  </Link>
                </div>
              ) : (
                <div className="purchases-list">
                  {purchases.map((purchase) => (
                    <div key={purchase._id} className="purchase-item">
                      <div className="purchase-thumbnail">
                        <img
                          src={purchase.content.thumbnail_url}
                          alt={purchase.content.title}
                        />
                      </div>
                      <div className="purchase-info">
                        <div className="purchase-header">
                          <h5>{purchase.content.title}</h5>
                          {getStatusBadge(purchase.expiryDate)}
                        </div>
                        <div className="purchase-details">
                          <p className="purchase-date">
                            <FaClock className="icon" />
                            {t("purchases.purchased_on")}:{" "}
                            {new Date(
                              purchase.purchaseDate
                            ).toLocaleDateString()}
                          </p>
                          <p className="purchase-price">
                            <FaRupeeSign className="icon" />
                            {t("purchases.amount")}: ₹{purchase.amount}
                          </p>
                          <p className="purchase-expiry">
                            <FaClock className="icon" />
                            {getRemainingTime(purchase.expiryDate)}
                          </p>
                        </div>
                        <Link
                          to={`/movie/${purchase.content._id}`}
                          className="btn btn-primary btn-sm watch-button"
                        >
                          <FaPlay className="me-2" />
                          {t("purchases.watch_now")}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Purchases;
