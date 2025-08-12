# Overview

Vividen Studio is a premium digital asset marketplace built as a modern alternative to platforms like Envato Elements and Adobe Stock. The platform allows users to browse, search, and purchase high-quality digital products including audio, video, UI kits, ebooks, music, sound effects, and PSD templates. The application features a sophisticated React frontend with a Node.js/Express backend, designed for scalability and premium user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on top of Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query for server state management and data fetching
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite with custom configuration for development and production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handlers
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store via connect-pg-simple
- **Development**: Hot module replacement with Vite integration for seamless development experience

## Data Storage
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Connection Pooling**: Neon serverless connection pooling for scalability
- **Shared Schema**: TypeScript schema definitions shared between client and server

## Authentication & Authorization
- **Authentication**: Email/password based authentication with session management
- **User Management**: User registration, login, and profile management
- **Role-based Access**: Admin and regular user roles with appropriate permissions
- **Session Storage**: PostgreSQL-backed session store for persistence

## Key Features
- **Product Catalog**: Comprehensive product management with categories, tags, and metadata
- **Search & Filtering**: Advanced search functionality with category-based filtering
- **Shopping Cart**: Session-based cart management with persistent storage
- **Order Processing**: Complete order workflow from cart to download
- **File Management**: Digital asset storage and download tracking
- **Responsive Design**: Mobile-first responsive design with adaptive components

# External Dependencies

## Database & Backend Services
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management
- **Express.js**: Web application framework with middleware support

## UI & Frontend Libraries
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **TanStack Query**: Server state management and data synchronization
- **Wouter**: Minimalist client-side routing library
- **React Hook Form**: Form handling with validation support

## Development Tools
- **Vite**: Build tool with hot module replacement and optimization
- **TypeScript**: Static typing across the entire application stack
- **PostCSS**: CSS processing with Tailwind CSS integration
- **ESBuild**: Fast JavaScript bundling for production builds

## Payment Processing
- **Stripe**: Payment processing infrastructure with React Stripe.js integration
- **Stripe Elements**: Secure payment form components

## Development & Deployment
- **Replit**: Development environment with specialized Vite plugins
- **Node.js**: Server runtime with ES module support
- **WebSocket**: Real-time communication support via ws library