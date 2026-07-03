import { useState, useEffect } from 'react';
import { PropertyData, MOCK_PROPERTIES } from './mockData';

const initialState = {
  currentView: 'landing' as 'landing' | 'dashboard' | 'analysis' | 'reports',
  theme: 'dark' as 'light' | 'dark',
  selectedProperty: null as PropertyData | null,
  selectedYear: 2024,
  mapStyle: 'satellite' as 'satellite' | 'osm',
  sidebarOpen: true,
  analysisOpen: false,
  drawingMode: false,
  properties: MOCK_PROPERTIES,
};

class SimpleStore {
  private state = { ...initialState };
  private listeners: Set<() => void> = new Set();

  getState() {
    return this.state;
  }

  setState(updater: Partial<typeof this.state> | ((s: typeof this.state) => Partial<typeof this.state>)) {
    const updates = typeof updater === 'function' ? updater(this.state) : updater;
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(l => l());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
}

export const store = new SimpleStore();

// Export actions
export const setView = (view: typeof initialState.currentView) => store.setState({ currentView: view });
export const selectProperty = (property: PropertyData | null) => store.setState({ selectedProperty: property });
export const setYear = (year: number) => store.setState({ selectedYear: year });
export const setMapStyle = (style: 'satellite' | 'osm') => store.setState({ mapStyle: style });
export const toggleSidebar = () => store.setState(s => ({ sidebarOpen: !s.sidebarOpen }));
export const openAnalysis = (property: PropertyData) => store.setState({ selectedProperty: property, analysisOpen: true });
export const closeAnalysis = () => store.setState({ analysisOpen: false });
export const setDrawingMode = (enabled: boolean) => store.setState({ drawingMode: enabled });
export const toggleTheme = () => store.setState(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' }));

export function useStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState({ ...store.getState() });
    });
  }, []);

  return {
    ...state,
    setView,
    selectProperty,
    setYear,
    setMapStyle,
    toggleSidebar,
    openAnalysis,
    closeAnalysis,
    setDrawingMode,
    toggleTheme,
  };
}
