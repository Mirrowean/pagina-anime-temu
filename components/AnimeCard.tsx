import React from 'react';
import type { Anime } from '../types';

interface AnimeCardProps {
  anime: Anime;
  onSelect: () => void;
}

const truncateSynopsis = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
};

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect }) => {
  return (
    <button 
      onClick={onSelect} 
      className="bg-base-200 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group text-left w-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-base-100"
      aria-label={`View details for ${anime.title}`}
    >
      <div className="relative">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="px-2 py-1 text-xs font-semibold text-black bg-brand-primary rounded-full">{anime.type}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-text-primary mb-2 truncate group-hover:whitespace-normal group-hover:text-brand-primary transition-colors duration-300">{anime.title}</h3>
        <p className="text-sm text-text-secondary h-20 overflow-hidden">
          {truncateSynopsis(anime.synopsis, 120)}
        </p>
         {anime.rating && (
            <div className="mt-4 flex items-center">
                <svg aria-hidden="true" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <p className="ml-2 text-sm font-bold text-text-primary">{anime.rating}</p>
            </div>
        )}
      </div>
    </button>
  );
};