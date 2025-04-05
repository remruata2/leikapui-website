import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// Import YouTube tech
import "videojs-youtube";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady, style } = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready with options:", options);
        onReady && onReady(player);
      }));

      // Add error handling
      player.on('error', function() {
        console.error('Video.js Error:', player.error());
      });

    } else {
      const player = playerRef.current;

      // Update player options
      if (options.sources && options.sources.length > 0) {
        player.src(options.sources);
      }
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player style={{ width: "100%", ...style }}>
      <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default VideoJS;
