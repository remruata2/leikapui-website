import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaDesktop, FaMobile, FaTablet, FaTv, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import "./Devices.css";

const Devices = () => {
  const { t } = useTranslation();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case "desktop":
        return <FaDesktop />;
      case "mobile":
        return <FaMobile />;
      case "tablet":
        return <FaTablet />;
      case "tv":
        return <FaTv />;
      default:
        return <FaDesktop />;
    }
  };

  const fetchDevices = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/devices`
      );
      setDevices(response.data.devices || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setError(error.response?.data?.message || t("common.error_occurred"));
      setDevices([]);
      Swal.fire({
        icon: "error",
        title: t("devices.fetch_error"),
        text: error.response?.data?.message || t("common.error_occurred"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    try {
      const result = await Swal.fire({
        title: t("devices.confirm_remove"),
        text: t("devices.remove_warning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b81010",
        cancelButtonColor: "#6c757d",
        confirmButtonText: t("common.yes"),
        cancelButtonText: t("common.cancel"),
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/devices/${deviceId}`
        );
        await fetchDevices();
        Swal.fire({
          icon: "success",
          title: t("devices.remove_success"),
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("devices.remove_error"),
        text: error.response?.data?.message || t("common.error_occurred"),
      });
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  if (loading) {
    return (
      <Container className="devices-container">
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
      <Container className="devices-container">
        <div className="text-center py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="devices-container py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="devices-card">
            <Card.Header className="text-center">
              <h2>{t("devices.title")}</h2>
              <p className="text-muted mb-0">{t("devices.subtitle")}</p>
            </Card.Header>
            <Card.Body>
              {devices.length === 0 ? (
                <div className="text-center py-4">
                  <p>{t("devices.no_devices")}</p>
                </div>
              ) : (
                <div className="devices-list">
                  {devices.map((device) => (
                    <div key={device._id} className="device-item">
                      <div className="device-icon">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div className="device-info">
                        <h5>{device.name}</h5>
                        <p className="device-details">
                          {device.browser} • {device.os}
                        </p>
                        <p className="device-time">
                          {t("devices.last_active")}:{" "}
                          {new Date(device.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        className="remove-device"
                        onClick={() => handleRemoveDevice(device._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
            <Card.Footer>
              <p className="text-muted mb-0">
                {t("devices.max_devices")}: {devices?.length || 0}/5
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Devices;
