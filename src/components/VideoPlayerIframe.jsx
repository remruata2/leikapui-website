import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const VideoPlayerIframe = ({ videoId, autoPlay = true, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watermarkPosition, setWatermarkPosition] = useState({
    top: 10,
    left: 10,
  });
  const [watermarkVisible, setWatermarkVisible] = useState(false);
  const user = useSelector((state) => state.user?.user);

  // Extract the video ID from the URL if a full URL is provided
  const extractVideoId = (url) => {
    if (!url) return null;

    // If it's already just an ID, return it
    if (!url.includes("/")) return url;

    // Extract ID from Bunny.net URL format (last segment after last slash)
    const segments = url.split("/");
    return segments[segments.length - 1];
  };

  const processedVideoId = extractVideoId(videoId);

  // Watermark animation logic
  useEffect(() => {
    if (!user) return;

    const showWatermark = () => {
      // Generate random position
      const newPosition = {
        top: Math.floor(Math.random() * 80) + 10, // 10-90%
        left: Math.floor(Math.random() * 80) + 10, // 10-90%
      };

      setWatermarkPosition(newPosition);
      setWatermarkVisible(true);

      // Hide after 3 seconds
      setTimeout(() => {
        setWatermarkVisible(false);

        // Show again after 5-10 seconds
        setTimeout(showWatermark, Math.random() * 5000 + 5000);
      }, 3000);
    };

    // Start the cycle
    const initialTimeout = setTimeout(showWatermark, 2000);

    return () => clearTimeout(initialTimeout);
  }, [user]);

  if (!processedVideoId) {
    return (
      <div className="video-error">
        <p>Video not available</p>
      </div>
    );
  }

  const handleFullscreen = () => {
    const container = document.getElementById(
      `video-container-${processedVideoId}`
    );

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const getUserInfo = () => {
    if (!user) return "Protected Content";
    return `${user.full_name || user.name || "User"} - ${user.email || ""}`;
  };

  const handleOnClose = () => {
    const iframe = document.querySelector(`iframe[src*="${processedVideoId}"]`);
    if (iframe) {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }
    onClose();
  };

  return (
    <div
      id={`video-container-${processedVideoId}`}
      style={{
        position: "relative",
        paddingTop: "56.25%",
      }}
    >
      <iframe
        src={`https://iframe.mediadelivery.net/embed/338066/${processedVideoId}?autoplay=${autoPlay}&loop=false&muted=false&preload=true&responsive=true`}
        loading="lazy"
        style={{
          border: 0,
          position: "absolute",
          top: 0,
          height: "100%",
          width: "100%",
        }}
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
        allowFullScreen={true}
        title="Video Player"
      ></iframe>

      {/* Close button */}
      {onClose && (
        <button
          onClick={handleOnClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
          aria-label="Close video"
        >
          ×
        </button>
      )}

      {/* Fullscreen button */}
      <button
        onClick={handleFullscreen}
        style={{
          position: "absolute",
          bottom: "15px",
          right: "15px",
          zIndex: 10,
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "6px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
          </svg>
        )}
      </button>

      {/* Dynamic watermark */}
      {watermarkVisible && user && (
        <div
          style={{
            position: "absolute",
            top: `${watermarkPosition.top}%`,
            left: `${watermarkPosition.left}%`,
            zIndex: 5,
            background: "transparent",
            color: "rgba(255, 255, 255, 0.3)",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            fontFamily: "sans-serif",
            textAlign: "center",
            opacity: watermarkVisible ? 0.5 : 0,
            transition: "opacity 0.5s ease-in-out",
            userSelect: "none",
            pointerEvents: "none",
            transform: "rotate(-5deg)",
            maxWidth: "80%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textShadow: "0px 0px 1px rgba(0,0,0,0.5)",
          }}
        >
          {getUserInfo()}
        </div>
      )}
    </div>
  );
};

VideoPlayerIframe.propTypes = {
  videoId: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool,
  onClose: PropTypes.func,
};

export default VideoPlayerIframe;
