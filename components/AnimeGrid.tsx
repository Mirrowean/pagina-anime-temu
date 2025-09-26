
import React from 'react';
import type { Anime } from '../types';
import { AnimeCard } from './AnimeCard';

interface AnimeGridProps {
  animes: Anime[];
  onAnimeSelect: (anime: Anime) => void;
}

export const AnimeGrid: React.FC<AnimeGridProps> = ({ animes, onAnimeSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} onSelect={() => onAnimeSelect(anime)} />
      ))}
    </div>
  );
};
