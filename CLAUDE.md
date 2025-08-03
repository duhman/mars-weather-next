# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mars Weather App - A Next.js application that displays current and historical weather data from Mars using NASA's Perseverance rover data. Features include dark/light theme toggle and data visualization.

## Commands

**Development:**
```bash
npm run dev    # Start development server with Turbopack
```

**Production:**
```bash
npm run build  # Build for production
npm start      # Start production server
```

**Code Quality:**
```bash
npm run lint   # Run ESLint
```

## Architecture

### Tech Stack
- **Framework:** Next.js 15.4.5 with App Router
- **Language:** TypeScript
- **Styling:** CSS Modules with Tailwind CSS v4
- **Data Fetching:** Server-side API routes with NASA InSight API integration
- **Charts:** Recharts for data visualization
- **Caching:** localStorage-based caching with 1-hour TTL

### Project Structure
- `/src/app/page.tsx` - Main page component using modular components
- `/src/app/api/weather/route.ts` - API endpoint with NASA InSight API integration and fallback
- `/src/components/` - Reusable components (WeatherCard, LoadingSpinner, ErrorAlert, HistoricalChart)
- `/src/types/weather.ts` - TypeScript interfaces for type safety
- `/src/utils/cache.ts` - Client-side caching utilities
- CSS Modules for each component

### Key Implementation Details

**Weather Data Flow:**
1. Client checks localStorage cache first
2. Fetches from `/api/weather` endpoint
3. API attempts NASA InSight API, falls back to simulated data
4. Data cached for 1 hour in localStorage
5. Auto-refresh every hour

**State Management:**
- React hooks for local state
- localStorage for data persistence
- No external state management library

**Styling Approach:**
- CSS Modules for component isolation
- Theme toggle (dark/light) with CSS classes
- Responsive design with CSS Grid and Flexbox
- Smooth transitions and hover effects

**Environment Variables:**
```
NASA_API_KEY=your_api_key_here
NEXT_PUBLIC_NASA_INSIGHT_API_URL=https://api.nasa.gov/insight_weather/
```

## Recent Improvements

- Replaced web scraping with NASA API integration
- Extracted inline styles to CSS Modules
- Created reusable components
- Added TypeScript interfaces for type safety
- Implemented client-side caching
- Enhanced data visualization with Recharts
- Added proper error handling and fallbacks