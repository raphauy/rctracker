# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RC Tracker is a project management and time tracking application built with Next.js 14, Prisma, PostgreSQL, and NextAuth. It manages clients, projects, deliverables, tasks, and development hours tracking.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with email provider
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: Jotai

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server (port 8050)
npm run start

# Linting
npm run lint

# Database operations
npm run seed              # Seed the database
prisma migrate dev       # Run migrations in development
prisma generate          # Generate Prisma client

# Code generation utilities
npm run generator         # Interactive model generator
npm run generate-services # Generate service files
npm run generate-form    # Generate form components
```

## Architecture

### Database Schema

The application uses a hierarchical data model:
- **Client** → has many **Projects**
- **Project** → has many **Deliverables**
- **Deliverable** → has many **Tasks**
- **Task** → has many **Developments** (time entries)

Users can be assigned to clients and have roles (user/admin).

### Application Structure

- **Authentication**: Email-based authentication with role-based access (admin/user)
- **Admin Panel** (`/admin/*`): CRUD operations for all entities
- **Client Portal** (`/[slug]/*`): Client-specific views for projects and billing
- **API Routes**: NextAuth handler at `/api/auth/[...nextauth]`

### Key Patterns

1. **Service Layer** (`/src/services/*`): Database operations using Prisma
2. **Server Actions**: Form submissions and data mutations in `*-actions.ts` files
3. **Data Tables**: Reusable table components with filtering, sorting, and pagination
4. **Form Components**: Consistent form patterns using React Hook Form and Zod schemas
5. **Code Generation**: Custom generator scripts to scaffold CRUD operations for new models

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `EMAIL_SERVER`: SMTP server for authentication emails
- `EMAIL_PORT`: SMTP port
- `EMAIL_USER`: SMTP username
- `EMAIL_PASSWORD`: SMTP password
- `EMAIL_FROM`: Sender email address
- `NEXTAUTH_SECRET`: NextAuth secret key
- `NEXTAUTH_URL`: Application URL

### Path Aliases

- `@/*` maps to `./src/*`

## Generator System

The project includes a code generator (`npm run generator`) that scaffolds complete CRUD functionality for Prisma models, creating:
- Service files with database operations
- Server actions for mutations
- Form components with validation
- Dialog components for create/edit/delete
- Data table with columns configuration
- Admin page with full CRUD UI

Generator annotations in `schema.prisma`:
- `// gennext: skip.zod` - Skip field in Zod schema
- `// gennext: show.column` - Show field in table columns
- `// gennext: skip.list` - Skip field in list views