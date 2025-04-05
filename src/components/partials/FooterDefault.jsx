import { memo, Fragment, useState, useEffect } from "react";

// react-bootstrap
import { Container, Row, Col, Button } from "react-bootstrap";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

// components
import Logo from "../logo";

// images
import androidIcon from "../../assets/images/platforms/android-icon.svg";
import iosIcon from "../../assets/images/platforms/ios-icon.svg";
import desktopIcon from "../../assets/images/platforms/desktop-icon.svg";

// the hook
import { useTranslation } from "react-i18next";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const FooterDefault = memo(() => {
  const { t } = useTranslation();
  const [animationClass, setAnimationClass] = useState("animate__fadeIn");
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (document.documentElement.scrollTop > 250) {
      setAnimationClass("animate__fadeIn");
    } else {
      setAnimationClass("animate__fadeOut");
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);
  return (
    <>
      <Fragment>
        <footer className="footer footer-default">
          <Container fluid>
            <div className="footer-top">
              <Row className="space-between gx-5">
                {/* Downloads Section */}
                <Col xs={12} md={6} className="mb-5 mb-md-0">
                  <h5 className="text-white mb-4 text-center text-md-start">
                    Download Our App
                  </h5>
                  <p className="font-size-14 mb-4 text-center text-md-start">
                    Get the best streaming experience on your preferred device
                  </p>

                  <div className="download-options">
                    {/* Android Option */}
                    <div className="platform-option mb-4">
                      <div className="d-flex align-items-center mb-2">
                        <div className="platform-icon me-3">
                          <img
                            src={androidIcon}
                            alt="Android"
                            width="24"
                            height="24"
                            style={{ filter: "invert(1)" }}
                          />
                        </div>
                        <h6 className="text-white mb-0">Android</h6>
                      </div>
                      <Button
                        as="a"
                        href="https://leikapui.b-cdn.net/application-0b3f3992-3731-47dd-a8ea-df5f915fe3c7.apk"
                        download
                        variant="primary"
                        size="sm"
                        className="download-btn"
                      >
                        Download APK
                      </Button>
                    </div>

                    {/* iOS Option */}
                    <div className="platform-option mb-4">
                      <div className="d-flex align-items-center mb-2">
                        <div className="platform-icon me-3">
                          <img
                            src={iosIcon}
                            alt="iOS"
                            width="24"
                            height="24"
                            style={{ filter: "invert(1)" }}
                          />
                        </div>
                        <h6 className="text-white mb-0">iOS</h6>
                      </div>
                      <span className="badge bg-secondary">Coming Soon</span>
                    </div>

                    {/* Desktop Option */}
                    <div className="platform-option mb-4">
                      <div className="d-flex align-items-center mb-2">
                        <div className="platform-icon me-3">
                          <img
                            src={desktopIcon}
                            alt="Desktop"
                            width="24"
                            height="24"
                            style={{ filter: "invert(1)" }}
                          />
                        </div>
                        <h6 className="text-white mb-0">Desktop</h6>
                      </div>
                      <span className="badge bg-secondary">Coming Soon</span>
                    </div>
                  </div>
                </Col>

                {/* Email and Links section - hidden on mobile */}
                {!isMobile && (
                  <Col xs={12} md={6} className="ps-md-5">
                    <h5 className="text-white mb-4 text-center text-md-start">
                      Important Links
                    </h5>
                    <ul className="list-unstyled footer-link-list">
                      <li className="mb-3">
                        <a
                          href="mailto:support@leikapuistudios.com"
                          className="text-white-50 hover-white"
                        >
                          Email Us: support@leikapuistudios.com
                        </a>
                      </li>
                      <li className="mb-3">
                        <Link
                          to="/privacy-policy"
                          className="text-white-50 hover-white"
                        >
                          {t("footer.privacy-policy")}
                        </Link>
                      </li>
                      <li className="mb-3">
                        <Link
                          to="/terms-of-use"
                          className="text-white-50 hover-white"
                        >
                          {t("footer.terms_of_use")}
                        </Link>
                      </li>
                      <li className="mb-3">
                        <Link
                          to="/cancellation-refund"
                          className="text-white-50 hover-white"
                        >
                          {t("Cancellation and Refund")}
                        </Link>
                      </li>
                      <li className="mb-3">
                        <Link
                          to="/contact-us"
                          className="text-white-50 hover-white"
                        >
                          {t("Contact Us")}
                        </Link>
                      </li>
                    </ul>
                    <p className="font-size-14 mt-4 text-center text-md-start">
                      &copy; <span className="currentYear">2025</span>{" "}
                      <span className="text-primary">Leikapui Studios</span>.{" "}
                    </p>
                  </Col>
                )}
              </Row>
            </div>
          </Container>
        </footer>
        <div
          id="back-to-top"
          style={{ display: "none" }}
          className={`animate__animated ${animationClass}`}
          onClick={scrollToTop}
        >
          <Link
            className="p-0 btn bg-primary btn-sm position-fixed top border-0 rounded-circle"
            id="top"
            to="#top"
          >
            <i className="fa-solid fa-chevron-up"></i>
          </Link>
        </div>
      </Fragment>
    </>
  );
});
FooterDefault.displayName = "FooterDefault";
export default FooterDefault;
