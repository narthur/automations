# automations

## Develompent

```bash
cp .env.example .env # and fill in the values
nvm use
pnpm install
pnpm serve
open http://localhost:4000 # open panel
open http://localhost:5001/automations-120bb/us-central1/gross # run https function
```

## Deploy

```bash
nvm use
pnpm install
pnpm deploy
```

## Toggl

- [Toggl Track Webhooks](https://support.toggl.com/en/articles/6321281-toggl-track-webhooks)
- [Webhooks API](https://developers.track.toggl.com/docs/webhooks_start/index.html)
- [URL Endpoint Validation](https://developers.track.toggl.com/docs/webhooks_start/url_endpoint_validation/index.html)

## Todo

- Fix gross function
- Register gross function with Toggl webhook
- Create new function to ask Beeminder to refresh all Toggl autodata goals using Toggl webhook