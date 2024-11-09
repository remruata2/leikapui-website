import React, { memo, Fragment, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import CustomButton from "../CustomButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import { useSelector } from "react-redux";
import { theme_scheme_direction } from "../../store/setting/selectors";
import { useTranslation } from "react-i18next";
import "./OttHeroSlider.css";

const OttHeroSlider = memo(() => {
  const { t } = useTranslation();
  const themeSchemeDirection = useSelector(theme_scheme_direction);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [active, setActive] = useState(false);
  const [sliderData, setSliderData] = useState([]);
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/sliders`);
        const data = await response.json();
        setSliderData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching slider data:", error);
        setIsLoading(false);
      }
    };
    fetchSliderData();
  }, []);

  useEffect(() => {
    if (location.pathname === "/" && themeSchemeDirection === "rtl") {
      const wrapperClasses = document.getElementsByClassName("swiper-wrapper");
      const rtlWrapperClasses =
        document.getElementsByClassName("swiper-rtl-wrapper");

      const updateClasses = (element, index) => {
        const parentElement = element.parentElement;
        parentElement.classList.remove("swiper-wrapper");
        parentElement.classList.add("swiper-rtl-wrapper");

        switch (index) {
          case 0:
            parentElement.classList.add("iq-rtl");
            break;
          case 1:
            parentElement.classList.add("iq-rtl-one");
            break;
          case 2:
            parentElement.classList.add("iq-rtl-two");
            break;
          default:
            break;
        }
      };

      Array.from(wrapperClasses).forEach((wrapper, index) => {
        wrapper.classList.add("swiper-rtl-wrapper");
        Array.from(wrapper.childNodes).forEach((element) => {
          if (element.classList.contains("swiper-slide-active")) {
            updateClasses(element, index);
          }
        });
      });

      Array.from(rtlWrapperClasses).forEach((wrapper, index) => {
        Array.from(wrapper.childNodes).forEach((element) => {
          if (element.classList.contains("swiper-slide-active")) {
            updateClasses(element, index);
          }
        });
      });

      return () => {
        Array.from(wrapperClasses).forEach((wrapper) => {
          wrapper.classList.remove("swiper-rtl-wrapper");
          wrapper.classList.add("swiper-wrapper");
        });
      };
    }
  }, [active, themeSchemeDirection, location.pathname]);
  return (
    <Fragment>
      <div
        className={`iq-banner-thumb-slider ${isLoading ? "loading" : "loaded"}`}
      >
        <div className="slider">
          <div className="position-relative slider-bg d-flex justify-content-end">
            <div className="position-relative my-auto">
              <div
                className="horizontal_thumb_slider"
                data-swiper="slider-thumbs-ott"
              >
                <div className="banner-thumb-slider-nav">
                  <Swiper
                    dir={themeSchemeDirection}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    autoplay={{ delay: 1000 }}
                    direction="horizontal"
                    navigation={{
                      prevEl: ".slider-prev",
                      nextEl: ".slider-next",
                    }}
                    spaceBetween={24}
                    loop={true}
                    slidesPerView={2}
                    breakpoints={{
                      0: { direction: "horizontal", slidesPerView: 1 },
                      768: { direction: "horizontal", slidesPerView: 2 },
                    }}
                    watchSlidesProgress={true}
                    modules={[Navigation, Thumbs]}
                    className="swiper-horizontal swiper-container mb-0"
                    id="responsive-rtl-swiper"
                  >
                    {sliderData.map((slide, index) => (
                      <SwiperSlide
                        key={index}
                        className="swiper-bg"
                        id="iq-small-rtl-swiper"
                        data-swiper-small-slide-index={`small-${index + 1}`}
                      >
                        <div className="block-images position-relative">
                          <div className="img-box">
                            <img
                              src={slide.horizontal_poster}
                              className="img-fluid"
                              alt=""
                              loading="lazy"
                            />
                            <div className="block-description">
                              <h6 className="iq-title fw-500 mb-0">
                                {t(slide.title)}
                              </h6>
                              <span className="fs-12">
                                {slide.duration || "Tv Show"}
                              </span>
                              <br />
                              <span className="fs-12">{slide.genres}</span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div
                    className="slider-prev swiper-button"
                    onClick={() => setActive(!active)}
                  >
                    <i className="iconly-Arrow-Left-2 icli"></i>
                  </div>
                  <div
                    className="slider-next swiper-button"
                    onClick={() => setActive(!active)}
                  >
                    <i className="iconly-Arrow-Right-2 icli"></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="slider-images iq-rtl-thumb-swiper"
              data-swiper="slider-images-ott"
            >
              <Swiper
                dir={themeSchemeDirection}
                onSwiper={setThumbsSwiper}
                slidesPerView={1}
                modules={[Navigation, Thumbs]}
                watchSlidesProgress={true}
                autoplay={{ delay: 1000, disableOnInteraction: true }}
                data-swiper-slide-index="0"
                breakpoints={{
                  0: { allowTouchMove: true },
                  768: { allowTouchMove: true },
                  1025: { allowTouchMove: false },
                  1500: { allowTouchMove: false },
                }}
                allowTouchMove={false}
                loop={true}
                className="swiper-container"
                id="iq-rtl-thumb-swiper"
              >
                {sliderData.map((slide, index) => (
                  <SwiperSlide
                    key={index}
                    className="swiper"
                    id={index + 1}
                    data-swiper-slide-index={index}
                  >
                    <div className="slider--image block-images">
                      <img
                        src={slide.horizontal_poster}
                        loading="lazy"
                        alt="banner"
                      />
                    </div>
                    <div className="description">
                      <div className="row align-items-center h-100">
                        <div className="col-lg-6 col-md-12">
                          <div className="slider-content">
                            <div className="d-flex align-items-center RightAnimate mb-3">
                              <span className="badge rounded-0 text-dark text-uppercase px-3 py-2 me-3 bg-white mr-3">
                                {slide.rating}
                              </span>
                            </div>
                            <h1 className="texture-text big-font letter-spacing-1 line-count-1 text-capitalize RightAnimate-two">
                              {slide.title}
                            </h1>
                            <p className="line-count-3 RightAnimate-two">
                              {t("ott_home.after_death")}
                            </p>
                            <div>
                              <span className="font-size-14 fw-500">
                                {slide.duration || "Tv Show"}
                              </span>
                              <div className="text-primary font-size-14 fw-500 text-capitalize">
                                {t("ott_home.genres")}:{" "}
                                <span className="text-danger">
                                  {slide.genres}
                                </span>
                              </div>
                            </div>
                            {slide.type === "movie" ? (
                              <CustomButton
                                buttonTitle={t("ott_home.stream_now")}
                                link={`/movies-detail/${slide._id}`}
                                linkButton="false"
                              />
                            ) : (
                              <CustomButton
                                buttonTitle={t("ott_home.stream_now")}
                                link={`/shows-details/${slide._id}`}
                                linkButton="false"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
});

OttHeroSlider.displayName = OttHeroSlider;
export default OttHeroSlider;
