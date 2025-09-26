
import React from 'react';
import type { Server } from '../types';

interface VideoPlayerProps {
  server: Server;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ server }) => {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={server.url}
        title={`Video Player - ${server.name}`}
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};
