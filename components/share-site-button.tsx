'use client';

import { Share2 } from 'lucide-react';

const SITE_NAME = 'Drama HD';

export function ShareSiteButton() {
  const handleShare = async () => {
    const shareData = {
      title: SITE_NAME,
      text: 'Watch and discover trending drama content on Drama HD.',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Ignore dismissed shares and keep fallback behavior below.
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareData.url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald/30 text-emerald transition hover:bg-emerald hover:text-white"
      aria-label="Share site"
      title="Share site"
    >
      <Share2 size={16} />
    </button>
  );
}
