export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_count: number;
  runtime?: number;
  budget?: number;
  revenue?: number;
  videos?: {
    results: VideoResult[];
  };
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  original_name: string;
  adult: boolean;
  number_of_episodes?: number;
  number_of_seasons?: number;
  episode_run_time?: number[];
  status?: string;
  videos?: {
    results: VideoResult[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MediaItem extends Omit<Movie, 'title' | 'release_date'> {
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
}

export type ContentType = 'movie' | 'tv' | 'all';