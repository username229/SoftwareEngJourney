'use client';

import { useState, useEffect } from 'react';
import './index.scss';

export interface Genre {
  id: number;
  name: string;
}

interface GenreFilterProps {
  onGenreSelect: (genreId: number | null) => void;
  selectedGenre: number | null;
  isLoading?: boolean;
}

export default function GenreFilter({ onGenreSelect, selectedGenre, isLoading }: GenreFilterProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Popular movie genres with their TMDB IDs
  const popularGenres: Genre[] = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ];

  useEffect(() => {
    setGenres(popularGenres);
  }, []);

  const handleGenreClick = (genreId: number) => {
    if (selectedGenre === genreId) {
      onGenreSelect(null); // Deselect if already selected
    } else {
      onGenreSelect(genreId);
    }
  };

  const getVisibleGenres = () => {
    return isExpanded ? genres : genres.slice(0, 8);
  };

  const selectedGenreName = genres.find(g => g.id === selectedGenre)?.name;

  return (
    <div className="genre-filter">
      <div className="genre-header">
        <h3 className="genre-title">
          <span className="icon">🎭</span>
          Genres
        </h3>
        {selectedGenreName && (
          <div className="selected-genre">
            <span>Current: {selectedGenreName}</span>
            <button 
              className="clear-genre"
              onClick={() => onGenreSelect(null)}
              disabled={isLoading}
              title="Clear genre filter"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="genre-grid">
        <button
          className={`genre-chip ${selectedGenre === null ? 'active' : ''}`}
          onClick={() => onGenreSelect(null)}
          disabled={isLoading}
        >
          <span className="genre-icon">🍿</span>
          All Movies
        </button>

        {getVisibleGenres().map((genre) => (
          <button
            key={genre.id}
            className={`genre-chip ${selectedGenre === genre.id ? 'active' : ''}`}
            onClick={() => handleGenreClick(genre.id)}
            disabled={isLoading}
            title={`Filter by ${genre.name}`}
          >
            <span className="genre-icon">
              {getGenreIcon(genre.name)}
            </span>
            {genre.name}
          </button>
        ))}

        {genres.length > 8 && (
          <button
            className="genre-chip expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isLoading}
          >
            <span className="genre-icon">
              {isExpanded ? '⬆️' : '⬇️'}
            </span>
            {isExpanded ? 'Show Less' : `+${genres.length - 8} More`}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="genre-loading">
          <div className="loading-spinner"></div>
          <span>Loading movies...</span>
        </div>
      )}
    </div>
  );
}

// Helper function to get emoji icons for genres
function getGenreIcon(genreName: string): string {
  const iconMap: { [key: string]: string } = {
    'Action': '💥',
    'Adventure': '🗺️',
    'Animation': '🎨',
    'Comedy': '😂',
    'Crime': '🕵️',
    'Documentary': '📹',
    'Drama': '🎭',
    'Family': '👨‍👩‍👧‍👦',
    'Fantasy': '🧙‍♂️',
    'History': '📜',
    'Horror': '👻',
    'Music': '🎵',
    'Mystery': '🔍',
    'Romance': '💕',
    'Science Fiction': '🚀',
    'TV Movie': '📺',
    'Thriller': '😱',
    'War': '⚔️',
    'Western': '🤠'
  };
  return iconMap[genreName] || '🎬';
}