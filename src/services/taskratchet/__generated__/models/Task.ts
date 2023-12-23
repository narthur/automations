/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Task = {
    /**
     * Task's unique identifier
     */
    id?: string;
    /**
     * Task's title
     */
    task?: string;
    /**
     * Task's timezone-agnostic due string
     */
    due?: string;
    /**
     * Task's precise due time, taking the user's current timezone into account
     */
    due_timestamp?: number;
    /**
     * Task's stakes
     */
    cents?: number;
    /**
     * Whether or not the task has been completed
     */
    complete?: boolean;
    /**
     * One of "complete", "expired", or "pending"
     */
    status?: string;
    /**
     * The user's current timezone
     */
    timezone?: string;
};

