// Microsoft-style performance monitoring
'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiCalls: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    apiCalls: 0
  };

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackPageLoad() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    }
  }

  trackRender(componentName: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    console.log(`🎬 MovieMate - ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    this.metrics.renderTime += renderTime;
  }

  trackApiCall() {
    this.metrics.apiCalls++;
  }

  getMetrics(): PerformanceMetrics {
    if (typeof window !== 'undefined' && 'performance' in window && (performance as any).memory) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
    return { ...this.metrics };
  }

  logPerformanceReport() {
    const metrics = this.getMetrics();
    console.group('🚀 MovieMate Performance Report');
    console.log('📊 Load Time:', `${metrics.loadTime.toFixed(2)}ms`);
    console.log('🎨 Total Render Time:', `${metrics.renderTime.toFixed(2)}ms`);
    console.log('🌐 API Calls Made:', metrics.apiCalls);
    if (metrics.memoryUsage) {
      console.log('🧠 Memory Usage:', `${(metrics.memoryUsage / 1048576).toFixed(2)}MB`);
    }
    console.groupEnd();
  }
}

export const usePerformanceTracking = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    const monitor = PerformanceMonitor.getInstance();
    
    monitor.trackPageLoad();
    
    return () => {
      monitor.trackRender(componentName, startTime);
    };
  }, [componentName]);
};

export default PerformanceMonitor;