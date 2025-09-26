
import React from 'react';
import type { AnimeDetails } from '../types';

interface HeroProps {
  anime: AnimeDetails;
  onSelect: (anime: AnimeDetails) => void;
}

const truncateSynopsis = (text: string, maxLength: number) => {
  if (!text || text.length <= maxLength) return text;
  const lastSpace = text.lastIndexOf(' ', maxLength);
  return text.substr(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
};


export const Hero: React.FC<HeroProps> = ({ anime, onSelect }) => {
  return (
    <section 
      className="relative rounded-lg overflow-hidden mb-12 h-[60vh] min-h-[400px] flex items-end p-4 sm:p-8 text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${anime.poster})` }}
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 max-w-2xl animate-fade-in-up">
        <span className="px-3 py-1 text-sm font-semibold text-black bg-brand-primary rounded-full mb-4 inline-block shadow-lg shadow-brand-primary/20">
            Featured Anime
        </span>
        <h2 id="hero-title" className="text-4xl md:text-6xl font-extrabold mb-4 [text-shadow:0_2px_10px_rgba(0,0,0,0.7)]">
            {anime.title}
        </h2>
        <p className="text-base md:text-lg text-text-primary mb-6 max-w-prose [text-shadow:0_1px_5px_rgba(0,0,0,0.8)]">
          {truncateSynopsis(anime.synopsis, 250)}
        </p>
        <button
          onClick={() => onSelect(anime)}
          className="px-8 py-3 bg-brand-primary text-black font-bold rounded-full text-lg hover:bg-opacity-80 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 disabled:bg-gray-500 transition-all duration-300 transform hover:scale-105"
        >
          View Details
        </button>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
