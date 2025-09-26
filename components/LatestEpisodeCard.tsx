import React from 'react';
import type { LatestEpisode } from '../types';

interface LatestEpisodeCardProps {
  episode: LatestEpisode;
  onSelect: () => void;
}

export const LatestEpisodeCard: React.FC<LatestEpisodeCardProps> = ({ episode, onSelect }) => {
  return (
    <button 
      onClick={onSelect} 
      className="bg-base-200 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group text-left w-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-base-100"
      aria-label={`Watch ${episode.title} Episode ${episode.number}`}
    >
      <div className="relative">
        <img
          src={episode.poster}
          alt={`Poster for ${episode.title}`}
          className="w-full h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute top-0 right-0 p-2">
            <span className="px-2 py-1 text-xs font-semibold text-black bg-brand-primary rounded-full shadow-lg shadow-brand-primary/30">
                EP {episode.number}
            </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-text-primary h-12 truncate group-hover:whitespace-normal group-hover:text-brand-primary transition-colors duration-300">
            {episode.title}
        </h3>
      </div>
    </button>
  );
};