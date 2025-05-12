# Form Builder Backend

A NestJS-based backend service for managing dynamic form creation and submissions.

## Description

This project is built using the [NestJS](https://github.com/nestjs/nest) framework and provides a robust backend service for form management. It uses Prisma as the ORM for database operations and is designed to be scalable and maintainable.

## Prerequisites

- Node.js (v20 or higher)
- pnpm (v8 or higher)
- PostgreSQL (for database)

## Project Setup

1. Install dependencies:
```bash
$ pnpm install
```

2. Set up your environment variables:
```bash
# Create a .env file in the root directory
DATABASE_URL="postgresql://user:password@localhost:5432/form_builder?schema=public"
```

3. Initialize the database:
```bash
$ npx prisma generate
$ npx prisma db push
```

## Development

```bash
# Start development server
$ pnpm run start:dev

# Build the project
$ pnpm run build

# Start production server
$ pnpm run start:prod
```

## Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root application module
├── prisma/             # Database schema and migrations
└── modules/            # Feature modules
```

## Deployment

This project is configured for deployment on Vercel. The deployment process is automated through the `vercel-build` script.
