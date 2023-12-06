/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserResponse = {
    /**
     * The account's unique identifier
     */
    id?: string;
    /**
     * User's full name
     */
    name?: string;
    /**
     * User's email address
     */
    email?: string;
    /**
     * User's current account timezone
     */
    timezone?: string;
    /**
     * List of user's payment methods
     */
    cards?: Array<string>;
    /**
     * User's integration settings; currently only Beeminder
     */
    integrations?: {
        beeminder?: {
            user?: string;
            goal_new_tasks?: string;
        };
    };
};

