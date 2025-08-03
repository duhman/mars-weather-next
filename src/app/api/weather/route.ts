import { NextResponse } from 'next/server';
import axios from 'axios';
import { 
  CurrentMarsWeatherData, 
  HistoricalMarsWeatherData,
  InsightAPIResponse,
  InsightSolData 
} from '@/types/weather';

// Helper function to fetch from NASA InSight API
async function fetchFromInsightAPI(): Promise<CurrentMarsWeatherData | null> {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const apiUrl = process.env.NEXT_PUBLIC_NASA_INSIGHT_API_URL || 'https://api.nasa.gov/insight_weather/';
    
    const response = await axios.get<InsightAPIResponse>(apiUrl, {
      params: {
        api_key: apiKey,
        feedtype: 'json',
        ver: '1.0'
      }
    });

    const data = response.data;
    
    if (!data.sol_keys || data.sol_keys.length === 0) {
      return null;
    }

    // Get the latest sol
    const latestSol = data.sol_keys[data.sol_keys.length - 1];
    const solData = data[latestSol] as InsightSolData;

    if (!solData || typeof solData !== 'object' || !('Season' in solData)) {
      return null;
    }

    // Extract weather data with fallbacks
    const temperature = solData.AT ? `${Math.round(solData.AT.av)}°C` : 'N/A';
    const windSpeed = solData.HWS ? `${Math.round(solData.HWS.av)} m/s` : 'N/A';
    const pressure = solData.PRE ? `${Math.round(solData.PRE.av)} Pa` : 'N/A';

    return {
      latestSol: `Sol ${latestSol}`,
      temperature,
      windSpeed,
      pressure,
      season: solData.Season || 'Unknown',
      lastUpdated: new Date().toISOString(),
      source: 'NASA InSight Mars Weather Service',
    };
  } catch (error) {
    console.error('InSight API error:', error);
    return null;
  }
}

// Fallback function using mock data
function getMockWeatherData(): CurrentMarsWeatherData {
  const mockSols = [1000, 1001, 1002, 1003, 1004];
  const mockTemps = [-50, -55, -45, -60, -52];
  const mockWinds = [5, 8, 12, 15, 10];
  const mockPressures = [730, 740, 750, 760, 745];
  const mockSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  
  const randomIndex = Math.floor(Math.random() * mockSols.length);
  
  return {
    latestSol: `Sol ${mockSols[randomIndex]}`,
    temperature: `${mockTemps[randomIndex]}°C`,
    windSpeed: `${mockWinds[randomIndex]} m/s`,
    pressure: `${mockPressures[randomIndex]} Pa`,
    season: mockSeasons[Math.floor(Math.random() * mockSeasons.length)],
    lastUpdated: new Date().toISOString(),
    source: 'Simulated Mars Weather Data (NASA API Unavailable)',
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'current';
  
  try {
    if (type === 'current') {
      // Try NASA InSight API first
      let weatherData = await fetchFromInsightAPI();
      
      // If API fails, use mock data
      if (!weatherData) {
        console.log('Using mock data as InSight API is unavailable');
        weatherData = getMockWeatherData();
      }
      
      return NextResponse.json({
        success: true,
        data: weatherData,
      });
    } else if (type === 'historical') {
      // Generate more realistic historical data
      const historicalData: HistoricalMarsWeatherData[] = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - (i * 3)); // Every 3 days
        
        const sol = 1000 - (i * 3);
        const baseTemp = -50;
        const tempVariation = Math.sin(i / 5) * 15; // Seasonal variation
        const randomVariation = (Math.random() - 0.5) * 10;
        
        historicalData.push({
          id: `sol-${sol}`,
          sol,
          temperature: Math.round(baseTemp + tempVariation + randomVariation),
          windSpeed: Math.round(5 + Math.random() * 15),
          pressure: Math.round(730 + Math.random() * 50),
          season: ['Spring', 'Summer', 'Autumn', 'Winter'][Math.floor((i / 7.5) % 4)],
          terrestrialDate: date.toISOString().split('T')[0],
        });
      }
      
      return NextResponse.json({
        success: true,
        data: historicalData.reverse(), // Oldest first
        source: 'Simulated Historical Mars Weather Data',
      });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching Mars weather data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Mars weather data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
