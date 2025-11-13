'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, TVShow, MediaItem } from '../../types';
import recommendationService from '../../services/recommendationService';
import MovieCard from '../MovieCard';
import Loading from '../Loading';
import './index.scss';

interface RecommendationResult {
  item: Movie | TVShow | MediaItem;
  score: number;
  reasons: string[];
}

interface RecommendationsProps {
  selectedItem: Movie | TVShow | MediaItem;
  user: { favorites: number[] } | null;
  onToggleFavorite: (item: Movie | TVShow | MediaItem) => void;
  onPlayTrailer: (item: Movie | TVShow | MediaItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Recommendations({ 
  selectedItem, 
  user, 
  onToggleFavorite, 
  onPlayTrailer, 
  isOpen, 
  onClose 
}: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const results = await recommendationService.getRecommendations(
        selectedItem,
        'all',
        12 // Load 12 recommendations
      );

      setRecommendations(results);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (isOpen && selectedItem) {
      loadRecommendations();
    }
  }, [isOpen, selectedItem, loadRecommendations]);

  const getTitle = (item: Movie | TVShow | MediaItem): string => {
    if ('title' in item) return item.title || '';
    if ('name' in item) return item.name || '';
    return 'Unknown Title';
  };

  const getSelectedTitle = (): string => {
    return getTitle(selectedItem);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="recommendations-modal-overlay" onClick={handleBackdropClick}>
      <div className="recommendations-modal">
        <div className="recommendations-header">
          <div className="header-content">
            <h2>🤖 AI Recommendations</h2>
            <p>Based on: <strong>{getSelectedTitle()}</strong></p>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="recommendations-content">
          {isLoading ? (
            <div className="loading-container">
              <Loading />
              <p>AI is analyzing and finding similar content...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">⚠️ {error}</p>
              <button className="retry-button" onClick={loadRecommendations}>
                Try Again
              </button>
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <div className="ai-info">
                <div className="ai-badge">
                  <span className="ai-icon">🧠</span>
                  <span>AI-Powered Recommendations</span>
                </div>
                <p>Our AI analyzed genres, ratings, themes, and viewer preferences to find these matches</p>
              </div>

              <div className="recommendations-grid">
                {recommendations.map((rec, index) => (
                  <div key={`${rec.item.id}-${index}`} className="recommendation-item">
                    <div className="recommendation-card">
                      <MovieCard
                        movie={rec.item as Movie}
                        isFavorite={user?.favorites.includes(rec.item.id) || false}
                        onToggleFavorite={() => onToggleFavorite(rec.item)}
                        onPlayTrailer={() => onPlayTrailer(rec.item)}
                        showPlayButton={true}
                      />
                      
                      <div className="recommendation-info">
                        <div className="score-badge">
                          <span className="score-value">{Math.round(rec.score * 100)}%</span>
                          <span className="score-label">Match</span>
                        </div>
                        
                        <div className="reasons">
                          <h4>Why recommended:</h4>
                          <ul>
                            {rec.reasons.map((reason, idx) => (
                              <li key={idx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-recommendations">
              <p>🤔 No recommendations found. Try selecting a different movie or TV show.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}