'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import WeatherCard from '@/components/WeatherCard';
import HistoricalChart from '@/components/HistoricalChart';
import { Cache } from '@/utils/cache';
import { 
  CurrentMarsWeatherData, 
  HistoricalMarsWeatherData,
  WeatherApiResponse 
} from '@/types/weather';

export default function Home() {
  const [weatherData, setWeatherData] = useState<CurrentMarsWeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalMarsWeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<'current' | 'historical'>('current');

  useEffect(() => {
    // Check for cached data first
    const cachedWeather = Cache.get<CurrentMarsWeatherData>('mars-weather-current');
    const cachedHistorical = Cache.get<HistoricalMarsWeatherData[]>('mars-weather-historical');
    
    if (cachedWeather) {
      setWeatherData(cachedWeather);
      setLoading(false);
    }
    
    if (cachedHistorical) {
      setHistoricalData(cachedHistorical);
    }

    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        const data: WeatherApiResponse = await response.json();
        
        if (data.success && data.data) {
          const currentData = data.data as CurrentMarsWeatherData;
          setWeatherData(currentData);
          Cache.set('mars-weather-current', currentData);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch Mars weather data');
          console.error('Error from API:', data.details);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to fetch Mars weather data: ${errorMessage}`);
        console.error('Error fetching Mars weather:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchHistoricalWeather = async () => {
      try {
        const response = await fetch('/api/weather?type=historical');
        const data: WeatherApiResponse = await response.json();
        
        if (data.success && data.data) {
          const historical = data.data as HistoricalMarsWeatherData[];
          setHistoricalData(historical);
          Cache.set('mars-weather-historical', historical);
        } else {
          console.error('Error fetching historical data:', data.error);
        }
      } catch (err) {
        console.error('Error fetching historical weather data:', err);
      }
    };

    fetchWeather();
    fetchHistoricalWeather();
    
    // Refresh data every hour
    const interval = setInterval(() => {
      fetchWeather();
      fetchHistoricalWeather();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatLastUpdated = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };


  const containerClass = `${styles.container} ${theme === 'dark' ? styles.containerDark : styles.containerLight}`;
  const wrapperClass = `${styles.wrapper} ${theme === 'dark' ? styles.wrapperDark : styles.wrapperLight}`;
  const headerClass = `${styles.header} ${theme === 'dark' ? styles.headerDark : styles.headerLight}`;
  const footerClass = `${styles.footer} ${theme === 'dark' ? styles.footerDark : styles.footerLight}`;
  const subtitleClass = `${styles.subtitle} ${theme === 'dark' ? styles.subtitleDark : styles.subtitleLight}`;
  const navButtonClass = `${styles.navButton} ${theme === 'dark' ? styles.navButtonDark : styles.navButtonLight}`;

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        <header className={headerClass}>
          <div className={styles.navigation}>
            <button 
              onClick={() => setView('current')}
              className={`${navButtonClass} ${view === 'current' ? styles.navButtonActive : ''}`}
            >
              Current Weather
            </button>
            <h1 className={styles.title}>Mars Weather Dashboard</h1>
            <button 
              onClick={() => setView('historical')}
              className={`${navButtonClass} ${view === 'historical' ? styles.navButtonActive : ''}`}
            >
              Historical Data
            </button>
          </div>
          <div className={styles.themeToggleContainer}>
            <button 
              onClick={toggleTheme}
              className={`${styles.themeButton} ${theme === 'dark' ? styles.navButtonDark : styles.navButtonLight}`}
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
            </button>
          </div>
          <p className={subtitleClass}>Latest weather data from Mars</p>
        </header>

        {loading ? (
          <LoadingSpinner message="Loading Mars weather data..." />
        ) : error ? (
          <ErrorAlert 
            error={error}
            details="Falling back to cached data or simulated values..."
          />
        ) : view === 'current' && weatherData ? (
          <div>
            <div className={styles.weatherGrid}>
              <WeatherCard
                title="Current Sol"
                value={weatherData.latestSol}
                size="large"
              />
              <WeatherCard
                title="Temperature"
                value={weatherData.temperature}
                size="large"
              />
              <WeatherCard
                title="Wind Speed"
                value={weatherData.windSpeed}
                size="large"
              />
            </div>

            <div className={styles.weatherGrid}>
              <WeatherCard
                title="Pressure"
                value={weatherData.pressure}
                size="small"
              />
              <WeatherCard
                title="Season"
                value={weatherData.season}
                size="small"
              />
            </div>

            <div className={footerClass}>
              <p>Last updated: {formatLastUpdated(weatherData.lastUpdated)}</p>
              <p>Data source: {weatherData.source}</p>
            </div>
          </div>
        ) : view === 'historical' ? (
          <div>
            <HistoricalChart data={historicalData} theme={theme} />
            <div className={footerClass}>
              <p>Data source: Mars Weather Historical Records</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}