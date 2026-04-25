export type VideoType = 'movie' | 'tv';

export type ProviderId = `p${number}`;

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
