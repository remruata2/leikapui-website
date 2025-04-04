import { memo, Fragment, useState, useEffect } from "react";
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
import CustomToggle from "../CustomToggle";

// the hook
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../utilities/authUtils";

import { useRef } from "react";

const HeaderDefault = memo((props) => {
  const dispatch = useDispatch();
  const [isMega, setIsMega] = useState(true);
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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

  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated);
    if (isAuthenticated && user) {
      dispatch(setUser(user));
    }
  }, [isAuthenticated, user, dispatch]);

  const handleLogout = async () => {
    try {
      await logout();
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

    window.addEventListener("scroll", handleScroll);
    updateIsMega();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Fragment>
      <header className="header-center-home header-default header-sticky">
        <Navbar
          expand="xl"
          className="nav navbar-light iq-navbar header-hover-menu py-xl-0"
        >
          <Container fluid className="navbar-inner">
            <div className="d-flex align-items-center justify-content-between w-100 landing-header">
              <div className="d-flex align-items-center justify-content-center flex-grow-1 flex-xl-grow-0">
                <div className="d-xl-none">
                  <button
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#navbar_main"
                    aria-controls="navbar_main"
                    className="btn btn-primary rounded-pill p-1 pt-0 toggle-rounded-btn me-3"
                    onClick={() => setShow1(!show1)}
                  >
                    <svg width="20px" className="icon-20" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
                      ></path>
                    </svg>
                  </button>
                </div>
                <Logo></Logo>
              </div>
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
                    className="px-0 pt-0"
                    closeButton
                    onHide={() => setShow1(false)}
                  >
                    <div className="navbar-brand d-flex justify-content-center w-100">
                      <Logo></Logo>
                    </div>
                  </Offcanvas.Header>
                  <ul
                    className="navbar-nav iq-nav-menu list-unstyled"
                    id="header-menu"
                  >
                    <Nav.Item as="li">
                      <Nav.Link
                        as={Link}
                        to="/"
                        className={`${
                          location.pathname === "/" ? "active" : ""
                        }`}
                        onClick={() => setShow1(false)}
                      >
                        <span className="item-name">{t("header.home")}</span>
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li">
                      <Nav.Link
                        as={Link}
                        to="/movies"
                        className={`${
                          location.pathname === "/movies" ? "active" : ""
                        }`}
                        onClick={() => setShow1(false)}
                      >
                        <span className="item-name">{t("header.movie")}</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        as={Link}
                        to="/tv-shows"
                        className={`${
                          location.pathname === "/tv-shows" ? "active" : ""
                        }`}
                        onClick={() => setShow1(false)}
                      >
                        <span className="item-name">{t("Series")}</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        aria-expanded={open2}
                        href="#"
                        onClick={() => setOpen2(!open2)}
                        className={`${
                          location.pathname === "/contact-us" ||
                          location.pathname === "/privacy-policy" ||
                          location.pathname === "/terms-of-use" ||
                          location.pathname === "/cancellation-refund"
                            ? "active"
                            : ""
                        }`}
                      >
                        <span className="item-name">{t("header.pages")}</span>
                        <span className="menu-icon ms-2">
                          <i
                            className={`fa ${
                              open2 ? "fa-caret-up" : "fa-caret-down"
                            } toggledrop-desktop right-icon`}
                            aria-hidden="true"
                          ></i>
                        </span>
                      </Nav.Link>
                      <Collapse in={open2} className="sub-nav list-unstyled">
                        <ul>
                          <Nav.Item as="li">
                            <Link
                              to="/contact-us"
                              className={`${
                                location.pathname === "/contact-us"
                                  ? "active"
                                  : ""
                              } nav-link`}
                              onClick={() => setShow1(false)}
                            >
                              Contact Us
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              to="/privacy-policy"
                              className={`${
                                location.pathname === "/privacy-policy"
                                  ? "active"
                                  : ""
                              } nav-link`}
                              onClick={() => setShow1(false)}
                            >
                              Privacy Policy
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              to="/terms-of-use"
                              className={`${
                                location.pathname === "/terms-of-use"
                                  ? "active"
                                  : ""
                              } nav-link`}
                              onClick={() => setShow1(false)}
                            >
                              Terms of Use
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              to="/cancellation-refund"
                              className={`${
                                location.pathname === "/cancellation-refund"
                                  ? "active"
                                  : ""
                              } nav-link`}
                              onClick={() => setShow1(false)}
                            >
                              Cancellation & Refund
                            </Link>
                          </Nav.Item>
                        </ul>
                      </Collapse>
                    </Nav.Item>
                    {isAuthenticated ? (
                      <Nav.Item as="li">
                        <Nav.Link
                          aria-expanded={open3}
                          href="#"
                          onClick={() => setOpen3(!open3)}
                        >
                          <span className="item-name">My Account</span>
                          <span className="menu-icon ms-2">
                            <i
                              className={`fa ${
                                open3 ? "fa-caret-up" : "fa-caret-down"
                              } toggledrop-desktop right-icon`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </Nav.Link>
                        <Collapse in={open3} className="sub-nav list-unstyled">
                          <ul>
                            <Nav.Item as="li">
                              <Link
                                to="/profile"
                                className="nav-link"
                                onClick={() => setShow1(false)}
                              >
                                Profile
                              </Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                              <Link
                                to="/devices"
                                className="nav-link"
                                onClick={() => setShow1(false)}
                              >
                                Devices
                              </Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                              <Link
                                to="/purchases"
                                className="nav-link"
                                onClick={() => setShow1(false)}
                              >
                                Purchases
                              </Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                              <Link
                                to="#"
                                className="nav-link"
                                onClick={() => {
                                  handleLogout();
                                  setShow1(false);
                                }}
                              >
                                Logout
                              </Link>
                            </Nav.Item>
                          </ul>
                        </Collapse>
                      </Nav.Item>
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
                          <span className="item-name">
                            <i className="fas fa-user"></i> {t("header.login")}
                          </span>
                        </Nav.Link>
                      </Nav.Item>
                    )}
                  </ul>
                </Container>
              </Navbar>

              {/* <div className="right-panel">
                <Button
                  id="navbar-toggle"
                  bsPrefix="navbar-toggler"
                  type="button"
                  aria-expanded={show}
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  onClick={() => setShow(!show)}
                >
                  <span className="navbar-toggler-btn">
                    <span className="navbar-toggler-icon"></span>
                  </span>
                </Button>
                <div
                  className={`navbar-collapse collapse ${show ? "show" : ""}`}
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav align-items-center ms-auto mb-2 mb-xl-0 gap-3">
                    <Dropdown
                      as="li"
                      className="nav-item dropdown iq-responsive-menu"
                    >
                      <div className="search-box">
                        <Link
                          to="#"
                          onClick={() => setShow2(!show2)}
                          className={` nav-link p-0 ${show2 ? "show" : ""}`}
                          id="search-drop"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div className="btn-icon btn-sm rounded-pill btn-action">
                            <span className="btn-inner">
                              <svg
                                className="icon-20"
                                width="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="11.7669"
                                  cy="11.7666"
                                  r="8.98856"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></circle>
                                <path
                                  d="M18.0186 18.4851L21.5426 22"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                              </svg>
                            </span>
                          </div>
                        </Link>
                        <ul
                          className={`dropdown-menu p-0 dropdown-search m-0 iq-search-bar ${
                            show2 ? "show" : ""
                          }`}
                          style={{ width: "10rem" }}
                          data-bs-popper="static"
                        >
                          <li className="p-0">
                            <div className="form-group input-group mb-0">
                              <input
                                type="text"
                                className="form-control border-0"
                                placeholder={t("blogs.search")}
                              />
                              <button
                                onClick={() => setShow2(!show2)}
                                type="submit"
                                className={` search-submit ${
                                  show === false ? "show" : ""
                                }`}
                              >
                                <svg
                                  className="icon-15"
                                  width="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="11.7669"
                                    cy="11.7666"
                                    r="8.98856"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></circle>
                                  <path
                                    d="M18.0186 18.4851L21.5426 22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </li>
                        </ul>
                        <Dropdown.Menu
                          as="ul"
                          className="p-0 dropdown-search m-0 iq-search-bar"
                          style={{ width: "20rem" }}
                        >
                          <li className="p-0">
                            <div className="form-group input-group mb-0">
                              <input
                                type="text"
                                className="form-control border-0"
                                placeholder="t('header.search_dot')"
                              />
                              <button type="submit" className="search-submit">
                                <svg
                                  className="icon-15"
                                  width="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="11.7669"
                                    cy="11.7666"
                                    r="8.98856"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></circle>
                                  <path
                                    d="M18.0186 18.4851L21.5426 22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </li>
                        </Dropdown.Menu>
                      </div>
                    </Dropdown>
                    <Dropdown as="li" className="nav-items">
                      <Dropdown.Toggle
                        as={CustomToggle}
                        href="#"
                        variant=" nav-link d-flex align-items-center px-0"
                        id="langDropdown"
                      >
                        <i className="fa-solid fa-language" size="md"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        as="ul"
                        className="dropdown-menu-end border-0 p-0 m-0"
                      >
                        <Dropdown.Item
                          to="#"
                          onClick={() => changeLanguage("en")}
                        >
                          en
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#"
                          onClick={() => changeLanguage("ar")}
                        >
                          ar
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#"
                          onClick={() => changeLanguage("de")}
                        >
                          de
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#"
                          onClick={() => changeLanguage("fr")}
                        >
                          fr
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#"
                          onClick={() => changeLanguage("gr")}
                        >
                          gr
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </ul>
                </div>
              </div> */}
            </div>
          </Container>
        </Navbar>
      </header>
    </Fragment>
  );
});

HeaderDefault.displayName = "HeaderDefault";
export default HeaderDefault;
