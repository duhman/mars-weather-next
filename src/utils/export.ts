import { CurrentMarsWeatherData, HistoricalMarsWeatherData } from '@/types/weather';

export type ExportFormat = 'json' | 'csv';

interface ExportData {
  current?: CurrentMarsWeatherData;
  historical?: HistoricalMarsWeatherData[];
  metadata: {
    exportDate: string;
    source: string;
    version: string;
  };
}

export function exportWeatherData(
  data: ExportData,
  format: ExportFormat,
  filename?: string
): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultFilename = `mars-weather-${timestamp}`;
  const finalFilename = filename || defaultFilename;

  switch (format) {
    case 'json':
      exportAsJSON(data, finalFilename);
      break;
    case 'csv':
      exportAsCSV(data, finalFilename);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

function exportAsJSON(data: ExportData, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadFile(blob, `${filename}.json`);
}

function exportAsCSV(data: ExportData, filename: string): void {
  let csvContent = '';

  // Add metadata
  csvContent += 'Mars Weather Data Export\n';
  csvContent += `Export Date: ${data.metadata.exportDate}\n`;
  csvContent += `Source: ${data.metadata.source}\n`;
  csvContent += `Version: ${data.metadata.version}\n\n`;

  // Current weather data
  if (data.current) {
    csvContent += 'Current Weather\n';
    csvContent += 'Sol,Temperature,Wind Speed,Pressure,Season,Last Updated\n';
    csvContent += `${data.current.latestSol},${data.current.temperature},${data.current.windSpeed},${data.current.pressure},${data.current.season},${data.current.lastUpdated}\n\n`;
  }

  // Historical data
  if (data.historical && data.historical.length > 0) {
    csvContent += 'Historical Weather\n';
    csvContent += 'Sol,Temperature (°C),Wind Speed (m/s),Pressure (Pa),Season,Earth Date\n';
    
    data.historical.forEach(record => {
      csvContent += `${record.sol},${record.temperature || 'N/A'},${record.windSpeed || 'N/A'},${record.pressure || 'N/A'},${record.season},${record.terrestrialDate}\n`;
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${filename}.csv`);
}

function downloadFile(blob: Blob, filename: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

// Utility function to prepare data for export
export function prepareExportData(
  current?: CurrentMarsWeatherData,
  historical?: HistoricalMarsWeatherData[]
): ExportData {
  return {
    current,
    historical,
    metadata: {
      exportDate: new Date().toISOString(),
      source: 'Mars Weather Dashboard',
      version: '2.0.0',
    },
  };
}