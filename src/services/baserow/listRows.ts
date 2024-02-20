import env from "src/lib/env";

export type ListRowsOptions = {
  exclude?: string;
  filterFieldFilter?: string;
  filterType?: string;
  filters?: Record<string, unknown>;
  include?: string;
  orderBy?: string;
  page?: number;
  search?: string;
  searchMode?: string;
  size?: number;
  userFieldNames?: boolean;
  viewId?: number;
  [key: string]: unknown;
};

export async function listRows<T>(
  tableId: number,
  options: ListRowsOptions = {}
) {
  const params = {
    userFieldNames: true,
    ...options,
    filters: JSON.stringify(options.filters),
  };

  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(JSON.stringify(v))}`)
    .join("&");

  const result = await fetch(
    `https://${env(
      "BASEROW_DOMAIN"
    )}/api/database/rows/table/${tableId}/?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${env("BASEROW_DATABASE_TOKEN")}`,
      },
    }
  );

  const data: unknown = await result.json();

  if (
    result.status !== 200 ||
    typeof data !== "object" ||
    data === null ||
    !("results" in data)
  ) {
    console.dir(data, {
      depth: null,
    });
    throw new Error(`Failed to list rows: ${result.status}`);
  }

  return data.results as T[];
}
