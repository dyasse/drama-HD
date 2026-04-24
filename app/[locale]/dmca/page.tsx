import type { Locale } from '../../../i18n/config';

const copy: Record<Locale, { title: string; sections: Array<{ h: string; p: string }> }> = {
  en: {
    title: 'DMCA / Copyright Policy',
    sections: [
      {
        h: 'Platform Role',
        p: 'Drama HD is a search-and-discovery platform for publicly available third-party embeds and metadata. We do not host, upload, or store any video streams on our servers.',
      },
      {
        h: 'Third-Party Content',
        p: 'All embedded players and links are provided by external services. Copyright ownership and distribution rights belong to their respective owners and providers.',
      },
      {
        h: 'Notice & Removal',
        p: 'If you are a copyright owner and believe a referenced embed violates your rights, send a DMCA notice with proof of ownership, affected URLs, and contact details. We will review and remove references when appropriate.',
      },
    ],
  },
  ar: {
    title: 'سياسة حقوق النشر / DMCA',
    sections: [
      {
        h: 'دور المنصة',
        p: 'يعمل Drama HD كمنصة بحث واكتشاف لبيانات وروابط تشغيل من مصادر خارجية متاحة للعامة. نحن لا نستضيف أو نرفع أو نخزن أي ملفات فيديو على خوادمنا.',
      },
      {
        h: 'المحتوى الخارجي',
        p: 'جميع المشغلات والروابط المعروضة تأتي من خدمات طرف ثالث. تعود ملكية الحقوق وحقوق التوزيع إلى مالكيها ومزوديها الأصليين.',
      },
      {
        h: 'الإشعارات والإزالة',
        p: 'إذا كنت مالك حقوق وتعتقد أن رابطًا معينًا ينتهك حقوقك، أرسل إشعار DMCA يتضمن إثبات الملكية والروابط المتأثرة ووسيلة التواصل. سنراجع الطلب ونزيل الإشارات عند الحاجة.',
      },
    ],
  },
  fr: {
    title: 'Politique DMCA / Droit d’auteur',
    sections: [
      {
        h: 'Rôle de la plateforme',
        p: 'Drama HD est une plateforme de recherche et de découverte de métadonnées et de lecteurs tiers accessibles publiquement. Nous n’hébergeons, ne téléversons ni ne stockons aucun flux vidéo.',
      },
      {
        h: 'Contenu tiers',
        p: 'Tous les lecteurs intégrés et liens proviennent de services externes. Les droits d’auteur et de diffusion appartiennent à leurs propriétaires et fournisseurs respectifs.',
      },
      {
        h: 'Notification et retrait',
        p: 'Si vous êtes titulaire de droits et pensez qu’une référence porte atteinte à vos droits, envoyez une notification DMCA avec preuve de propriété, URL concernées et coordonnées. Nous examinerons et supprimerons les références si nécessaire.',
      },
    ],
  },
};

export default async function DmcaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = copy[(locale as Locale) ?? 'en'] ?? copy.en;

  return (
    <main className="space-y-4 rounded-2xl border border-emerald/20 bg-white/80 p-5 dark:bg-zinc-900/70">
      <h1 className="text-2xl font-bold text-gold">{content.title}</h1>
      {content.sections.map((section) => (
        <section key={section.h} className="space-y-1">
          <h2 className="font-semibold text-emerald">{section.h}</h2>
          <p className="text-sm leading-6">{section.p}</p>
        </section>
      ))}
    </main>
  );
}
