'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'EBoR0YCWYlbarcR5LgRZFAsdt3f6YcthtvLytB1u'; // Replace with your Mars weather API key

export default function Home() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`
        );
        
        // Get the latest sol (Martian day) data
        const solKeys = response.data.sol_keys;
        const latestSol = solKeys[solKeys.length - 1];
        const latestWeather = response.data[latestSol];
        
        // Set the temperature
        setTemperature(latestWeather.AT.av);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Mars weather data');
        setLoading(false);
        console.error('Error fetching Mars weather:', err);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div style={{ 
      position: 'relative',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1
        }}
      >
        <source src="/Penguins Play on Mars Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
      }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            <h1>The temperature on Mars is {temperature}°C</h1>
            <p>It's cold.</p>
          </div>
        )}
      </div>
    </div>
  );
}