import { LocaleSwitcher } from '../../components/locale-switcher';
import { defaultLocale, isValidLocale, type Locale } from '../../i18n/config';

const copy: Record<Locale, { title: string; subtitle: string; free: string; plan: string; cta: string; points: string[] }> = {
  en: {
    title: 'Drama HD',
    subtitle: 'Stream unforgettable stories in your language.',
    free: 'Enjoy 20 episodes free before upgrading.',
    plan: '$6/month subscription unlocks the full catalog in HD.',
    cta: 'Start Watching',
    points: ['20 free episodes included', '$6 monthly premium access', 'Emerald & gold cinematic theme'],
  },
  ar: {
    title: 'دراما HD',
    subtitle: 'شاهد قصصًا لا تُنسى بلغتك.',
    free: 'استمتع بـ20 حلقة مجانًا قبل الترقية.',
    plan: 'اشتراك 6 دولارات شهريًا يفتح كامل المكتبة بجودة HD.',
    cta: 'ابدأ المشاهدة',
    points: ['20 حلقة مجانية', 'اشتراك شهري بقيمة 6 دولارات', 'تصميم سينمائي بالزمردي والذهبي'],
  },
  fr: {
    title: 'Drama HD',
    subtitle: 'Regardez des histoires inoubliables dans votre langue.',
    free: 'Profitez de 20 épisodes gratuits avant de passer à l’abonnement.',
    plan: 'Abonnement à 6 $/mois pour débloquer tout le catalogue en HD.',
    cta: 'Commencer à regarder',
    points: ['20 épisodes gratuits', 'Accès premium à 6 $/mois', 'Thème cinématique émeraude et or'],
  },
};

type LocalePageProps = {
  params: { locale: string };
};

export default function LocalePage({ params }: LocalePageProps) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = copy[locale];

  return (
    <main style={{ maxWidth: 900, margin: '0 auto' }}>
      <section
        style={{
          border: '1px solid #d4af37',
          borderRadius: 16,
          padding: '2rem',
          backgroundColor: 'rgba(1, 35, 31, 0.75)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        <LocaleSwitcher locale={locale} />
        <h1 style={{ marginTop: '1.2rem', marginBottom: '.5rem', color: '#ffd86f' }}>{content.title}</h1>
        <p style={{ marginTop: 0 }}>{content.subtitle}</p>

        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#0a4f45', borderRadius: 12 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>{content.free}</p>
          <p style={{ marginBottom: 0 }}>{content.plan}</p>
        </div>

        <ul style={{ marginTop: '1.25rem' }}>
          {content.points.map((point) => (
            <li key={point} style={{ marginBottom: '.5rem' }}>
              {point}
            </li>
          ))}
        </ul>

        <button
          type="button"
          style={{
            background: '#d4af37',
            color: '#062d27',
            border: 0,
            borderRadius: 999,
            padding: '.75rem 1.25rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {content.cta}
        </button>
      </section>
    </main>
  );
}
