import type { Me } from "src/__generated__/graphql";

import { api } from "..";
import type { TogglMe } from "../types";

export default async function me(): Promise<Me> {
  const rawMe = await api<TogglMe>("me");

  return {
    ...rawMe,
    id: rawMe.id.toString(),
    apiToken: rawMe.api_token,
    togglAccountsId: rawMe.toggl_accounts_id,
    defaultWorkspaceId: rawMe.default_workspace_id,
    beginningOfWeek: rawMe.beginning_of_week,
    imageUrl: rawMe.image_url,
    createdAt: rawMe.created_at,
    updatedAt: rawMe.updated_at,
    openidEmail: rawMe.openid_email,
    openidEnabled: rawMe.openid_enabled,
    countryId: rawMe.country_id,
    hasPassword: rawMe.has_password,
    intercomHash: rawMe.intercom_hash,
    oauthProviders: rawMe.oauth_providers,
  };
}
