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

// img
import user from "/assets/images/user/user1.webp";
import { useRef } from "react";

const HeaderDefault = memo(() => {
  const dispatch = useDispatch();
  const [isMega, setIsMega] = useState(true);
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

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
  const hasCheckedLoginStatus = useRef(false);

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

    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/isAuthenticated`, {
          method: "GET",
          credentials: "include",
        });
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);
        setLoggedIn(data.isAuthenticated);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    if (!hasCheckedLoginStatus.current) {
      checkLoginStatus();
      hasCheckedLoginStatus.current = true;
    }

    window.addEventListener("scroll", handleScroll);
    updateIsMega();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      dispatch(setUser(null));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
                  {(isAuthenticated || location.pathname !== "/") && (
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
                    </ul>
                  )}
                </Container>
              </Navbar>

              <div className="right-panel">
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
                    {isAuthenticated ? (
                      <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle
                          as={CustomToggle}
                          href="#"
                          variant=" nav-link d-flex align-items-center px-0"
                          size="sm"
                          id="dropdownMenuButton1"
                        >
                          <div className="btn-icon rounded-pill user-icons">
                            <span className="btn-inner">
                              <svg
                                className="icon-18"
                                width="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                                <path
                                  d="M19.2036 8.66919V12.6792"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                                <path
                                  d="M21.2497 10.6741H17.1597"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                              </svg>
                            </span>
                          </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          as="ul"
                          className="dropdown-menu-end dropdown-user border-0 p-0 m-0"
                        >
                          <li className="user-info d-flex align-items-center gap-3 mb-3">
                            <img
                              src={user}
                              className="img-fluid"
                              alt=""
                              loading="lazy"
                            />
                            <span className="font-size-14 fw-500 text-capitalize text-white">
                              {t("header.jenny")}
                            </span>
                          </li>
                          <li>
                            <Link
                              to="/profile"
                              className="iq-sub-card d-flex align-items-center gap-3"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 22"
                                fill="none"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M7.84455 20.6621C4.15273 20.6621 1 20.0876 1 17.7868C1 15.486 4.13273 13.3621 7.84455 13.3621C11.5364 13.3621 14.6891 15.4654 14.6891 17.7662C14.6891 20.066 11.5564 20.6621 7.84455 20.6621Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M7.83725 10.1738C10.26 10.1738 12.2236 8.21015 12.2236 5.78742C12.2236 3.36469 10.26 1.40015 7.83725 1.40015C5.41452 1.40015 3.44998 3.36469 3.44998 5.78742C3.4418 8.20196 5.3918 10.1656 7.80634 10.1738C7.81725 10.1738 7.82725 10.1738 7.83725 10.1738Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <h6 className="mb-0 font-size-14 fw-normal">
                                {t("header.profile")}
                              </h6>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/devices"
                              className="iq-sub-card d-flex align-items-center gap-3"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M8 4V20"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <h6 className="mb-0 font-size-14 fw-normal">
                                {t("header.devices")}
                              </h6>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/purchases"
                              className="iq-sub-card d-flex align-items-center gap-3"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16 6V5.2C16 3.43269 14.5673 2 12.8 2H11.2C9.43269 2 8 3.43269 8 5.2V6H3C2.44772 6 2 6.44772 2 7V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V7C22 6.44772 21.5523 6 21 6H16Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M8 6V5.2C8 3.43269 9.43269 2 11.2 2H12.8C14.5673 2 16 3.43269 16 5.2V6"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <h6 className="mb-0 font-size-14 fw-normal">
                                {t("header.purchases")}
                              </h6>
                            </Link>
                          </li>

                          <li>
                            <Link
                              className="iq-sub-card iq-logout-2 mt-1 d-flex justify-content-center gap-2"
                              onClick={handleLogout}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                {/* SVG paths */}
                              </svg>
                              <h6 className="mb-0 font-size-14 fw-normal">
                                {t("header.logout")}
                              </h6>
                            </Link>
                          </li>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      <li>
                        <Link to="/login" className="nav-link">
                          <i className="fas fa-user"></i> {t("header.login")}
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
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
