import axios from "axios";

// Source: https://developers.track.toggl.com/docs/api/projects#get-workspaceprojects
export interface TogglProject {
  // Whether the project is active or archived
  active: boolean;
  // Actual hours
  actual_hours?: number;
  // Last updated date
  at: string;
  // Whether estimates are based on task hours, premium feature
  auto_estimates?: boolean;
  // Whether the project is billable, premium feature
  billable?: boolean;
  // Client ID legacy field
  cid: number;
  // Client ID
  client_id?: number;
  // Color
  color: string;
  // Creation date
  created_at: string;
  // Currency, premium feature
  currency?: string;
  // Current project period, premium feature
  current_period: {
    end_date: string;
    start_date: string;
  };
  // End date
  end_date: string;
  // Estimated hours
  estimated_hours?: number;
  // First time entry for this project. Only included if it was requested with with_first_time_entry
  first_time_entry: string;
  // Fixed fee, premium feature
  fixed_fee?: number;
  // Project ID
  id: number;
  // Whether the project is private
  is_private: boolean;
  // Name
  name: string;
  // Hourly rate
  rate: number;
  // Last date for rate change
  rate_last_updated?: string;
  // Whether the project is recurring, premium feature
  recurring: boolean;
  // Project recurring parameters, premium feature
  recurring_parameters?: {
    items: {
      // Custom period, used when "period" field is "custom"
      custom_period: number;
      // Estimated seconds
      estimated_seconds: number;
      // Recurring end date
      parameter_end_date?: string;
      // Recurring start date
      parameter_start_date: string;
      // Period
      period: string;
      // Project start date
      project_start_date: string;
    }[];
  };
  // Deletion date
  server_deleted_at?: string;
  // Start date
  start_date: string;
  // Whether the project is used as template, premium feature
  template?: boolean;
  // Workspace ID legacy field
  wid: number;
  // Workspace ID
  workspace_id: number;
}

export default async function getProjects(): Promise<TogglProject[]> {
  const url = `https://www.toggl.com/api/v9/workspaces/${process.env.TOGGL_WORKSPACE_ID}/projects`;
  const auth = Buffer.from(`${process.env.TOGGL_API_TOKEN}:api_token`).toString(
    "base64"
  );

  const response = await axios
    .get<TogglProject[]>(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params: {
        billable: true,
        active: true,
      },
    })
    .catch((error) => {
      console.error("Error fetching projects");
      console.error("URL:", url);
      console.error(error);
      throw error;
    });

  return response.data;
}
