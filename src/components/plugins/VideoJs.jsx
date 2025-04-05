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

      // Add YouTube tech to the player
      const player = (playerRef.current = videojs(videoElement, {
        ...options,
        techOrder: ["youtube"],
        forceSSL: true,
        youtube: {
          ...options.youtube,
          iv_load_policy: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          playsinline: 1
        }
      }, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
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
