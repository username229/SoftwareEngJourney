import axios, { AxiosResponse } from 'axios';
import { Movie, TVShow, MediaItem, Genre, ContentType, VideoResult } from '../types';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

interface TMDBResponse<T = Movie> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface MultiSearchResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const mediaService = {
  // Movies
  getPopularMovies: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await tmdbApi.get('/movie/popular', {
        params: { page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new Error('Failed to load popular movies');
    }
  },

  getMovieDetails: async (movieId: number): Promise<Movie> => {
    try {
      const response: AxiosResponse<Movie> = await tmdbApi.get(`/movie/${movieId}`, {
        params: { language: 'en-US', append_to_response: 'videos' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to load movie details');
    }
  },

  getMoviesByGenre: async (genreIds: number[], page: number = 1): Promise<TMDBResponse<Movie>> => {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await tmdbApi.get('/discover/movie', {
        params: { 
          with_genres: genreIds.join(','), 
          page, 
          language: 'en-US',
          sort_by: 'popularity.desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw new Error('Failed to load movies by genre');
    }
  },

  // TV Shows
  getPopularTVShows: async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
    try {
      const response: AxiosResponse<TMDBResponse<TVShow>> = await tmdbApi.get('/tv/popular', {
        params: { page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw new Error('Failed to load popular TV shows');
    }
  },

  getTVShowDetails: async (tvId: number): Promise<TVShow> => {
    try {
      const response: AxiosResponse<TVShow> = await tmdbApi.get(`/tv/${tvId}`, {
        params: { language: 'en-US', append_to_response: 'videos' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw new Error('Failed to load TV show details');
    }
  },

  getTVShowsByGenre: async (genreIds: number[], page: number = 1): Promise<TMDBResponse<TVShow>> => {
    try {
      const response: AxiosResponse<TMDBResponse<TVShow>> = await tmdbApi.get('/discover/tv', {
        params: { 
          with_genres: genreIds.join(','), 
          page, 
          language: 'en-US',
          sort_by: 'popularity.desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV shows by genre:', error);
      throw new Error('Failed to load TV shows by genre');
    }
  },

  // Multi Search (Movies + TV)
  multiSearch: async (query: string, page: number = 1): Promise<MultiSearchResponse> => {
    try {
      const response: AxiosResponse<MultiSearchResponse> = await tmdbApi.get('/search/multi', {
        params: { query, page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error performing multi search:', error);
      throw new Error('Failed to search');
    }
  },

  searchMovies: async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await tmdbApi.get('/search/movie', {
        params: { query, page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  },

  searchTVShows: async (query: string, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    try {
      const response: AxiosResponse<TMDBResponse<TVShow>> = await tmdbApi.get('/search/tv', {
        params: { query, page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw new Error('Failed to search TV shows');
    }
  },

  // Genres
  getMovieGenres: async (): Promise<Genre[]> => {
    try {
      const response = await tmdbApi.get('/genre/movie/list', {
        params: { language: 'en-US' }
      });
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching movie genres:', error);
      throw new Error('Failed to load movie genres');
    }
  },

  getTVGenres: async (): Promise<Genre[]> => {
    try {
      const response = await tmdbApi.get('/genre/tv/list', {
        params: { language: 'en-US' }
      });
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching TV genres:', error);
      throw new Error('Failed to load TV genres');
    }
  },

  // Combined Genres
  getGenres: async (): Promise<Genre[]> => {
    try {
      const [movieGenres, tvGenres] = await Promise.all([
        mediaService.getMovieGenres(),
        mediaService.getTVGenres()
      ]);
      
      // Combine and deduplicate genres by id
      const allGenres = [...movieGenres, ...tvGenres];
      const uniqueGenres = allGenres.filter((genre, index, self) => 
        index === self.findIndex(g => g.id === genre.id)
      );
      
      return uniqueGenres.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching combined genres:', error);
      return [];
    }
  },

  // Videos/Trailers
  getMovieVideos: async (movieId: number): Promise<VideoResult[]> => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`, {
        params: { language: 'en-US' }
      });
      return response.data.results.filter((video: VideoResult) => video.site === 'YouTube');
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];
    }
  },

  getTVVideos: async (tvId: number): Promise<VideoResult[]> => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}/videos`, {
        params: { language: 'en-US' }
      });
      return response.data.results.filter((video: VideoResult) => video.site === 'YouTube');
    } catch (error) {
      console.error('Error fetching TV videos:', error);
      return [];
    }
  },

  // Trending
  getTrending: async (mediaType: ContentType = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<MultiSearchResponse> => {
    try {
      const response: AxiosResponse<MultiSearchResponse> = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, {
        params: { language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw new Error('Failed to load trending content');
    }
  },

  // Similar Movies
  getSimilarMovies: async (movieId: number, page: number = 1): Promise<TMDBResponse<Movie>> => {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await tmdbApi.get(`/movie/${movieId}/similar`, {
        params: { page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw new Error('Failed to load similar movies');
    }
  },

  // Similar TV Shows
  getSimilarTVShows: async (tvId: number, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    try {
      const response: AxiosResponse<TMDBResponse<TVShow>> = await tmdbApi.get(`/tv/${tvId}/similar`, {
        params: { page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching similar TV shows:', error);
      throw new Error('Failed to load similar TV shows');
    }
  },

  // Movie Recommendations
  getMovieRecommendations: async (movieId: number, page: number = 1): Promise<TMDBResponse<Movie>> => {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
        params: { page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      throw new Error('Failed to load movie recommendations');
    }
  },

  // TV Show Recommendations  
  getTVRecommendations: async (tvId: number, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    try {
      const response: AxiosResponse<TMDBResponse<TVShow>> = await tmdbApi.get(`/tv/${tvId}/recommendations`, {
        params: { page, language: 'en-US' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show recommendations:', error);
      throw new Error('Failed to load TV show recommendations');
    }
  }
};

export default mediaService;