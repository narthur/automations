import cmd, { type Command } from "../lib/cmd.js";
import { syncS3ToVectorStore } from "../jobs/syncS3ToVectorStore.js";

const jobs = {
  "sync-s3": {
    name: "Sync S3 to Vector Store",
    description: "Sync markdown files from S3 to OpenAI vector store",
    action: syncS3ToVectorStore,
  },
} as const;

type JobId = keyof typeof jobs;

export function isValidJobId(id: string): id is JobId {
  return id in jobs;
}

export function getJobList(): string {
  return Object.entries(jobs)
    .map(([id, job]) => `\`${id}\`: ${job.name} - ${job.description}`)
    .join("\n");
}

async function jobHandler(message: string): Promise<string[]> {
  const jobId = message.replace(/^\/job\s*/, "").trim();

  if (!jobId) {
    return [`Available jobs:\n${getJobList()}`];
  }

  if (!isValidJobId(jobId)) {
    return [
      `Invalid job ID: ${jobId}\n\nAvailable jobs:\n${getJobList()}`,
    ];
  }

  try {
    await jobs[jobId].action();
    return [`Successfully ran job: ${jobs[jobId].name}`];
  } catch (error) {
    console.error(`Failed to run job ${jobId}:`, error);
    return [`Failed to run job ${jobId}: ${error instanceof Error ? error.message : "Unknown error"}`];
  }
}

const jobCommand: Command = {
  match: /^\/job/,
  action: jobHandler
};

export default jobCommand;
