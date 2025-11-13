// Microsoft-style accessibility utilities
export const a11yUtils = {
  // ARIA labels for screen readers
  getMovieCardLabel: (title: string, rating: number, isFavorite: boolean) => {
    return `${title}, avaliação ${rating.toFixed(1)} de 10, ${isFavorite ? 'marcado como favorito' : 'não está nos favoritos'}`;
  },

  // Keyboard navigation support
  handleKeyboardNavigation: (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  },

  // Focus management
  trapFocus: (containerElement: HTMLElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    containerElement.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    return () => {
      containerElement.removeEventListener('keydown', handleTabKey);
    };
  },

  // Color contrast checker
  checkColorContrast: (foreground: string, background: string): boolean => {
    // Simplified contrast checker - in production would use full WCAG algorithm
    const getLuminance = (color: string) => {
      // Basic implementation - would be more robust in production
      return 0.5; // Placeholder
    };
    
    const contrast = (getLuminance(foreground) + 0.05) / (getLuminance(background) + 0.05);
    return contrast >= 4.5; // WCAG AA standard
  },

  // Screen reader announcements
  announceToScreenReader: (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
};

export default a11yUtils;