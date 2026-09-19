import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description: "Qui se cache derrière 237 Top Usages — notre mission et notre approche.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-700 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-surface-900 font-medium">À propos</span>
      </nav>

      <div className="bg-white rounded-2xl border border-surface-200/80 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700" />
        <div className="p-6 sm:p-8 lg:p-10 space-y-6">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
            À propos de 237 Top Usages
          </h1>

          <div className="prose-custom">
            <p>
              <strong>237 Top Usages</strong> est un projet indépendant né d'un constat
              simple : au Cameroun, l'information sur les usages réels du numérique,
              de l'énergie et du business en ligne est souvent fragmentée, difficile
              à trouver, ou déconnectée du terrain.
            </p>
            <p>
              Notre mission ? Décrypter ce que les Camerounais utilisent vraiment —
              à Douala, Yaoundé, Bafoussam et partout ailleurs. Pas de théorie
              abstraite, pas de copier-coller Wikipédia. Juste du concret, du vécu,
              des solutions applicables.
            </p>

            <h2>Ce qu'on couvre</h2>
            <ul>
              <li><strong>Internet & télécoms</strong> — MTN, Orange, Camtel, Starlink, connexion, data…</li>
              <li><strong>Énergie</strong> — délestages, solutions, générateurs, solaire…</li>
              <li><strong>Business en ligne</strong> — apps, paiement mobile, freelancing, vente…</li>
              <li><strong>Tendances</strong> — tech, foot, musique, réseaux sociaux…</li>
            </ul>

            <h2>Notre approche</h2>
            <p>
              Notre rédaction s'appuie sur une veille quotidienne rigoureuse et des enquêtes
              de terrain menées par des rédacteurs, développeurs et observateurs passionnés
              du quotidien camerounais. Chaque article, chaque comparatif et chaque dossier
              est pensé pour apporter une valeur concrète, vérifiable et immédiatement utile
              aux citoyens, entrepreneurs et professionnels du 237.
            </p>
            <p>
              Si tu as des idées de sujets, des corrections à proposer ou envie de
              contribuer, n'hésite pas à nous{" "}
              <a href="/contact">contacter</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
