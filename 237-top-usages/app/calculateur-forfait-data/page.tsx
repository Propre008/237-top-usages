import type { Metadata } from "next";
import Link from "next/link";
import DataCalculator from "@/components/tools/DataCalculator";

export const metadata: Metadata = {
  title: "Calculateur de Forfait Data Cameroun 2026 — MTN, Orange, Camtel Blue",
  description:
    "Trouve instantanément le forfait internet qui donne le plus de Go pour ton budget (100 F à 25 000 F). Comparateur en temps réel MTN vs Orange vs Camtel avec codes USSD directs.",
  keywords: [
    "forfait internet cameroun",
    "meilleur forfait mtn camtel orange",
    "calculateur forfait data cameroun",
    "mtn maxi net",
    "orange kif data",
    "camtel blue forfait",
    "code ussd internet cameroun",
    "prix giga cameroun",
  ],
  openGraph: {
    title: "Calculateur de Forfait Data Cameroun 2026 — MTN, Orange, Camtel",
    description:
      "Quel opérateur te donne le plus de Go pour ton budget ? Calcule le coût par Go et copie les codes USSD en un clic.",
    url: "https://237topusages.cm/calculateur-forfait-data",
    type: "website",
  },
};

export default function DataCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Calculateur de Forfait Data Cameroun",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "All",
        "description":
          "Outil gratuit de comparaison en temps réel des forfaits internet au Cameroun (MTN, Orange, Camtel Blue).",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "XAF",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Quel opérateur offre le plus de gigas pour son argent au Cameroun ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "CAMTEL (Blue) offre généralement le ratio volume/prix le plus élevé (jusqu'à 35 Go pour 5 000 FCFA ou 10 Go pour 500 FCFA la nuit), mais sa couverture 4G est surtout concentrée dans les grandes villes comme Douala et Yaoundé. MTN et Orange offrent un équilibre idéal entre volume et couverture réseau nationale.",
            },
          },
          {
            "@type": "Question",
            "name": "Quels sont les codes USSD principaux pour souscrire ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Pour MTN Cameroun, composez le *123# (ou *123*11# pour les pass jour). Pour Orange Cameroun, composez le *145# ou le *148# (Orange Kif). Pour CAMTEL Blue, composez le *825#.",
            },
          },
          {
            "@type": "Question",
            "name": "Comment éviter que sa connexion data ne parte trop vite ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Désactivez la lecture automatique des vidéos sur TikTok, Instagram et Facebook. Activez le mode économiseur de données dans les paramètres Android et coupez les mises à jour automatiques du Play Store en données mobiles.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-surface-500 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-700 transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <span className="text-surface-900 font-semibold">
          Calculateur de Forfait Data
        </span>
      </nav>

      {/* HERO SECTION DE L'OUTIL */}
      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand-100/70 text-brand-900 border border-brand-200/80 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
          ⚡ Outil 100% Gratuit & Sans Inscription
        </div>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-5.5xl font-extrabold text-surface-900 leading-[1.15] tracking-tight">
          Calculateur de Forfait Data{" "}
          <span className="text-brand-600 underline decoration-accent-400 decoration-wavy decoration-2">
            Cameroun
          </span>
        </h1>
        <p className="text-surface-600 text-sm sm:text-base md:text-lg leading-relaxed">
          Choisis ton budget et compare en temps réel les offres de{" "}
          <strong className="text-surface-900">MTN, Orange et Camtel Blue</strong>.
          Découvre qui te donne le plus de Gigas par franc dépensé.
        </p>
      </header>

      {/* L'OUTIL INTERACTIF */}
      <DataCalculator />

      {/* GUIDE PRATIQUE & FAQ */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-surface-200 shadow-sm space-y-8 mt-12">
        <div className="border-b border-surface-100 pb-4">
          <h2 className="font-display text-2xl font-bold text-surface-900 flex items-center gap-2">
            <span>💡</span> Guide & Questions Fréquentes sur la Data au Cameroun
          </h2>
          <p className="text-sm text-surface-500 mt-1">
            Tout ce qu&apos;il faut savoir pour optimiser sa consommation internet au 237.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-surface-900 flex items-center gap-2">
              <span>🏆</span> Quel opérateur a le meilleur rapport Go / Prix ?
            </h3>
            <p className="text-sm text-surface-600 leading-relaxed">
              En terme de volume brut, <strong>CAMTEL (Blue)</strong> écrase souvent la concurrence avec des offres comme <strong>35 Go pour 5 000 FCFA</strong> (contre environ 14 à 15 Go chez MTN et Orange pour le même prix). Cependant, la couverture 4G de Camtel est principalement limitée aux grandes zones urbaines (Douala, Yaoundé, Bafoussam). Pour une mobilité totale partout au Cameroun, <strong>Orange et MTN</strong> restent les plus fiables.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-surface-900 flex items-center gap-2">
              <span>🌙</span> Les forfaits de nuit : bonne ou mauvaise idée ?
            </h3>
            <p className="text-sm text-surface-600 leading-relaxed">
              C&apos;est le secret le mieux gardé des gros consommateurs et des développeurs : pour <strong>200 à 500 FCFA</strong>, vous pouvez obtenir entre <strong>2 Go et 10 Go</strong> valables entre 00h et 06h du matin. Si vous devez mettre à jour des applications, télécharger des vidéos de formation ou faire des sauvegardes, planifiez-les la nuit !
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-surface-900 flex items-center gap-2">
              <span>📉</span> Pourquoi ma data disparaît-elle si vite ?
            </h3>
            <p className="text-sm text-surface-600 leading-relaxed">
              Sur les smartphones récents, trois coupables vident le forfait sans prévenir : la lecture automatique des vidéos en haute définition sur <strong>TikTok / Reels</strong>, les sauvegardes automatiques de photos <strong>Google Photos</strong> et les mises à jour automatiques des applications en arrière-plan via le <strong>Google Play Store</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-surface-900 flex items-center gap-2">
              <span>📶</span> Comment souscrire sans taper le code à chaque fois ?
            </h3>
            <p className="text-sm text-surface-600 leading-relaxed">
              Tu peux utiliser les applications mobiles officielles des opérateurs : <strong>My Orange Cameroun</strong>, <strong>MTN MoMo / Ayoba</strong>, ou <strong>Blue App</strong> de Camtel. Mais si ta connexion est lente ou coupée, les <strong>codes USSD directs</strong> affichés sur notre outil restent le moyen le plus infaillible.
            </p>
          </div>
        </div>
      </section>

      {/* LIENS CONNEXES DU BLOG */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors"
        >
          ← Retourner à l&apos;accueil du blog
        </Link>
      </div>
    </div>
  );
}
