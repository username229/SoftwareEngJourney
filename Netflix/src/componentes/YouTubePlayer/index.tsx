'use client';

import { useState, useEffect } from 'react';
import { VideoResult } from '../../types/movie';
import './index.scss';

interface YouTubePlayerProps {
  videos: VideoResult[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function YouTubePlayer({ videos, title, isOpen, onClose }: YouTubePlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);

  useEffect(() => {
    if (videos && videos.length > 0) {
      // Find trailer first, then teaser, then any video
      const trailer = videos.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube' && video.official
      );
      const teaser = videos.find(video => 
        video.type === 'Teaser' && video.site === 'YouTube'
      );
      const anyVideo = videos.find(video => video.site === 'YouTube');
      
      setSelectedVideo(trailer || teaser || anyVideo || null);
    }
  }, [videos]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !selectedVideo) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const embedUrl = `https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="youtube-modal-overlay" onClick={handleBackdropClick}>
      <div className="youtube-modal">
        <div className="youtube-header">
          <h3>{title} - {selectedVideo.name}</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="youtube-player-container">
          <iframe
            src={embedUrl}
            title={selectedVideo.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="youtube-iframe"
          />
        </div>

        {videos.length > 1 && (
          <div className="video-selector">
            <h4>Available Videos:</h4>
            <div className="video-list">
              {videos
                .filter(video => video.site === 'YouTube')
                .map(video => (
                  <button
                    key={video.id}
                    className={`video-option ${selectedVideo.key === video.key ? 'active' : ''}`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <span className="video-type">{video.type}</span>
                    <span className="video-name">{video.name}</span>
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}