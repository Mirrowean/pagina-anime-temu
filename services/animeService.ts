import type { Anime, AnimeDetails, LatestEpisode, Server, AnimeFilters, AnimeSearchResponse } from '../types';

const API_BASE_URL = 'https://animeflv.ahmedrangel.com/api';
// The CORS proxy service is frequently unstable. Swapping to another alternative
// to resolve the "Failed to fetch" errors.
const CORS_PROXY = 'https://cors.eu.org/';

const mapApiItemToAnime = (item: any): Anime => ({
  id: item.slug,
  title: item.title,
  poster: item.cover,
  synopsis: item.synopsis || 'No synopsis available.',
  type: item.type,
  url: item.url,
  rating: item.rating,
});

const STATUS_MAP: { [key:string]: number } = {
  emision: 1,
  finalizado: 2,
  proximamente: 3,
};

export const searchAnime = async (
  query: string,
  filters: Partial<AnimeFilters> = {},
  page: number = 1
): Promise<AnimeSearchResponse> => {
  const emptyResponse: AnimeSearchResponse = { animes: [], currentPage: 1, hasNextPage: false, totalPages: 1 };
  try {
    let url: string;
    const options: RequestInit = { method: 'GET' };

    if (query) {
      // Text search uses GET /api/search
      const params = new URLSearchParams({
        query: query,
        page: page.toString(),
      });
      const searchUrl = `${API_BASE_URL}/search?${params.toString()}`;
      url = `${CORS_PROXY}${searchUrl}`;
    } 
    else {
      // Filtering uses GET /api/search/by-url, by constructing an animeflv.net URL.
      // This is more reliable as per the API documentation.
      const browseUrl = new URL('https://animeflv.net/browse');
      const params = browseUrl.searchParams;

      if (filters.genre && filters.genre !== 'all') {
        params.append('genre[]', filters.genre);
      }
      if (filters.type && filters.type !== 'all') {
        params.append('type[]', filters.type);
      }
      if (filters.status && filters.status !== 'all') {
        const selectedStatus = STATUS_MAP[filters.status];
        if (selectedStatus) {
          params.append('status[]', selectedStatus.toString());
        }
      }
      if (filters.order && filters.order !== 'default') {
        params.set('order', filters.order);
      }
      params.set('page', page.toString());
      
      const targetUrl = browseUrl.toString();
      const filterApiUrl = `${API_BASE_URL}/search/by-url?url=${encodeURIComponent(targetUrl)}`;
      url = `${CORS_PROXY}${filterApiUrl}`;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 404) return emptyResponse; 
      throw new Error(`API Error: ${response.status} ${response.statusText}. The API or proxy might be down.`);
    }

    const apiResponse = await response.json();
    
    if (apiResponse.success === false) {
      return emptyResponse;
    }
    
    if (apiResponse && apiResponse.success && apiResponse.data) {
        const data = apiResponse.data;
        // The API response for both search and filter nests the anime list in the 'media' property.
        const animeList = data.media || []; 
        const animes = animeList.map(mapApiItemToAnime);
        
        // The API response has pagination fields directly on the 'data' object.
        return {
            animes,
            currentPage: data.currentPage || 1,
            hasNextPage: data.hasNextPage || false,
            totalPages: data.foundPages || 1,
        };
    }
    
    throw new Error('The API returned data in an unexpected format.');

  } catch (error) {
    console.error('Failed to fetch anime:', error);
    if (error instanceof Error && error.message.startsWith('API Error')) {
      throw error;
    }
    throw new Error('Failed to fetch data. Please check your network connection or try again later.');
  }
};


export const getAnimeDetails = async (slug: string): Promise<AnimeDetails> => {
  const url = `${CORS_PROXY}${API_BASE_URL}/anime/${slug}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const apiResponse = await response.json();
    if (apiResponse && apiResponse.success && apiResponse.data) {
      return {
        ...apiResponse.data,
        id: slug, // slug is not in the response data, so we add it
        poster: apiResponse.data.cover,
      };
    }
    throw new Error('Unexpected API response format for anime details.');
  } catch (error) {
    console.error('Failed to fetch anime details:', error);
    throw new Error('Failed to load anime details.');
  }
};

export const getEpisodeServers = async (episodeSlug: string): Promise<Server[]> => {
    const url = `${CORS_PROXY}${API_BASE_URL}/anime/episode/${episodeSlug}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        const apiResponse = await response.json();
        if (apiResponse && apiResponse.success && apiResponse.data && apiResponse.data.servers) {
            return apiResponse.data.servers.map((server: any) => ({
                name: server.name,
                url: server.embed,
            }));
        }
        throw new Error('Unexpected API response format for episode servers.');
    } catch (error) {
        console.error('Failed to fetch episode servers:', error);
        throw new Error('Failed to load episode video sources.');
    }
};

export const getLatestEpisodes = async (): Promise<LatestEpisode[]> => {
  const url = `${CORS_PROXY}${API_BASE_URL}/list/latest-episodes`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const apiResponse = await response.json();
    if (apiResponse && apiResponse.success && Array.isArray(apiResponse.data)) {
      return apiResponse.data.map((item: any): LatestEpisode => {
        // The anime slug is part of the episode slug. E.g., "shaman-king-flowers-10" -> "shaman-king-flowers"
        const animeIdMatch = item.slug.match(/(.*)-\d+$/);
        const animeId = animeIdMatch ? animeIdMatch[1] : item.slug.substring(0, item.slug.lastIndexOf('-'));

        return {
          animeId,
          title: item.title,
          poster: item.cover,
          slug: item.slug,
          number: item.number,
          url: item.url,
        };
      });
    }
    throw new Error('Unexpected API response format for latest episodes.');
  } catch (error) {
    console.error('Failed to fetch latest episodes:', error);
    throw new Error('Failed to load latest episodes.');
  }
};