import { type GitHubCommitResponse } from "./types";

const GITHUB_API_URL = process.env.GITHUB_API_URL ?? "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
// const AI_MODEL_API_URL = process.env.AI_MODEL_API_URL;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

async function fetchCommits(since: Date): Promise<GitHubCommitResponse[]> {
  const url = `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits?since=${since.toISOString()}`;
  const response = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
  });
  return response.json() as Promise<GitHubCommitResponse[]>;
}

// async function generateStandupNotes(commits: object[]): Promise<any> {
//   const prompt: string = commits.reduce(
//     (acc, commit) =>
//       acc +
//       `Commit by ${commit.commit.author.name}: ${commit.commit.message}\n`,
//     "Standup notes:\n"
//   );

//   const response = await fetch(AI_MODEL_API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ prompt }),
//   });
//   return response.json();
// }

export async function handler() {
  console.log("Running my cron job");

  const lastRun: Date = new Date();
  lastRun.setDate(lastRun.getDate() - 1);

  const commits = await fetchCommits(lastRun);

  if (commits.length > 0) {
    console.log(commits);
  } else {
    console.log("No new commits found since the last run.");
  }
}
