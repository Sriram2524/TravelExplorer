# Travel Destinations App

## Overview

This is a modern full-stack travel destinations application built with React, Express, and PostgreSQL. The app allows users to explore travel destinations worldwide, view detailed information including weather data and maps, manage favorites, and plan trips. It features a responsive design with smooth animations, real-time weather integration, and interactive maps using Leaflet.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints for destinations, weather, favorites, and trip planning
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: destinations, users, userFavorites, tripPlans, tripPlanDestinations
- **Client Storage**: localStorage for favorites persistence across sessions

### UI/UX Design System
- **Component Library**: Radix UI primitives with custom Shadcn/ui styling
- **Design Tokens**: CSS custom properties for consistent theming
- **Typography**: Inter font family for modern readability
- **Color Scheme**: Neutral base with blue primary, green secondary, and orange accent
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Animations**: CSS transitions and transforms for smooth interactions

### Authentication & Security
- **Session-based Authentication**: Express sessions stored in PostgreSQL
- **Password Security**: Hashed passwords (implementation ready)
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Zod schemas for request validation

### Performance Optimizations
- **Code Splitting**: Vite automatic code splitting for optimal loading
- **Image Optimization**: Lazy loading and responsive images
- **Caching Strategy**: React Query with stale-while-revalidate pattern
- **Database Optimization**: Indexed queries and connection pooling

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Deployment**: Configured for Replit hosting environment
- **Build System**: Vite with esbuild for fast compilation

### Third-party APIs
- **Weather Service**: OpenWeatherMap API for real-time weather data
- **Maps**: Leaflet with OpenStreetMap tiles for interactive location maps
- **Font Loading**: Google Fonts for typography (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)

### UI Libraries
- **Component Framework**: Radix UI for accessible component primitives
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS with PostCSS processing
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Date Utilities**: date-fns for date manipulation

### Development Tools
- **Type Checking**: TypeScript with strict configuration
- **Linting**: ESLint configuration ready
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: Vite dev server with HMR
- **Error Overlay**: Replit-specific error handling plugins

### Optional Integrations
- **Serverless Functions**: Netlify Functions setup for alternative deployment
- **Static Assets**: Support for attached assets and external images
- **Analytics**: Ready for integration with analytics providers