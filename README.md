# drama-HD
watch all in one

## Licensed provider failover configuration

The player supports up to **12 licensed provider slots** from runtime environment variables and automatically fails over between enabled providers.

### Required environment variables

- `NEXT_PUBLIC_PROVIDER_1_URL`
- `NEXT_PUBLIC_PROVIDER_2_URL`
- `NEXT_PUBLIC_PROVIDER_3_URL`
- `NEXT_PUBLIC_PROVIDER_4_URL`
- `NEXT_PUBLIC_PROVIDER_5_URL`
- `NEXT_PUBLIC_PROVIDER_6_URL`
- `NEXT_PUBLIC_PROVIDER_7_URL`
- `NEXT_PUBLIC_PROVIDER_8_URL`
- `NEXT_PUBLIC_PROVIDER_9_URL`
- `NEXT_PUBLIC_PROVIDER_10_URL`
- `NEXT_PUBLIC_PROVIDER_11_URL`
- `NEXT_PUBLIC_PROVIDER_12_URL`

Optional:

- `NEXT_PUBLIC_PROVIDER_HOST_WHITELIST` (comma-separated hostnames, e.g. `licensed.example,player.partner.com`)
- `NEXT_PUBLIC_SUPPORT_EMAIL` (used by the player "Report Issue" action)

### URL template placeholders

Each provider URL can be a concrete URL or a template with placeholders:

- `{type}` → `movie` or `tv`
- `{id}` → TMDB id
- `{s}` → season number
- `{e}` → episode number

Example:

`https://licensed-player.example/embed/{type}/{id}?season={s}&episode={e}`

### Host allowlist behavior

When `NEXT_PUBLIC_PROVIDER_HOST_WHITELIST` is set:

- only matching hosts (or subdomains) are allowed,
- non-HTTP(S) URLs are rejected,
- non-matching providers are treated as disabled and never used by the player.

### Failover behavior

- The player remembers the last successful provider per title/episode in local storage.
- Automatic failover can be toggled in the UI.
- On iframe timeout (12s) or load error, it rotates to the next enabled provider.
- If no providers are enabled, a support message is shown instead of rendering a broken iframe.

## Troubleshooting: `ERR_FAILED` on Vercel URLs

If a browser shows `ERR_FAILED` (like `https://v0-drama-series-app.vercel.app/`), the issue is usually deployment or DNS, not app code.

Quick check from terminal:

```bash
npm run check:url -- https://v0-drama-series-app.vercel.app/
```

What the script verifies:

- DNS resolution for the hostname
- HTTPS HEAD request response

If DNS fails, the subdomain is unavailable (deleted, renamed, or not propagated).
If DNS works but HTTPS fails, check Vercel project status, domain assignment, and firewall/network restrictions.
