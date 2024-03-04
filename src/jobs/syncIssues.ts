import { addRow, listRows } from "baserow-sdk";
import { TABLES } from "src/services/baserow/constants";
import makeFilters from "src/services/baserow/makeFilters";
import getBmBlogIssues from "src/services/github/getBmBlogIssues";

export default async function syncIssues() {
  const response = await getBmBlogIssues();
  const issues = response.repository.issues.nodes;

  for (const issue of issues) {
    const matches = await listRows(TABLES.Tasks, {
      filters: makeFilters([
        {
          type: "equal",
          field: "Source",
          value: issue.url,
        },
      ]),
    });

    if (matches.length > 0) {
      continue;
    }

    await addRow(TABLES.Tasks, {
      Source: issue.url,
      Title: issue.title,
      Status: "Pending",
      Project: ["Beeminder Blog"],
      Notes: issue.body,
    });
  }
}
