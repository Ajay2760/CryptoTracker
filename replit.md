# Cryptocurrency Dashboard - System Architecture

## Overview

This is a modern cryptocurrency dashboard application built with React and TypeScript. The application provides real-time cryptocurrency market data through the CoinGecko API, allowing users to browse markets, view detailed coin information with charts, and maintain a personal watchlist. The system follows a client-server architecture with a proxy backend to handle API requests and avoid CORS issues.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Charts**: Recharts for cryptocurrency price visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Proxy**: Express routes that proxy requests to CoinGecko API
- **Development**: Hot reload with Vite middleware integration

### Database Strategy
- **Primary Storage**: LocalStorage for watchlist persistence (client-side)
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect configured but not actively used
- **Future-Ready**: Database infrastructure prepared for potential server-side data storage

## Key Components

### Core Features
1. **Markets Dashboard**: Paginated cryptocurrency listings with sorting and filtering
2. **Coin Details**: Individual cryptocurrency pages with detailed information and price charts
3. **Watchlist Management**: Personal favorite coins stored in browser localStorage
4. **Search & Filtering**: Real-time search with debouncing and market cap/change filters

### UI Component System
- **Design System**: Based on shadcn/ui with consistent styling patterns
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Loading States**: Skeleton components for improved user experience
- **Error Handling**: Graceful error states and fallbacks

### Data Management
- **API Caching**: React Query with 2-minute stale time for market data
- **Optimistic Updates**: Immediate UI feedback for watchlist operations
- **Debounced Search**: 300ms delay to prevent excessive API calls

## Data Flow

### Client-Side Flow
1. **Page Load**: React Router determines current route
2. **Data Fetching**: React Query triggers API calls through proxy endpoints
3. **State Updates**: Query cache updates trigger component re-renders
4. **User Interactions**: Watchlist changes update localStorage and refresh relevant queries

### Server-Side Flow
1. **Request Proxy**: Express routes forward requests to CoinGecko API
2. **API Authentication**: Optional API key injection for rate limit improvements
3. **Response Handling**: Error handling and data transformation before client response
4. **CORS Resolution**: Server acts as proxy to avoid browser CORS restrictions

## External Dependencies

### Primary APIs
- **CoinGecko API**: Cryptocurrency market data and pricing information
- **Rate Limiting**: Free tier with optional API key for increased limits

### Development Tools
- **Replit Integration**: Custom vite plugins for Replit environment
- **TypeScript**: Full type safety across client and server
- **ESLint/Prettier**: Code quality and formatting (configured via package.json)

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants
- **Date-fns**: Date manipulation and formatting

## Deployment Strategy

### Build Process
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Asset Handling**: Static assets served from built client directory

### Environment Configuration
- **Development**: Vite dev server with Express middleware
- **Production**: Standalone Express server serving static files
- **Environment Variables**: CoinGecko API key and database URL support

### Scalability Considerations
- **Database Ready**: Drizzle ORM configured for future PostgreSQL integration
- **Caching Strategy**: React Query provides client-side caching with configurable TTL
- **API Optimization**: Proxy pattern allows for future API aggregation and caching
- **Component Architecture**: Modular design supports feature expansion

The system is designed for rapid development and easy deployment while maintaining the flexibility to scale with additional features like user authentication, server-side data persistence, and advanced analytics.