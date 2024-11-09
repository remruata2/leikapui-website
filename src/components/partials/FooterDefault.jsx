import { memo, Fragment, useState, useEffect } from "react";

// react-bootstrap
import { Container, Row, Col } from "react-bootstrap";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

// components
import Logo from "../logo";

// image

// the hook
import { useTranslation } from "react-i18next";

const FooterMega = memo(() => {
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
              <Row className="space-between">
                <Col xl={3} md={6} lg={6} className="mb-5 mb-lg-0">
                  <div className="footer-logo">
                    <Logo></Logo>
                  </div>
                  <p className="mb-4 font-size-14">
                    {t("footer.email_us")}:{" "}
                    <span className="text-white">
                      {t("customercare@mizostream.com")}
                    </span>
                  </p>
                  <p className="text-uppercase letter-spacing-1 font-size-14 mb-1">
                    {t("footer.customer_services")}
                  </p>
                  <p className="mb-0 contact text-white">+ (91) 7005584288</p>
                </Col>
                <Col md={6} className="float-right">
                  <ul className="menu list-inline p-0 d-flex flex-wrap align-items-center">
                    <li className="menu-item">
                      <Link to="/terms-of-use">
                        {" "}
                        {t("footer.terms_of_use")}
                      </Link>
                    </li>
                    <li id="menu-item-7316" className="menu-item">
                      <Link to="/privacyPolicy">
                        {" "}
                        {t("footer.privacy-policy")}
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link to="/faq"> {t("header.faq")}</Link>
                    </li>
                  </ul>
                  <p className="font-size-14">
                    © <span className="currentYear">2024</span>{" "}
                    <span className="text-primary">MizoStream</span>.{" "}
                  </p>
                </Col>
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
FooterMega.displayName = "FooterMega";
export default FooterMega;
