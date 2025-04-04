import React, { useMemo, memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import VideoJS from "../../components/plugins/VideoJs";
import VideoPlayerIframe from "../../components/VideoPlayerIframe";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import PopOutPlayer from "./PopOutPlayer";
import { useAuth } from "../../context/AuthContext";
import "./DetailPage.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const CastCard = memo(({ image_url, name, role }) => (
  <div className="cast-item">
    <img src={image_url} alt={name} className="cast-image" />
    <p className="cast-name">{name || "Loading..."}</p>
    <p className="cast-role">{role}</p>
  </div>
));

CastCard.displayName = "CastCard";

const DetailPage = memo(() => {
  const [personDetails, setPersonDetails] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toggler, setToggler] = useState(false);
  const playerRef = React.useRef(null);
  const { t } = useTranslation();
  const [selectedMovie, setSelectedMovie] = useState({});
  const { id: movieId } = useParams();
  const user = useSelector((state) => state.user?.user);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [remainingTime, setRemainingTime] = useState("some time");
  const [userData, setUserData] = useState(null);
  const [videoJsOptions, setVideoJsOptions] = useState([]);
  const [videoJsTrailerOptions, setVideoJsTrailerOptions] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [trailerVideoId, setTrailerVideoId] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const location = useLocation();
  const dispatch = useDispatch();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [renderVideo, setRenderVideo] = useState(false);

  // Ensure user data is synchronized with auth state
  useEffect(() => {
    if (isAuthenticated && authUser) {
      console.log("Auth state changed - user is authenticated:", authUser);
      if (!user) {
        console.log("Dispatching user data to Redux store");
        dispatch(setUser(authUser));
      }
    } else if (!isAuthenticated) {
      console.log("Auth state changed - user is not authenticated");
    }
  }, [isAuthenticated, authUser, user, dispatch]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [movieResponse, likeStatusResponse, likeCountResponse] =
        await Promise.all([
          axios.get(`${apiUrl}/api/movies/${movieId}`),
          user
            ? axios.get(`${apiUrl}/api/movies/${movieId}/like-status`, {
                params: { userId: user._id },
              })
            : Promise.resolve(null),
          axios.get(`${apiUrl}/api/movies/${movieId}/like-count`),
        ]);

      // Extract and set movie data
      const movieData = movieResponse.data.data;
      setSelectedMovie(movieData);

      // Set like status if user is authenticated
      if (likeStatusResponse) {
        setIsLiked(likeStatusResponse.data.isLiked);
      }

      // Set like count
      if (likeCountResponse) {
        setLikeCount(likeCountResponse.data.likesCount);
      }

      // Set video IDs from movie_url object if available
      if (movieData.movie_url) {
        // Prioritize dashUrl, then hlsUrl, then mp4Url
        const videoUrl =
          movieData.movie_url.dashUrl ||
          movieData.movie_url.hlsUrl ||
          movieData.movie_url.mp4Url;
        if (videoUrl) {
          setVideoId(videoUrl);
        }
      }

      // Set trailer URL if available
      if (movieData.trailer) {
        // If it's a Bunny.net URL, use as is
        if (movieData.trailer.includes("mediadelivery.net")) {
          setTrailerVideoId(movieData.trailer);
        } else {
          // Try to extract YouTube ID if it's a YouTube URL
          const trailerID = movieData.trailer.split("v=")[1]?.split("&")[0];
          if (trailerID) {
            setTrailerUrl(trailerID);
          }
        }
      }

      // Check payment status separately if user is authenticated
      if (user) {
        try {
          const token = localStorage.getItem("jwtToken");
          // Use the purchases/check endpoint
          const purchaseCheckResponse = await axios.get(
            `${apiUrl}/api/purchases/check/${movieId}`,
            {
              params: { userId: user._id },
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("Purchase check response:", purchaseCheckResponse.data);

          if (purchaseCheckResponse.data) {
            const { success, hasAccess } = purchaseCheckResponse.data;
            setHasPaid(hasAccess); // Use hasAccess instead of hasPaid

            // If there's still remainingTime in the response, use it
            if (purchaseCheckResponse.data.remainingTime) {
              setRemainingTime(purchaseCheckResponse.data.remainingTime);
            } else {
              // Default value or empty string if not provided
              setRemainingTime("some time");
            }
          }
        } catch (paymentError) {
          console.error("Error checking purchase status:", paymentError);
          // Don't set payment status as an error here, just log it
        }
      }

      // Process person details directly from the populated data
      const personDetails = movieData.castAndCrews.map((castCrew) => ({
        _id: castCrew.person._id,
        name: castCrew.person.name,
        image_url: castCrew.person.image_url,
        role: castCrew.role,
        type: castCrew.type,
      }));

      setPersonDetails(personDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
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
          src: `https://www.youtube.com/watch?v=${trailerUrl}`,
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
          src: `https://www.youtube.com/watch?v=${trailerUrl}` || "", // Use an empty string if trailerUrl is null or undefined
          type: "video/youtube",
        },
      ],
      youtube: { iv_load_policy: 1 },
    });
  }, [trailerUrl]);

  useEffect(() => {
    if (!paymentId || paymentStatus !== "processing") return;

    const interval = setInterval(async () => {
      try {
        // Get auth token from localStorage
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.error("No auth token available to check payment status");
          return;
        }

        // Use the exact same API call approach as in the Expo app
        const response = await axios.get(
          `${apiUrl}/api/payments/transaction-status/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Transaction status check result:", response.data);

        if (response.data.success) {
          if (response.data.transaction.status === "completed") {
            setPaymentStatus("success");
            clearInterval(interval);
            // Refresh data to get updated payment status
            fetchData();
          } else if (response.data.transaction.status === "failed") {
            setPaymentStatus("failed");
            clearInterval(interval);
            Swal.fire({
              title: "Payment Failed",
              text: "The payment could not be processed",
              icon: "error",
            });
          }
          // Continue polling for 'pending' status
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        // Don't clear interval on error, keep trying
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [paymentId, paymentStatus, apiUrl, fetchData]);

  useEffect(() => {
    if (showVideoModal) {
      setRenderVideo(true);
    } else {
      // Wait a moment before unmounting to allow for animation
      const timer = setTimeout(() => {
        setRenderVideo(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showVideoModal]);

  const castMembers = personDetails.filter((person) => person.type === "cast");
  const crewMembers = personDetails.filter((person) => person.type === "crew");

  const handlePlayClick = () => {
    // For full movie, show in modal
    if (hasPaid && videoId) {
      setShowVideoModal(true);
    } else {
      // For trailer just scroll to it
      const videoContainer = document.querySelector(".video-container");
      if (videoContainer) {
        videoContainer.scrollIntoView({ behavior: "smooth" });
      }

      // If using VideoJS player, play it directly
      if (playerRef.current) {
        playerRef.current.play();
      }
    }
  };

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
    try {
      console.log("Payment initiated, auth state:", {
        isAuthenticated,
        user,
        authUser,
      });

      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        navigate("/login", { state: { from: location } });
        return;
      }

      // Use the auth user or redux user, whichever is available
      const userData = authUser || user;

      if (!userData || !userData._id) {
        console.log("No user data available:", { authUser, user });

        // Attempt to load user data directly from localStorage
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          try {
            const parsedUserData = JSON.parse(storedUserData);
            if (parsedUserData && parsedUserData._id) {
              console.log("Found user data in localStorage:", parsedUserData);
              processPayment(parsedUserData);
              return;
            }
          } catch (e) {
            console.error("Error parsing userData from localStorage:", e);
          }
        }

        Swal.fire({
          title: "Authentication Error",
          text: "User data not available. Please log in again.",
          icon: "error",
        });
        navigate("/login", { state: { from: location } });
        return;
      }

      // If we have userData, proceed with payment
      processPayment(userData);
    } catch (error) {
      console.error("Payment initialization error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setPaymentLoading(false);
      Swal.fire({
        title: "Payment Initialization Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Could not start payment process",
        icon: "error",
      });
    }
  }, [
    apiUrl,
    movieId,
    selectedMovie,
    isAuthenticated,
    user,
    authUser,
    navigate,
    location,
  ]);

  // Function to handle the actual payment process
  const processPayment = async (userData) => {
    try {
      setPaymentLoading(true);

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      console.log("Initiating payment with data:", {
        userId: userData._id,
        contentId: movieId,
        contentType: "Movie",
        amount: selectedMovie.ppv_cost,
      });

      // Use the exact endpoint name from backend
      const orderResponse = await axios.post(
        `${apiUrl}/api/payments/initiate`,
        {
          userId: userData._id,
          contentId: movieId,
          contentType: "Movie",
          amount: selectedMovie.ppv_cost,
          deviceInfo: {
            deviceType: "web",
            browser: navigator.userAgent,
          },
        }
      );

      console.log("Order response:", orderResponse.data);

      if (!orderResponse.data.order_id) {
        throw new Error("No order ID received from server");
      }

      // Store these values for payment verification
      const transactionId = orderResponse.data.transaction_id;
      const paymentReference = orderResponse.data.paymentReference;

      console.log("Creating Razorpay instance with options:", {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: "INR",
        order_id: orderResponse.data.order_id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "Movie Payment",
        description: `Payment for movie: ${selectedMovie.title}`,
        order_id: orderResponse.data.order_id,
        prefill: {
          name: userData?.full_name || "",
          email: userData?.email || "",
          contact: userData?.phone || "",
        },
        handler: async function (response) {
          try {
            console.log(
              "Payment successful, verifying with backend:",
              response
            );
            // Verify the payment with backend
            const verifyResponse = await axios.post(
              `${apiUrl}/api/payments/verify`,
              {
                userId: userData._id,
                contentId: movieId,
                contentType: "Movie",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                transactionId: transactionId, // Add missing required field
                paymentReference: paymentReference, // Add missing required field
                deviceInfo: {
                  deviceType: "web",
                  browser: navigator.userAgent,
                },
              }
            );

            console.log("Verification response:", verifyResponse.data);

            if (verifyResponse.data.success) {
              setPaymentId(verifyResponse.data.transactionId);
              setPaymentStatus("processing");
              Swal.fire({
                title: "Payment Successful",
                text: "Your payment has been processed successfully.",
                icon: "success",
              });
              // Refresh payment status
              fetchData();
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            console.error("Error response:", error.response?.data);
            setPaymentStatus("failed");
            Swal.fire({
              title: "Payment Failed",
              text:
                error.response?.data?.message || "Payment verification failed",
              icon: "error",
            });
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        Swal.fire({
          title: "Payment Failed",
          text: response.error.description || "Payment could not be completed",
          icon: "error",
        });
        setPaymentLoading(false);
      });

      console.log("Opening Razorpay modal");
      rzp.open();
    } catch (error) {
      console.error("Payment process error:", error);
      setPaymentLoading(false);
      Swal.fire({
        title: "Payment Error",
        text: error.message || "An error occurred during payment",
        icon: "error",
      });
    }
  };

  const handleLikeClick = useCallback(async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
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
  }, [apiUrl, movieId, user, isAuthenticated, navigate, location]);

  // Webhook simulation (for testing)
  const simulateWebhook = async (paymentId, status) => {
    try {
      await axios.post(`${apiUrl}/api/payments/webhook/simulate`, {
        paymentId,
        status,
      });
    } catch (error) {
      console.error("Error simulating webhook:", error);
    }
  };

  if (isLoading || !selectedMovie) {
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
                    {/* Always show trailer on the page */}
                    {trailerVideoId ? (
                      <VideoPlayerIframe
                        videoId={trailerVideoId}
                        autoPlay={false}
                      />
                    ) : (
                      <VideoJS
                        options={videoJsTrailerOptions}
                        onReady={handlePlayerReady}
                      />
                    )}
                    {/* Show trailer tag */}
                    <div className="trailer-tag">Trailer</div>
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
                    <div className="d-flex flex-column">
                      <button
                        className="btn btn-primary btn-watch"
                        onClick={handlePlayClick}
                        style={{
                          width: "fit-content",
                          padding: "10px 24px",
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginBottom: "20px",
                        }}
                      >
                        <i className="fa fa-play me-2"></i> Watch Now
                      </button>
                      {/* Only show remaining time if it's available */}
                      {remainingTime && (
                        <span className="mb-3">
                          You have{" "}
                          <span className="text-primary fw-bold">
                            {remainingTime}
                          </span>{" "}
                          to watch this movie
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex flex-column">
                      <p className="mb-3">
                        Rent this movie to watch the full content
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        style={{
                          width: "fit-content",
                          padding: "10px 24px",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        {paymentLoading ? (
                          <>
                            <i className="fa fa-spinner fa-spin me-2"></i>{" "}
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-credit-card me-2"></i> Rent for
                            ₹{selectedMovie?.ppv_cost}
                          </>
                        )}
                      </button>
                    </div>
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
                            <div className="cast-slider-container">
                              <Swiper
                                modules={[Navigation, Thumbs]}
                                navigation={{
                                  prevEl: ".cast-prev",
                                  nextEl: ".cast-next",
                                }}
                                spaceBetween={16}
                                watchOverflow={true}
                                observer={true}
                                observeParents={true}
                                breakpoints={{
                                  0: {
                                    slidesPerView: 2,
                                    slidesPerGroup: 2,
                                  },
                                  768: {
                                    slidesPerView: 4,
                                    slidesPerGroup: 2,
                                  },
                                  1025: {
                                    slidesPerView: 6,
                                    slidesPerGroup: 3,
                                  },
                                }}
                                className="cast-swiper"
                              >
                                {castMembers.map((data, index) => (
                                  <SwiperSlide key={index}>
                                    <CastCard
                                      image_url={data.image_url}
                                      name={data.name}
                                      role={data.role}
                                    />
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                              <div className="cast-prev swiper-button">
                                <i className="fa fa-chevron-left"></i>
                              </div>
                              <div className="cast-next swiper-button">
                                <i className="fa fa-chevron-right"></i>
                              </div>
                            </div>
                          </Tab.Pane>
                          <Tab.Pane
                            className="fade"
                            id="nav-review"
                            eventKey="third"
                            role="tabpanel"
                            aria-labelledby="nav-review-tab"
                          >
                            <div className="cast-slider-container">
                              <Swiper
                                modules={[Navigation, Thumbs]}
                                navigation={{
                                  prevEl: ".crew-prev",
                                  nextEl: ".crew-next",
                                }}
                                spaceBetween={16}
                                watchOverflow={true}
                                observer={true}
                                observeParents={true}
                                breakpoints={{
                                  0: {
                                    slidesPerView: 2,
                                    slidesPerGroup: 2,
                                  },
                                  768: {
                                    slidesPerView: 4,
                                    slidesPerGroup: 2,
                                  },
                                  1025: {
                                    slidesPerView: 6,
                                    slidesPerGroup: 3,
                                  },
                                }}
                                className="cast-swiper"
                              >
                                {crewMembers.map((data, index) => (
                                  <SwiperSlide key={index}>
                                    <CastCard
                                      image_url={data.image_url}
                                      name={data.name}
                                      role={data.role}
                                    />
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                              <div className="crew-prev swiper-button">
                                <i className="fa fa-chevron-left"></i>
                              </div>
                              <div className="crew-next swiper-button">
                                <i className="fa fa-chevron-right"></i>
                              </div>
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
      {/* Modal for full movie playback */}
      {hasPaid && (
        <div
          className={`video-modal ${showVideoModal ? "show" : ""}`}
          style={{
            display: showVideoModal ? "flex" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            zIndex: 9999,
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            className="modal-close"
            onClick={() => {
              setShowVideoModal(false);
            }}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              zIndex: 10000,
            }}
          >
            <i className="fa fa-times"></i>
          </div>
          <div
            className="modal-content"
            style={{
              width: "90%",
              maxWidth: "1200px",
            }}
          >
            {renderVideo && videoId && (
              <VideoPlayerIframe
                videoId={videoId}
                autoPlay={true}
                onClose={() => setShowVideoModal(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

DetailPage.displayName = "DetailPage";
export default DetailPage;
