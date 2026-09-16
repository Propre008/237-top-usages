import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacte l'équipe 237 Top Usages — suggestions, partenariats ou questions.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-700 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-surface-900 font-medium">Contact</span>
      </nav>

      <div className="bg-white rounded-2xl border border-surface-200/80 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700" />
        <div className="p-6 sm:p-8 lg:p-10 space-y-6">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
            Contact
          </h1>
          <p className="text-surface-700 leading-relaxed">
            Tu as une question, une suggestion d'article, une correction à proposer
            ou une idée de partenariat ? On est là.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Email Card */}
            <div className="card-hover p-5 rounded-xl border border-surface-200 bg-surface-50 flex items-start gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-100 text-brand-700 text-xl flex-shrink-0">
                ✉️
              </span>
              <div>
                <h3 className="font-display font-bold text-surface-900 text-sm">Email</h3>
                <a
                  className="text-brand-600 hover:text-brand-800 transition-colors text-sm font-medium"
                  href="mailto:contact@237topusages.cm"
                >
                  contact@237topusages.cm
                </a>
                <p className="text-xs text-surface-700 mt-1">Réponse sous 48h max.</p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="card-hover p-5 rounded-xl border border-surface-200 bg-surface-50 flex items-start gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-700 text-xl flex-shrink-0">
                💬
              </span>
              <div>
                <h3 className="font-display font-bold text-surface-900 text-sm">WhatsApp / Telegram</h3>
                <p className="text-sm text-surface-700 font-medium">+237 XX XX XX XX</p>
                <p className="text-xs text-surface-700 mt-1">À remplir avec ton numéro.</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-brand-50 border border-brand-200">
            <p className="text-sm text-brand-800 leading-relaxed">
              💡 <strong>Idée de sujet ?</strong> Envoie-nous simplement un message avec le thème
              que tu aimerais voir couvert. Si c'est pertinent, on le publie dans la semaine !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
