import type { Locale } from '../../../i18n/config';
import { SettingsPanel } from '../../../components/settings-panel';

export default function SettingsPage({ params }: { params: { locale: string } }) {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsPanel locale={params.locale as Locale} />
    </main>
  );
}
