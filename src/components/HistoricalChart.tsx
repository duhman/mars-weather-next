'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoricalMarsWeatherData } from '@/types/weather';
import styles from './HistoricalChart.module.css';

interface HistoricalChartProps {
  data: HistoricalMarsWeatherData[];
  theme: 'dark' | 'light';
}

export default function HistoricalChart({ data, theme }: HistoricalChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map(item => ({
    sol: `Sol ${item.sol}`,
    temperature: item.temperature,
    windSpeed: item.windSpeed,
    pressure: item.pressure,
    date: new Date(item.terrestrialDate).toLocaleDateString()
  }));

  const axisColor = theme === 'dark' ? '#a0a0a0' : '#555';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mars Weather Trends (Last 30 Sols)</h2>
      
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>Temperature Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="sol" 
              stroke={axisColor}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={axisColor}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fill: axisColor } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1a1a2e' : '#fff',
                border: `1px solid ${theme === 'dark' ? '#ff6b00' : '#ff9a3c'}`,
                borderRadius: '8px'
              }}
              labelStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ff6b00" 
              strokeWidth={2}
              dot={{ fill: '#ff9a3c', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>Wind Speed & Pressure</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.slice(-15)}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="sol" 
              stroke={axisColor}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={axisColor}
              label={{ value: 'Value', angle: -90, position: 'insideLeft', style: { fill: axisColor } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1a1a2e' : '#fff',
                border: `1px solid ${theme === 'dark' ? '#ff6b00' : '#ff9a3c'}`,
                borderRadius: '8px'
              }}
              labelStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar dataKey="windSpeed" fill="#ff6b00" name="Wind Speed (m/s)" />
            <Bar dataKey="pressure" fill="#ff9a3c" name="Pressure (Pa)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Average Temperature:</span>
          <span className={styles.summaryValue}>
            {Math.round(data.reduce((sum, d) => sum + (d.temperature || 0), 0) / data.length)}°C
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Temperature Range:</span>
          <span className={styles.summaryValue}>
            {Math.min(...data.map(d => d.temperature || 0))}°C to {Math.max(...data.map(d => d.temperature || 0))}°C
          </span>
        </div>
      </div>
    </div>
  );
}