# Project Knowledge

## Overview
This is an automation project built with Astro that provides various automation services and commands. The project integrates with multiple external services including OpenAI, Notion, Telegram, and others.

## Key Technologies
- Astro for the server framework
- TypeScript for type safety
- pnpm as the package manager
- OpenAI for AI assistance
- Notion for document management
- Telegram for messaging

## Development Guidelines
- Use Test-Driven Development (TDD)
  - Write tests first
  - Run tests to see them fail
  - Implement the feature
  - Run tests to verify
- Use TypeScript for all new code
- Keep code modular and focused
- Follow existing patterns in the codebase
- Commands use Command pattern
  - Export Command object with match and action
  - Test the action function directly

## External Services
- OpenAI: Used for AI assistance and chat functionality
- Notion: Document management and storage
- Telegram: Bot interface and messaging
- Beeminder: Goal tracking integration
- TaskRatchet: Task management integration

## Common Tasks
- Running tests: `pnpm verify` (runs tests, type checking, and linting)
- Starting dev server: `pnpm dev`
- Building: `pnpm build`

## Project Structure
- `/src/commands/` - Command implementations
- `/src/services/` - External service integrations
- `/src/lib/` - Shared utilities
- `/src/pages/` - Astro pages and API routes
- `/scripts/` - Utility scripts

## Important Notes
- Environment variables must be set up before running the project
- The project uses file-based routing through Astro
- OpenAI integration requires proper setup of vector stores and assistants

## Scheduled Jobs
- Issues sync: Runs hourly to synchronize issues
- S3 to Vector Store sync: Runs daily at midnight to sync files from S3 to OpenAI vector store
  - Requires the following environment variables:
    - S3_BUCKET_NAME: The B2 bucket name
    - S3_ENDPOINT: The B2 endpoint URL (e.g., s3.us-west-000.backblazeb2.com)
    - S3_ACCESS_KEY_ID: B2 application key ID
    - S3_SECRET_ACCESS_KEY: B2 application key
    - S3_REGION: B2 region (e.g., us-west-000)
    - OPENAI_VECTOR_STORE_NAME: Name for the OpenAI vector store
