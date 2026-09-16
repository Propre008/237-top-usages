import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600 text-white font-display font-bold text-xs">
                237
              </span>
              <span className="font-display font-bold text-surface-900">
                Top Usages
              </span>
            </div>
            <p className="text-sm text-surface-700 leading-relaxed">
              Ce que les Camerounais utilisent vraiment. Décryptages, tops et
              solutions concrètes.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-surface-900 text-sm uppercase tracking-wider">
              Rubriques
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categorie/top-usages" className="text-surface-700 hover:text-brand-600 transition-colors">
                  Top Usages
                </Link>
              </li>
              <li>
                <Link href="/categorie/problemes-solutions" className="text-surface-700 hover:text-brand-600 transition-colors">
                  Problèmes & Solutions
                </Link>
              </li>
              <li>
                <Link href="/categorie/tendances" className="text-surface-700 hover:text-brand-600 transition-colors">
                  Tendances
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-surface-900 text-sm uppercase tracking-wider">
              Infos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/a-propos" className="text-surface-700 hover:text-brand-600 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-surface-700 hover:text-brand-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-surface-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-surface-700">
          <p>© {new Date().getFullYear()} 237 Top Usages — Projet indépendant.</p>
          <p>Fait avec ❤️ au Cameroun</p>
        </div>
      </div>
    </footer>
  );
}
