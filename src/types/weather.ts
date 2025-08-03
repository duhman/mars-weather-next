export interface MarsWeatherData {
  sol: number;
  temperature: number | null;
  windSpeed: number | null;
  pressure: number | null;
  season: string;
  terrestrialDate: string;
}

export interface CurrentMarsWeatherData {
  latestSol: string;
  temperature: string;
  windSpeed: string;
  pressure: string;
  season: string;
  lastUpdated: string;
  source: string;
}

export interface HistoricalMarsWeatherData extends MarsWeatherData {
  id: string;
}

export interface WeatherApiResponse {
  success: boolean;
  data?: CurrentMarsWeatherData | HistoricalMarsWeatherData[];
  error?: string;
  details?: string;
  source?: string;
}

export interface InsightSolData {
  AT?: {
    av: number;
    ct: number;
    mn: number;
    mx: number;
  };
  HWS?: {
    av: number;
    ct: number;
    mn: number;
    mx: number;
  };
  PRE?: {
    av: number;
    ct: number;
    mn: number;
    mx: number;
  };
  Season: string;
  First_UTC: string;
  Last_UTC: string;
}

export interface InsightAPIResponse {
  [key: string]: InsightSolData | string[] | { 
    [sol: string]: {
      AT?: { valid: boolean };
      HWS?: { valid: boolean };
      PRE?: { valid: boolean };
    }
  };
  sol_keys: string[];
  validity_checks: {
    [sol: string]: {
      AT?: { valid: boolean };
      HWS?: { valid: boolean };
      PRE?: { valid: boolean };
    };
  };
}