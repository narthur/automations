# Jobs Knowledge

## Overview
This directory contains scheduled jobs that run at specific intervals using the `croner` package.

## Jobs

### S3 to Vector Store Sync
Syncs files from Backblaze B2 (using S3 compatibility) to OpenAI vector store.

- **Schedule**: Daily at midnight
- **Purpose**: Keeps OpenAI's vector store in sync with B2 storage
- **Process**:
  1. Lists all files in configured B2 bucket
  2. Downloads each file
  3. Replaces entire vector store with new files
  4. Preserves file names from B2 in vector store

Required environment variables:
- `S3_BUCKET_NAME`: B2 bucket name
- `S3_ENDPOINT`: B2 endpoint URL (e.g., s3.us-west-000.backblazeb2.com)
- `S3_ACCESS_KEY_ID`: B2 application key ID
- `S3_SECRET_ACCESS_KEY`: B2 application key
- `S3_REGION`: B2 region (e.g., us-west-000)
- `OPENAI_VECTOR_STORE_NAME`: Name for OpenAI vector store

### Other Jobs
- **Alarms**: Send notifications for various services
- **Goals**: Update goal tracking systems
- **Issues Sync**: Synchronize issues hourly
- **DynaSnooze**: Handle snooze functionality

## Best Practices
- Jobs should handle their own errors
- Use the `options` object with error handling when creating Cron jobs
- Keep job logic focused and modular
- Add logging for monitoring job execution
