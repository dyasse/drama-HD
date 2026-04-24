import type { Locale } from '../../../i18n/config';
import { SettingsPanel } from '../../../components/settings-panel';

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsPanel locale={locale as Locale} />
    </main>
  );
}
