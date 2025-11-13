'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Movie } from '../../types';
import StarRating from '../StarRating';
import './index.scss';

export interface Props {
  movie: Movie;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
  onPlayTrailer?: (movie: Movie) => void;
  onShowRecommendations?: (movie: Movie) => void;
  showPlayButton?: boolean;
  showRecommendationsButton?: boolean;
}

export default function MovieCard(props: Props) {
  const { 
    movie, 
    isFavorite = false, 
    onToggleFavorite, 
    onPlayTrailer, 
    onShowRecommendations,
    showPlayButton = false,
    showRecommendationsButton = false 
  } = props;
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleSeeMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(true);
  };

  const handleCloseDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(false);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  const handlePlayTrailer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(movie);
    }
  };

  const handleShowRecommendations = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShowRecommendations) {
      onShowRecommendations(movie);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getGenreNames = (genreIds: number[]) => {
    const genreMap: { [key: number]: string } = {
      28: 'Ação',
      12: 'Aventura',
      16: 'Animação',
      35: 'Comédia',
      80: 'Crime',
      99: 'Documentário',
      18: 'Drama',
      10751: 'Família',
      14: 'Fantasia',
      36: 'História',
      27: 'Terror',
      10402: 'Música',
      9648: 'Mistério',
      10749: 'Romance',
      878: 'Ficção Científica',
      10770: 'Cinema TV',
      53: 'Thriller',
      10752: 'Guerra',
      37: 'Faroeste'
    };

    if (!genreIds || genreIds.length === 0) return 'Gêneros não disponíveis';
    
    return genreIds
      .map(id => genreMap[id] || 'Desconhecido')
      .slice(0, 3)
      .join(', ');
  };

  return (
    <>
      <li className="movie-card">
        <div className="movie-poster">
          {movie.poster_path && !imageError ? (
            <Image 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title || 'Movie'} poster - Click to view details`}
              width={280}
              height={420}
              className="movie-image"
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 250px, 280px"
              quality={85}
            />
          ) : (
            <div className="no-poster">
              <span>No Image Available</span>
            </div>
          )}
          
          {showPlayButton && (
            <button className="play-trailer-btn" onClick={handlePlayTrailer}>
              ▶️ Play Trailer
            </button>
          )}
          
          {showRecommendationsButton && (
            <button className="recommendations-btn" onClick={handleShowRecommendations}>
              🤖 AI Recommendations
            </button>
          )}
        </div>
        <p>{movie.title}</p>
        
        <div className="movie-info">
          <div className="movie-header">
            <p className="movie-title">{movie.title}</p>
            {onToggleFavorite && (
              <button 
                className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            )}
          </div>
          <StarRating rating={movie.vote_average} />

          <div className="hidden-content">
            <p className="description">
              {movie.overview ? 
                (movie.overview.length > 100 ? 
                  `${movie.overview.substring(0, 100)}...` : 
                  movie.overview
                ) : 
                'Descrição não disponível'
              }
            </p>
            <button 
              className="details-button"
              onClick={handleSeeMore}
            >
              See More..
            </button>
          </div>
        </div>
      </li>

      {/* Modal de Detalhes */}
      {showDetails && (
        <div className="movie-modal-overlay" onClick={handleCloseDetails}>
          <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseDetails}>
              ✕
            </button>
            
            <div className="modal-content">
              <div className="modal-poster">
                {movie.poster_path && !imageError ? (
                  <Image 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title || 'Movie'} - Full size poster image showing movie artwork and details`}
                    width={200}
                    height={300}
                    className="modal-image"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    quality={90}
                    sizes="200px"
                  />
                ) : (
                  <div className="no-poster-modal">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              
              <div className="modal-info">
                <h2 className="modal-title">{movie.title}</h2>
                {movie.original_title !== movie.title && (
                  <p className="original-title">Título Original: {movie.original_title}</p>
                )}
                
                <div className="movie-meta">
                  <div className="meta-item">
                    <strong>Data de Lançamento:</strong> {formatDate(movie.release_date)}
                  </div>
                  <div className="meta-item">
                    <strong>Gêneros:</strong> {getGenreNames(movie.genre_ids)}
                  </div>
                  <div className="meta-item">
                    <strong>Idioma:</strong> {movie.original_language.toUpperCase()}
                  </div>
                  <div className="meta-item">
                    <strong>Popularidade:</strong> {movie.popularity?.toFixed(1)}
                  </div>
                  <div className="meta-item">
                    <strong>Votos:</strong> {movie.vote_count} votos
                  </div>
                </div>

                <div className="rating-section">
                  <StarRating rating={movie.vote_average} />
                  <span className="rating-text">
                    {movie.vote_average?.toFixed(1)}/10
                  </span>
                </div>

                <div className="description-full">
                  <h3>Sinopse:</h3>
                  <p>{movie.overview || 'Sinopse não disponível.'}</p>
                </div>

                {movie.adult && (
                  <div className="adult-content">
                    <span className="adult-badge">🔞 Conteúdo Adulto</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}