import { getPublicImageUrl } from './s3Service';

// Decide se usa TMDB ou S3 para imagens
export const getMovieImage = (tmdbPath?: string, s3Key?: string) => {
  if (s3Key) {
    return getPublicImageUrl(s3Key);
  }
  
  if (tmdbPath) {
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/w500${tmdbPath}`;
  }
  
  return '/placeholder-movie.jpg';
};

// Cache de imagens no S3
export const cacheImageToS3 = async (tmdbUrl: string, movieId: string) => {
  try {
    const response = await fetch(tmdbUrl);
    const buffer = await response.arrayBuffer();
    
    const key = `cached/${movieId}.jpg`;
    // Upload para S3 seria feito aqui
    return key;
  } catch (error) {
    console.error('Failed to cache image:', error);
    return null;
  }
};