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
- Use TypeScript for all new code
- Add tests for new functionality
- Keep code modular and focused
- Follow existing patterns in the codebase

## External Services
- OpenAI: Used for AI assistance and chat functionality
- Notion: Document management and storage
- Telegram: Bot interface and messaging
- Beeminder: Goal tracking integration
- TaskRatchet: Task management integration

## Common Tasks
- Running tests: `pnpm test`
- Starting dev server: `pnpm dev`
- Building: `pnpm build`
- Checking types: `pnpm checkTs`
- Linting: `pnpm lint`

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
