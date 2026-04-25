import type { ProviderBuildParams, ProviderDef, ProviderId } from './types';

const MAX_PROVIDER_SLOTS = 12;
const PROVIDER_HOST_WHITELIST_ENV = 'NEXT_PUBLIC_PROVIDER_HOST_WHITELIST';

function readRuntimeEnv(key: string): string {
  if (typeof process === 'undefined' || !process.env) return '';
  return process.env[key]?.trim() ?? '';
}

export function parseHostWhitelist(rawList: string): string[] {
  if (!rawList) return [];

  return rawList
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeProviderTemplate(template: string): string {
  return template.trim();
}

function isValidAbsoluteHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isAllowedProviderHost(url: string, whitelist: string[]): boolean {
  if (!whitelist.length) return true;

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return whitelist.some((allowedHost) => hostname === allowedHost || hostname.endsWith(`.${allowedHost}`));
  } catch {
    return false;
  }
}

export function resolveProviderUrl(template: string, params: ProviderBuildParams): string {
  const season = params.season ?? 1;
  const episode = params.episode ?? 1;

  return template
    .replaceAll('{type}', params.type)
    .replaceAll('{id}', String(params.tmdbId))
    .replaceAll('{s}', String(season))
    .replaceAll('{e}', String(episode));
}

function createProviderDef(slot: number, whitelist: string[]): ProviderDef {
  const envKey = `NEXT_PUBLIC_PROVIDER_${slot}_URL`;
  const template = normalizeProviderTemplate(readRuntimeEnv(envKey));
  const id = `p${slot}` as ProviderId;
  const label = `Provider ${slot}`;

  const hasTemplate = Boolean(template);
  const templateIsUrlLike = hasTemplate && (template.includes('{') || isValidAbsoluteHttpUrl(template));
  const enabled = hasTemplate && templateIsUrlLike;

  return {
    id,
    label,
    priority: slot,
    enabled,
    buildUrl: (params) => {
      if (!enabled) return 'about:blank';
      const resolvedUrl = resolveProviderUrl(template, params);
      if (!isValidAbsoluteHttpUrl(resolvedUrl)) return 'about:blank';
      if (!isAllowedProviderHost(resolvedUrl, whitelist)) return 'about:blank';
      return resolvedUrl;
    },
  };
}

export function getProviderDefinitions(): ProviderDef[] {
  const whitelist = parseHostWhitelist(readRuntimeEnv(PROVIDER_HOST_WHITELIST_ENV));
  return Array.from({ length: MAX_PROVIDER_SLOTS }, (_, index) => index + 1).map((slot) => createProviderDef(slot, whitelist));
}

export function getNextEnabledProvider(currentIndex: number, providers: ProviderDef[]): number {
  if (!providers.length) return -1;

  for (let offset = 1; offset <= providers.length; offset += 1) {
    const nextIndex = (currentIndex + offset) % providers.length;
    if (providers[nextIndex]?.enabled) return nextIndex;
  }

  return currentIndex;
}
