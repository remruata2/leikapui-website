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

// img
import user from "/assets/images/user/user1.webp";
import { useRef } from "react";

const HeaderDefault = memo(() => {
  const dispatch = useDispatch();
  const [isMega, setIsMega] = useState(true);
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

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

  const navigate = useNavigate();

  const logout = () => {
    fetch(`${apiUrl}/logout`, {
      method: "GET",
      credentials: "include", // Include the session cookie with the request
    })
      .then((response) => {
        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Expected JSON response but received:", contentType);
          throw new Error("Expected JSON response");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Parsed JSON response:", data);

        if (data.message === "Logged out successfully") {
          // Clear user data from state
          dispatch(setUser(null));
          console.log("Logged out successfully");

          // Redirect to the login page
          navigate("/login");
        } else {
          // Handle any errors
          console.error("Logout error message:", data.message);
        }
      })
      .catch((error) => {
        // Handle any network errors
        console.error("An error occurred while logging out:", error);
      });
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
              <div className="d-flex gap-3 gap-xl-0 align-items-center">
                <div>
                  <button
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#navbar_main"
                    aria-controls="navbar_main"
                    className="d-xl-none btn btn-primary rounded-pill p-1 pt-0 toggle-rounded-btn"
                    onClick={() => setShow1(!show1)}
                  >
                    <svg width="20px" className="icon-20" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
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
                    className="px-0"
                    closeButton
                    onHide={() => setShow1(false)}
                  >
                    <div className="navbar-brand ms-3">
                      <Logo></Logo>
                    </div>
                  </Offcanvas.Header>
                  <ul
                    className="navbar-nav iq-nav-menu list-unstyled"
                    id="header-menu"
                  >
                    <Nav.Item as="li">
                      <Nav.Link
                        aria-expanded={open2}
                        as={Link}
                        to="/"
                        className={`${
                          location.pathname === "/" ? "active" : ""
                        }`}
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
                      >
                        <span className="item-name">{t("header.movie")}</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        aria-expanded={open2}
                        as={Link}
                        to="/tv-shows"
                        className={`${
                          location.pathname === "/tv-shows" ? "active" : ""
                        }`}
                      >
                        <span className="item-name">{t("Series")}</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        aria-expanded={open2}
                        href="#homePages"
                        onClick={() => setOpen2(!open2)}
                        className={`${
                          location.pathname === "/about-us" ||
                          location.pathname === "/contact-us" ||
                          location.pathname === "/faq" ||
                          location.pathname === "/PrivacyPolicy" ||
                          location.pathname === "/pricing" ||
                          location.pathname === "/coming-soon"
                            ? "active"
                            : ""
                        }`}
                      >
                        <span className="item-name">{t("header.pages")}</span>
                        <span className="menu-icon ms-2">
                          <i
                            className="fa fa-caret-down toggledrop-desktop right-icon"
                            aria-hidden="true"
                          ></i>
                          <span className="toggle-menu">
                            <i
                              className="fa fa-plus  arrow-active text-white"
                              aria-hidden="true"
                            ></i>
                            <i
                              className="fa fa-minus  arrow-hover text-white"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </span>
                      </Nav.Link>
                      <Collapse in={open2} className="sub-nav list-unstyled">
                        <ul>
                          <Nav.Item as="li">
                            <Link
                              to="/about-us"
                              className={`${
                                location.pathname === "/about-us"
                                  ? "active"
                                  : ""
                              } nav-link`}
                            >
                              {" "}
                              {t("header.about_us")}{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              to="/contact-us"
                              className={`${
                                location.pathname === "/contact-us"
                                  ? "active"
                                  : ""
                              } nav-link`}
                            >
                              {" "}
                              {t("header.contact_us")}{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              to="/faq"
                              className={`${
                                location.pathname === "/faq" ? "active" : ""
                              } nav-link`}
                            >
                              {" "}
                              {t("header.faq")}{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              to="/PrivacyPolicy"
                              className={`${
                                location.pathname === "/PrivacyPolicy"
                                  ? "active"
                                  : ""
                              } nav-link`}
                            >
                              {" "}
                              {t("header.privacy_policy")}{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              to="/pricing"
                              className={`${
                                location.pathname === "/pricing" ? "active" : ""
                              } nav-link`}
                            >
                              {" "}
                              {t("header.pricing_plan")}{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              to="/coming-soon"
                              className={`${
                                location.pathname === "/coming-soon"
                                  ? "active"
                                  : ""
                              } nav-link`}
                            >
                              {" "}
                              {t("header.coming_soon")}{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Nav.Link
                              aria-expanded={open3}
                              href="#homePages"
                              onClick={() => setOpen3(!open3)}
                              className={`${
                                location.pathname === "/error-page-one" ||
                                location.pathname === "/error-page-two"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <span className="item-name">
                                {t("header.error_page")}
                              </span>
                              <span className="menu-icon">
                                <i
                                  className="fa fa-caret-right toggledrop-desktop right-icon"
                                  aria-hidden="true"
                                ></i>
                                <span className="toggle-menu">
                                  <i
                                    className="fa fa-plus  arrow-active text-white"
                                    aria-hidden="true"
                                  ></i>
                                  <i
                                    className="fa fa-minus  arrow-hover text-white"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </span>
                            </Nav.Link>
                            <Collapse
                              in={open3}
                              className="sub-nav list-unstyled"
                            >
                              <ul>
                                <Nav.Item as="li">
                                  <Link
                                    to="/error-page-one"
                                    className={`${
                                      location.pathname === "/error-page-one"
                                        ? "active"
                                        : ""
                                    } nav-link`}
                                  >
                                    {" "}
                                    {t("header.error_page")} 1{" "}
                                  </Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                  <Link
                                    to="/error-page-two"
                                    className={`${
                                      location.pathname === "/error-page-two"
                                        ? "active"
                                        : ""
                                    } nav-link`}
                                  >
                                    {" "}
                                    {t("header.error_page")} 2{" "}
                                  </Link>
                                </Nav.Item>
                              </ul>
                            </Collapse>
                          </Nav.Item>
                        </ul>
                      </Collapse>
                    </Nav.Item>
                  </ul>
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
                    {loggedIn ? (
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
                              to="/playlist"
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
                                {t("header.my_account")}
                              </h6>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/playlist"
                              className="iq-sub-card d-flex align-items-center gap-3"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="m0 0h24v24h-24z"
                                  fill="#fff"
                                  opacity="0"
                                  transform="matrix(-1 0 0 -1 24 24)"
                                />
                                <path
                                  d="m19 11h-6v-6a1 1 0 0 0 -2 0v6h-6a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z"
                                  fill="currentColor"
                                />
                              </svg>
                              <h6 className="mb-0 font-size-14 fw-normal">
                                {t("header.watchlist")}
                              </h6>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/pricing"
                              className="iq-sub-card d-flex align-items-center gap-3"
                            >
                              <svg
                                width="16"
                                height="16"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <h6 className="mb-0 font-size-14 fw-normal">
                                {t("header.subscription")}
                              </h6>
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="iq-sub-card iq-logout-2 mt-1 d-flex justify-content-center gap-2"
                              onClick={logout}
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
                        <Link to="/login">
                          <i className="fas fa-user"></i> Login
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
