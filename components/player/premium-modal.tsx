'use client';

import { Crown, Sparkles, X } from 'lucide-react';

export function PremiumModal({ open, onClose, title, subtitle }: { open: boolean; onClose: () => void; title: string; subtitle: string }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gold bg-gradient-to-b from-zinc-950 to-black p-6 text-cream shadow-2xl shadow-gold/20">
        <button type="button" onClick={onClose} className="mb-3 ml-auto block text-zinc-300"><X size={18} /></button>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-gold">
          <Crown size={16} /> Premium Access <Sparkles size={14} />
        </div>
        <h4 className="text-2xl font-bold text-gold">{title}</h4>
        <p className="mt-1 text-sm text-zinc-200">{subtitle}</p>
        <button type="button" className="mt-5 w-full rounded-full bg-gold px-4 py-2 font-semibold text-zinc-950">
          Unlock Full Series for $6
        </button>
      </div>
    </div>
  );
}
