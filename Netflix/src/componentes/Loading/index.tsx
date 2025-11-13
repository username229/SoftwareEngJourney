'use client';

import './index.scss';

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'dots';
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export default function Loading({ 
  type = 'spinner', 
  size = 'medium', 
  text = 'Carregando...' 
}: LoadingProps) {

  if (type === 'skeleton') {
    return (
      <div className={`skeleton-container ${size}`}>
        <div className="skeleton-poster"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-rating"></div>
          <div className="skeleton-description"></div>
        </div>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`loading-dots ${size}`}>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    );
  }

  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}