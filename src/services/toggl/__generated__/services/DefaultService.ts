/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1me_1clients_get_responses_200_content_application_1json_schema_items } from '../models/paths_1me_1clients_get_responses_200_content_application_1json_schema_items';
import type { paths_1me_1preferences_post_requestBody_content_application_1json_schema } from '../models/paths_1me_1preferences_post_requestBody_content_application_1json_schema';
import type { paths_1me_1projects_get_responses_200_content_application_1json_schema_items } from '../models/paths_1me_1projects_get_responses_200_content_application_1json_schema_items';
import type { paths_1me_1tags_get_responses_200_content_application_1json_schema_items } from '../models/paths_1me_1tags_get_responses_200_content_application_1json_schema_items';
import type { paths_1me_1tasks_get_responses_200_content_application_1json_schema_items } from '../models/paths_1me_1tasks_get_responses_200_content_application_1json_schema_items';
import type { paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema } from '../models/paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema';
import type { paths_1me_1workspaces_get_responses_200_content_application_1json_schema_items } from '../models/paths_1me_1workspaces_get_responses_200_content_application_1json_schema_items';
import type { paths_1organizations_1_organization_id_get_responses_200_content_application_1json } from '../models/paths_1organizations_1_organization_id_get_responses_200_content_application_1json';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Returns details for the current user.
     * @param withRelatedData Retrieve user related data (clients, projects, tasks, tags, workspaces, time entries, etc.)
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMe(
        withRelatedData?: boolean,
    ): CancelablePromise<{
        /**
         * User's API token. Will be omitted if empty
         */
        api_token?: string;
        at?: string;
        beginning_of_week?: number;
        /**
         * Clients, null if with_related_data was not set to true or if the user does not have any clients
         */
        clients?: Array<paths_1me_1clients_get_responses_200_content_application_1json_schema_items>;
        country_id?: number;
        created_at?: string;
        default_workspace_id?: number;
        email?: string;
        fullname?: string;
        has_password?: boolean;
        id?: number;
        image_url?: string;
        /**
         * will be omitted if empty
         */
        intercom_hash?: string;
        oauth_providers?: Array<string>;
        openid_email?: string;
        openid_enabled?: boolean;
        /**
         * will be omitted if empty
         */
        options?: {
            additionalProperties?: any;
        };
        /**
         * Projects, null if with_related_data was not set to true or if the user does not have any projects
         */
        projects?: Array<paths_1me_1projects_get_responses_200_content_application_1json_schema_items>;
        /**
         * Tags, null if with_related_data was not set to true or if the user does not have any tags
         */
        tags?: Array<paths_1me_1tags_get_responses_200_content_application_1json_schema_items>;
        /**
         * Tasks, null if with_related_data was not set to true or if the user does not have any tasks
         */
        tasks?: Array<paths_1me_1tasks_get_responses_200_content_application_1json_schema_items>;
        /**
         * Time entries, null if with_related_data was not set to true or if the user does not have any time entries
         */
        time_entries?: Array<paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema>;
        timezone?: string;
        updated_at?: string;
        /**
         * Workspaces, null if with_related_data was not set to true or if the user does not have any workspaces
         */
        workspaces?: Array<paths_1me_1workspaces_get_responses_200_content_application_1json_schema_items>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me',
            query: {
                'with_related_data': withRelatedData,
            },
            errors: {
                403: `User does not have access to this resource.`,
                404: `could not load user data`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Updates details for the current user.
     * @param requestBody
     * @returns any Successful response
     * @throws ApiError
     */
    public static putMe(
        requestBody?: {
            /**
             * User's first day of the week. Sunday: 0, Monday:1, etc.
             */
            beginning_of_week?: number;
            /**
             * User's country ID
             */
            country_id?: number;
            /**
             * User's current password (used to change the current password)
             */
            current_password?: string;
            /**
             * User's default workspace ID
             */
            default_workspace_id?: number;
            /**
             * User's email address
             */
            email?: string;
            /**
             * User's full name
             */
            fullname?: string;
            /**
             * User's new password (current one must also be provided)
             */
            password?: string;
            /**
             * User's timezone
             */
            timezone?: string;
        },
    ): CancelablePromise<{
        /**
         * will be omitted if empty
         */
        api_token?: string;
        at?: string;
        beginning_of_week?: number;
        country_id?: number;
        created_at?: string;
        default_workspace_id?: number;
        email?: string;
        fullname?: string;
        has_password?: boolean;
        id?: number;
        image_url?: string;
        openid_email?: string;
        openid_enabled?: boolean;
        /**
         * will be omitted if empty
         */
        options?: {
            additionalProperties?: any;
        };
        timezone?: string;
        updated_at?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Current password is not valid
                 * Current password must be present to change password
                 * Invalid beginning_of_week
                 * Invalid country_id
                 * Invalid default_workspace_id
                 * Invalid email
                 * Invalid fullname
                 * Invalid timezone
                 * Password should be at least 6 characters
                 * user with this email already exists
                `,
                403: `User does not have access to this resource.`,
            },
        });
    }

    /**
     * Returns a list of clients for the current user.
     * @param since Retrieve clients created/modified/deleted since this date using UNIX timestamp.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeClients(
        since?: number,
    ): CancelablePromise<Array<{
        /**
         * IsArchived is true if the client is archived
         */
        archived?: boolean;
        /**
         * When was the last update
         */
        at?: string;
        /**
         * Client ID
         */
        id?: number;
        /**
         * Client name
         */
        name?: string;
        /**
         * When was the client deleted from server; null if not deleted
         */
        server_deleted_at?: string;
        /**
         * Workspace ID
         */
        wid?: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/clients',
            query: {
                'since': since,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns a list of features for the current user.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeFeatures(): CancelablePromise<Array<{
        features?: Array<{
            enabled?: boolean;
            feature_id?: number;
            name?: string;
        }>;
        workspace_id?: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/features',
            errors: {
                403: `Operation Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns the client's IP-based location. If no data is present, empty response will be yielded.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeLocation(): CancelablePromise<{
        city?: string;
        city_lat_long?: string;
        country_code?: string;
        country_name?: string;
        state?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/location',
            errors: {
                404: `Country with given ISO code not found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Used to check if authentication works.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeLogged(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/logged',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns a list of organizations for the current user.
     * @returns paths_1organizations_1_organization_id_get_responses_200_content_application_1json Successful response
     * @throws ApiError
     */
    public static getMeOrganizations(): CancelablePromise<Array<paths_1organizations_1_organization_id_get_responses_200_content_application_1json>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/organizations',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns a list of projects for the current user.
     * @param includeArchived Whether to include archived projects
     * @param since Retrieve projects modified since this date using UNIX timestamp, including deleted ones.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeProjects(
        includeArchived?: string,
        since?: number,
    ): CancelablePromise<Array<{
        /**
         * Whether the project is active or archived
         */
        active?: boolean;
        actual_hours?: number | null;
        actual_seconds?: number | null;
        /**
         * Last updated date
         */
        at?: string;
        /**
         * Whether estimates are based on task hours, premium feature
         */
        auto_estimates?: boolean | null;
        /**
         * Whether the project is billable, premium feature
         */
        billable?: boolean | null;
        /**
         * Client ID legacy field
         */
        cid?: number;
        client_id?: number | null;
        color?: string;
        created_at?: string;
        /**
         * Currency, premium feature
         */
        currency?: string | null;
        /**
         * Current project period, premium feature (models.RecurringPeriod)
         */
        current_period?: {
            end_date?: string;
            start_date?: string;
        };
        end_date?: string;
        estimated_hours?: number | null;
        estimated_seconds?: number | null;
        /**
         * First time entry for this project. Only included if it was requested with with_first_time_entry
         */
        first_time_entry?: string;
        /**
         * Fixed fee, premium feature
         */
        fixed_fee?: number;
        /**
         * Project ID
         */
        id?: number;
        /**
         * Whether the project is private
         */
        is_private?: boolean;
        /**
         * Project name
         */
        name?: string;
        /**
         * Hourly rate
         */
        rate?: number;
        /**
         * Last date for rate change
         */
        rate_last_updated?: string | null;
        /**
         * Whether the project is recurring, premium feature
         */
        recurring?: boolean;
        /**
         * Project recurring parameters, premium feature. Array of models.RecurringProjectParameters
         */
        recurring_parameters?: Array<{
            /**
             * Custom period, used when "period" field is "custom"
             */
            custom_period?: number | null;
            /**
             * Estimated seconds
             */
            estimated_seconds?: number | null;
            /**
             * Recurring end date
             */
            parameter_end_date?: string | null;
            /**
             * Recurring start date
             */
            parameter_start_date?: string;
            /**
             * Period
             */
            period?: string;
            /**
             * Project start date
             */
            project_start_date?: string;
        }>;
        /**
         * Deletion date
         */
        server_deleted_at?: string | null;
        start_date?: string;
        /**
         * Whether the project is used as template, premium feature
         */
        template?: boolean | null;
        wid?: number;
        workspace_id?: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/projects',
            query: {
                'include_archived': includeArchived,
                'since': since,
            },
            errors: {
                400: `Invalid include_archived value`,
                403: `Operation Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns a paginated list of projects for the current user.
     * @param startProjectId ID of the project to start from
     * @param since Retrieve projects modified since this date using UNIX timestamp, including deleted ones.
     * @param perPage Number of projects to return per page, default 201.
     * @returns paths_1me_1projects_get_responses_200_content_application_1json_schema_items Successful response
     * @throws ApiError
     */
    public static getMeProjectsPaginated(
        startProjectId?: number,
        since?: number,
        perPage?: number,
    ): CancelablePromise<Array<paths_1me_1projects_get_responses_200_content_application_1json_schema_items>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/projects/paginated',
            query: {
                'start_project_id': startProjectId,
                'since': since,
                'per_page': perPage,
            },
            errors: {
                403: `Operation Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns a list of tags for the current user.
     * @param since Retrieve tags modified/deleted since this date using UNIX timestamp.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeTags(
        since?: number,
    ): CancelablePromise<Array<{
        /**
         * When was created/last modified
         */
        at?: string;
        /**
         * When was deleted
         */
        deleted_at?: string;
        /**
         * Tag ID
         */
        id?: number;
        /**
         * Tag name
         */
        name?: string;
        /**
         * Workspace ID
         */
        workspace_id?: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/tags',
            query: {
                'since': since,
            },
            errors: {
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns tasks from projects in which the user is participating.
     * @param since Retrieve tasks created/modified/deleted since this date using UNIX timestamp.
     * @param includeNotActive Include tasks marked as done.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeTasks(
        since?: number,
        includeNotActive?: boolean,
    ): CancelablePromise<Array<{
        /**
         * False when the task has been done
         */
        active?: boolean;
        /**
         * When the task was created/last modified
         */
        at?: string;
        /**
         * Estimation time for this task in seconds
         */
        estimated_seconds?: number | null;
        /**
         * Task ID
         */
        id?: number;
        /**
         * Task name
         */
        name?: string;
        /**
         * Project ID
         */
        project_id?: number;
        /**
         * Whether the task is recurring
         */
        recurring?: boolean;
        /**
         * When the task was deleted
         */
        server_deleted_at?: string | null;
        /**
         * The value tracked_seconds is in milliseconds, not in seconds.
         */
        tracked_seconds?: number;
        /**
         * Task assignee, if available
         */
        user_id?: number | null;
        /**
         * Workspace ID
         */
        workspace_id?: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/tasks',
            query: {
                'since': since,
                'include_not_active': includeNotActive,
            },
            errors: {
                400: `Invalid include_not_active value`,
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns a list of track reminders for the current user.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeTrackReminders(): CancelablePromise<Array<{
        /**
         * Reminder creation time
         */
        created_at?: string;
        /**
         * Frequency of the reminder in days, should be either 1 or 7
         */
        frequency?: number;
        /**
         * Groups IDs to send the reminder to
         */
        group_ids?: Array<number>;
        /**
         * Reminder ID
         */
        reminder_id?: number;
        /**
         * Threshold is the number of hours after which the reminder will be sent
         */
        threshold?: number;
        /**
         * User IDs to send the reminder to
         */
        user_ids?: Array<number>;
        /**
         * Workspace ID
         */
        workspace_id?: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/track_reminders',
            errors: {
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get web timer.
     * @returns any Successful operation
     * @throws ApiError
     */
    public static getMeWebTimer(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/web-timer',
            errors: {
                403: `Operation Forbidden`,
                404: `Resource can not be found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns a list of workspaces for the current user.
     * @param since Retrieve workspaces created/modified/deleted since this date using UNIX timestamp, including the dates a workspace member got added, removed or updated in the workspace.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getMeWorkspaces(
        since?: number,
    ): CancelablePromise<Array<{
        admin?: boolean;
        api_token?: string;
        at?: string;
        business_ws?: boolean;
        /**
         * models.CsvUpload
         */
        csv_upload?: {
            at?: string;
            log_id?: number;
        };
        default_hourly_rate?: number;
        default_currency?: string;
        ical_enabled?: boolean;
        ical_url?: string;
        id?: number;
        logo_url?: string;
        /**
         * How far back free workspaces can access data.
         */
        max_data_retention_days?: number;
        name?: string;
        only_admins_may_create_projects?: boolean;
        only_admins_may_create_tags?: boolean;
        only_admins_see_billable_rates?: boolean;
        only_admins_see_team_dashboard?: boolean;
        organization_id?: number;
        premium?: boolean;
        profile?: number;
        projects_billable_by_default?: boolean;
        rate_last_updated?: string;
        reports_collapse?: boolean;
        role?: string;
        rounding?: number;
        rounding_minutes?: number;
        server_deleted_at?: string;
        /**
         * models.Subscription
         */
        subscription?: {
            auto_renew?: boolean;
            /**
             * models.CardDetails
             */
            card_details?: any;
            company_id?: number;
            /**
             * models.ContactDetail
             */
            contact_detail?: any;
            created_at?: string;
            currency?: string;
            customer_id?: number;
            deleted_at?: string;
            last_pricing_plan_id?: number;
            organization_id?: number;
            /**
             * models.PaymentDetail
             */
            payment_details?: any;
            pricing_plan_id?: number;
            renewal_at?: string;
            subscription_id?: number;
            /**
             * models.Period
             */
            subscription_period?: any;
            workspace_id?: number;
        };
        suspended_at?: string;
        te_constraints?: {
            description_present?: boolean;
            project_present?: boolean;
            tag_present?: boolean;
            task_present?: boolean;
            time_entry_constraints_enabled?: boolean;
        };
        working_hours_in_minutes?: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/workspaces',
            query: {
                'since': since,
            },
            errors: {
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns user preferences and alpha features. The list of alpha features contains a full list of feature codes (every feature that exists in database) and the enabled flag specifying if that feature should be enabled or disabled for the user.
     * @returns paths_1me_1preferences_post_requestBody_content_application_1json_schema Successful response
     * @throws ApiError
     */
    public static getMePreferences(): CancelablePromise<paths_1me_1preferences_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/preferences',
            errors: {
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * With this endpoint, preferences can be modified and alpha features can be enabled or disabled.
     * @param requestBody
     * @returns any Successful operation
     * @throws ApiError
     */
    public static postMePreferences(
        requestBody?: {
            /**
             * will be omitted if empty
             */
            alpha_features?: Array<{
                /**
                 * Feature ID
                 */
                alpha_feature_id?: number;
                /**
                 * Feature code
                 */
                code?: string;
                /**
                 * Time of deletion, omitted if empty
                 */
                deleted_at?: string | null;
                /**
                 * Feature description, omitted if empty
                 */
                description?: string | null;
                /**
                 * Whether the feature is enabled
                 */
                enabled?: boolean;
            }>;
            calendar_visible_hours_end?: number;
            calendar_visible_hours_start?: number;
            /**
             * will be omitted if empty
             */
            collapseDetailedReportEntries?: boolean;
            /**
             * will be omitted if empty
             */
            collapseTimeEntries?: boolean;
            date_format?: string;
            /**
             * will be omitted if empty
             */
            decimal_separator?: string | null;
            /**
             * will be omitted if empty
             */
            displayDensity?: string | null;
            /**
             * will be omitted if empty
             */
            distinctRates?: string | null;
            duration_format?: string;
            duration_format_on_timer_duration_field?: boolean;
            /**
             * will be omitted if empty
             */
            firstSeenBusinessPromo?: number | null;
            /**
             * will be omitted if empty
             */
            hide_keyboard_shortcut?: boolean;
            keyboard_increment_timer_page?: number;
            /**
             * will be omitted if empty
             */
            keyboard_shortcuts_enabled?: boolean;
            /**
             * will be omitted if empty
             */
            manualEntryMode?: string | null;
            /**
             * will be omitted if empty
             */
            manualMode?: boolean;
            /**
             * will be omitted if empty
             */
            manualModeOverlaySeen?: boolean;
            /**
             * will be omitted if empty
             */
            offlineMode?: string | null;
            pg_time_zone_name?: string;
            /**
             * will be omitted if empty
             */
            projectDashboardActivityMode?: string | null;
            record_timeline?: boolean;
            /**
             * will be omitted if empty
             */
            reportRounding?: boolean;
            /**
             * will be omitted if empty
             */
            reportRoundingDirection?: string | null;
            /**
             * will be omitted if empty
             */
            reportRoundingStepInMinutes?: number | null;
            /**
             * will be omitted if empty
             */
            reportsHideWeekends?: boolean;
            /**
             * will be omitted if empty
             */
            seenFollowModal?: boolean;
            /**
             * will be omitted if empty
             */
            seenFooterPopup?: boolean;
            /**
             * will be omitted if empty
             */
            seenProjectDashboardOverlay?: boolean;
            /**
             * will be omitted if empty
             */
            seenTogglButtonModal?: boolean;
            send_product_emails?: boolean;
            send_timer_notifications?: boolean;
            send_weekly_report?: boolean;
            /**
             * will be omitted if empty
             */
            showTimeInTitle?: boolean;
            /**
             * will be omitted if empty
             */
            show_timeline_in_day_view?: boolean;
            /**
             * will be omitted if empty
             */
            show_total_billable_hours?: boolean;
            /**
             * will be omitted if empty
             */
            show_weekend_on_timer_page?: boolean;
            /**
             * will be omitted if empty
             */
            snowballReportRounding?: string | null;
            /**
             * will be omitted if empty
             */
            stack_times_on_manual_mode_after?: string | null;
            /**
             * will be omitted if empty
             */
            summaryReportAmounts?: string | null;
            /**
             * will be omitted if empty
             */
            summaryReportDistinctRates?: boolean;
            /**
             * will be omitted if empty
             */
            summaryReportGrouping?: string | null;
            /**
             * will be omitted if empty
             */
            summaryReportSortAsc?: boolean;
            /**
             * will be omitted if empty
             */
            summaryReportSortField?: string | null;
            /**
             * will be omitted if empty
             */
            summaryReportSubGrouping?: string | null;
            /**
             * will be omitted if empty
             */
            theme?: string | null;
            timeofday_format?: string;
            /**
             * will be omitted if empty
             */
            timerView?: string | null;
            /**
             * will be omitted if empty
             */
            timerViewMobile?: string | null;
            toSAcceptNeeded?: boolean;
            /**
             * will be omitted if empty
             */
            visibleFooter?: string | null;
            /**
             * will be omitted if empty
             */
            webTimeEntryStarted?: boolean;
            /**
             * will be omitted if empty
             */
            webTimeEntryStopped?: boolean;
            /**
             * will be omitted if empty
             */
            weeklyReportGrouping?: string | null;
            /**
             * will be omitted if empty
             */
            weeklyReportValueToShow?: string | null;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Cannot set value for ToSAcceptNeeded
                 * Invalid feature code(s)
                 * Missing data
                 * Value in date_format is invalid
                 * Value in timeofday_format is invalid
                `,
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns user preferences and alpha features. The list of alpha features contains a full list of feature codes (every feature that exists in database) and the enabled flag specifying if that feature should be enabled or disabled for the user.
     * @param client Client type
     * @returns paths_1me_1preferences_post_requestBody_content_application_1json_schema Successful response
     * @throws ApiError
     */
    public static getMePreferences1(
        client: string,
    ): CancelablePromise<paths_1me_1preferences_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/preferences/{client}',
            path: {
                'client': client,
            },
            errors: {
                400: `Invalid client value`,
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * With this endpoint, preferences can be modified and alpha features can be enabled or disabled.
     * @param client Client type
     * @param requestBody
     * @returns any Successful operation
     * @throws ApiError
     */
    public static postMePreferences1(
        client: string,
        requestBody?: paths_1me_1preferences_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/preferences/{client}',
            path: {
                'client': client,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Cannot set value for ToSAcceptNeeded
                 * Invalid feature code(s)
                 * Missing data
                 * Unknown client
                 * Value in date_format is invalid
                 * Value in timeofday_format is invalid
                `,
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get the preferences for a given workspace.
     * @param workspaceId Workspace ID
     * @returns any Successful response
     * @throws ApiError
     */
    public static getWorkspacesPreferences(
        workspaceId: number,
    ): CancelablePromise<{
        logo?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workspaces/{workspace_id}/preferences',
            path: {
                'workspace_id': workspaceId,
            },
            errors: {
                400: `Workspace not found`,
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Update the preferences for a given workspace.
     * @param workspaceId Workspace ID
     * @param requestBody
     * @returns any Successful operation
     * @throws ApiError
     */
    public static postWorkspacesPreferences(
        workspaceId: number,
        requestBody?: {
            /**
             * Legacy field
             */
            'annual-master-campaign-2018'?: string;
            /**
             * Time of acceptance of the terms of service
             */
            inc_tos_accepted_at?: string;
            /**
             * User ID who accepted the terms of service
             */
            inc_tos_accepted_by?: number;
            /**
             * Pricing plan ID
             */
            initial_pricing_plan?: number;
            /**
             * Legacy field
             */
            'january-2018-campaign'?: boolean;
            /**
             * Legacy field
             */
            master_signup?: boolean;
            /**
             * Date on which "Lock Time Entries" feature was enabled
             */
            report_locked_at?: string;
            /**
             * Whether SSO is enabled for this workspace
             */
            single_sign_on?: boolean;
            /**
             * Date on which SSO was requested
             */
            sso_requested_at?: string;
        },
    ): CancelablePromise<{
        logo?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workspaces/{workspace_id}/preferences',
            path: {
                'workspace_id': workspaceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Workspace not found
                 * The field is not writable
                 * Admin permissions required
                `,
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Resets the API token for the current user.
     * @returns any Successful response
     * @throws ApiError
     */
    public static postMeResetToken(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/reset_token',
            errors: {
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Lists latest time entries.
     * @param since Get entries modified since this date using UNIX timestamp, including deleted ones.
     * @param before Get entries with start time, before given date (YYYY-MM-DD) or with time in RFC3339 format.
     * @param startDate Get entries with start time, from start_date YYYY-MM-DD or with time in RFC3339 format. To be used with end_date.
     * @param endDate Get entries with start time, until end_date YYYY-MM-DD or with time in RFC3339 format. To be used with start_date.
     * @returns paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema Successful response
     * @throws ApiError
     */
    public static getMeTimeEntries(
        since?: number,
        before?: string,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<Array<paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/time_entries',
            query: {
                'since': since,
                'before': before,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Load running time entry for user ID.
     * @returns paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema Successful response
     * @throws ApiError
     */
    public static getMeTimeEntriesCurrent(): CancelablePromise<paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/time_entries/current',
            errors: {
                403: `User does not have access to this resource.`,
                404: `Resource not found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Creates a new workspace TimeEntry.
     * @param workspaceId
     * @returns paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema Successful response
     * @throws ApiError
     */
    public static postMeWorkspacesTimeEntries(
        workspaceId: number,
    ): CancelablePromise<paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/workspaces/{workspace_id}/time_entries',
            path: {
                'workspace_id': workspaceId,
            },
            errors: {
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * In short: http://tools.ietf.org/html/rfc6902 and http://tools.ietf.org/html/rfc6901 with some additions. Patch will be executed partially when there are errors with some records. No transaction, no rollback.
     * @param workspaceId Numeric ID of the workspace
     * @param timeEntryIds Numeric IDs of time_entries, separated by comma. E.g.: 204301830,202700150,202687559. The limit is 100 IDs per request.
     * @param requestBody
     * @returns any Successful response
     * @throws ApiError
     */
    public static patchMeWorkspacesTimeEntries(
        workspaceId?: number,
        timeEntryIds?: string,
        requestBody?: Array<{
            /**
             * Operation (add/remove/replace)
             */
            op?: string;
            /**
             * The path to the entity to patch (e.g. /description)
             */
            path?: string;
            /**
             * The new value for the entity in path.
             */
            value?: any;
        }>,
    ): CancelablePromise<{
        failure?: Array<{
            /**
             * The ID for which the patch operation failed.
             */
            id?: number;
            /**
             * The operation failure reason.
             */
            message?: string;
        }>;
        /**
         * The IDs for which the patch was succesful.
         */
        success?: Array<number>;
    }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/me/workspaces/{workspace_id}/time_entries/{time_entry_ids}',
            path: {
                'workspace_id': workspaceId,
                'time_entry_ids': timeEntryIds,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param workspaceId Numeric workspace ID
     * @param timeEntryId The time entry ID
     * @param requestBody
     * @returns any Successful response
     * @throws ApiError
     */
    public static putMeWorkspacesTimeEntries(
        workspaceId?: number,
        timeEntryId?: number,
        requestBody?: {
            /**
             * Whether the time entry is marked as billable, optional, default false
             */
            billable?: boolean;
            /**
             * Must be provided when creating a time entry and should identify the service/application used to create it
             */
            created_with?: string;
            /**
             * Time entry description, optional
             */
            description?: string;
            /**
             * Time entry duration. For running entries should be negative, preferable -1
             */
            duration?: number;
            /**
             * Deprecated: Used to create a time entry with a duration but without a stop time. This parameter can be ignored.
             */
            duronly?: boolean;
            /**
             * Project ID, legacy field
             */
            pid?: number;
            /**
             * Project ID, optional
             */
            project_id?: number;
            /**
             * Start time in UTC, required for creation. Format: 2006-01-02T15:04:05Z
             */
            start?: string;
            /**
             * If provided during creation, the date part will take precedence over the date part of "start". Format: 2006-11-07
             */
            start_date?: string;
            /**
             * Stop time in UTC, can be omitted if it's still running or created with "duration". If "stop" and "duration" are provided, values must be consistent (start + duration == stop)
             */
            stop?: string;
            /**
             * Can be "add" or "delete". Used when updating an existing time entry
             */
            tag_action?: string;
            /**
             * IDs of tags to add/remove
             */
            tag_ids?: Array<number>;
            /**
             * Names of tags to add/remove. If name does not exist as tag, one will be created automatically
             */
            tags?: Array<string>;
            /**
             * Task ID, optional
             */
            task_id?: number;
            /**
             * Task ID, legacy field
             */
            tid?: number;
            /**
             * Time Entry creator ID, legacy field
             */
            uid?: number;
            /**
             * Time Entry creator ID, if omitted will use the requester user ID
             */
            user_id?: number;
            /**
             * Workspace ID, legacy field
             */
            wid?: number;
            /**
             * Workspace ID, required
             */
            workspace_id?: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/me/workspaces/{workspace_id}/time_entries/{time_entry_id}',
            path: {
                'workspace_id': workspaceId,
                'time_entry_id': timeEntryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Stops a workspace time entry.
     * @param workspaceId Numeric ID of the workspace
     * @param timeEntryId Numeric ID of the time entry
     * @returns paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema The stopped workspace TimeEntry.
     * @throws ApiError
     */
    public static patchWorkspacesTimeEntriesStop(
        workspaceId?: number,
        timeEntryId?: number,
    ): CancelablePromise<paths_1me_1workspaces_1_workspace_id_1time_entries_1_time_entry_id_put_responses_200_schema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/workspaces/{workspace_id}/time_entries/{time_entry_id}/stop',
            path: {
                'workspace_id': workspaceId,
                'time_entry_id': timeEntryId,
            },
            errors: {
                400: `Invalid or missing time_entry_id`,
                403: `User does not have access to this resource.`,
                404: `Time entry not found`,
                409: `Time entry is already stopped`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Creates a new organization with a single workspace and assigns current user as the organization owner
     * @param requestBody
     * @returns any Organization and workspace IDs
     * @throws ApiError
     */
    public static postOrganizations(
        requestBody?: {
            /**
             * Organization name
             */
            name?: string;
            /**
             * Workspace name
             */
            workspace_name?: string;
        },
    ): CancelablePromise<{
        id?: number;
        name?: string;
        workspace_id?: number;
        workspace_name?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/organizations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Invalid JSON input
                 * Field 'name' cannot be empty.
                 * organization name too long, maximum length is 140
                 * workspace name must contain non-space characters
                 * workspace name must be provided
                 * workspace name must not be longer than 140
                `,
                403: `Operation Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param organizationId Numeric ID of the organization
     * @returns any Successful response
     * @throws ApiError
     */
    public static getOrganizations(
        organizationId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{organization_id}',
            path: {
                'organization_id': organizationId,
            },
            errors: {
                404: `Possible error messages:
                 * Invalid organization ID
                 * User not part of organization
                `,
            },
        });
    }

    /**
     * Updates an existing organization
     * @param organizationId Numeric ID of the organization
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putOrganizations(
        organizationId?: number,
        requestBody?: {
            /**
             * The name of the organization
             */
            name?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/organizations/{organization_id}',
            path: {
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Invalid JSON input
                 * Invalid organization ID
                 * At least one field is required
                 * field 'name' cannot be empty
                 * organization name too long, maximum length is 140
                `,
                403: `Operation Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Returns list of users in organization based on set of url parameters: Result is paginated. Pagination params are returned in headers
     * @param organizationId Numeric ID of the organization
     * @param filter Returns records where name or email contains this string
     * @param activeStatus List of active inactive invited comma separated(if not present, all statuses)
     * @param onlyAdmins If true returns admins only
     * @param groups Comma-separated list of groups ids, returns users belonging to these groups only
     * @param workspaces Comma-separated list of workspaces ids, returns users belonging to this workspaces only
     * @param page Page number, default 1
     * @param perPage Number of items per page, default 50
     * @param sortDir Values 'asc' or 'desc', result is sorted on 'names' column, default 'asc'
     * @returns any Successful response
     * @throws ApiError
     */
    public static getOrganizationsUsers(
        organizationId?: number,
        filter?: string,
        activeStatus?: string,
        onlyAdmins?: string,
        groups?: string,
        workspaces?: string,
        page?: number,
        perPage?: number,
        sortDir?: string,
    ): CancelablePromise<Array<{
        admin?: boolean;
        avatar_url?: string;
        can_edit_email?: boolean;
        email?: string;
        groups?: Array<{
            group_id?: number;
            name?: string;
        }>;
        id?: number;
        inactive?: boolean;
        invitation_code?: string;
        joined?: boolean;
        name?: string;
        owner?: boolean;
        user_id?: number;
        workspaces?: Array<{
            admin?: boolean;
            inactive?: boolean;
            name?: string;
            role?: string;
            workspace_id?: number;
        }>;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{organization_id}/users',
            path: {
                'organization_id': organizationId,
            },
            query: {
                'filter': filter,
                'active_status': activeStatus,
                'only_admins': onlyAdmins,
                'groups': groups,
                'workspaces': workspaces,
                'page': page,
                'per_page': perPage,
                'sort_dir': sortDir,
            },
            errors: {
                400: `Possible error messages:
                 * Missing or invalid organization_id.
                 * active_status parameter can contain only 'active', 'inactive' or 'invited'.
                 * only_admins parameter can contain only 'true' or 'false'.
                 * Invalid value sent for 'page'.
                 * page parameter must contain values > 0.
                 * Invalid value sent for 'per_page'.
                 * per_page parameter must contain values > 0.
                 * sort_dir parameter can contain only 'asc' or 'desc'.
                 * Invalid value sent for 'groups'.
                 * Invalid value sent for 'workspaces'.
                `,
                403: `Operation Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Apply changes in bulk to users in an organization (currently deletion only).
     * @param organizationId Numeric ID of the organization
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static patchOrganizationsUsers(
        organizationId?: number,
        requestBody?: {
            /**
             * Organization user IDs to be deleted
             */
            delete?: Array<number>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/organizations/{organization_id}/users',
            path: {
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Missing or invalid organization_id
                 * At least one organization user ID must be supplied.
                 * Organization user IDs must be unique.
                 * The following organization user IDs do not belong to this organization: '...'.
                 * Cannot remove the paying user with organization user ID='...'.
                 * Cannot remove the organization owner user with organization user ID='...'.
                `,
            },
        });
    }

    /**
     * Leaves organization, effectively delete user account in org and delete organization if it is last user
     * @param organizationId Numeric ID of the organization
     * @returns any OK
     * @throws ApiError
     */
    public static deleteOrganizationsUsers(
        organizationId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/organizations/{organization_id}/users',
            path: {
                'organization_id': organizationId,
            },
            errors: {
                400: `Possible error messages:
                 * The user does not belong to the organization.
                 * Cannot remove the paying user.
                 * Cannot remove the organization owner.
                `,
                403: `User does not have access to this resource.`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Changes a single organization-user.
     * @param organizationId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putOrganizationsUsers(
        organizationId: number,
        requestBody?: {
            email?: string;
            groups?: Array<number>;
            inactive?: boolean;
            name?: string;
            organization_admin?: boolean;
            workspaces?: Array<{
                admin?: boolean;
                inactive?: boolean;
                name?: string;
                role?: string;
                workspace_id?: number;
            }>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/organizations/{organization_id}/users/{organization_user_id}',
            path: {
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Missing or invalid organization_id.
                 * User does not exist in the organization.
                 * At least one field is required.
                 * Field 'name' cannot be empty.
                 * Missing e-mail.
                 * Invalid e-mail: '...'
                 * Email already exists.
                 * Group '...' is not in Organization '...'.
                 * Workspace '...' is not in Organization '...'.
                 * Cannot remove admin privileges from owner.
                 * Cannot deactivate owner.
                 * Cannot remove admin privileges from paying user.
                 * Cannot deactivate paying user.
                 * User has multiple organizations.
                `,
                403: `Operation forbidden.`,
                404: `Possible error messages:
                 * Invalid organization user ID.
                 * Failed to load user data.
                `,
                500: `Internal server error.`,
            },
        });
    }

    /**
     * Returns map indexed by workspace ID where each map element contains workspace admins list, members count and groups count.
     * @returns any Successful operation.
     * @throws ApiError
     */
    public static getOrganizationsWorkspacesStatistics(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{organization_id}/workspaces/statistics',
            errors: {
                403: `Forbidden`,
                404: `Resource can not be found`,
            },
        });
    }

    /**
     * Assign or remove users to/from a workspace or to/from groups belonging to said workspace.
     * @param organizationId Numeric ID of the organization
     * @param workspaceId Numeric ID of the workspace within the organization
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putOrganizationsWorkspacesAssignments(
        organizationId: number,
        workspaceId: number,
        requestBody?: {
            group_id?: number;
            joined?: boolean;
            operation?: string;
            user_id?: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/organizations/{organization_id}/workspaces/{workspace_id}/assignments',
            path: {
                'organization_id': organizationId,
                'workspace_id': workspaceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Possible error messages:
                 * Invalid JSON input
                 * Invalid organization ID.
                 * Nothing to change.
                 * Field operation can contain only 'add' or 'remove'.
                 * Cannot send user_id and group_id in the same element.
                 * One of user_id or group_id is required.
                 * Invalid user_id.
                 * Cannot remove workspace owner.
                 * Cannot remove paying user.
                 * Invalid group_id.
                 * Invalid workspace ID.
                `,
                403: `Operation Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * User connected with invitation is marked as joined, email is sent to the inviter.
     * @param invitationCode
     * @returns any OK
     * @throws ApiError
     */
    public static postOrganizationsInvitationsAccept(
        invitationCode: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/organizations/invitations/{invitation_code}/accept',
            path: {
                'invitation_code': invitationCode,
            },
            errors: {
                403: `Operation Forbidden`,
                404: `Invalid invitation code`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * User connected with invitation is marked as deleted.
     * @param invitationCode
     * @returns any OK
     * @throws ApiError
     */
    public static postOrganizationsInvitationsReject(
        invitationCode: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/organizations/invitations/{invitation_code}/reject',
            path: {
                'invitation_code': invitationCode,
            },
            errors: {
                403: `Operation Forbidden`,
                404: `Invalid invitation code`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Creates a new invitation for the user.
     * @param organizationId
     * @param requestBody
     * @throws ApiError
     */
    public static postOrganizationsInvitations(
        organizationId: number,
        requestBody?: {
            emails?: Array<string>;
            workspaces?: Array<{
                admin?: boolean;
                role?: string;
                workspace_id?: number;
            }>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/organizations/{organization_id}/invitations',
            path: {
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
