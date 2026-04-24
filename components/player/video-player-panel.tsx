'use client';

import { useState } from 'react';
import { Lock, PlayCircle } from 'lucide-react';
import type { Show } from '../../lib/data/content';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import { PremiumModal } from './premium-modal';

const subtitleOptions = ['AR', 'EN', 'FR'] as const;

export function VideoPlayerPanel({ show, locale }: { show: Show; locale: Locale }) {
  const t = uiCopy[locale];
  const [episode, setEpisode] = useState(1);
  const [subtitle, setSubtitle] = useState<(typeof subtitleOptions)[number]>('EN');
  const [audio, setAudio] = useState<(typeof subtitleOptions)[number]>('AR');
  const [openModal, setOpenModal] = useState(false);

  const isPremiumEpisode = episode > 20;

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-emerald/20 bg-black p-3 text-cream">
        <div className="relative overflow-hidden rounded-xl">
          {!isPremiumEpisode ? (
            <div className="grid h-[360px] place-items-center bg-zinc-900">
              <PlayCircle size={72} className="text-emerald" />
              <p>Now playing {show.title} • Episode {episode}</p>
            </div>
          ) : (
            <div className="grid h-[360px] place-items-center bg-zinc-900/95 text-center">
              <Lock size={42} className="text-gold" />
              <p className="mt-3 max-w-xs text-lg font-semibold">Episode {episode} requires Premium access.</p>
              <button onClick={() => setOpenModal(true)} className="mt-4 rounded-full bg-gold px-4 py-2 font-semibold text-zinc-950">
                {t.unlock}
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="text-sm">
            {t.subtitleLanguage}
            <select value={subtitle} onChange={(event) => setSubtitle(event.target.value as 'AR' | 'EN' | 'FR')} className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-2">
              {subtitleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm">
            {t.audioLanguage}
            <select value={audio} onChange={(event) => setAudio(event.target.value as 'AR' | 'EN' | 'FR')} className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-2">
              {subtitleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>
      </div>

      <aside className="rounded-2xl border border-emerald/20 bg-white/70 p-3 dark:bg-zinc-900/75">
        <p className="mb-2 text-sm font-semibold">{t.selectEpisode}</p>
        <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
          {show.episodes.map((item) => {
            const premium = item.id > 20;
            return (
              <button
                type="button"
                onClick={() => setEpisode(item.id)}
                key={item.id}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${episode === item.id ? 'bg-emerald text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
              >
                <span>{item.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${premium ? 'bg-gold text-black' : 'bg-emerald/20 text-emerald dark:text-cream'}`}>
                  {premium ? t.premiumBadge : t.freeBadge}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
      <PremiumModal open={openModal} onClose={() => setOpenModal(false)} title={t.unlock} subtitle={t.oneTime} />
    </section>
  );
}
