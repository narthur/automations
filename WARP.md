# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick-Start Commands

### Essential Development Commands
```bash
# Setup (first time)
cp .env.example .env  # Configure environment variables
pnpm install

# Development workflow
pnpm dev              # Start Astro dev server with env vars loaded
pnpm test             # Run Vitest in watch mode
pnpm vitest --run     # Run tests once
pnpm checkTs          # TypeScript type checking
pnpm lint             # ESLint code analysis
pnpm lint:fix         # Auto-fix linting issues
pnpm checkAll         # Run all checks (tests, types, lint)

# Production build
pnpm build            # Build for production (includes Astro check)
pnpm start            # Start production server (requires build first)

# Utility scripts
pnpm dlx tsx ./scripts/github.ts    # Run GitHub integration script
pnpm dlx tsx ./scripts/trello.ts    # Run Trello integration script
```

### Running Single Test Files
```bash
pnpm vitest src/lib/makeDaystamp.spec.ts --run
pnpm vitest src/jobs/alarms/bm.spec.ts --run
```

## Architecture Overview

This is a Node.js automation platform built with **Astro** that runs both scheduled jobs and provides HTTP endpoints. The system integrates with multiple external services to automate goal tracking, notifications, and data synchronization.

### Core Components

1. **Cron-Driven Jobs** (`src/cron.ts`)
   - Scheduled tasks running at different intervals (1 min, 10 min, 30 min)
   - Alarm notifications, goal tracking updates, issue synchronization

2. **HTTP/Telegram Bot Interface** (`src/pages/hooks/telegram.ts`)
   - Webhook endpoints for Telegram bot interactions
   - Command processing with OpenAI fallback for natural language

3. **Service Integrations** (`src/services/`)
   - External API wrappers for Beeminder, Baserow, OpenAI, Telegram, etc.
   - Standardized interfaces with error handling and rate limiting

4. **Automation Jobs** (`src/jobs/`)
   - Goal tracking automations (`goals/`)
   - Alarm/notification systems (`alarms/`)
   - Data synchronization tasks

### Data Flow

```
Cron Schedule → Job Execution → Service APIs → External Systems
     ↓              ↓              ↓              ↓
Telegram Bot → Command Router → OpenAI/Commands → Response
```

- **Incoming**: Cron triggers, Telegram webhooks
- **Processing**: Job execution, command parsing, AI assistance
- **Outgoing**: API calls to Beeminder, Baserow, notifications

## Core Patterns & Conventions

### Alarm Trigger System (`src/jobs/alarms/`)

Creates notification alarms for time-sensitive items:

```typescript
// Example: src/jobs/alarms/bm.ts
export const send = createAlarmTrigger({
  id: "bm",
  getItems: async () => {
    const goals = await getGoals();
    return goals.map((g) => ({
      name: g.slug,
      timestamp: g.losedate,
    }));
  },
});
```

Pattern: Define ID, implement `getItems()` returning `{ name, timestamp }[]`

### Goal Updater Pattern (`src/jobs/goals/`)

Automates goal tracking by syncing data from external sources:

```typescript
// Example: src/jobs/goals/bm.ts
export const update = makeUpdater({
  user: "narthur",
  goal: "bm",
  getSharedData: async () => { /* fetch base data */ },
  getDateUpdate: async (date, sharedData) => ({
    value: calculatedValue
  })
});
```

Pattern: Configure user/goal, implement data fetchers for shared context and daily values

### Service Abstraction (`src/services/`)

Each external service has a dedicated module with:
- Type definitions (`types/`)
- Core API functions
- Error handling and rate limiting
- Environment configuration

### Command System (`src/commands/`)

Telegram bot commands with standardized interface:
- Each command exports a function accepting text input
- Returns string array for response messages
- Registered in command router for `/command` patterns

## Development Workflow

### Prerequisites
- **Node.js**: Version specified in `.nvmrc`
- **pnpm**: v10+ (defined in CI workflows)
- **Environment Variables**: Copy `.env.example` to `.env` and configure

### Local Development Setup
1. `pnpm install` - Install dependencies
2. Configure `.env` with required API keys and tokens
3. `pnpm dev` - Start development server
4. Test automation scripts: `pnpm dlx tsx ./scripts/[name].ts`

### Testing Strategy
- **Unit Tests**: Vitest with `.spec.ts` files
- **Mocks**: Located in `__mocks__/` and `src/lib/__mocks__/`
- **Test Config**: Custom setup in `vitest.config.ts`, `vitest.setup.ts`

### Code Quality
- **ESLint**: Strict TypeScript rules, import sorting
- **File Naming**: Kebab-case with `.spec.ts` for tests
- **Max Lines**: 100 lines per file (200 for tests)
- **Type Safety**: Strict TypeScript, prefer specific types over `any`

### Deployment
- **Platform**: Render.com
- **Trigger**: Automatic on `main` branch push
- **Build**: `pnpm install && pnpm build`
- **Start**: `pnpm start` (runs `run-server.mjs`)
- **GitHub Actions**: CI runs lint and tests on all pushes

## Service Integrations

### Beeminder (`src/services/beeminder/`)
- **Purpose**: Goal tracking and datapoint creation
- **Key APIs**: Goals, datapoints, beemergencies
- **Environment**: `BM_USER`, `BM_TOKEN`
- **Rate Limiting**: Built into service wrapper

### Baserow (`src/services/baserow/`)
- **Purpose**: Time tracking database and rate calculations
- **Key APIs**: List rows, filter entries by date
- **Environment**: Baserow API credentials
- **Tables**: Defined in `constants.ts`

### OpenAI (`src/services/openai/`)
- **Purpose**: AI assistant for Telegram bot natural language processing
- **Key APIs**: Chat completion, file management, vector stores
- **Environment**: `OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID`
- **Features**: Thread management, file uploads, GPT responses

### Telegram Bot (`src/services/telegram/`)
- **Purpose**: Bot interface for commands and notifications
- **Key APIs**: Send messages, webhook handling
- **Environment**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_TOKEN`, `TELEGRAM_ALLOWED_USER`
- **Security**: Validates webhook token and restricts to allowed user

### GitHub (`src/services/github/`)
- **Purpose**: Issue synchronization and blog automation
- **Key APIs**: GraphQL API for issues
- **Environment**: GitHub token for API access

### Trello (`src/services/trello/`)
- **Purpose**: Task management integration
- **Key APIs**: Cards, lists, board management
- **Environment**: Trello API key and token

### Notion (`src/services/notion.ts`)
- **Purpose**: Document and knowledge management
- **Environment**: `NOTION_TOKEN`

### Mailgun (`src/services/mailgun.ts`)
- **Purpose**: Email notifications and automation
- **Environment**: Mailgun API credentials

### TaskRatchet (`src/services/taskratchet/`)
- **Purpose**: Task commitment and accountability
- **Generated Client**: Located in `__generated__/` directory