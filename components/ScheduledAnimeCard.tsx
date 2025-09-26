import React from 'react';
import type { ScheduledAnime } from '../types';

interface ScheduledAnimeCardProps {
  anime: ScheduledAnime;
  onSelect: () => void;
}

const formatDateShort = (dateString: string) => {
    try {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        });
    } catch (e) {
        return dateString;
    }
}

export const ScheduledAnimeCard: React.FC<ScheduledAnimeCardProps> = ({ anime, onSelect }) => {
  return (
    <button 
      onClick={onSelect} 
      className="bg-base-200 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group text-left w-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-base-100"
      aria-label={`View details for ${anime.title}`}
    >
      <div className="relative">
        <img
          src={anime.poster}
          alt={`Poster for ${anime.title}`}
          className="w-full h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-0 right-0 p-2">
            <span className="px-2 py-1 text-xs font-semibold text-white bg-brand-secondary rounded-full">
                {formatDateShort(anime.nextAiringDate)}
            </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-text-primary h-12 truncate group-hover:whitespace-normal group-hover:text-brand-primary transition-colors duration-300">
            {anime.title}
        </h3>
      </div>
    </button>
  );
};