import baserow from "src/services/baserow";
import { TABLES } from "src/services/baserow/constants";
import makeFilters from "src/services/baserow/makeFilters";
import getBmBlogIssues from "src/services/github/getBmBlogIssues";

export default async function syncIssues() {
  const response = await getBmBlogIssues();
  const issues = response.repository.issues.nodes;

  for (const issue of issues) {
    const { results } = await baserow.listRows(TABLES.Tasks, {
      size: 1,
      filters: makeFilters([
        {
          type: "equal",
          field: "Source",
          value: issue.url,
        },
      ]),
    });

    if (results.length > 0) {
      continue;
    }

    await baserow.addRow(TABLES.Tasks, {
      Source: issue.url,
      Name: issue.title,
      Status: "Pending",
      Project: ["Beeminder Blog"],
      Notes: issue.body,
    });
  }
}
