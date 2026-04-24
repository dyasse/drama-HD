'use client';

import { Crown, X } from 'lucide-react';

export function PremiumModal({ open, onClose, title, subtitle }: { open: boolean; onClose: () => void; title: string; subtitle: string }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gold bg-zinc-950 p-6 text-cream">
        <button type="button" onClick={onClose} className="mb-3 ml-auto block text-zinc-300"><X size={18} /></button>
        <div className="mb-3 inline-flex rounded-full bg-gold/20 p-2 text-gold"><Crown size={18} /></div>
        <h4 className="text-2xl font-bold text-gold">{title}</h4>
        <p className="mt-1 text-sm text-zinc-200">{subtitle}</p>
        <button type="button" className="mt-5 w-full rounded-full bg-gold px-4 py-2 font-semibold text-zinc-950">
          Pay $6 • Unlock
        </button>
      </div>
    </div>
  );
}
