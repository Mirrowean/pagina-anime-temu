import React, { useState, useEffect } from 'react';
import type { Anime, LatestEpisode, Schedule, ScheduledAnime, AnimeFilters, AnimeDetails, FilterOptions } from './types';
import { searchAnime, getLatestEpisodes, getAnimeDetails } from './services/animeService';
import { getGenres, getTypes, getStatuses, getOrders } from './services/filterService';
import { SearchBar } from './components/SearchBar';
import { AnimeGrid } from './components/AnimeGrid';
import { LatestEpisodesGrid } from './components/LatestEpisodesGrid';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { AnimeDetailsModal } from './components/AnimeDetailsModal';
import { CalendarView } from './components/CalendarView';
import { FilterBar } from './components/FilterBar';
import { PaginationControls } from './components/PaginationControls';
import { Hero } from './components/Hero';

type View = 'home' | 'search' | 'calendar' | 'catalog';

const App: React.FC = () => {
  // Search and filter state
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<AnimeFilters>({
    genre: 'all',
    type: 'all',
    status: 'all',
    order: 'default',
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    genres: { all: 'Todos los Géneros' },
    types: {},
    statuses: {},
    orders: {},
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // Other state
  const [latestEpisodes, setLatestEpisodes] = useState<LatestEpisode[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScheduleLoading, setIsScheduleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [view, setView] = useState<View>('home');
  const [selectedAnimeInfo, setSelectedAnimeInfo] = useState<{ anime: Anime; initialEpisodeSlug?: string } | null>(null);
  const [heroAnime, setHeroAnime] = useState<AnimeDetails | null>(null);

  useEffect(() => {
    const fetchInitialDataAndFilters = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const latestEpisodesResult = await getLatestEpisodes();
        setLatestEpisodes(latestEpisodesResult);
        
        // Use static, verified filter options to ensure correct API slugs
        setFilterOptions({
            genres: getGenres(),
            types: getTypes(),
            statuses: getStatuses(),
            orders: getOrders(),
        });

        if (latestEpisodesResult.length > 0) {
            try {
                const heroEpisode = latestEpisodesResult[0];
                const heroDetails = await getAnimeDetails(heroEpisode.animeId);
                setHeroAnime(heroDetails);
            } catch (heroError) {
                console.error("Failed to load hero anime details:", heroError);
            }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load initial application data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialDataAndFilters();
  }, []);
  
  useEffect(() => {
    const buildSchedule = async () => {
        if (latestEpisodes.length === 0 || Object.keys(schedule).length > 0) {
            return;
        }

        try {
            setIsScheduleLoading(true);
            setError(null);

            const airingAnimesMap = new Map<string, LatestEpisode>();
            latestEpisodes.forEach(ep => {
                if (!airingAnimesMap.has(ep.animeId)) {
                    airingAnimesMap.set(ep.animeId, ep);
                }
            });
            const uniqueAiringAnimes = Array.from(airingAnimesMap.values());

            const detailPromises = uniqueAiringAnimes.map(anime => getAnimeDetails(anime.animeId));
            const results = await Promise.allSettled(detailPromises);

            const newSchedule: Schedule = {};
            const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

            results.forEach((result) => {
                if (result.status === 'fulfilled' && result.value.next_airing_episode) {
                    const animeDetails = result.value;
                    try {
                        const date = new Date(animeDetails.next_airing_episode + 'T00:00:00');
                        const dayName = days[date.getDay()];
                        
                        if (!newSchedule[dayName]) {
                            newSchedule[dayName] = [];
                        }

                        newSchedule[dayName].push({
                            id: animeDetails.id,
                            title: animeDetails.title,
                            poster: animeDetails.poster,
                            nextAiringDate: animeDetails.next_airing_episode,
                        });
                    } catch(e) {
                        console.error(`Invalid date format for ${animeDetails.title}: ${animeDetails.next_airing_episode}`);
                    }
                }
            });

            setSchedule(newSchedule);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not build the schedule.');
        } finally {
            setIsScheduleLoading(false);
        }
    };
    
    if (view === 'calendar') {
        buildSchedule();
    }
  }, [view, latestEpisodes, schedule]);

  // Combined effect for searching and fetching catalog with filters
  useEffect(() => {
    const fetchAnimes = async () => {
      if (view !== 'search' && view !== 'catalog') {
        return;
      }
    
      setIsLoading(true);
      setError(null);

      try {
        const query = view === 'search' ? searchQuery : '';
        const results = await searchAnime(query, filters, currentPage);
        
        if (results.animes.length === 0) {
          if (query.trim()) {
            setError(`No results found for "${query}" with the current filters.`);
          } else {
            setError('Oops! No anime found matching the selected filters.');
          }
        }
        setAnimes(results.animes);
        setCurrentPage(results.currentPage);
        setTotalPages(results.totalPages);
        setHasNextPage(results.hasNextPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setAnimes([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (view === 'catalog' || view === 'search') {
      fetchAnimes();
    }
  }, [searchQuery, view, filters, currentPage]);
  
  const handleSearch = (query: string) => {
    setView('search');
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (filterName: keyof AnimeFilters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setCurrentPage(1);
    // When a filter is changed, always switch to catalog view and clear any active search
    if (view !== 'catalog') {
        setView('catalog');
        setSearchQuery('');
    }
  };
  
  const handleSelectAnime = (anime: Anime | LatestEpisode | ScheduledAnime | AnimeDetails) => {
     const animeStub: Anime = {
      id: 'animeId' in anime ? anime.animeId : anime.id,
      title: anime.title,
      poster: anime.poster,
      synopsis: ('synopsis' in anime && anime.synopsis) ? anime.synopsis : '', // Pre-fill synopsis
      type: ('type' in anime && anime.type) ? anime.type : '',     // Pre-fill type
      url: '',      // Fetched in modal
    };
    setSelectedAnimeInfo({ anime: animeStub });
  };
  
  const handleSelectEpisode = (episode: LatestEpisode) => {
    const animeStub: Anime = {
      id: episode.animeId,
      title: episode.title,
      poster: episode.poster,
      synopsis: '',
      type: '',
      url: '',
    };
    setSelectedAnimeInfo({ anime: animeStub, initialEpisodeSlug: episode.slug });
  };

  const handleCloseModal = () => {
    setSelectedAnimeInfo(null);
  };

  const handleGoHome = () => {
    setView('home');
    setSearchQuery('');
    setFilters({ genre: 'all', type: 'all', status: 'all', order: 'default' });
    setCurrentPage(1);
  }
  
  const handleShowCalendar = () => {
    setView('calendar');
  }

  const handleShowCatalog = () => {
    setView('catalog');
    setCurrentPage(1);
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'calendar': {
        if (isScheduleLoading) return <Loader />;
        if (error) return <ErrorMessage message={error} />;
        return <CalendarView schedule={schedule} onAnimeSelect={handleSelectAnime} />;
      }
      case 'catalog':
      case 'search':
        return (
          <section>
            <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-md">
              <FilterBar onFilterChange={handleFilterChange} filters={filters} options={filterOptions} />
            </div>
            {isLoading ? <Loader /> : (
              error && animes.length === 0 ? <ErrorMessage message={error} /> : (
                <>
                  <h2 className="text-3xl font-bold text-text-primary mb-6 border-b-2 border-brand-primary pb-2">
                    {view === 'search' && searchQuery ? `Search Results for "${searchQuery}"` : 'Anime Catalog'}
                  </h2>
                  <AnimeGrid animes={animes} onAnimeSelect={handleSelectAnime} />
                  {animes.length > 0 && totalPages > 1 && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      hasNextPage={hasNextPage}
                      onPrevious={handlePreviousPage}
                      onNext={handleNextPage}
                    />
                  )}
                </>
              )
            )}
          </section>
        );
      case 'home':
      default:
        if (isLoading && latestEpisodes.length === 0) return <Loader />;
        if (error && latestEpisodes.length === 0) return <ErrorMessage message={error} />;
        if (latestEpisodes.length > 0) {
          return (
            <>
              {heroAnime && <Hero anime={heroAnime} onSelect={handleSelectAnime} />}
              <LatestEpisodesGrid episodes={latestEpisodes} onEpisodeSelect={handleSelectEpisode} />
            </>
          );
        }
        return <ErrorMessage message="Could not find any recent episodes." />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-text-primary font-sans">
      <header className="py-6 px-4 md:px-8 bg-base-200/50 backdrop-blur-sm border-b border-base-300 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 
            className="text-3xl font-extrabold text-center tracking-wider cursor-pointer"
            onClick={handleGoHome}
            aria-label="Go to homepage"
          >
            <span className="text-brand-primary [text-shadow:0_0_8px_var(--tw-shadow-color)] shadow-brand-primary">Anime</span><span className="text-text-primary">FLV</span>
          </h1>
           <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <nav className="flex gap-2">
                  <button 
                    onClick={handleGoHome}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${view === 'home' ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'bg-base-300 hover:bg-base-100'}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={handleShowCatalog}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${view === 'catalog' || view === 'search' ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'bg-base-300 hover:bg-base-100'}`}
                  >
                    Catalog
                  </button>
                  <button 
                    onClick={handleShowCalendar}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${view === 'calendar' ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'bg-base-300 hover:bg-base-100'}`}
                  >
                    Calendar
                  </button>
              </nav>
              <div className="w-full sm:w-64 md:w-auto lg:w-80">
                <SearchBar onSearch={handleSearch} isLoading={isLoading && view === 'search'} />
              </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
       <footer className="text-center py-4 mt-8 text-text-secondary text-sm">
        <p>Powered by the unofficial AnimeFLV API. App created for demonstration purposes.</p>
      </footer>
      {selectedAnimeInfo && (
        <AnimeDetailsModal 
          anime={selectedAnimeInfo.anime} 
          initialEpisodeSlug={selectedAnimeInfo.initialEpisodeSlug}
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default App;