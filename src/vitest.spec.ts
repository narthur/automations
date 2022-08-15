import { describe, it, expect } from "vitest";

describe('vitest', () => {
    it('can expect error', async () => {
        // eslint-disable-next-line @typescript-eslint/require-await
        const fn = async () => {
            throw new Error('foo')
        }

        await expect(fn()).rejects.toThrowError();
    })
})