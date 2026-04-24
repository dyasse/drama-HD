'use client';

import { useEffect, useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import { PremiumModal } from './premium-modal';

const subtitleOptions = ['AR', 'EN', 'FR'] as const;

export function VideoPlayerPanel({
  title,
  locale,
  mediaType,
  tmdbId,
}: {
  title: string;
  locale: Locale;
  mediaType: 'movie' | 'tv';
  tmdbId: number;
}) {
  const t = uiCopy[locale];
  const [episode, setEpisode] = useState(1);
  const [subtitle, setSubtitle] = useState<(typeof subtitleOptions)[number]>('EN');
  const [openModal, setOpenModal] = useState(false);

  const episodes = useMemo(() => Array.from({ length: 40 }, (_, i) => i + 1), []);
  const isPremium = mediaType === 'movie' ? true : episode > 20;

  useEffect(() => {
    if (mediaType === 'tv' && episode > 20) {
      setOpenModal(true);
    }
  }, [episode, mediaType]);

  const src = mediaType === 'movie' ? `https://vidsrc.to/embed/movie/${tmdbId}` : `https://vidsrc.to/embed/tv/${tmdbId}/1/${episode}`;

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-gold/40 bg-black p-3 text-cream">
        <div className="relative overflow-hidden rounded-xl">
          {mediaType === 'movie' ? (
            <div className="grid h-[420px] place-items-center bg-zinc-900/95 px-4 text-center">
              <Lock size={42} className="text-gold" />
              <p className="mt-3 max-w-xs text-lg font-semibold">First 20 minutes are free. Full movie requires Gold.</p>
              <button type="button" onClick={() => setOpenModal(true)} className="mt-4 rounded-full bg-gold px-4 py-2 font-semibold text-zinc-950">
                Unlock Full Movie for $6
              </button>
            </div>
          ) : isPremium ? (
            <div className="grid h-[420px] place-items-center bg-zinc-900/95 px-4 text-center">
              <Lock size={42} className="text-gold" />
              <p className="mt-3 max-w-xs text-lg font-semibold">Episode {episode} requires Premium access.</p>
              <button type="button" onClick={() => setOpenModal(true)} className="mt-4 rounded-full bg-gold px-4 py-2 font-semibold text-zinc-950">
                Unlock Full Series for $6
              </button>
            </div>
          ) : (
            <iframe
              src={src}
              className="h-[420px] w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="origin"
              title={`${title} player`}
            />
          )}
        </div>

        <label className="mt-3 block text-sm">
          {t.subtitleLanguage}
          <select value={subtitle} onChange={(event) => setSubtitle(event.target.value as 'AR' | 'EN' | 'FR')} className="mt-1 w-full rounded border border-gold/40 bg-zinc-900 p-2">
            {subtitleOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>

      {mediaType === 'tv' && (
        <aside className="rounded-2xl border border-emerald/20 bg-white/70 p-3 dark:bg-zinc-900/75">
          <p className="mb-2 text-sm font-semibold">{t.selectEpisode}</p>
          <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
            {episodes.map((id) => {
              const premiumEpisode = id > 20;
              return (
                <button
                  type="button"
                  onClick={() => setEpisode(id)}
                  key={id}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${episode === id ? 'bg-emerald text-cream' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                >
                  <span>Episode {id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${premiumEpisode ? 'border border-gold bg-gold/10 text-gold' : 'bg-emerald/20 text-emerald dark:text-cream'}`}>
                    {premiumEpisode ? t.premiumBadge : t.freeBadge}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      )}
      <PremiumModal open={openModal} onClose={() => setOpenModal(false)} title={t.unlock} subtitle={t.oneTime} />
    </section>
  );
}
