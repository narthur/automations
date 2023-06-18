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
pnpm firebase login # or pnpm firebase login:add
pnpm firebase login:use the_email
pnpm run deploy
```

If you receive the following error:

> Error: Failed to get Firebase project [project_id]. Please make sure the project exists and your account has permission to access it.

Try running `firebase logout` and `firebase login` to refresh your access token.

### Secrets

After defining a new secret in `secrets.ts`, you'll need to set it in the Firebase project:

```bash
pnpm firebase functions:secrets:set THE_SECRET_ID # and enter the value
pnpm firebase functions:secrets:get THE_SECRET_ID # to verify
```

You can view the secret's value in the Google Cloud console Secrets Manager.

## Toggl

- [Toggl Track Webhooks](https://support.toggl.com/en/articles/6321281-toggl-track-webhooks)
- [Webhooks API](https://developers.track.toggl.com/docs/webhooks_start/index.html)
- [URL Endpoint Validation](https://developers.track.toggl.com/docs/webhooks_start/url_endpoint_validation/index.html)

## Todo

- Fix gross function
- Register gross function with Toggl webhook
- Create new function to ask Beeminder to refresh all Toggl autodata goals using Toggl webhook