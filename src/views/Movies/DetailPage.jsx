import React, { useMemo, memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import VideoJS from "../../components/plugins/VideoJs";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import PopOutPlayer from "./PopOutPlayer";
import { useAuth } from "../../hooks/useAuth";

const DetailPage = memo(() => {
  const [toggler, setToggler] = useState(false);
  const playerRef = React.useRef(null);
  const { t } = useTranslation();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { id: movieId } = useParams();
  const user = useSelector((state) => state.user?.user);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [hasPaid, setHasPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentStatusLoaded, setIsPaymentStatusLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [personDetails, setPersonDetails] = useState([]);
  const [videoJsOptions, setVideoJsOptions] = useState([]);
  const [videoJsTrailerOptions, setVideoJsTrailerOptions] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const isLoggedIn = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [
        movieResponse,
        likeStatusResponse,
        likeCountResponse,
        paymentStatusResponse,
      ] = await Promise.all([
        axios.get(`${apiUrl}/api/movies/${movieId}`),
        user
          ? axios.get(`${apiUrl}/api/movies/${movieId}/like`, {
              params: { userId: user._id },
            })
          : Promise.resolve(null),
        axios.get(`${apiUrl}/api/movies/${movieId}/like-count`),
        user
          ? axios.post(`${apiUrl}/api/payments/status`, {
              userId: user._id,
              movieId: movieId,
            })
          : Promise.resolve(null),
      ]);

      // Extract and set movie data
      const movieData = movieResponse.data.data;
      movieData.release_year = new Date(movieData.release_date).getFullYear();
      setSelectedMovie(movieData);

      if (movieData.trailer_url) {
        setTrailerUrl(movieData.trailer_url);
      }

      // Set like status and count
      if (likeStatusResponse) {
        setIsLiked(likeStatusResponse.data.isLiked);
      }
      setLikeCount(likeCountResponse.data.likeCount);

      // Set payment status
      if (paymentStatusResponse) {
        const { hasPaid, remainingTime } = paymentStatusResponse.data;
        setHasPaid(hasPaid);
        setRemainingTime(remainingTime);
      }

      // Fetch person details
      const personDetailsPromises = movieData.castAndCrews.map(
        async (person) => {
          const response = await axios.get(
            `${apiUrl}/api/persons/${person.person}`
          );
          return { ...response.data, role: person.role, type: person.type };
        }
      );

      const personDetailsArray = await Promise.all(personDetailsPromises);
      setPersonDetails(personDetailsArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsPaymentStatusLoaded(true);
    }
  }, [apiUrl, movieId, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setVideoJsOptions({
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
    });

    setVideoJsTrailerOptions({
      autoplay: false,
      controls: true,
      responsive: true,
      techOrder: ["youtube"],
      sources: [
        {
          src: trailerUrl || "", // Use an empty string if trailerUrl is null or undefined
          type: "video/youtube",
        },
      ],
      youtube: { iv_load_policy: 1 },
    });
  }, [trailerUrl]);

  const castMembers = personDetails.filter((person) => person.type === "cast");
  const crewMembers = personDetails.filter((person) => person.type === "crew");
  const handlePlayClick = () => setShowModal(true);
  const handlePlayerReady = useCallback(
    (player) => {
      playerRef.current = player;

      // Add event listener for the 'play' event
      player.on("play", handlePlayClick);

      player.on("waiting", () => {
        videojs.log("player is waiting");
      });
      player.on("dispose", () => {
        videojs.log("player will dispose");
      });
    },
    [handlePlayClick]
  );

  const handlePayment = useCallback(async () => {
    if (!isLoggedIn) {
      Swal.fire({ icon: "error", title: "Please login first" });
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/api/payments/initiate`, {
        userId: user._id,
        contentId: movieId,
        contentType: "Movie",
      });
      const { orderId } = response.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: selectedMovie.ppv_cost * 100,
        currency: "INR",
        name: "Movie Payment",
        description: `Payment for movie: ${selectedMovie.title}`,
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
          contentId: movieId,
          contentType: "Movie",
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
  }, [apiUrl, fetchData, movieId, selectedMovie, user]);

  const handleLikeClick = useCallback(async () => {
    if (!user) {
      Swal.fire({ icon: "error", title: "Please login first" });
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/movies/${movieId}/like`,
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
  }, [apiUrl, movieId, user]);

  if (isLoading || !selectedMovie || !isPaymentStatusLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`detail-page ${isLoading ? "loading" : "loaded"}`}>
      <div className="iq-main-slider site-video">
        <Container fluid>
          <Row>
            <Col lg="12">
              <div className="movie-details-container">
                <div className="movie-details-content">
                  <div className="video-container">
                    <VideoJS
                      options={hasPaid ? videoJsOptions : videoJsTrailerOptions}
                      onReady={handlePlayerReady}
                    />
                    {!hasPaid && <div className="trailer-tag">Trailer</div>}
                  </div>
                </div>
                <div className="movie-details-description ml-3">
                  <Row>
                    <Col md="12" className="mb-auto">
                      <div className="d-block d-lg-flex align-items-center">
                        <h2 className="trending-text fw-bold text-uppercase my-0 fadeInLeft animated d-inline-block">
                          {selectedMovie.title}
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
                              Casts
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey="third"
                              variant=""
                              id="nav-review-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-review"
                              type="button"
                              role="tab"
                              aria-controls="nav-review"
                              aria-selected="false"
                            >
                              Crews
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
                            <div className="cast-list">
                              {castMembers.map((person, index) => (
                                <div key={index} className="cast-item">
                                  <img
                                    src={person.image_url}
                                    alt={person.name}
                                    className="cast-image"
                                  />
                                  <p>{person.name || "Loading..."}</p>
                                </div>
                              ))}
                            </div>
                          </Tab.Pane>
                          <Tab.Pane
                            className="fade"
                            id="nav-review"
                            eventKey="third"
                            role="tabpanel"
                            aria-labelledby="nav-review-tab"
                          >
                            <div className="cast-list">
                              {crewMembers.map((person, index) => (
                                <div key={index} className="cast-item">
                                  <h5>{person.role}</h5>
                                  <img
                                    src={person.image_url}
                                    alt={person.name}
                                    className="cast-image"
                                  />
                                  <p>{person.name || "Loading..."}</p>
                                </div>
                              ))}
                            </div>
                          </Tab.Pane>
                        </Tab.Content>
                      </Tab.Container>
                    </div>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
});

DetailPage.displayName = "DetailPage";
export default DetailPage;
