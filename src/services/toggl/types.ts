// https://developers.track.toggl.com/docs/api/projects#get-workspaceprojects
export type TogglProject = {
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
};

// https://developers.track.toggl.com/docs/api/tasks
export type TogglTask = {
  // False when the task has been done
  active: boolean;
  // When the task was created/last modified
  at: string;
  // Estimation time for this task in seconds
  estimated_seconds: number;
  // Task ID
  id: number;
  // Task Name
  name: string;
  // Project ID
  project_id: number;
  // Whether this is a recurring task
  recurring: boolean;
  // When the task was deleted
  server_deleted_at?: string;
  // The value tracked_seconds is in milliseconds, not in seconds.
  tracked_seconds: number;
  // Task assignee, if available
  user_id?: number;
  // Workspace ID
  workspace_id: number;
};

export type TogglProjectBillable = TogglProject & {
  billable: true;
  active: true;
};

export type TogglProjectFixedFee = TogglProjectBillable & {
  fixed_fee: number;
  estimated_hours: number;
};

export type TogglProjectHourly = TogglProjectBillable & {
  fixed_fee: null;
};

// https://developers.track.toggl.com/docs/api/clients#get-load-client-from-id
export type TogglClient = {
  // IsArchived is true if the client is archived
  archived: boolean;
  // When was the last update
  at: string;
  // Client ID
  id: number;
  // Name of the client
  name: string;
  // When was deleted, null if not deleted
  server_deleted_at?: string;
  // Workspace ID
  wid: number;
};

export type TogglMe = {
  id: number;
  api_token: string;
  email: string;
  fullname: string;
  timezone: string;
  toggl_accounts_id: string;
  default_workspace_id: number;
  beginning_of_week: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  openid_email: null;
  openid_enabled: boolean;
  country_id: number;
  has_password: boolean;
  at: string;
  intercom_hash: string;
  oauth_providers: string[];
};

export type TogglProjectSummaries = Array<{
  user_id: number;
  project_id: number;
  tracked_seconds: number;
  billable_seconds: number;
}>;

export type TogglProjectSummary = {
  seconds: number;
  billable_amount_in_cents: number;
  rates: Array<{
    billable_seconds: number;
    hourly_rate_in_cents: number;
    currency: string;
  }>;
  graph: Array<{
    seconds: number;
    billable_amount_in_cents?: number;
    by_rate: Record<string, number>;
  }>;
  resolution: string;
};

export type TogglTimeSummaryEntry = {
  id: number | null;
  title: string | null;
  seconds: number;
  rates: Array<{
    billable_seconds: number;
    hourly_rate_in_cents: number;
    currency: string;
  }>;
};

export type TogglTimeSummaryGroup = {
  id: number;
  sub_groups: Array<TogglTimeSummaryEntry>;
};

export type TogglTimeSummary = {
  groups: Array<TogglTimeSummaryGroup>;
};
