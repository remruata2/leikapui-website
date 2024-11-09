import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFilm,
  FaTv,
  FaQuestionCircle,
  FaEnvelope,
  FaFileAlt,
  FaInfoCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaFileContract,
} from "react-icons/fa";
import "./SidebarDefault.css"; // Import the CSS file
import Logo from "../logo";
import { useAuth } from "../../context/AuthContext";

const SidebarDefault = () => {
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const handleLogout = () => {
    // Remove the JWT token from localStorage
    localStorage.removeItem("jwtToken");
    window.dispatchEvent(new Event("authChange"));
    // Update the authentication state
    setIsAuthenticated(false);

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="sidebar-container">
      <Sidebar
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#1f242d",
            width: "250px",
            height: "100vh",
            color: "#fff",
            marginTop: "10px",
            marginBottom: "20px",
          },
        }}
      >
        <div className="logo-container">
          <Logo />
        </div>
        <div style={{ padding: "0 24px", marginBottom: "8px" }}>
          <p>
            <span
              style={{ fontWeight: "600", fontSize: "0.9rem", color: "gray" }}
            >
              General
            </span>
          </p>
        </div>
        <Menu
          menuItemStyles={{
            button: {
              color: "white",
              [`&.active`]: {
                backgroundColor: "#fff",
                color: "#38445a",
              },
              "&:hover": {
                backgroundColor: "#38445a",
                color: "white",
              },
            },
          }}
        >
          <MenuItem component={<NavLink to="/" end />}>
            <FaHome /> Home
          </MenuItem>
          <MenuItem component={<NavLink to="/movies" />}>
            <FaFilm /> Movies
          </MenuItem>
          <MenuItem component={<NavLink to="/tv-shows" />}>
            <FaTv /> Series
          </MenuItem>
          <div
            style={{
              padding: "0 24px",
              marginBottom: "8px",
              marginTop: "12px",
            }}
          >
            <p>
              <span
                style={{ fontWeight: "600", fontSize: "0.9rem", color: "gray" }}
              >
                Other Pages
              </span>
            </p>
          </div>
          <MenuItem component={<NavLink to="/faq" />}>
            <FaQuestionCircle /> FAQ
          </MenuItem>
          <MenuItem component={<NavLink to="/PrivacyPolicy" />}>
            <FaFileAlt /> Privacy Policy
          </MenuItem>
          <MenuItem component={<NavLink to="/terms-of-use" />}>
            <FaFileContract />
            Terms of Use
          </MenuItem>
          <MenuItem component={<NavLink to="/contact-us" />}>
            <FaEnvelope /> Contact Us
          </MenuItem>
          <MenuItem component={<NavLink to="/about-us" />}>
            <FaInfoCircle /> About Us
          </MenuItem>
          <div
            style={{
              padding: "0 24px",
              marginBottom: "8px",
              marginTop: "12px",
            }}
          >
            <p>
              <span
                style={{ fontWeight: "600", fontSize: "0.9rem", color: "gray" }}
              >
                User Account
              </span>
            </p>
          </div>
          {isAuthenticated ? (
            <MenuItem component={<NavLink onClick={handleLogout} />}>
              <FaSignOutAlt /> Logout
            </MenuItem>
          ) : (
            <MenuItem component={<NavLink to="/login" />}>
              <FaSignInAlt /> Login
            </MenuItem>
          )}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarDefault;
