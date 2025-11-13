// Microsoft-style error boundary
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MovieMate Error Boundary caught an error:', error, errorInfo);
    
    // In a real app, you would log this to an error reporting service
    // like Application Insights (Microsoft's solution)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🎬 Oops! Algo deu errado</h2>
            <p>Ocorreu um erro inesperado no MovieMate.</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Detalhes técnicos</summary>
              {this.state.error?.toString()}
            </details>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="retry-button"
            >
              🔄 Tentar Novamente
            </button>
          </div>
          
          <style jsx>{`
            .error-boundary {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 400px;
              padding: 20px;
              background: #0f172a;
            }
            .error-content {
              text-align: center;
              background: #1e293b;
              padding: 40px;
              border-radius: 12px;
              border: 1px solid #334155;
              max-width: 500px;
            }
            .error-content h2 {
              color: #f1f5f9;
              margin-bottom: 16px;
            }
            .error-content p {
              color: #94a3b8;
              margin-bottom: 20px;
            }
            .retry-button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
            }
            .retry-button:hover {
              background: #2563eb;
            }
            details {
              margin: 20px 0;
              text-align: left;
              color: #94a3b8;
              font-family: monospace;
              font-size: 12px;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;