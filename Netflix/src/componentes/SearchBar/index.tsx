'use client';

import { useState } from 'react';
import './index.scss';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, onClear, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar filmes..."
            className="search-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="search-button"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              <span className="search-icon">🔍</span>
            )}
          </button>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              disabled={isLoading}
            >
              ✕
            </button>
          )}
        </div>
      </form>
    </div>
  );
}