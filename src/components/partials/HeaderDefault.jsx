import { memo, Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/user/actions";

// react-bootstrap
import {
  Button,
  Nav,
  Collapse,
  Navbar,
  Offcanvas,
  Container,
  Dropdown,
} from "react-bootstrap";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

//redux
import { useDispatch } from "react-redux";

import { theme_scheme_direction } from "../../store/setting/actions";

// components
import Logo from "../logo";

// icons
import {
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaDesktop,
  FaTv,
  FaFilm,
  FaSignInAlt,
  FaSync,
} from "react-icons/fa";

// the hook
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../utilities/authUtils";

const HeaderDefault = memo((props) => {
  const dispatch = useDispatch();
  const [isMega, setIsMega] = useState(true);
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const offcanvasRef = useRef(null);

  //for translation
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);

    if (lng === "ar") {
      dispatch(theme_scheme_direction("rtl"));
    } else {
      dispatch(theme_scheme_direction("ltr"));
    }
  };

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [open3, setOpen3] = useState(false);

  useEffect(() => {
    // This effect runs when authentication state changes
    if (isAuthenticated && user) {
      dispatch(setUser(user));
    }
  }, [isAuthenticated, user, dispatch]);

  const handleLogout = async () => {
    try {
      await logout();
      // Force a re-render by dispatching an auth change event
      window.dispatchEvent(new Event("authChange"));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const headerSticky = document.querySelector(".header-sticky");
      if (headerSticky) {
        if (window.scrollY > 1) {
          headerSticky.classList.add("sticky");
        } else {
          headerSticky.classList.remove("sticky");
        }
      }
    };

    const updateIsMega = () => {
      setIsMega(location.pathname === "/");
    };

    // Close the offcanvas when clicking outside of it
    const handleOutsideClick = (event) => {
      if (
        show1 &&
        offcanvasRef.current &&
        !offcanvasRef.current.contains(event.target)
      ) {
        // Check if the click is not on the toggle button (which has its own handler)
        const toggleBtn = document.querySelector(".toggle-rounded-btn");
        if (!toggleBtn.contains(event.target)) {
          setShow1(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleOutsideClick);
    updateIsMega();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show1]);

  return (
    <Fragment>
      <header className="header-center-home header-default header-sticky">
        {/* Mobile Menu Toggle Button - Leftmost position */}
        <div
          className={`d-xl-none mobile-toggle-container ${
            show1 ? "menu-open" : ""
          }`}
        >
          <button
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#navbar_main"
            aria-controls="navbar_main"
            className="btn btn-primary rounded-pill p-1 pt-0 toggle-rounded-btn"
            onClick={() => setShow1(!show1)}
          >
            {show1 ? (
              <svg
                width="40px"
                height="40px"
                className="icon-40"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                ></path>
              </svg>
            ) : (
              <svg
                width="40px"
                height="40px"
                className="icon-40"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
                ></path>
              </svg>
            )}
          </button>
        </div>

        <Navbar
          expand="xl"
          className="nav navbar-light iq-navbar header-hover-menu py-xl-0"
        >
          <Container fluid className="navbar-inner">
            <div className="d-flex align-items-center justify-content-between w-100 landing-header">
              {/* Logo Container - Centered on mobile, left on desktop */}
              <div className="d-flex align-items-center justify-content-center flex-grow-1 flex-md-grow-0">
                <Logo></Logo>
              </div>

              {/* Navbar/Offcanvas */}
              <Navbar
                expand="xl"
                className={`offcanvas mobile-offcanvas nav hover-nav horizontal-nav py-xl-0 ${
                  show1 === true ? "show" : ""
                } ${isMega ? "mega-menu-content" : ""}`}
                style={{
                  visibility: `${show1 === true ? "visible" : "hidden"}`,
                }}
                id="navbar_main"
              >
                <Container fluid className="container-fluid p-lg-0">
                  <Offcanvas.Header
                    className="px-0 pt-0 d-flex align-items-center"
                    closeButton
                    onHide={() => setShow1(false)}
                  ></Offcanvas.Header>
                  <ul
                    className="navbar-nav iq-nav-menu list-unstyled"
                    id="header-menu"
                  >
                    <Nav.Item as="li">
                      <Nav.Link
                        as={Link}
                        to="/"
                        className={`${
                          location.pathname === "/" ||
                          location.pathname === "/dashboard" ||
                          location.pathname === "/home" ||
                          location.pathname === "/movie"
                            ? "active"
                            : ""
                        }`}
                        onClick={() => setShow1(false)}
                      >
                        <div className="menu-icon-wrapper">
                          <FaFilm />
                        </div>
                        <span className="item-name">{t("header.movie")}</span>
                      </Nav.Link>
                    </Nav.Item>

                    {isAuthenticated ? (
                      <>
                        <Nav.Item as="li">
                          <Nav.Link
                            as={Link}
                            to="/profile"
                            className={`${
                              location.pathname === "/profile" ? "active" : ""
                            }`}
                            onClick={() => setShow1(false)}
                          >
                            <div className="menu-icon-wrapper">
                              <FaUser />
                            </div>
                            <span className="item-name">Profile</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link
                            as={Link}
                            to="/purchases"
                            className={`${
                              location.pathname === "/purchases" ? "active" : ""
                            }`}
                            onClick={() => setShow1(false)}
                          >
                            <div className="menu-icon-wrapper">
                              <FaShoppingCart />
                            </div>
                            <span className="item-name">Purchases</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link
                            as={Link}
                            to="/devices"
                            className={`${
                              location.pathname === "/devices" ? "active" : ""
                            }`}
                            onClick={() => setShow1(false)}
                          >
                            <div className="menu-icon-wrapper">
                              <FaDesktop />
                            </div>
                            <span className="item-name">Devices</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link
                            as={Link}
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLogout();
                              setShow1(false);
                            }}
                          >
                            <div className="menu-icon-wrapper">
                              <FaSignOutAlt />
                            </div>
                            <span className="item-name">Logout</span>
                          </Nav.Link>
                        </Nav.Item>
                      </>
                    ) : (
                      <Nav.Item as="li">
                        <Nav.Link
                          as={Link}
                          to="/login"
                          className={`${
                            location.pathname === "/login" ? "active" : ""
                          }`}
                          onClick={() => setShow1(false)}
                        >
                          <div className="menu-icon-wrapper">
                            <FaSignInAlt />
                          </div>
                          <span className="item-name">{t("Login")}</span>
                        </Nav.Link>
                      </Nav.Item>
                    )}
                  </ul>
                </Container>
              </Navbar>
              <div className="d-flex align-items-center">
                {/* Add refresh button */}
                <button
                  onClick={() => window.location.reload(true)}
                  className="btn btn-link text-white me-3"
                  title="Hard Refresh"
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaSync />
                </button>
                {/* Existing header content */}
              </div>
            </div>
          </Container>
        </Navbar>
      </header>
    </Fragment>
  );
});

HeaderDefault.displayName = "HeaderDefault";
export default HeaderDefault;
