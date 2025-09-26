import React, { useState, useEffect } from 'react';
import type { Anime, AnimeDetails, Episode, Server } from '../types';
import { getAnimeDetails, getEpisodeServers } from '../services/animeService';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { VideoPlayer } from './VideoPlayer';

interface AnimeDetailsModalProps {
  anime: Anime;
  onClose: () => void;
  initialEpisodeSlug?: string;
}

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString + 'T00:00:00'); // Assume local timezone of API server is okay
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return dateString; // fallback to original string if date is invalid
    }
}


export const AnimeDetailsModal: React.FC<AnimeDetailsModalProps> = ({ anime, onClose, initialEpisodeSlug }) => {
  const [details, setDetails] = useState<AnimeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isEpisodeLoading, setIsEpisodeLoading] = useState(false);

  const handleEpisodeSelect = async (episode: Episode) => {
    try {
        setIsEpisodeLoading(true);
        setSelectedEpisode(episode);
        setServers([]);
        setSelectedServer(null);
        setError(null);
        const episodeServers = await getEpisodeServers(episode.slug);
        setServers(episodeServers);
        if (episodeServers.length > 0) {
            // Default to the first available server
            setSelectedServer(episodeServers[0]);
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load episode servers.');
    } finally {
        setIsEpisodeLoading(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const animeDetails = await getAnimeDetails(anime.id);
        setDetails(animeDetails);

        if (initialEpisodeSlug) {
            const episodeToSelect = animeDetails.episodes.find(
                ep => ep.slug === initialEpisodeSlug
            );
            if (episodeToSelect) {
                handleEpisodeSelect(episodeToSelect);
            }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load anime details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [anime.id, initialEpisodeSlug]);

  
  // Handle clicks on the modal backdrop to close it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  return (
    <div 
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-base-200 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text-secondary hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="overflow-y-auto p-6 flex-grow">
          {isLoading ? (
            <Loader />
          ) : !details ? (
            <ErrorMessage message={error || 'Could not load anime details.'} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1">
                  <img src={details.poster} alt={details.title} className="rounded-lg w-full" />
                </div>
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-bold text-brand-primary mb-2">{details.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${details.status === 'En emisión' ? 'bg-green-600' : 'bg-red-600'} text-white`}>{details.status}</span>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-secondary text-white">{details.type}</span>
                    {details.rating && <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-black">Rating: {details.rating}</span>}
                  </div>
                  <p className="text-text-secondary mb-4">{details.synopsis}</p>
                   {details.next_airing_episode && (
                    <div className="mt-4 p-3 bg-base-300 rounded-lg">
                      <p className="font-semibold text-text-primary text-sm">
                        Next Episode Air Date:
                      </p>
                      <p className="text-brand-primary text-lg font-bold">
                        {formatDate(details.next_airing_episode)}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {details.genres.map(genre => <span key={genre} className="bg-base-300 text-text-secondary text-xs font-medium px-2.5 py-1 rounded-full">{genre}</span>)}
                  </div>
                </div>
              </div>

              <div className="border-t border-base-300 pt-4">
                {selectedEpisode && (
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">
                            Watching: Episode {selectedEpisode.number}
                        </h3>
                        {isEpisodeLoading ? <Loader /> : error ? <ErrorMessage message={error} /> : (
                            <>
                                {selectedServer ? (
                                    <VideoPlayer server={selectedServer} />
                                ) : <ErrorMessage message="No video sources found for this episode." />}

                                {servers.length > 1 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <p className="text-sm font-semibold mr-2 self-center">Servers:</p>
                                        {servers.map(server => (
                                            <button 
                                                key={server.name}
                                                onClick={() => setSelectedServer(server)}
                                                className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedServer?.name === server.name ? 'bg-brand-primary text-white' : 'bg-base-300 hover:bg-base-100'}`}
                                            >
                                                {server.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
                
                <h3 className="text-2xl font-bold mb-4">Episodes</h3>
                <div className="max-h-60 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pr-2">
                  {details.episodes.map((ep) => (
                    <button
                      key={ep.number}
                      onClick={() => handleEpisodeSelect(ep)}
                      className={`w-full p-2 rounded-md text-center transition-colors text-sm ${selectedEpisode?.number === ep.number ? 'bg-brand-primary text-white font-bold' : 'bg-base-300 hover:bg-base-100'}`}
                    >
                      Episode {ep.number}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
       <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};