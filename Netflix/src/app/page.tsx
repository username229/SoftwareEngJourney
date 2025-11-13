'use client';

import dynamic from 'next/dynamic';

// Dynamic import without SSR
const MovieMateApp = dynamic(() => import("../componentes/MovieMateApp"), {
  ssr: false,
  loading: () => (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f1f5f9',
      fontSize: '18px',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '16px', background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🎬 MovieMate
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
          Loading your entertainment companion...
        </p>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #374151', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
});

export default function Home() {
  return (
    <div suppressHydrationWarning>
      <MovieMateApp />
    </div>
  );
}
