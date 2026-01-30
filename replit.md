# Patronage Realtor

## Overview

Patronage Realtor is a modern real estate website platform built as a responsive, component-based web application. The platform showcases premium properties, interior design services, and provides various real estate calculators for potential buyers. It features a clean, professional design with a focus on luxury real estate and interior design services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives wrapped with custom styling through shadcn/ui

### Component Structure
The frontend follows a modular component-based architecture:
- `client/src/pages/` - Page-level components (Home, Interiors, AboutUs, Calculators)
- `client/src/components/layout/` - Shared layout components (Header, Footer)
- `client/src/components/home/` - Homepage-specific sections (Hero, PropertySearch, FeaturedProperties)
- `client/src/components/shared/` - Reusable components across pages (Chatbot, PlaceholderImage)
- `client/src/components/ui/` - Base UI components from shadcn/ui

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript compiled with tsx
- **API Pattern**: RESTful API with routes prefixed under `/api`
- **Build System**: Custom build script using esbuild for server bundling and Vite for client

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - Contains shared type definitions used by both client and server
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Storage**: Abstracted through `IStorage` interface in `server/storage.ts`, currently using in-memory implementation

### Development vs Production
- Development: Vite dev server with HMR, proxied through Express
- Production: Static files served from `dist/public`, server bundled to `dist/index.cjs`

## External Dependencies

### Database
- PostgreSQL (configured via `DATABASE_URL` environment variable)
- Drizzle Kit for migrations (`db:push` command)

### UI/Styling
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- shadcn/ui component library (new-york style)
- Lucide React for icons
- Google Fonts (League Spartan, Inter, Space Grotesk)

### Session Management
- connect-pg-simple for PostgreSQL session storage (available but not currently implemented)

### Third-Party Integrations (Dependencies Present)
- Stripe (payment processing)
- OpenAI / Google Generative AI (AI capabilities)
- Nodemailer (email services)
- Passport with passport-local (authentication)

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` for error display
- `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` for development
- Custom `vite-plugin-meta-images` for OpenGraph image handling