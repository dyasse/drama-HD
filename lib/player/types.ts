export type VideoType = 'movie' | 'tv';

export type ProviderId = `p${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

export type ProviderBuildParams = {
  type: VideoType;
  tmdbId: number;
  season?: number;
  episode?: number;
};

export type ProviderDef = {
  id: ProviderId;
  label: string;
  priority: number;
  enabled: boolean;
  buildUrl: (params: ProviderBuildParams) => string;
};
