/// <reference types="vitest" />
import {defineConfig} from 'vite'

export default defineConfig({
    test: {
        mockReset: true,
        root: __dirname
    }
})