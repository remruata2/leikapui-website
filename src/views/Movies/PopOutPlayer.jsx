import React, { useEffect, useRef, forwardRef } from "react";
import VideoJS from "../../components/plugins/VideoJs";

const PopOutPlayer = forwardRef(
  ({ options, onReady, isOpen, onClose }, ref) => {
    const playerRef = useRef(null);

    useEffect(() => {
      if (isOpen && playerRef.current) {
        playerRef.current.player.play();
      }
    }, [isOpen]);

    return (
      <div
        className={`pop-out-player ${isOpen ? "open" : "closed"}`}
        onClick={onClose}
      >
        <div className="player-container" onClick={(e) => e.stopPropagation()}>
          <VideoJS
            options={options}
            onReady={onReady}
            ref={ref}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    );
  }
);

export default PopOutPlayer;
