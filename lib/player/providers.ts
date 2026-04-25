import type { VideoType } from './types';

export type ProviderDef = {
  id: string;
  label: string;
  priority: number;
  enabled: boolean;
  buildUrl: (params: { type: VideoType; tmdbId: number; season?: number; episode?: number }) => string;
};

const PROVIDER_LABELS = [
  'Provider 1',
  'Provider 2',
  'Provider 3',
  'Provider 4',
  'Provider 5',
  'Provider 6',
  'Provider 7',
  'Provider 8',
] as const;

const PROVIDER_ENV_KEYS = [
  'NEXT_PUBLIC_PROVIDER_1_URL',
  'NEXT_PUBLIC_PROVIDER_2_URL',
  'NEXT_PUBLIC_PROVIDER_3_URL',
  'NEXT_PUBLIC_PROVIDER_4_URL',
  'NEXT_PUBLIC_PROVIDER_5_URL',
  'NEXT_PUBLIC_PROVIDER_6_URL',
  'NEXT_PUBLIC_PROVIDER_7_URL',
  'NEXT_PUBLIC_PROVIDER_8_URL',
] as const;

const PROVIDER_HOST_WHITELIST_ENV = 'NEXT_PUBLIC_PROVIDER_HOST_WHITELIST';

function readRuntimeEnv(key: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;
  return process.env[key];
}

export function parseHostWhitelist(rawList: string | undefined): string[] {
  if (!rawList) return [];

  return rawList
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedProviderHost(url: string, whitelist: string[]): boolean {
  if (!whitelist.length) return true;

  try {
    const parsed = new URL(url);
    return whitelist.some((allowedHost) => {
      if (parsed.hostname === allowedHost) return true;
      return parsed.hostname.endsWith(`.${allowedHost}`);
    });
  } catch {
    return false;
  }
}

export function resolveProviderUrl(
  template: string,
  params: { type: VideoType; tmdbId: number; season?: number; episode?: number },
): string {
  const season = params.season ?? 1;
  const episode = params.episode ?? 1;

  return template
    .replaceAll('{type}', params.type)
    .replaceAll('{id}', String(params.tmdbId))
    .replaceAll('{s}', String(season))
    .replaceAll('{e}', String(episode));
}

export function getProviderDefinitions(): ProviderDef[] {
  const whitelist = parseHostWhitelist(readRuntimeEnv(PROVIDER_HOST_WHITELIST_ENV));

  return PROVIDER_ENV_KEYS.map((envKey, index) => {
    const template = readRuntimeEnv(envKey)?.trim();
    const id = `p${index + 1}`;

    return {
      id,
      label: PROVIDER_LABELS[index],
      priority: index + 1,
      enabled: Boolean(template),
      buildUrl: ({ type, tmdbId, season, episode }) => {
        const fallbackTemplate = 'about:blank';
        const resolvedUrl = resolveProviderUrl(template || fallbackTemplate, {
          type,
          tmdbId,
          season,
          episode,
        });

        return isAllowedProviderHost(resolvedUrl, whitelist) ? resolvedUrl : 'about:blank';
      },
    };
  });
}

export function getNextEnabledProvider(currentIndex: number, providers: ProviderDef[]): number {
  if (!providers.length) return -1;
  for (let offset = 1; offset <= providers.length; offset += 1) {
    const nextIndex = (currentIndex + offset) % providers.length;
    if (providers[nextIndex]?.enabled) {
      return nextIndex;
    }
  }

  return currentIndex;
}
