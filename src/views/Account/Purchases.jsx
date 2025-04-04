import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaFilm, FaPlay, FaClock, FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import defaultThumbnailImage from "../../default-thumbnail.png";
import "./Purchases.css";

const Purchases = () => {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Use the imported image
  const defaultThumbnail = defaultThumbnailImage;

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        console.log("Loaded user data:", parsedUserData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const fetchPurchases = async () => {
    try {
      setError(null);
      setLoading(true);

      // Log API URL for debugging
      console.log(
        "Fetching purchases from:",
        `${import.meta.env.VITE_API_URL}/api/payments/user-transactions`
      );

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payments/user-transactions`
      );

      console.log("Purchases API response:", response.data);

      // Use the transactions directly from response data
      const transactions = Array.isArray(response.data)
        ? response.data
        : response.data.transactions ||
          response.data.purchases ||
          response.data.data ||
          [];

      setPurchases(transactions);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setError(
        error.response?.data?.message ||
          t("common.error_occurred") ||
          "An error occurred"
      );
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const getPosterUrl = (transaction) => {
    // Follow the pattern in the Expo app for poster URLs
    if (
      transaction.contentType === "Season" ||
      transaction.contentType === "Episode"
    ) {
      // For TV shows, check if there's a specific episode/season poster or use the show's poster
      return (
        transaction.contentId?.vertical_poster ||
        transaction.contentId?.tvShow?.vertical_poster ||
        transaction.contentId?.horizontal_poster ||
        transaction.contentId?.tvShow?.horizontal_poster ||
        defaultThumbnail
      );
    }

    // For movies or other content types
    return (
      transaction.contentId?.vertical_poster ||
      transaction.contentId?.horizontal_poster ||
      defaultThumbnail
    );
  };

  const getContentTitle = (transaction) => {
    let title = transaction.contentId?.title || "Unknown Title";

    // Add season/episode information if available
    if (transaction.contentType === "Season" && transaction.seasonNumber) {
      title += ` Season ${transaction.seasonNumber}`;
    } else if (
      transaction.contentType === "Episode" &&
      transaction.episodeNumber
    ) {
      title += ` Episode ${transaction.episodeNumber}`;
    }

    return title;
  };

  const getContentLink = (transaction) => {
    if (!transaction.contentId?._id) return "/";

    if (transaction.contentType === "Movie") {
      return `/movies-detail/${transaction.contentId._id}`;
    } else if (
      transaction.contentType === "Season" ||
      transaction.contentType === "Episode"
    ) {
      return `/tv-shows-detail/${transaction.contentId._id}`;
    }

    // Default to movie details
    return `/movies-detail/${transaction.contentId._id}`;
  };

  const getRemainingTime = (expiryDate) => {
    if (!expiryDate) return t("purchases.unknown") || "Unknown";

    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return t("purchases.expired") || "Expired";
    if (diffDays === 0) return t("purchases.expires_today") || "Expires today";
    return (
      t("purchases.days_remaining", { days: diffDays }) ||
      `${diffDays} days remaining`
    );
  };

  const getStatusBadge = (expiryDate) => {
    if (!expiryDate)
      return (
        <Badge bg="warning" className="status-badge">
          {t("purchases.unknown") || "Unknown"}
        </Badge>
      );

    const now = new Date();
    const expiry = new Date(expiryDate);
    const isExpired = expiry < now;

    return (
      <Badge bg={isExpired ? "danger" : "success"} className="status-badge">
        {isExpired
          ? t("purchases.expired") || "Expired"
          : t("purchases.active") || "Active"}
      </Badge>
    );
  };

  // Safe get property
  const safeGet = (obj, path, defaultValue = "") => {
    try {
      return path.split(".").reduce((o, k) => o?.[k], obj) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <Container className="purchases-container py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="purchases-card">
            <Card.Header className="text-center">
              <h2>{t("purchases.title") || "My Purchases"}</h2>
              <p className="text-muted mb-0">
                {userData?.full_name
                  ? t("purchases.subtitle_with_name", {
                      name: userData.full_name,
                    }) || `Welcome back, ${userData.full_name}`
                  : t("purchases.subtitle") || "Your purchased content"}
              </p>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">
                      {t("common.loading") || "Loading..."}
                    </span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                </div>
              ) : !purchases?.length ? (
                <div className="text-center py-4">
                  <FaFilm
                    className="no-purchases-icon"
                    style={{ fontSize: "3rem", opacity: 0.5 }}
                  />
                  <p className="mt-3">
                    {t("purchases.no_purchases") ||
                      "You haven't made any purchases yet."}
                  </p>
                  <Link to="/" className="btn btn-primary mt-2">
                    {t("purchases.browse_movies") || "Browse Movies"}
                  </Link>
                </div>
              ) : (
                <div className="purchases-list">
                  {purchases.map((purchase, index) => {
                    return (
                      <div
                        key={purchase._id || index}
                        className="purchase-item"
                      >
                        <div className="purchase-thumbnail">
                          <img
                            src={getPosterUrl(purchase)}
                            alt={getContentTitle(purchase)}
                            onError={(e) => {
                              // Prevent infinite loops by checking if we've already tried the fallback
                              if (e.target.src !== defaultThumbnail) {
                                e.target.src = defaultThumbnail;
                              }
                              // If even the fallback fails, just hide the image
                              e.target.onerror = () => {
                                e.target.style.display = "none";
                              };
                            }}
                          />
                        </div>
                        <div className="purchase-info">
                          <div className="purchase-header">
                            <h5>{getContentTitle(purchase)}</h5>
                            {getStatusBadge(purchase.expiryDate)}
                          </div>
                          <div className="purchase-details">
                            <p className="purchase-date">
                              <FaClock className="icon" />
                              {t("purchases.purchased_on") ||
                                "Purchased on"}:{" "}
                              {new Date(
                                purchase.created_at ||
                                  purchase.purchaseDate ||
                                  purchase.createdAt ||
                                  Date.now()
                              ).toLocaleDateString()}
                            </p>
                            <p className="purchase-price">
                              <FaRupeeSign className="icon" />
                              {t("purchases.amount") || "Amount"}: ₹
                              {purchase.amount || purchase.price || "0"}
                            </p>
                            <p className="purchase-expiry">
                              <FaClock className="icon" />
                              {getRemainingTime(purchase.expiryDate)}
                            </p>
                          </div>
                          <Link
                            to={getContentLink(purchase)}
                            className="btn btn-primary btn-sm watch-button"
                          >
                            <FaPlay className="me-2" />
                            {t("purchases.watch_now") || "Watch Now"}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
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
