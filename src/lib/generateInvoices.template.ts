export default (p: {
  hours: number;
  rate: number;
  lines: string[];
  client: string;
  id: string;
  start_date: string;
  end_date: string;
}) => `
  ### Invoice
  
  Key | Value
  --- | ---
  Invoice ID | ${p.id}
  Period | ${p.start_date} - ${p.end_date}
  Client | ${p.client}
  Contractor | Nathan Arthur
  
  ### Line Items
  
  Billable Hours | Description
  --- | ---
  ${p.lines.join("\n")}
  
  ### Summary
  
  Key | Value
  --- | ---
  Total Billable Hours | ${p.hours.toFixed(2)}
  Hourly Rate | ${p.rate ? `$${p.rate.toFixed(2)}/hr` : "n/a"}
  Total Due | $${(p.hours * p.rate).toFixed(2)}
  `;
