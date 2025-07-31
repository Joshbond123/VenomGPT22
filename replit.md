# VenomGPT - Cyberpunk AI Chat Platform

## Overview

VenomGPT is a cyberpunk-themed, uncensored AI chatbot platform powered by Cerebras AI. Features include 3D animated homepage, ChatGPT-like interface with markdown support, smart memory system using sliding window context, unlimited API key rotation, and comprehensive admin panel accessed via secret logo clicks.

## User Preferences

Preferred communication style: Simple, everyday language.
Design Theme: Cyberpunk aesthetic with 3D animations and dark theme.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with dark theme (slate color scheme)
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with memory store
- **Authentication**: BCrypt for password hashing
- **API Integration**: Axios for external service calls (Cerebras AI)

### Data Storage
- **Primary Database**: PostgreSQL (configured with Drizzle ORM)
- **Current Storage**: File-based JSON storage in `/storage` directory
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Store**: In-memory storage (MemoryStore)

## Key Components

### Authentication System
- User registration and login with email/password
- Session-based authentication with HTTP-only cookies
- Admin role management with protected routes
- BCrypt password encryption

### Chat System
- Real-time chat interface with message history
- Support for both authenticated and anonymous users
- Message persistence and chat organization
- Mobile-responsive chat interface with collapsible sidebar

### AI Integration
- Cerebras AI service integration for responses
- API key rotation system for load balancing
- Usage tracking and rate limiting capabilities
- Summarization features for chat management

### Admin Dashboard
- API key management (summary and response keys)
- System settings configuration
- User management and statistics
- Usage analytics and monitoring

### UI Components
- Comprehensive component library using Shadcn/ui
- Dark theme with custom VenomGPT branding
- Mobile-first responsive design
- Accessible components with proper ARIA support

## Data Flow

1. **User Authentication**: Users register/login → Session created → JWT-less session management
2. **Chat Creation**: User starts chat → Chat entity created → Message exchange begins
3. **Message Processing**: User message → Stored in database → Sent to Cerebras AI → AI response stored
4. **Real-time Updates**: Frontend polls for updates → React Query manages cache invalidation
5. **Admin Operations**: Admin actions → Protected API endpoints → Database/file system updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL database driver
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **bcryptjs**: Password hashing
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **express-session**: Session management
- **axios**: HTTP client for AI service integration

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

### AI Service Integration
- **Cerebras AI**: Primary AI model provider
- **API Key Management**: Rotation system for multiple keys
- **Usage Tracking**: Request counting and analytics

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- File-based storage for rapid prototyping
- Memory-based sessions for development
- Replit-specific optimizations and plugins

### Production Deployment
- **Build Process**: Vite builds frontend to `dist/public`, ESBuild bundles backend
- **Database**: PostgreSQL with Drizzle migrations
- **Sessions**: Can be upgraded to PostgreSQL-based sessions
- **Static Assets**: Served by Express in production
- **Environment Variables**: Database URL, session secrets, API keys

### Migration Path
The application is designed to easily migrate from file-based storage to PostgreSQL:
1. Database schema is already defined in `shared/schema.ts`
2. Drizzle configuration is ready for PostgreSQL
3. Storage interface allows seamless backend switching
4. Migration scripts can be generated with `drizzle-kit`

### Security Considerations
- Environment-based configuration
- Session secret management
- API key protection
- Input validation with Zod schemas
- CORS and security headers
- Password hashing with BCrypt

The architecture supports both development flexibility and production scalability, with clear separation of concerns and type safety throughout the stack.