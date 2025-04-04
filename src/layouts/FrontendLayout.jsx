import { memo, Fragment, Suspense, useState, useEffect } from "react";
import "./FrontendLayout.css";

// reacr-router
import { Outlet, Link } from "react-router-dom";

// header
import HeaderDefault from "../components/partials/HeaderDefault";
import HeaderMerchandise from "../components/merchandise/partials/HeaderDefault";

// footer
import FooterDefault from "../components/partials/FooterDefault";
import Loader from "../components/Loader";
//seetingoffCanvas

const FrontendLayout = memo((props) => {
  const [animationClass, setAnimationClass] = useState("animate__fadeIn");

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

  return (
    <Fragment>
      <div className="header-layout">
        {props.HeaderMega === "true" && <HeaderDefault />}
        {props.HeaderMerchandise === "true" && <HeaderMerchandise />}
        <div className="content-wrapper">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
        {/* Add Footer Component */}
        <FooterDefault />
      </div>
      <div
        id="back-to-top"
        style={{ display: "none" }}
        className={`animate__animated ${animationClass}`}
        onClick={scrollToTop}
      >
        <Link
          className="p-0 btn bg-primary btn-sm position-fixed top border-0 rounded-circle text-white"
          id="top"
          to="#top"
        >
          <i className="fa-solid fa-chevron-up"></i>
        </Link>
      </div>
    </Fragment>
  );
});

FrontendLayout.displayName = "FrontendLayout";
export default FrontendLayout;
