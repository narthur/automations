import "./src/cron.ts";

import express from 'express';

import { handler as ssrHandler } from './dist/server/entry.mjs';

const PORT = parseInt(process.env.PORT) || 3000

const app = express();
// Change this based on your astro.config.mjs, `base` option.
// They should match. The default value is "/".
const base = '/';
app.use(base, express.static('dist/client/'));
app.use((req, res, next) => {
    try {
        void ssrHandler(req, res, next);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

app.listen(PORT);