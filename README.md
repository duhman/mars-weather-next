# Mars Weather App

This is a simple Mars weather application that displays the current temperature on Mars using NASA's InSight Mars Weather Service API. The app features a fun background video of penguins playing on Mars.

## Features

- Displays the current temperature on Mars in Celsius
- Shows a whimsical message "It's cold." beneath the temperature
- Features a looping video background of penguins having fun on Mars
- Built with Next.js for optimal Vercel deployment compatibility

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This app is designed for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy the app with the correct settings.

The app uses a `vercel.json` configuration file to ensure proper static deployment.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Vercel Documentation](https://vercel.com/docs) - learn about Vercel deployment and features.

## API Key Security

For production deployment, you should move the NASA API key to environment variables:

1. Create a `.env.local` file in the root directory
2. Add your API key: `NASA_API_KEY=your_actual_api_key_here`
3. Update the code to use: `const API_KEY = process.env.NASA_API_KEY;`

You can use the NASA API key from the demo app for testing, but for production you should get your own key from [NASA API Portal](https://api.nasa.gov/).