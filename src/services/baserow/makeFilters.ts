import type { ListRowsOptions } from "baserow-sdk";

export default function makeFilters(
  filters: Array<Record<string, unknown>>
): ListRowsOptions["filters"] {
  return {
    filter_type: "AND",
    filters,
    groups: [],
  };
}
