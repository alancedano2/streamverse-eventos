// src/components/VideoPlayer.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  streamUrl: string;
  fallbackMp4Url?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamUrl, fallbackMp4Url }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  // State to determine which URL to try playing
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState(streamUrl);

  useEffect(() => {
    // Determine the source URL and options based on current state
    const isMp4Fallback = currentPlayingUrl === fallbackMp4Url && !!fallbackMp4Url;
    const options = {
      autoplay: true,
      controls: !isMp4Fallback, // Hide controls for fallback MP4
      responsive: true,
      fluid: true,
      liveui: !isMp4Fallback, // Disable live UI for fallback MP4
      sources: [{
        src: currentPlayingUrl,
        type: currentPlayingUrl.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4',
      }],
    };

    if (!playerRef.current) {
      // Player does not exist, create it
      const videoElement = videoRef.current?.querySelector('video');
      if (!videoElement) return;

      const player = videojs(videoElement, options, () => {
        // Player is ready
      });

      player.on('error', () => {
        console.error('Video.js error:', player.error());
        // Only attempt fallback if we are currently trying to play the streamUrl
        // and a fallbackMp4Url is available and we are not already playing the fallback
        if (currentPlayingUrl === streamUrl && fallbackMp4Url) {
          console.log('Stream failed, attempting to play fallback MP4.');
          setCurrentPlayingUrl(fallbackMp4Url); // This will trigger re-render and re-run useEffect
        } else {
          console.error('Video failed and no fallback available or already on fallback.');
        }
      });

      playerRef.current = player;
    } else {
      // Player already exists, update its source and options if URL changes
      // This handles both initial streamUrl change and fallbackMp4Url change
      if (playerRef.current.currentSrc() !== currentPlayingUrl) {
        playerRef.current.src(options.sources);
        playerRef.current.controls(options.controls || false); // Ensure controls update
        // No need to set liveui directly, as it's part of initialization or src change handles it
        playerRef.current.autoplay(true);
        playerRef.current.load(); // Reload the player with new source
      }
    }
  }, [currentPlayingUrl, streamUrl, fallbackMp4Url]); // Re-run effect if current playing URL or original URLs change

  // If the original streamUrl prop changes from parent, reset currentPlayingUrl
  useEffect(() => {
    setCurrentPlayingUrl(streamUrl);
  }, [streamUrl]);

  // Dispose the player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="w-full h-full">
      <div ref={videoRef} className="video-js vjs-big-play-centered w-full h-full">
        <video className="video-js vjs-default-skin" preload="auto"></video>
      </div>
    </div>
  );
};

export default VideoPlayer;
