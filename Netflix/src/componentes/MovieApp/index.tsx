'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../MovieCard';
import SearchBar from '../SearchBar';
import Auth from '../Auth';
import GenreFilter from '../GenreFilter';
import './index.scss';
import { Movie, User } from '../../types';

export default function MovieApp() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState<'popular' | 'search' | 'favorites' | 'genre'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZTIwNDRlNzBlYmQyMDllOWRlMGYxMzNlYTdkYjZlMyIsIm5iZiI6MTczNTMxNDQxMC45MDcsInN1YiI6IjY3NmVjYmVhY2ZlNjI2NDRkZjEyYmQyNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.28fEWsof4fpShoUyw1RNlUJuWQDgsrwlVtO07KCOSJs';

  useEffect(() => {
    setMounted(true);
    loadUserFromStorage();
    getPopularMovies();
  }, []);

  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem('moviemate-current-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const getPopularMovies = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/popular',
        params: {
          language: 'pt-BR',
          page: page
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      });
      
      if (page === 1) {
        setMovies(response.data.results);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }
      
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoviesByGenre = async (genreId: number, page = 1) => {
    setIsLoading(true);
    setSelectedGenre(genreId);
    setCurrentView('genre');
    
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/discover/movie',
        params: {
          with_genres: genreId,
          language: 'en-US',
          page: page,
          sort_by: 'popularity.desc'
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      });
      
      if (page === 1) {
        setMovies(response.data.results);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }
      
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = async (query: string, page = 1) => {
    setIsLoading(true);
    setSearchQuery(query);
    setCurrentView('search');
    
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie',
        params: {
          query: query,
          language: 'en-US',
          page: page
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      });
      
      if (page === 1) {
        setMovies(response.data.results);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }
      
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setCurrentView('popular');
    setSearchQuery('');
    setCurrentPage(1);
    getPopularMovies();
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('moviemate-current-user', JSON.stringify(userData));
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('moviemate-current-user');
    if (currentView === 'favorites') {
      setCurrentView('popular');
      getPopularMovies();
    }
  };

  const toggleFavorite = (movie: Movie) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    const movieId = movie.id;
    const updatedUser = {
      ...user,
      favorites: user.favorites.includes(movieId)
        ? user.favorites.filter(id => id !== movieId)
        : [...user.favorites, movieId]
    };

    setUser(updatedUser);
    localStorage.setItem('moviemate-current-user', JSON.stringify(updatedUser));

    // Atualizar no array de usuários
    const users = JSON.parse(localStorage.getItem('moviemate-users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], favorites: updatedUser.favorites };
      localStorage.setItem('moviemate-users', JSON.stringify(users));
    }
  };

  const handleGenreSelect = (genreId: number | null) => {
    if (genreId === null) {
      // Reset to popular movies
      setSelectedGenre(null);
      setCurrentView('popular');
      getPopularMovies();
    } else {
      // Load movies by genre
      getMoviesByGenre(genreId);
    }
  };

  const showFavorites = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    setCurrentView('favorites');
    const favoriteMovies = movies.filter(movie => user.favorites.includes(movie.id));
    setMovies(favoriteMovies);
  };

  const loadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      if (currentView === 'search' && searchQuery) {
        searchMovies(searchQuery, currentPage + 1);
      } else if (currentView === 'genre' && selectedGenre) {
        getMoviesByGenre(selectedGenre, currentPage + 1);
      } else if (currentView === 'popular') {
        getPopularMovies(currentPage + 1);
      }
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'search':
        return `Search Results for "${searchQuery}"`;
      case 'favorites':
        return 'My Favorites';
      case 'genre':
        return 'Movies by Genre';
      default:
        return 'Popular Movies';
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="movie-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <h1>🎬 MovieMate</h1>
            <p>Your movie companion</p>
          </div>
          
          <div className="header-actions">
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user.name}!</span>
                <button 
                  onClick={showFavorites}
                  className="favorites-btn"
                >
                  ❤️ Favorites ({user.favorites.length})
                </button>
                <button 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className="login-btn"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-section">
        <SearchBar 
          onSearch={searchMovies}
          onClear={clearSearch}
          isLoading={isLoading}
        />
        
        {/* Genre Filter */}
        <GenreFilter 
          onGenreSelect={handleGenreSelect}
          selectedGenre={selectedGenre}
          isLoading={isLoading}
        />
        
        <div className="view-controls">
          <button 
            onClick={() => {
              setCurrentView('popular');
              setSelectedGenre(null);
              getPopularMovies();
            }}
            className={`view-btn ${currentView === 'popular' ? 'active' : ''}`}
          >
            🔥 Popular
          </button>
          {user && (
            <button 
              onClick={showFavorites}
              className={`view-btn ${currentView === 'favorites' ? 'active' : ''}`}
            >
              ❤️ Favorites
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="main-content">
        <div className="content-header">
          <h2>{getViewTitle()}</h2>
          <span className="results-count">
            {movies.length} {movies.length === 1 ? 'filme' : 'filmes'}
          </span>
        </div>

        {movies.length > 0 ? (
          <>
            <ul className="movie-grid">
              {movies.map((movie: Movie) => (
                <MovieCard 
                  key={movie.id}
                  movie={movie}
                  isFavorite={user?.favorites.includes(movie.id) || false}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </ul>

            {/* Load More Button */}
            {currentView !== 'favorites' && currentPage < totalPages && (
              <div className="load-more-section">
                <button 
                  onClick={loadMore}
                  className="load-more-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>
              {currentView === 'favorites' 
                ? 'You have no favorite movies yet.' 
                : 'No movies found.'
              }
            </p>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <Auth 
          onLogin={handleLogin}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}