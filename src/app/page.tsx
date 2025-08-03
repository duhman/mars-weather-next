'use client';

import React, { useEffect } from 'react';
import styles from './page.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import WeatherCard from '@/components/WeatherCard';
import HistoricalChart from '@/components/HistoricalChart';
import WeatherIcon from '@/components/WeatherIcon';
import { useCurrentWeather, useHistoricalWeather } from '@/hooks/useWeatherData';
import { usePreferences } from '@/hooks/usePreferences';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { exportWeatherData, prepareExportData } from '@/utils/export';

export default function Home() {
  const { data: weatherData, isLoading: isLoadingCurrent, error: currentError } = useCurrentWeather();
  const { data: historicalData = [], isLoading: isLoadingHistorical } = useHistoricalWeather();
  const { 
    preferences, 
    toggleTheme, 
    convertTemperature, 
    convertWindSpeed,
    isLoaded: preferencesLoaded 
  } = usePreferences();
  const { isOffline, isUpdateAvailable, updateServiceWorker } = useServiceWorker();

  // Apply theme to body
  useEffect(() => {
    if (preferencesLoaded) {
      document.body.className = preferences.theme;
    }
  }, [preferences.theme, preferencesLoaded]);

  const handleExport = (format: 'json' | 'csv') => {
    const exportData = prepareExportData(weatherData, historicalData);
    exportWeatherData(exportData, format);
  };

  const getWeatherCondition = (): 'sunny' | 'dusty' | 'stormy' | 'cold' | 'windy' => {
    if (!weatherData) return 'sunny';
    
    const temp = parseInt(weatherData.temperature);
    const wind = parseInt(weatherData.windSpeed);
    
    if (temp < -60) return 'cold';
    if (wind > 15) return 'windy';
    if (weatherData.season.toLowerCase().includes('dust')) return 'dusty';
    if (wind > 20 && temp < -40) return 'stormy';
    return 'sunny';
  };

  const loading = isLoadingCurrent || isLoadingHistorical || !preferencesLoaded;
  const error = currentError;
  const view = preferences.defaultView;

  const containerClass = `${styles.container} ${preferences.theme === 'dark' ? styles.containerDark : styles.containerLight}`;
  const wrapperClass = `${styles.wrapper} ${preferences.theme === 'dark' ? styles.wrapperDark : styles.wrapperLight}`;
  const headerClass = `${styles.header} ${preferences.theme === 'dark' ? styles.headerDark : styles.headerLight}`;
  const footerClass = `${styles.footer} ${preferences.theme === 'dark' ? styles.footerDark : styles.footerLight}`;
  const subtitleClass = `${styles.subtitle} ${preferences.theme === 'dark' ? styles.subtitleDark : styles.subtitleLight}`;

  return (
    <div className={containerClass} role="main" aria-label="Mars Weather Dashboard">
      {isOffline && (
        <div className={styles.offlineBanner} role="alert" aria-live="polite">
          You&apos;re offline - showing cached data
        </div>
      )}
      
      {isUpdateAvailable && (
        <div className={styles.updateBanner} role="alert">
          <span>A new version is available!</span>
          <button onClick={updateServiceWorker} className={styles.updateButton}>
            Update Now
          </button>
        </div>
      )}

      <div className={wrapperClass}>
        <header className={headerClass}>
          <h1 className={styles.title}>Mars Weather Dashboard</h1>
          <p className={subtitleClass}>Real-time weather data from Mars missions</p>
          
          <nav className={styles.controls} role="navigation" aria-label="Dashboard controls">
            <button 
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label={`Switch to ${preferences.theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {preferences.theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            <div className={styles.exportButtons} role="group" aria-label="Export options">
              <button 
                onClick={() => handleExport('json')}
                className={styles.exportButton}
                aria-label="Export data as JSON"
              >
                Export JSON
              </button>
              <button 
                onClick={() => handleExport('csv')}
                className={styles.exportButton}
                aria-label="Export data as CSV"
              >
                Export CSV
              </button>
            </div>
          </nav>
        </header>

        {loading ? (
          <LoadingSpinner message="Loading Mars weather data..." />
        ) : error ? (
          <ErrorAlert 
            error={error.message}
            details={isOffline ? "You&apos;re offline. Showing cached data when available." : undefined}
          />
        ) : (
          <>
            {view === 'current' && weatherData && (
              <section aria-label="Current weather conditions">
                <div className={styles.currentWeatherHeader}>
                  <WeatherIcon 
                    condition={getWeatherCondition()} 
                    size="large" 
                    animated={true}
                  />
                  <h2 className={styles.sectionTitle}>Current Conditions</h2>
                </div>

                <div className={styles.weatherGrid}>
                  <WeatherCard
                    title="Sol"
                    value={weatherData.latestSol}
                    size="large"
                  />
                  <WeatherCard
                    title="Temperature"
                    value={weatherData.temperature ? 
                      convertTemperature(parseInt(weatherData.temperature)) : 
                      'N/A'
                    }
                    size="large"
                  />
                  <WeatherCard
                    title="Wind Speed"
                    value={weatherData.windSpeed ? 
                      convertWindSpeed(parseInt(weatherData.windSpeed)) : 
                      'N/A'
                    }
                    size="large"
                  />
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
                  <p>Last updated: {new Date(weatherData.lastUpdated).toLocaleString()}</p>
                  <p>Data source: {weatherData.source}</p>
                </div>
              </section>
            )}

            {view === 'historical' && (
              <section aria-label="Historical weather data">
                <HistoricalChart data={historicalData} theme={preferences.theme} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}