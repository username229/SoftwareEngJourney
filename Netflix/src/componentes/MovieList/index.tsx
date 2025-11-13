'use client';

import { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import MovieCard from '../MovieCard';
import { Movie } from '@/types/movie';

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getMovies();
  }, []);

  const getMovies = () => {
    axios({
      method: 'get',
      url: 'https://api.themoviedb.org/3/movie/popular',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZTIwNDRlNzBlYmQyMDllOWRlMGYxMzNlYTdkYjZlMyIsIm5iZiI6MTczNTMxNDQxMC45MDcsInN1YiI6IjY3NmVjYmVhY2ZlNjI2NDRkZjEyYmQyNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.28fEWsof4fpShoUyw1RNlUJuWQDgsrwlVtO07KCOSJs',
      },
      params: {
        language: 'en-US',
        page: 1
      }
    }).then(response => {
      setMovies(response.data.results);
    }).catch(error => {
      console.error('Error fetching movies:', error);
    });
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </ul>
  );
}