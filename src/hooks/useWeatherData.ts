import { useQuery, QueryClient } from '@tanstack/react-query';
import { CurrentMarsWeatherData, HistoricalMarsWeatherData, WeatherApiResponse } from '@/types/weather';

const WEATHER_QUERY_KEY = ['mars-weather'];
const HISTORICAL_QUERY_KEY = ['mars-weather-historical'];

async function fetchCurrentWeather(): Promise<CurrentMarsWeatherData> {
  const response = await fetch('/api/weather');
  const data: WeatherApiResponse = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch weather data');
  }
  
  return data.data as CurrentMarsWeatherData;
}

async function fetchHistoricalWeather(): Promise<HistoricalMarsWeatherData[]> {
  const response = await fetch('/api/weather?type=historical');
  const data: WeatherApiResponse = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch historical data');
  }
  
  return data.data as HistoricalMarsWeatherData[];
}

export function useCurrentWeather() {
  return useQuery({
    queryKey: WEATHER_QUERY_KEY,
    queryFn: fetchCurrentWeather,
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  });
}

export function useHistoricalWeather() {
  return useQuery({
    queryKey: HISTORICAL_QUERY_KEY,
    queryFn: fetchHistoricalWeather,
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  });
}

// Utility function to prefetch weather data
export async function prefetchWeatherData(queryClient: QueryClient) {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: WEATHER_QUERY_KEY,
      queryFn: fetchCurrentWeather,
    }),
    queryClient.prefetchQuery({
      queryKey: HISTORICAL_QUERY_KEY,
      queryFn: fetchHistoricalWeather,
    }),
  ]);
}