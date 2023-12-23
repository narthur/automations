/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Task } from '../models/Task';
import type { UserResponse } from '../models/UserResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Get your profile data
     * @returns UserResponse Successful response
     * @throws ApiError
     */
    public static getMe(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me',
        });
    }

    /**
     * Update your profile data
     * @param requestBody
     * @returns UserResponse Successful response
     * @throws ApiError
     */
    public static putMe(
        requestBody?: {
            /**
             * User's full name
             */
            name: string;
            /**
             * User's email address
             */
            email: string;
            /**
             * User's timezone; for valid values, see GET timezones
             */
            timezone?: string;
            /**
             * New password
             */
            new_password?: string;
            /**
             * User's integration settings; currently only Beeminder
             */
            integrations?: Record<string, any>;
        },
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all your tasks
     * @returns Task Successful response
     * @throws ApiError
     */
    public static getMeTasks(): CancelablePromise<Array<Task>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/tasks',
        });
    }

    /**
     * Create a new task
     * @param requestBody
     * @returns Task Successful response
     * @throws ApiError
     */
    public static postMeTasks(
        requestBody?: Task,
    ): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/tasks',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a specific task
     * @param taskId ID of the specific task
     * @returns Task Successful response
     * @throws ApiError
     */
    public static getMeTasks1(
        taskId: string,
    ): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/tasks/{task_id}',
            path: {
                'task_id': taskId,
            },
        });
    }

    /**
     * Update a specific task
     * @param taskId ID of the specific task
     * @param requestBody
     * @returns Task Successful response
     * @throws ApiError
     */
    public static putMeTasks(
        taskId: string,
        requestBody?: Task,
    ): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/me/tasks/{task_id}',
            path: {
                'task_id': taskId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get API status details
     * @returns any Successful response
     * @throws ApiError
     */
    public static getStatus(): CancelablePromise<{
        /**
         * The current UTC time of the API server instance
         */
        utc_now?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/status',
        });
    }

    /**
     * Get valid timezone values
     * @returns string Successful response
     * @throws ApiError
     */
    public static getTimezones(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/timezones',
        });
    }

}
