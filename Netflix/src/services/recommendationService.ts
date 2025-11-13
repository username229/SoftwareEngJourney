import { Movie, TVShow, MediaItem, Genre } from '../types';
import mediaService from './movieService';

interface RecommendationWeights {
  genre: number;
  rating: number;
  year: number;
  popularity: number;
  keywords: number;
}

interface RecommendationResult {
  item: Movie | TVShow | MediaItem;
  score: number;
  reasons: string[];
}

class RecommendationService {
  private readonly weights: RecommendationWeights = {
    genre: 0.4,      // 40% - Most important
    rating: 0.25,    // 25% - Quality indicator
    year: 0.1,       // 10% - Recency preference
    popularity: 0.15, // 15% - General appeal
    keywords: 0.1    // 10% - Content similarity
  };

  /**
   * Generate AI-powered recommendations based on a selected movie/TV show
   */
  async getRecommendations(
    selectedItem: Movie | TVShow | MediaItem,
    contentType: 'movie' | 'tv' | 'all' = 'all',
    limit: number = 10
  ): Promise<RecommendationResult[]> {
    try {
      // Get similar content from TMDB
      const [similarContent, recommendations, genres] = await Promise.all([
        this.getSimilarContent(selectedItem),
        this.getTMDBRecommendations(selectedItem),
        mediaService.getGenres()
      ]);

      // Combine and deduplicate results
      const allCandidates = this.combineAndDeduplicate([
        ...similarContent,
        ...recommendations
      ]);

      // Apply AI scoring algorithm
      const scoredResults = this.applyAIScoring(
        selectedItem,
        allCandidates,
        genres
      );

      // Filter by content type if specified
      const filteredResults = this.filterByContentType(scoredResults, contentType);

      // Return top recommendations
      return filteredResults
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  /**
   * Get similar content from TMDB API
   */
  private async getSimilarContent(item: Movie | TVShow | MediaItem): Promise<(Movie | TVShow)[]> {
    try {
      if (this.isMovie(item)) {
        const response = await mediaService.getSimilarMovies(item.id);
        return response.results || [];
      } else {
        const response = await mediaService.getSimilarTVShows(item.id);
        return response.results || [];
      }
    } catch (error) {
      console.error('Error fetching similar content:', error);
      return [];
    }
  }

  /**
   * Get TMDB recommendations
   */
  private async getTMDBRecommendations(item: Movie | TVShow | MediaItem): Promise<(Movie | TVShow)[]> {
    try {
      if (this.isMovie(item)) {
        const response = await mediaService.getMovieRecommendations(item.id);
        return response.results || [];
      } else {
        const response = await mediaService.getTVRecommendations(item.id);
        return response.results || [];
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  /**
   * AI-powered scoring algorithm
   */
  private applyAIScoring(
    selectedItem: Movie | TVShow | MediaItem,
    candidates: (Movie | TVShow)[],
    genres: Genre[]
  ): RecommendationResult[] {
    return candidates.map(candidate => {
      const scores = {
        genre: this.calculateGenreScore(selectedItem, candidate),
        rating: this.calculateRatingScore(selectedItem, candidate),
        year: this.calculateYearScore(selectedItem, candidate),
        popularity: this.calculatePopularityScore(candidate),
        keywords: this.calculateKeywordScore(selectedItem, candidate)
      };

      const totalScore = Object.keys(scores).reduce((total, key) => {
        const scoreKey = key as keyof RecommendationWeights;
        return total + (scores[scoreKey] * this.weights[scoreKey]);
      }, 0);

      const reasons = this.generateReasons(selectedItem, candidate, scores, genres);

      return {
        item: candidate,
        score: Math.round(totalScore * 100) / 100,
        reasons
      };
    });
  }

  /**
   * Calculate genre similarity score (0-1)
   */
  private calculateGenreScore(selected: Movie | TVShow | MediaItem, candidate: Movie | TVShow): number {
    if (!selected.genre_ids || !candidate.genre_ids) return 0;

    const selectedGenres = new Set(selected.genre_ids);
    const candidateGenres = new Set(candidate.genre_ids);
    const intersection = new Set([...selectedGenres].filter(x => candidateGenres.has(x)));
    const union = new Set([...selectedGenres, ...candidateGenres]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Calculate rating similarity score (0-1)
   */
  private calculateRatingScore(selected: Movie | TVShow | MediaItem, candidate: Movie | TVShow): number {
    const selectedRating = selected.vote_average || 0;
    const candidateRating = candidate.vote_average || 0;
    
    // Prefer items with similar or higher ratings
    const difference = Math.abs(selectedRating - candidateRating);
    const maxDifference = 10; // Max possible difference
    
    let score = 1 - (difference / maxDifference);
    
    // Bonus for higher-rated content
    if (candidateRating > selectedRating) {
      score *= 1.1;
    }
    
    return Math.min(score, 1);
  }

  /**
   * Calculate year proximity score (0-1)
   */
  private calculateYearScore(selected: Movie | TVShow | MediaItem, candidate: Movie | TVShow): number {
    const selectedYear = this.getYear(selected);
    const candidateYear = this.getYear(candidate);
    
    if (!selectedYear || !candidateYear) return 0.5;
    
    const yearDifference = Math.abs(selectedYear - candidateYear);
    const maxYearDifference = 20; // Consider 20 years as max meaningful difference
    
    return Math.max(0, 1 - (yearDifference / maxYearDifference));
  }

  /**
   * Calculate popularity score (0-1)
   */
  private calculatePopularityScore(candidate: Movie | TVShow): number {
    const popularity = candidate.popularity || 0;
    const maxPopularity = 1000; // Reasonable max popularity value
    
    return Math.min(popularity / maxPopularity, 1);
  }

  /**
   * Calculate keyword/content similarity score (0-1)
   */
  private calculateKeywordScore(selected: Movie | TVShow | MediaItem, candidate: Movie | TVShow): number {
    // Simple content similarity based on overview
    const selectedOverview = (selected.overview || '').toLowerCase();
    const candidateOverview = (candidate.overview || '').toLowerCase();
    
    if (!selectedOverview || !candidateOverview) return 0;
    
    const selectedWords = new Set(selectedOverview.split(/\s+/).filter(word => word.length > 3));
    const candidateWords = new Set(candidateOverview.split(/\s+/).filter(word => word.length > 3));
    
    const intersection = new Set([...selectedWords].filter(x => candidateWords.has(x)));
    const union = new Set([...selectedWords, ...candidateWords]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Generate human-readable reasons for recommendation
   */
  private generateReasons(
    selected: Movie | TVShow | MediaItem,
    candidate: Movie | TVShow,
    scores: Record<string, number>,
    genres: Genre[]
  ): string[] {
    const reasons: string[] = [];
    
    // Genre reasons
    if (scores.genre > 0.5) {
      const commonGenres = this.getCommonGenres(selected, candidate, genres);
      if (commonGenres.length > 0) {
        reasons.push(`Similar genres: ${commonGenres.join(', ')}`);
      }
    }
    
    // Rating reasons
    if (scores.rating > 0.7) {
      const candidateRating = candidate.vote_average || 0;
      if (candidateRating >= 7) {
        reasons.push(`Highly rated (${candidateRating.toFixed(1)}/10)`);
      }
    }
    
    // Year reasons
    if (scores.year > 0.8) {
      reasons.push('From similar time period');
    }
    
    // Popularity reasons
    if (scores.popularity > 0.7) {
      reasons.push('Popular choice among viewers');
    }
    
    // Content similarity reasons
    if (scores.keywords > 0.3) {
      reasons.push('Similar themes and content');
    }
    
    // Default reason
    if (reasons.length === 0) {
      reasons.push('AI recommendation based on your selection');
    }
    
    return reasons;
  }

  /**
   * Helper methods
   */
  private isMovie(item: Movie | TVShow | MediaItem): item is Movie | MediaItem {
    return 'title' in item || ('media_type' in item && item.media_type === 'movie');
  }

  private getYear(item: Movie | TVShow | MediaItem): number | null {
    if ('release_date' in item && item.release_date) {
      return new Date(item.release_date).getFullYear();
    }
    if ('first_air_date' in item && item.first_air_date) {
      return new Date(item.first_air_date).getFullYear();
    }
    return null;
  }

  private getCommonGenres(
    selected: Movie | TVShow | MediaItem,
    candidate: Movie | TVShow,
    genres: Genre[]
  ): string[] {
    if (!selected.genre_ids || !candidate.genre_ids) return [];
    
    const selectedGenres = new Set(selected.genre_ids);
    const candidateGenres = new Set(candidate.genre_ids);
    const commonGenreIds = [...selectedGenres].filter(x => candidateGenres.has(x));
    
    return commonGenreIds
      .map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean) as string[];
  }

  private combineAndDeduplicate(items: (Movie | TVShow)[]): (Movie | TVShow)[] {
    const seen = new Set<number>();
    return items.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  private filterByContentType(
    results: RecommendationResult[],
    contentType: 'movie' | 'tv' | 'all'
  ): RecommendationResult[] {
    if (contentType === 'all') return results;
    
    return results.filter(result => {
      if (contentType === 'movie') {
        return this.isMovie(result.item);
      } else {
        return !this.isMovie(result.item);
      }
    });
  }
}

const recommendationService = new RecommendationService();
export default recommendationService;