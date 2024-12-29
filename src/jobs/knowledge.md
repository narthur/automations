# Jobs Knowledge

## Overview
This directory contains scheduled jobs that run at specific intervals using the `croner` package.

## Jobs

### S3 to Vector Store Sync
Syncs files from Backblaze B2 (using S3 compatibility) to OpenAI vector store.

- **Schedule**: Daily at midnight
- **Purpose**: Keeps OpenAI's vector store in sync with B2 storage
- **Manual Trigger**: Use `/job sync-s3` command in Telegram
- **Process**:
  1. Lists all files in configured B2 bucket
  2. Filters for markdown files only
  3. Processes files in batches of 20 (OpenAI's recommended batch size)
  4. Downloads each batch of files
  5. Updates vector store with each batch
  6. Preserves file names from B2 in vector store
- **Error Handling**:
  - Retries failed uploads up to 3 times with 100ms delay between attempts
  - Skips files larger than 10MB
  - Tracks statistics for successful, skipped, and failed files
- **Performance**:
  - Handles large numbers of files through batching
  - Memory efficient by processing files in chunks
  - Progress logging for monitoring long-running syncs
  - Retries failed uploads up to 3 times
  - Skips files larger than 10MB
- **Monitoring**:
  - Logs sync duration
  - Tracks successful, skipped, and failed files
  - Provides detailed error logging

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
