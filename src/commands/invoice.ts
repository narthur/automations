import generateInvoices from "src/lib/generateInvoices.js";

import cmd from "../lib/cmd.js";

export default cmd("invoice", async () => {
  await generateInvoices();
  return "Invoices generated";
});
