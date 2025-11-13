'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, TVShow, MediaItem, User, ContentType, VideoResult } from '../../types';
import mediaService from '../../services/movieService';
import SearchBar from '../SearchBar';
import Auth from '../Auth';
import MovieCard from '../MovieCard';
import GenreFilter from '../GenreFilter';
import YouTubePlayer from '../YouTubePlayer';
import Recommendations from '../Recommendations';
import Loading from '../Loading';
import ErrorBoundary from '../ErrorBoundary';
import './index.scss';

export default function MovieMateApp() {
  // State Management
  const [movies, setMovies] = useState<(Movie | TVShow | MediaItem)[]>([]);
  const [searchResults, setSearchResults] = useState<(Movie | TVShow | MediaItem)[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState<'popular' | 'search' | 'favorites' | 'trending'>('popular');
  const [contentType] = useState<ContentType>('all');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // YouTube Player State
  const [youtubePlayer, setYoutubePlayer] = useState<{
    isOpen: boolean;
    videos: VideoResult[];
    title: string;
  }>({
    isOpen: false,
    videos: [],
    title: ''
  });

  // Recommendations State
  const [recommendations, setRecommendations] = useState<{
    isOpen: boolean;
    selectedItem: Movie | TVShow | MediaItem | null;
  }>({
    isOpen: false,
    selectedItem: null
  });

  const loadContent = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(page === 1);
      let response;

      if (currentView === 'trending') {
        response = await mediaService.getTrending(contentType);
      } else if (selectedGenres.length > 0) {
        if (contentType === 'movie') {
          response = await mediaService.getMoviesByGenre(selectedGenres, page);
        } else if (contentType === 'tv') {
          response = await mediaService.getTVShowsByGenre(selectedGenres, page);
        } else {
          // For 'all', load both and combine
          const [movieResponse, tvResponse] = await Promise.all([
            mediaService.getMoviesByGenre(selectedGenres, page),
            mediaService.getTVShowsByGenre(selectedGenres, page)
          ]);
          response = {
            results: [
              ...movieResponse.results.map(item => ({ ...item, media_type: 'movie' as const })),
              ...tvResponse.results.map(item => ({ ...item, media_type: 'tv' as const }))
            ],
            total_pages: Math.max(movieResponse.total_pages, tvResponse.total_pages),
            page: page,
            total_results: movieResponse.total_results + tvResponse.total_results
          };
        }
      } else {
        if (contentType === 'movie') {
          response = await mediaService.getPopularMovies(page);
        } else if (contentType === 'tv') {
          response = await mediaService.getPopularTVShows(page);
        } else {
          // For 'all', load both and combine
          const [movieResponse, tvResponse] = await Promise.all([
            mediaService.getPopularMovies(page),
            mediaService.getPopularTVShows(page)
          ]);
          response = {
            results: [
              ...movieResponse.results.map(item => ({ ...item, media_type: 'movie' as const })),
              ...tvResponse.results.map(item => ({ ...item, media_type: 'tv' as const }))
            ],
            total_pages: Math.max(movieResponse.total_pages, tvResponse.total_pages),
            page: page,
            total_results: movieResponse.total_results + tvResponse.total_results
          };
        }
      }

      if (page === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }

      setCurrentPage(page);
      setTotalPages(response.total_pages);
      setError(null);
    } catch (error) {
      console.error('Error loading content:', error);
      setError(`Failed to load ${contentType === 'all' ? 'content' : contentType}`);
    } finally {
      setIsLoading(false);
    }
  }, [contentType, selectedGenres, currentView]);

  const initializeApp = useCallback(async () => {
    try {
      // Check for existing user session
      const savedUser = localStorage.getItem('moviemate-current-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      await loadContent();
    } catch (error) {
      console.error('Error initializing app:', error);
      setError('Failed to initialize application');
    } finally {
      setIsLoading(false);
    }
  }, [loadContent]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    if (currentView === 'popular' || currentView === 'trending') {
      setCurrentPage(1); // Reset to first page when filters change
      loadContent(1);
    }
  }, [contentType, selectedGenres, currentView, loadContent]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setCurrentView('popular');
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setCurrentView('search');
      
      let response;
      if (contentType === 'movie') {
        response = await mediaService.searchMovies(query);
      } else if (contentType === 'tv') {
        response = await mediaService.searchTVShows(query);
      } else {
        response = await mediaService.multiSearch(query);
      }

      setSearchResults(response.results);
      setError(null);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setCurrentView('popular');
    setSearchResults([]);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    localStorage.setItem('moviemate-current-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('moviemate-current-user');
    if (currentView === 'favorites') {
      setCurrentView('popular');
    }
  };

  const toggleFavorite = (item: Movie | TVShow | MediaItem) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    const itemId = item.id;
    const updatedUser = {
      ...user,
      favorites: user.favorites.includes(itemId)
        ? user.favorites.filter(id => id !== itemId)
        : [...user.favorites, itemId]
    };

    setUser(updatedUser);
    localStorage.setItem('moviemate-current-user', JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('moviemate-users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], favorites: updatedUser.favorites };
      localStorage.setItem('moviemate-users', JSON.stringify(users));
    }
  };

  const showFavorites = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    setCurrentView('favorites');
    const favoriteItems = movies.filter(item => user.favorites.includes(item.id));
    setMovies(favoriteItems);
  };

  const isMovie = (item: Movie | TVShow | MediaItem): item is Movie | MediaItem => {
    return 'title' in item || ('media_type' in item && item.media_type === 'movie');
  };

  const handlePlayTrailer = async (item: Movie | TVShow | MediaItem) => {
    try {
      let videos: VideoResult[] = [];
      let title = '';

      console.log('Loading trailer for:', item);

      if (isMovie(item)) {
        // It's a movie
        title = 'title' in item ? item.title || '' : ('name' in item ? item.name || '' : '');
        console.log('Loading movie videos for:', title, 'ID:', item.id);
        videos = await mediaService.getMovieVideos(item.id);
      } else {
        // It's a TV show
        title = 'name' in item ? item.name || '' : '';
        console.log('Loading TV videos for:', title, 'ID:', item.id);
        videos = await mediaService.getTVVideos(item.id);
      }

      console.log('Found videos:', videos);

      if (videos.length > 0) {
        setYoutubePlayer({
          isOpen: true,
          videos,
          title
        });
      } else {
        alert('No trailers available for this content');
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      alert('Failed to load trailer');
    }
  };

  const handleShowRecommendations = (item: Movie | TVShow | MediaItem) => {
    setRecommendations({
      isOpen: true,
      selectedItem: item
    });
  };

  const handleCloseRecommendations = () => {
    setRecommendations({
      isOpen: false,
      selectedItem: null
    });
  };

  const closeYouTubePlayer = () => {
    setYoutubePlayer({
      isOpen: false,
      videos: [],
      title: ''
    });
  };

  const loadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      loadContent(currentPage + 1);
    }
  };

  const getDisplayItems = () => {
    return currentView === 'search' ? searchResults : movies;
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'search':
        return `Search Results (${searchResults.length})`;
      case 'favorites':
        return `My Favorites (${movies.length})`;
      case 'trending':
        return 'Trending Now';
      default:
        return `Popular ${contentType === 'all' ? 'Content' : contentType === 'movie' ? 'Movies' : 'TV Shows'}`;
    }
  };

  const displayItems = getDisplayItems();

  return (
    <ErrorBoundary>
      <div className="moviemate-app">
        <header className="app-header">
          <div className="header-content">
            <div className="brand">
              <h1>🎬 MovieMate</h1>
              <p>Your Entertainment Companion</p>
            </div>

            <div className="header-actions">
              {user ? (
                <div className="user-menu">
                  <span className="user-greeting">Welcome, {user.name}!</span>
                  <button className="favorites-btn" onClick={showFavorites}>
                    ❤️ Favorites ({user.favorites.length})
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <button className="login-btn" onClick={() => setShowAuth(true)}>
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="search-section">
            <SearchBar 
              onSearch={handleSearch} 
              onClear={handleClearSearch}
              isLoading={isSearching} 
            />
            
            <div className="view-controls">
              <button
                className={`view-btn ${currentView === 'popular' ? 'active' : ''}`}
                onClick={() => { setCurrentView('popular'); loadContent(); }}
              >
                🔥 Popular
              </button>
              <button
                className={`view-btn ${currentView === 'trending' ? 'active' : ''}`}
                onClick={() => { setCurrentView('trending'); loadContent(); }}
              >
                📈 Trending
              </button>
              {user && (
                <button
                  className={`view-btn ${currentView === 'favorites' ? 'active' : ''}`}
                  onClick={showFavorites}
                >
                  ❤️ Favorites
                </button>
              )}
            </div>
          </div>

          <GenreFilter
            selectedGenre={selectedGenres.length > 0 ? selectedGenres[0] : null}
            onGenreSelect={(genreId) => setSelectedGenres(genreId ? [genreId] : [])}
            isLoading={isLoading}
          />

          <div className="content-header">
            <h2>{getViewTitle()}</h2>
            {displayItems.length > 0 && (
              <div className="results-count">
                {displayItems.length} items
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <button onClick={() => { setError(null); loadContent(); }}>
                Retry
              </button>
            </div>
          )}

          {isLoading && displayItems.length === 0 ? (
            <div className="loading-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <Loading key={index} type="skeleton" size="medium" />
              ))}
            </div>
          ) : displayItems.length > 0 ? (
            <>
              <div className="content-grid">
                {displayItems.map((item) => (
                  <MovieCard
                    key={`${item.id}-${('media_type' in item ? item.media_type : isMovie(item) ? 'movie' : 'tv')}`}
                    movie={item as Movie}
                    isFavorite={user?.favorites.includes(item.id) || false}
                    onToggleFavorite={() => toggleFavorite(item)}
                    onPlayTrailer={() => handlePlayTrailer(item)}
                    onShowRecommendations={() => handleShowRecommendations(item)}
                    showPlayButton={true}
                    showRecommendationsButton={true}
                  />
                ))}
              </div>

              {currentView !== 'search' && currentView !== 'favorites' && currentPage < totalPages && (
                <div className="load-more-section">
                  <button
                    className="load-more-btn"
                    onClick={loadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loading type="dots" size="small" /> : '🔽 Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>
                {currentView === 'search' 
                  ? '🔍 No results found. Try a different search term.' 
                  : currentView === 'favorites'
                  ? '❤️ No favorites yet. Start adding some!'
                  : '🎬 No content available.'}
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAuth && (
          <Auth
            onLogin={handleLogin}
            onClose={() => setShowAuth(false)}
          />
        )}

        <YouTubePlayer
          videos={youtubePlayer.videos}
          title={youtubePlayer.title}
          isOpen={youtubePlayer.isOpen}
          onClose={closeYouTubePlayer}
        />

        {recommendations.selectedItem && (
          <Recommendations
            selectedItem={recommendations.selectedItem}
            user={user}
            onToggleFavorite={toggleFavorite}
            onPlayTrailer={handlePlayTrailer}
            isOpen={recommendations.isOpen}
            onClose={handleCloseRecommendations}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}