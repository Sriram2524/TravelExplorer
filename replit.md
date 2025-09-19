# Overview

This is a travel destination discovery web application built as a full-stack TypeScript project. The application allows users to browse travel destinations, view detailed information including weather data and maps, and filter destinations by region, tags, or search queries. It features a modern React frontend with a Node.js/Express backend, using in-memory storage with sample travel destination data.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React + TypeScript**: Single-page application using functional components and hooks
- **Routing**: Wouter for client-side routing with two main routes (home and destination detail pages)
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Express.js**: RESTful API server with TypeScript
- **Storage**: In-memory storage implementation with sample destination data (designed to be easily replaceable with database integration)
- **API Design**: RESTful endpoints for destinations with query parameter support for filtering and search
- **Development**: Hot reload support with Vite integration in development mode

## Data Layer
- **Schema Definition**: Shared TypeScript types between frontend and backend using Drizzle ORM schema definitions
- **Database Ready**: Drizzle configuration present for PostgreSQL (currently using in-memory storage)
- **Type Safety**: Zod schemas for runtime validation and type inference

## Key Features
- **Destination Browsing**: Grid-based destination cards with hero images and quick info
- **Advanced Filtering**: Filter by region, tags, or free-text search
- **Detailed Views**: Modal-based destination details with image galleries, activities, and travel information
- **Weather Integration**: Real-time weather data via OpenWeatherMap API proxy
- **Interactive Maps**: Leaflet integration for location visualization
- **Responsive Design**: Mobile-first design with adaptive layouts

## Code Organization
- **Monorepo Structure**: Client, server, and shared code in separate directories
- **Path Aliases**: TypeScript path mapping for clean imports (@, @shared, @assets)
- **Component Architecture**: Reusable UI components with proper separation of concerns
- **Type Safety**: Full TypeScript coverage with shared types between client and server

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **express**: Node.js web application framework
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL client

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Map and Weather Integration
- **leaflet**: Interactive map library
- **@types/leaflet**: TypeScript definitions for Leaflet
- **OpenWeatherMap API**: Weather data service (proxied through backend)

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **nanoid**: Unique ID generation

The application is structured to easily transition from in-memory storage to a full PostgreSQL database, with all the necessary ORM configurations already in place.