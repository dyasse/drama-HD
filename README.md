# drama-HD
watch all in one

## Licensed provider failover configuration

The player supports an 8-provider failover registry driven by runtime environment variables.

### Required environment variables

- `NEXT_PUBLIC_PROVIDER_1_URL`
- `NEXT_PUBLIC_PROVIDER_2_URL`
- `NEXT_PUBLIC_PROVIDER_3_URL`
- `NEXT_PUBLIC_PROVIDER_4_URL`
- `NEXT_PUBLIC_PROVIDER_5_URL`
- `NEXT_PUBLIC_PROVIDER_6_URL`
- `NEXT_PUBLIC_PROVIDER_7_URL`
- `NEXT_PUBLIC_PROVIDER_8_URL`

Optional:

- `NEXT_PUBLIC_PROVIDER_HOST_WHITELIST` (comma-separated hostnames)
- `NEXT_PUBLIC_SUPPORT_EMAIL` (for the player issue link)

### URL template placeholders

Each provider URL template can include:

- `{type}` => `movie` or `tv`
- `{id}` => TMDB ID
- `{s}` => season number
- `{e}` => episode number

Example template:

`https://licensed-player.example/embed/{type}/{id}?season={s}&episode={e}`

### Host whitelist behavior

If `NEXT_PUBLIC_PROVIDER_HOST_WHITELIST` is set, final resolved provider URLs are allowed only when their host matches one listed domain (or subdomain). Non-matching providers resolve to `about:blank` and are shown disabled.

### Failover behavior

- Player starts with the last successful provider saved per title/episode when available.
- Automatic failover can be toggled from the player UI.
- If iframe load times out (12 seconds) or errors, the player rotates to the next enabled provider.
- `Refresh Player` forces a hard iframe reload via key nonce.
