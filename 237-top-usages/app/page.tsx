import ArticleList from "@/components/ArticleList";
import { getSortedPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const allPosts = getSortedPosts();
  // On affiche les 6 derniers articles
  const latestPosts = allPosts.slice(0, 6);
  // Articles à la une (les 3 premiers pour l'instant)
  const featuredPosts = allPosts.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-gradient text-white mx-4 sm:mx-6 lg:mx-8 mt-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mask-image:linear-gradient(to_bottom,white,transparent)" />
        
        <div className="relative z-10 px-6 py-16 md:px-12 md:py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="max-w-3xl space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md border border-white/20 w-fit shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
              100% Gratuit, 100% Terrain
            </div>
            <h1 className="font-display text-4.5xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Ce que les Camerounais utilisent{" "}
              <span className="text-accent-400 relative inline-block whitespace-nowrap">
                vraiment
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent-500 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
              </span>
            </h1>
            <p className="text-lg text-brand-50 leading-relaxed max-w-xl md:text-xl font-medium opacity-90">
              Internet, énergie, business en ligne : des tops, des solutions et
              des tendances expliqués simplement, depuis Douala et Yaoundé.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/calculateur-forfait-data"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent-400 hover:bg-accent-300 text-slate-950 font-extrabold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-sm md:text-base ring-4 ring-accent-400/25"
              >
                ⚡ Calculateur Forfait Data
              </Link>
              <Link
                href="/categorie/top-usages"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-brand-900 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-brand-50 transition-all duration-300 text-sm md:text-base ring-4 ring-white/10"
              >
                🏆 Découvrir les tops
              </Link>
              <Link
                href="/categorie/problemes-solutions"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-800/40 text-white font-bold rounded-xl border border-white/20 hover:bg-brand-800/60 transition-all duration-300 text-sm md:text-base backdrop-blur-md hover:-translate-y-1"
              >
                🔧 Solutions
              </Link>
            </div>
          </div>
          
          <div className="flex-1 hidden lg:block relative w-full max-w-md">
            {/* SVG Illustration : Tech, Énergie, Business */}
            <div className="relative w-full aspect-square group">
              <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 transform rotate-6 scale-105 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/30 to-white/10 rounded-3xl backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl p-8 transform -rotate-3 transition-transform duration-500 group-hover:rotate-0">
                 <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background elements */}
                    <circle cx="100" cy="100" r="70" fill="url(#grad1)" opacity="0.2"/>
                    {/* Smartphone shape */}
                    <rect x="65" y="25" width="70" height="150" rx="12" fill="rgba(255,255,255,0.1)" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Screen content - signals & chart */}
                    <path d="M80 60H120" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M80 80H100" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="100" cy="155" r="4" fill="currentColor"/>
                    {/* Lightning bolt for energy */}
                    <path d="M110 90L95 120H115L105 150" stroke="#facc15" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="#facc15" fillOpacity="0.2"/>
                    {/* Signal arcs */}
                    <path d="M145 40C160 55 160 80 145 95" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M160 25C180 45 180 85 160 105" stroke="#86efac" strokeWidth="5" strokeLinecap="round"/>
                    
                    <defs>
                      <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
                      </radialGradient>
                    </defs>
                 </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION OUTIL INTERACTIF (NOUVEAU) ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-brand-900 via-surface-900 to-slate-900 text-white shadow-2xl border border-brand-500/30 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400 text-slate-950 text-xs font-extrabold tracking-wider uppercase shadow-sm">
              <span>🚀</span> NOUVEAU MICRO-OUTIL 237
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold leading-tight">
              Combien de Gigas pour ton budget ?
            </h2>
            <p className="text-surface-300 text-sm sm:text-base leading-relaxed">
              Compare instantanément les forfaits <strong>MTN, Orange et Camtel Blue</strong>. Découvre le coût réel par Go et copie le code USSD direct en 1 clic.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/calculateur-forfait-data"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-extrabold rounded-xl shadow-lg hover:shadow-brand-500/25 transition-all text-sm sm:text-base"
              >
                <span>⚡</span> Lancer le comparateur gratuit
              </Link>
              <span className="text-xs text-surface-400">100% gratuit · Sans inscription</span>
            </div>
          </div>

          <div className="flex-1 w-full lg:max-w-xs bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs text-surface-300 font-medium">Exemple pour 2 000 FCFA</span>
              <span className="text-xs font-extrabold text-accent-400">Jusqu&apos;à 12 Go</span>
            </div>
            <div className="space-y-2.5 text-xs text-surface-200">
              <div className="flex justify-between items-center">
                <span>🔵 Camtel Blue :</span>
                <b className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">12 Go (7j)</b>
              </div>
              <div className="flex justify-between items-center">
                <span>🟠 Orange :</span>
                <b className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">7.5 Go (7j)</b>
              </div>
              <div className="flex justify-between items-center">
                <span>🟡 MTN :</span>
                <b className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">7 Go (7j)</b>
              </div>
            </div>
            <Link
              href="/calculateur-forfait-data"
              className="block text-center text-xs font-bold text-brand-300 hover:text-white pt-2 border-t border-white/10 transition-colors"
            >
              Tester avec mon budget →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PARCOURIR PAR RUBRIQUE ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-surface-900 mb-8">
          Parcourir par rubrique
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <Link
            href="/categorie/top-usages"
            className="card-hover bg-white rounded-[1.5rem] p-6 border border-surface-200/80 flex flex-col gap-3 group relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-50 rounded-full transition-transform duration-500 group-hover:scale-[2] opacity-50" />
            <span className="text-4xl relative z-10 transform transition-transform group-hover:-translate-y-1">🏆</span>
            <div className="relative z-10 mt-2">
              <h3 className="font-display text-xl font-bold text-surface-900 group-hover:text-brand-700 transition-colors">
                Top Usages
              </h3>
              <p className="text-sm text-surface-600 mt-2 font-medium">
                Les apps, services et plateformes les plus utilisés au Cameroun.
              </p>
            </div>
          </Link>

          <Link
            href="/categorie/problemes-solutions"
            className="card-hover bg-white rounded-[1.5rem] p-6 border border-surface-200/80 flex flex-col gap-3 group relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-50 rounded-full transition-transform duration-500 group-hover:scale-[2] opacity-50" />
            <span className="text-4xl relative z-10 transform transition-transform group-hover:-translate-y-1">🔧</span>
            <div className="relative z-10 mt-2">
              <h3 className="font-display text-xl font-bold text-surface-900 group-hover:text-amber-600 transition-colors">
                Problèmes & Solutions
              </h3>
              <p className="text-sm text-surface-600 mt-2 font-medium">
                Délestages, Internet instable, business : comment s’organiser.
              </p>
            </div>
          </Link>

          <Link
            href="/categorie/tendances"
            className="card-hover bg-white rounded-[1.5rem] p-6 border border-surface-200/80 flex flex-col gap-3 group relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-sky-50 rounded-full transition-transform duration-500 group-hover:scale-[2] opacity-50" />
            <span className="text-4xl relative z-10 transform transition-transform group-hover:-translate-y-1">📈</span>
            <div className="relative z-10 mt-2">
              <h3 className="font-display text-xl font-bold text-surface-900 group-hover:text-sky-600 transition-colors">
                Tendances
              </h3>
              <p className="text-sm text-surface-600 mt-2 font-medium">
                Ce qui buzz cette semaine : tech, business, réseaux sociaux.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== À LA UNE ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">
              🔥 À la une cette semaine
            </h2>
            <p className="text-surface-600 mt-1 font-medium">Nos guides et tops les plus populaires</p>
          </div>
          <Link
            href="/categorie/top-usages"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 hover:underline bg-brand-50 px-4 py-2 rounded-lg transition-colors"
          >
            Voir tout <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <ArticleList posts={featuredPosts} />
      </section>

      {/* ===== DERNIERS ARTICLES ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-surface-900">
              Derniers articles
            </h2>
          </div>
        </div>
        <ArticleList posts={latestPosts} />
      </section>

      {/* ===== À PROPOS / PROMESSE ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-surface-200 bg-white p-8 md:p-12 shadow-sm relative overflow-hidden">
          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-50 rounded-full blur-[80px] -mr-40 -mt-40 opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-50 rounded-full blur-[80px] -ml-40 -mb-40 opacity-60 pointer-events-none" />
          
          <div className="grid gap-8 md:grid-cols-3 relative z-10 items-center">
            <div className="md:col-span-2 space-y-5">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-surface-900">
                237 Top Usages, c’est quoi ?
              </h3>
              <p className="text-lg text-surface-700 leading-relaxed font-medium">
                Un projet indépendant qui décrypte les usages réels du numérique,
                de l’énergie et du business au Cameroun.
              </p>
              <p className="text-surface-600 leading-relaxed">
                On teste, on compare et on explique ce qui marche vraiment pour
                les entrepreneurs, freelances et curieux du web, avec des exemples
                concrets de Douala, Yaoundé et d’ailleurs. Pas de blabla, que du terrain.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                href="/a-propos"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-900 px-7 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-700 hover:-translate-y-1 transition-all duration-300 ring-4 ring-transparent hover:ring-brand-100"
              >
                Découvrir notre mission
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
