import React, {
  Fragment,
  useMemo,
  memo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Row, Col, Container, Nav, Tab, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useEnterExit } from "../../utilities/usePage";
import { useTranslation } from "react-i18next";
import ChoicesJs from "../../components/choice";
import FsLightbox from "fslightbox-react";
import FsLightBoxComponent from "../../components/fslight-box";
import { useSelector } from "react-redux";
import VideoJS from "../../components/plugins/VideoJs";
import { FaCartPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const TvShowsDetail = memo(() => {
  const { t } = useTranslation();
  const { id: tvShowId } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const user = useSelector((state) => state.user?.user);
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const [hasPaid, setHasPaid] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isPaymentStatusLoaded, setIsPaymentStatusLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [trailerUrl, setTrailerUrl] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        tvShowResponse,
        likeStatusResponse,
        likeCountResponse,
        paymentStatusResponse,
      ] = await Promise.all([
        axios.get(`${apiUrl}/api/tvShows/${tvShowId}`),
        user
          ? axios.get(`${apiUrl}/api/tvShows/${tvShowId}/like`, {
              params: { userId: user._id },
            })
          : Promise.resolve(null),
        axios.get(`${apiUrl}/api/tvShows/${tvShowId}/like-count`),
        user
          ? axios.post(`${apiUrl}/api/payments/status`, {
              userId: user._id,
              tvShowId: tvShowId,
            })
          : Promise.resolve(null),
      ]);

      const tvShowData = tvShowResponse.data;
      tvShowData.release_year = new Date(tvShowData.release_date).getFullYear();
      setSelectedMovie(tvShowData);

      if (tvShowData.trailer_url) {
        setTrailerUrl(tvShowData.trailer_url);
      }

      const seasonOptions = tvShowData.seasons.map((season, index) => ({
        value: index + 1,
        label: `Season ${index + 1}`,
      }));
      setOptions(seasonOptions);

      if (likeStatusResponse) {
        setIsLiked(likeStatusResponse.data.isLiked);
      }

      setLikeCount(likeCountResponse.data.likeCount);

      if (paymentStatusResponse) {
        const { hasPaid, remainingTime } = paymentStatusResponse.data;
        setHasPaid(hasPaid);
        setRemainingTime(remainingTime);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setIsPaymentStatusLoaded(true);
    }
  }, [apiUrl, tvShowId, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const videoJsOptions = useMemo(
    () => ({
      autoplay: false,
      controls: true,
      responsive: true,
      techOrder: ["youtube"],
      sources: [
        {
          src: "https://www.youtube.com/watch?v=Q1GlkwGSkO0",
          type: "video/youtube",
        },
      ],
      youtube: { iv_load_policy: 1 },
    }),
    []
  );

  const videoJsTrailerOptions = useMemo(
    () => ({
      autoplay: false,
      controls: true,
      responsive: true,
      techOrder: ["youtube"],
      sources: [
        {
          src: trailerUrl || "",
          type: "video/youtube",
        },
      ],
      youtube: { iv_load_policy: 1 },
    }),
    [trailerUrl]
  );

  const handleLikeClick = useCallback(async () => {
    if (!user) {
      Swal.fire({ icon: "error", title: "Please login first" });
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/tvShows/${tvShowId}/like`,
        {
          userId: user._id,
        }
      );
      if (response.data.message === "Like removed successfully") {
        setIsLiked(false);
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        setIsLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error liking the movie:", error);
    }
  }, [apiUrl, tvShowId, user]);

  const handlePayment = useCallback(async () => {
    if (!user) {
      Swal.fire({ icon: "error", title: "Please login first" });
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/api/payments/initiate`, {
        userId: user._id,
        tvShowId: tvShowId,
      });
      const { orderId } = response.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: selectedMovie.ppv_cost * 100,
        currency: "INR",
        name: "Series Payment",
        description: `Payment for Tv Series: ${selectedMovie.title}`,
        order_id: orderId,
        handler: async function (response) {
          console.log("Payment successful:", response);
          setHasPaid(true);
          await fetchData();
        },
        prefill: {
          name: user.full_name,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          userId: user._id,
          tvShowId: tvShowId,
        },
        theme: {
          color: "#F37254",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  }, [apiUrl, fetchData, tvShowId, selectedMovie, user]);

  useEnterExit();

  const handleSeasonChange = (event) => {
    setSeasonNumber(Number(event.target.value));
  };

  const handlePlayClick = (slideIndex) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: slideIndex,
    });
  };

  const playerRef = useRef(null);

  const handlePlayerReady = useCallback((player) => {
    playerRef.current = player;
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });
    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  }, []);

  if (loading || !selectedMovie || !isPaymentStatusLoaded) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Fragment>
      <div className="movie-details-container">
        <Container fluid>
          <Row>
            <Col lg="6">
              <div className="movie-details-content">
                {hasPaid ? (
                  <VideoJS
                    options={videoJsOptions}
                    onReady={handlePlayerReady}
                  />
                ) : (
                  <div className="video-container">
                    <VideoJS
                      options={videoJsTrailerOptions}
                      onReady={handlePlayerReady}
                    />
                    <div className="trailer-tag">Trailer</div>
                  </div>
                )}
              </div>
            </Col>
            <Col lg="6">
              <div className="movie-details-description">
                <Row>
                  <Col md="9" className="mb-auto">
                    <div className="d-block d-lg-flex align-items-center">
                      <h2 className="trending-text fw-bold text-uppercase my-0 fadeInLeft animated d-inline-block">
                        {selectedMovie.show_name}
                      </h2>
                    </div>
                    <div className="d-block d-lg-flex align-items-center mb-2">
                      <span className="border border-white p-1">
                        Release Year: {selectedMovie.release_year}
                      </span>
                      <span className="ms-3 font-Weight-500 genres-info me-2 border border-white p-1">
                        1hr : 48mins
                      </span>
                    </div>
                    <div className="d-flex flex-wrap align-items-center text-white text-detail flex-wrap mb-4">
                      <span className="badge bg-primary">
                        {selectedMovie.genres}
                      </span>
                      <span className="trending-year trending-year-list font-Weight-500 genres-info">
                        {selectedMovie.created_at}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-4 flex-wrap mb-4">
                      <ul className="list-inline p-0 share-icons music-play-lists mb-n2 mx-n2">
                        <li>
                          <span onClick={handleLikeClick}>
                            <i
                              className={`fa-heart ${
                                isLiked ? "fa-solid" : "far"
                              }`}
                            ></i>
                          </span>
                        </li>
                      </ul>
                      <span className="text-white">{likeCount} likes</span>
                    </div>
                  </Col>
                </Row>
                {hasPaid ? (
                  <span>
                    You have{" "}
                    <span className="text-primary text-strong">
                      {remainingTime}
                    </span>{" "}
                    to watch this movie
                  </span>
                ) : (
                  <button className="pay-button" onClick={handlePayment}>
                    <FaCartPlus size="1.5em" /> Rent for Rs.{" "}
                    {selectedMovie.ppv_cost} (3 days)
                  </button>
                )}
                <Row>
                  <div className="details-part content-details trending-info">
                    <Tab.Container defaultActiveKey="first">
                      <Nav className="iq-custom-tab tab-bg-gredient-center d-flex nav nav-pills align-items-center text-center mb-5 justify-content-left list-inline">
                        <Nav.Item>
                          <Nav.Link
                            eventKey="first"
                            variant=" d-flex align-items-center"
                            id="nav-description-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-description"
                            type="button"
                            role="tab"
                            aria-controls="nav-description"
                            aria-selected="true"
                          >
                            {t("detail_page.description")}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="second"
                            variant=""
                            id="nav-review-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-review"
                            type="button"
                            role="tab"
                            aria-controls="nav-review"
                            aria-selected="false"
                          >
                            Casts and Crews
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane
                          className="fade show"
                          eventKey="first"
                          id="nav-description"
                          role="tabpanel"
                          aria-labelledby="nav-description-tab"
                        >
                          <p>{t(selectedMovie.description)}</p>
                        </Tab.Pane>
                        <Tab.Pane
                          className="fade"
                          id="nav-review"
                          eventKey="second"
                          role="tabpanel"
                          aria-labelledby="nav-review-tab"
                        >
                          {selectedMovie?.casts}
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="show-detail section-padding">
        <Container fluid>
          <div className="show-movie-section">
            <div className="iq-custom-select d-inline-block">
              <ChoicesJs
                options={options}
                className="js-choice"
                select="one"
                name="season-selector"
                onChange={handleSeasonChange}
              />
            </div>
          </div>
          <div className="show-custom-tab">
            <Tab.Container defaultActiveKey="first">
              <Nav className="iq-custom-tab tab-bg-fill nav nav-pills text-center list-inline my-4">
                <Nav.Item>
                  <Nav.Link
                    eventKey="first"
                    variant=" d-flex align-items-center"
                    id="nav-episodes-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-episodes"
                    type="button"
                    role="tab"
                    aria-controls="nav-episodes"
                    aria-selected="true"
                    className="m-0"
                  >
                    {t("detail_page.episode")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="second"
                    variant=""
                    id="nav-description-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-description"
                    type="button"
                    role="tab"
                    aria-controls="nav-description"
                    aria-selected="false"
                    className="m-0"
                  >
                    {t("detail_page.description")}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane
                  className=" fade show"
                  eventKey="first"
                  id="nav-episodes"
                  role="tabpanel"
                  aria-labelledby="nav-episodes-tab"
                >
                  <Row className="list-inline p-0 mb-0">
                    {selectedMovie.seasons
                      .filter((season) => season.season_no === seasonNumber)
                      .flatMap((season) =>
                        season.episodes.map((item, index) => (
                          <Col
                            lg={3}
                            sm={12}
                            md={6}
                            key={index}
                            className={`${
                              index === season.episodes.length - 1
                                ? "mt-3 mt-md-0"
                                : ""
                            }`}
                          >
                            <div className="episode-block">
                              <div className="block-image position-relative">
                                <img
                                  src={item.horizontal_poster}
                                  alt="showImg"
                                  className="img-fluid img-zoom episode-thumbnail"
                                  loading="lazy"
                                />
                                <div className="episode-number">
                                  Episode No. {item.episode_no}
                                </div>
                                <div className="episode-play">
                                  {hasPaid ? (
                                    <span
                                      onClick={() => handlePlayClick(index + 1)}
                                    >
                                      <i className="fa-solid fa-play"></i>
                                    </span>
                                  ) : (
                                    <span>
                                      <i className="fa-solid fa-lock"></i>
                                    </span>
                                  )}
                                </div>
                                <FsLightbox
                                  toggler={lightboxController.toggler}
                                  sources={selectedMovie.seasons
                                    .filter(
                                      (season) =>
                                        season.season_no === seasonNumber
                                    )
                                    .flatMap((season) =>
                                      season.episodes.map(
                                        (item) => item.video_url
                                      )
                                    )}
                                  slide={lightboxController.slide}
                                  onOpen={() => {
                                    document.documentElement.requestFullscreen();
                                  }}
                                  onClose={() => {
                                    if (document.fullscreenElement) {
                                      document.exitFullscreen();
                                    }
                                  }}
                                  customControls={[
                                    <button
                                      key="prev"
                                      onClick={() =>
                                        setLightboxController({
                                          ...lightboxController,
                                          slide: lightboxController.slide - 1,
                                        })
                                      }
                                    >
                                      Prev Episode
                                    </button>,
                                    <button
                                      key="next"
                                      onClick={() =>
                                        setLightboxController({
                                          ...lightboxController,
                                          slide: lightboxController.slide + 1,
                                        })
                                      }
                                    >
                                      Next Episode
                                    </button>,
                                  ]}
                                />
                              </div>
                              <div className="epi-desc p-3">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                  <span className="border-gredient-left text-white rel-date">
                                    {new Date(
                                      item.release_date
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="text-primary run-time">
                                    {item.duration}
                                  </span>
                                </div>
                                <Link to="/episodes">
                                  <h5 className="epi-name text-white mb-0">
                                    {item.title}
                                  </h5>
                                </Link>
                                <p>{item.description}</p>
                              </div>
                            </div>
                          </Col>
                        ))
                      )}
                    {!hasPaid && (
                      <button className="btn btn-lg btn-primary">
                        Rent All Episodes (Rs. {selectedMovie.ppv_cost}) :
                        Season {seasonNumber}
                      </button>
                    )}
                  </Row>
                </Tab.Pane>
                <Tab.Pane
                  className=" fade"
                  id="nav-description"
                  eventKey="second"
                  role="tabpanel"
                  aria-labelledby="nav-description-tab"
                >
                  <p>{t(selectedMovie.description)}</p>
                </Tab.Pane>
                <Tab.Pane
                  className=" fade"
                  id="nav-review"
                  eventKey="third"
                  role="tabpanel"
                  aria-labelledby="nav-review-tab"
                ></Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </Container>
      </div>
    </Fragment>
  );
});

TvShowsDetail.displayName = "TvShowsDetail";
export default TvShowsDetail;
