// pnpm dlx tsx ./scripts/github.ts

import "dotenv/config";

import getBmBlogIssues from "src/services/github/getBmBlogIssues";

getBmBlogIssues()
  .then((r) => {
    console.dir(r, { depth: null });
  })
  .catch(console.error);
