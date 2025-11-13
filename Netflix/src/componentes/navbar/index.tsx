'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../MovieCard';
import './index.css';
import { Movie } from '../../types';


export default function Navbar() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [mounted, setMounted] = useState(false);

    // Evitar problemas de hidratação e buscar filmes automaticamente
    useEffect(() => {
        setMounted(true);
        getMovies();
    }, []);
    
    const getMovies = () => {
        axios({
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/popular',
            params: {
                language: 'pt-BR'
            },
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZTIwNDRlNzBlYmQyMDllOWRlMGYxMzNlYTdkYjZlMyIsIm5iZiI6MTczNTMxNDQxMC45MDcsInN1YiI6IjY3NmVjYmVhY2ZlNjI2NDRkZjEyYmQyNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.28fEWsof4fpShoUyw1RNlUJuWQDgsrwlVtO07KCOSJs'
            }
        }).then((response: any) => {
            console.log(response.data);
            setMovies(response.data.results);
        }).catch((error: any) => {
            console.error('Erro ao buscar filmes:', error);
        });
    };

    if (!mounted) {
        return null;
    }

    return (
        <div>
            <nav className="navbar">
                <h1 suppressHydrationWarning>MovieMate</h1>
                <p suppressHydrationWarning>Filmes Populares</p>
            </nav>
            
            <ul className="movie-list">
                {movies.map((movie: Movie) => (
                    <MovieCard 
                        key={movie.id}
                        movie={movie}
                    />
                ))}
            </ul>
        </div>
    );
}