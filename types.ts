
export interface Anime {
  id: string; // From 'slug'
  title: string;
  poster: string; // From 'cover'
  synopsis: string;
  type: string;
  url: string;
  rating?: string;
  // These are not in search results from the new API
  genres?: string[];
  status?: string;
  total_episodes?: string;
}

export interface Episode {
  number: number;
  slug: string;
  url: string;
}

export interface LatestEpisode {
  title: string;
  number: number;
  poster: string; // from 'cover'
  slug: string; // episode slug
  url: string;
  animeId: string; // parsed from episode slug
}

export interface ScheduledAnime {
  id: string;
  title: string;
  poster: string;
  nextAiringDate: string;
}

export interface Schedule {
  [key: string]: ScheduledAnime[];
}

export interface AnimeDetails extends Anime {
  alternative_titles: string[];
  genres: string[];
  episodes: Episode[];
  related: any[]; // Define more specifically if needed
  next_airing_episode: string | null;
}

export interface Server {
    name: string;
    url: string; // This will be the embed URL
}

export interface EpisodeDetails {
    title: string;
    number: number;
    servers: Server[];
}

export interface AnimeFilters {
  genre: string;
  type: string;
  status: string;
  order: string;
}

export interface AnimeSearchResponse {
  animes: Anime[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

export interface FilterOptions {
  genres: Record<string, string>;
  types: Record<string, string>;
  statuses: Record<string, string>;
  orders: Record<string, string>;
}
