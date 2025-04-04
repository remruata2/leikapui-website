import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaDesktop, FaMobile, FaTablet, FaTv, FaTrash, FaLaptop, FaGamepad } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { getDeviceInfo } from "../../utilities/authUtils";
import "./Devices.css";

const Devices = () => {
  const { t } = useTranslation();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDevice, setCurrentDevice] = useState(null);

  const getDeviceIcon = (deviceType) => {
    const type = deviceType?.toLowerCase() || "";
    
    if (type.includes("mobile") || type.includes("phone")) return <FaMobile />;
    if (type.includes("tablet") || type.includes("ipad")) return <FaTablet />;
    if (type.includes("tv") || type.includes("television")) return <FaTv />;
    if (type.includes("laptop")) return <FaLaptop />;
    if (type.includes("game") || type.includes("console")) return <FaGamepad />;
    
    // Default to desktop
    return <FaDesktop />;
  };

  const fetchDevices = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Get the current device info to identify it in the list
      const currentDeviceInfo = await getDeviceInfo();
      setCurrentDevice(currentDeviceInfo);
      
      // Debug the API request
      console.log("Fetching devices from:", `${import.meta.env.VITE_API_URL}/api/devices`);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/devices`
      );
      
      console.log("Devices API response:", response.data);
      
      // Handle different response structures
      let devicesList = [];
      if (response.data.devices) {
        devicesList = response.data.devices;
      } else if (Array.isArray(response.data)) {
        devicesList = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        devicesList = response.data.data;
      }
      
      setDevices(devicesList);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setError(error.response?.data?.message || t("common.error_occurred"));
      setDevices([]);
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
      console.error("Error removing device:", error);
      Swal.fire({
        icon: "error",
        title: t("devices.remove_error"),
        text: error.response?.data?.message || t("common.error_occurred"),
      });
    }
  };

  // Determine if a device is the current one
  const isCurrentDevice = (device) => {
    if (!currentDevice) return false;
    
    // Use deviceId for comparison (this is the unique identifier we generate)
    return device.deviceId === currentDevice.deviceId || device.uniqueId === currentDevice.deviceId;
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Container className="devices-container py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="devices-card">
            <Card.Header className="text-center">
              <h2>{t("devices.title") || "Devices"}</h2>
              <p className="text-muted mb-0">{t("devices.subtitle") || "Manage your devices"}</p>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t("common.loading") || "Loading..."}</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                </div>
              ) : devices.length === 0 ? (
                <div className="text-center py-4">
                  <p>{t("devices.no_devices") || "No devices found."}</p>
                </div>
              ) : (
                <div className="devices-list">
                  {devices.map((device, index) => (
                    <div 
                      key={device._id || device.id || index} 
                      className={`device-item ${isCurrentDevice(device) ? 'current-device' : ''}`}
                    >
                      <div className="device-icon">
                        {getDeviceIcon(device.type || device.deviceType || device.deviceInfo?.deviceType)}
                      </div>
                      <div className="device-info">
                        <h5>
                          {device.name || device.deviceInfo?.deviceBrand || device.deviceBrand || "Unknown Device"}
                          {isCurrentDevice(device) && 
                            <span className="current-device-badge">
                              {t("devices.current_device") || "Current Device"}
                            </span>
                          }
                        </h5>
                        <p className="device-details">
                          {device.browser || device.deviceInfo?.modelName || device.modelName || ""} 
                          {" • "}
                          {device.os || device.osName || device.deviceInfo?.osName || ""}
                          {device.deviceInfo?.osVersion ? ` ${device.deviceInfo.osVersion}` : ""}
                          {device.osVersion ? ` ${device.osVersion}` : ""}
                        </p>
                        <p className="device-time">
                          {t("devices.last_active") || "Last active"}:{" "}
                          {new Date(device.lastActive || device.lastLoginAt || device.deviceInfo?.lastLoginAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      {!isCurrentDevice(device) && (
                        <Button
                          variant="danger"
                          className="remove-device"
                          onClick={() => handleRemoveDevice(device._id || device.id)}
                          aria-label={t("devices.remove_device") || "Remove device"}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
            <Card.Footer>
              <p className="text-muted mb-0">
                {t("devices.max_devices") || "Devices"}: {devices?.length || 0}/5
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Devices;
