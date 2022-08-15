import {describe, it, expect, vi, beforeEach} from 'vitest'
import axios from 'axios'
import gross from './gross'

vi.mock('axios')

const mockGet = vi.spyOn(axios, 'get')
const mockPost = vi.spyOn(axios, 'post')

function loadData(data: unknown) {
    vi.mocked(mockGet).mockResolvedValue({data})
}

function pointContaining(data: Record<string, unknown>) {
    return expect.objectContaining({
            ...data
    }) as unknown
}

describe('gross', () => {
    beforeEach(() => {
        vi.setSystemTime('2022-08-10T17:50:07+00:00')
        loadData([])
        process.env = {
            ...process.env,
            GROSS_MULTIPLIER_TOGGL: "10",
            GROSS_TOGGL_PROJECT: "the_id",
            TOGGL_API_TOKEN: "the_token",
            USERNAME: "the_username",
            AUTH_TOKEN: "the_auth_token",
        }
    })

    it('posts day sum', async () => {
        loadData([{
            "project_id": process.env.GROSS_TOGGL_PROJECT,
            "duration": 3600,
            "start": "2022-08-10T16:50:07+00:00",
        }])

        await gross()

        expect(mockPost).toHaveBeenCalledWith(expect.any(String), pointContaining({
            value: 10,
        }))
    })

    it('handles ongoing timers', async () => {
        vi.setSystemTime('2022-08-10T17:50:07+00:00')

        loadData([{
            "project_id": process.env.GROSS_TOGGL_PROJECT,
            "duration": -1660150207,
            "start": "2022-08-10T16:50:07+00:00",
        }])

        await gross()

        expect(mockPost).toHaveBeenCalledWith(expect.any(String), pointContaining({
            value: 10,
        }))
    })

    it('includes comment', async () => {
        loadData([{
            "project_id": process.env.GROSS_TOGGL_PROJECT,
            "duration": 3600,
            "start": "2022-08-10T16:50:07+00:00",
        }])

        await gross()

        expect(mockPost).toHaveBeenCalledWith(expect.any(String), pointContaining({
            comment: "Toggl: 1hrs",
        }))
    })

    it('filters by project id', async () => {
        loadData([{
            "project_id": "wrong_id",
            "duration": 3600,
        }])

        await gross()

        expect(mockPost).toHaveBeenCalledWith(expect.any(String), pointContaining({
            value: 0,
        }))
    })

    it('uses Toggl API token', async () => {
        await gross()

        const expected = Buffer.from(`${process.env.TOGGL_API_TOKEN}:api_token`).toString("base64")

        expect(mockGet).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: `Basic ${expected}`,
            }) as unknown
        }))
    })

    it('sets daystamp', async () => {
        vi.setSystemTime('2022-08-10T17:50:07+00:00')

        await gross()

        expect(mockPost).toHaveBeenCalledWith(expect.any(String), pointContaining({
            daystamp: '2022-08-10',
        }))
    })

    it('sets requestid to date', async () => {
        vi.setSystemTime('2022-08-10T17:50:07+00:00')

        await gross()

        expect(mockPost).toHaveBeenCalledWith(expect.any(String), pointContaining({
            requestid: 'toggl-2022-08-10',
        }))
    })

    it('filters by date', async () => {
        vi.setSystemTime('2022-08-10T17:50:07+00:00')

        loadData([{
            "project_id": process.env.GROSS_TOGGL_PROJECT,
            "duration": 3600,
            "start": "2022-08-09T16:50:07+00:00",
            }])

        await gross()

        expect(mockPost).toHaveBeenCalledWith(expect.any(String), pointContaining({
            value: 0,
        }))
    })

    it('posts to beeminder goal url', async () => {
        await gross()

        const expected = 'https://www.beeminder.com/api/v1/users/the_username/goals/gross/datapoints.json'

        expect(mockPost).toHaveBeenCalledWith(expected, expect.anything())
    })

    it('uses Beeminder auth token', async () => {
        await gross()

        expect(mockPost).toHaveBeenCalledWith(expect.any(String), pointContaining({
            auth_token: process.env.AUTH_TOKEN,
        }))
    })

    it('ignores duplicate request errors', async () => {
        vi.mocked(mockPost).mockRejectedValue({
            response: {
                status: 422,
                data: {
                    error: "Duplicate datapoint",
                }
            }
        })

        await gross()

        expect(mockPost).toHaveBeenCalledTimes(1)
    })

    it('rethrows errors', async () => {
        vi.mocked(mockPost).mockRejectedValue({
            response: {
                status: 500,
                data: {
                error: "Internal Server Error",
                }
            }
        })

        await expect(gross()).rejects.toThrowError()

        expect(mockPost).toHaveBeenCalledTimes(1)
    })
})