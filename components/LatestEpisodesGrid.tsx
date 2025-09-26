import React from 'react';
import type { LatestEpisode } from '../types';
import { LatestEpisodeCard } from './LatestEpisodeCard';

interface LatestEpisodesGridProps {
  episodes: LatestEpisode[];
  onEpisodeSelect: (episode: LatestEpisode) => void;
}

export const LatestEpisodesGrid: React.FC<LatestEpisodesGridProps> = ({ episodes, onEpisodeSelect }) => {
  return (
    <section>
        <h2 className="text-3xl font-bold text-text-primary mb-6 border-b-2 border-brand-primary pb-2">Latest Episode Releases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {episodes.map((episode) => (
            <LatestEpisodeCard key={episode.slug} episode={episode} onSelect={() => onEpisodeSelect(episode)} />
        ))}
        </div>
    </section>
  );
};
