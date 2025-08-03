import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  theme: 'dark' | 'light';
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'ms' | 'mph' | 'kmh';
  defaultView: 'current' | 'historical';
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  temperatureUnit: 'celsius',
  windSpeedUnit: 'ms',
  defaultView: 'current',
  autoRefresh: true,
  refreshInterval: 60,
};

const PREFERENCES_KEY = 'mars-weather-preferences';

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferencesState({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage whenever they change
  const setPreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setPreferencesState(prev => {
      const updated = { ...prev, ...newPreferences };
      try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
      return updated;
    });
  }, []);

  // Utility functions for common preference updates
  const toggleTheme = useCallback(() => {
    setPreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' });
  }, [preferences.theme, setPreferences]);

  const setTemperatureUnit = useCallback((unit: UserPreferences['temperatureUnit']) => {
    setPreferences({ temperatureUnit: unit });
  }, [setPreferences]);

  const setWindSpeedUnit = useCallback((unit: UserPreferences['windSpeedUnit']) => {
    setPreferences({ windSpeedUnit: unit });
  }, [setPreferences]);

  // Temperature conversion utilities
  const convertTemperature = useCallback((celsius: number): string => {
    if (preferences.temperatureUnit === 'fahrenheit') {
      const fahrenheit = (celsius * 9/5) + 32;
      return `${Math.round(fahrenheit)}°F`;
    }
    return `${celsius}°C`;
  }, [preferences.temperatureUnit]);

  // Wind speed conversion utilities
  const convertWindSpeed = useCallback((ms: number): string => {
    switch (preferences.windSpeedUnit) {
      case 'mph':
        return `${Math.round(ms * 2.237)} mph`;
      case 'kmh':
        return `${Math.round(ms * 3.6)} km/h`;
      default:
        return `${ms} m/s`;
    }
  }, [preferences.windSpeedUnit]);

  return {
    preferences,
    setPreferences,
    isLoaded,
    toggleTheme,
    setTemperatureUnit,
    setWindSpeedUnit,
    convertTemperature,
    convertWindSpeed,
  };
}