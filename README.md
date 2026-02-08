# Strik Watch
A real-time cryptocurrency options monitoring application that tracks Bitcoin options data from Binance, providing insights into strike prices, open interest, and market activity.

## Tchnology Stack
This application is built with Next.js due to the need for handling large datasets and frequent updates. Next.js provides several advantages for this use case:
- **Code splitting** for optimized bundle sizes
- **Server-side rendering** for static data
- **Selective component re-rendering** for efficient updates when data changes
- **Mature ecosystem** with a large, active community

## Self-Evaluation
- React: 8/10
- Next.js: 7/10
- TypeScript: 7/10
- Tailwind CSS: 9/10

I have been using React, Next.js, and TypeScript in projects for 2 years, primarily on content-focused websites.

## LLM usage
- Used for understanding the task requirement, as I have no prior experience with Bitcoin and the Binance API.
- Assisted in writing complex functionality implementaion.
- Used for debugging, verifying the requirements fulfillment.

## Getting Started

Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Deployment
The application is deployed on Vercel, however, Binance API requests are blocked by Vercel's servers. For full functionality, please run the application locally.

<img width="1211" height="820" alt="Screenshot 2026-02-08 at 17 08 27" src="https://github.com/user-attachments/assets/80ce724c-2b79-4b2d-bed1-f48780046cca" />
