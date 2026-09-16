"use client";

import React, { useState, useMemo } from "react";
import {
  Operator,
  Duration,
  OPERATOR_METADATA,
  filterAndSortPlans,
  calculatePricePerGb,
  formatDataSize,
  DataPlan,
} from "@/lib/data-plans";
import UsageEstimatorModal from "./UsageEstimatorModal";

const BUDGET_PRESETS = [500, 1000, 2000, 5000, 10000, 20000];

export default function DataCalculator() {
  const [budget, setBudget] = useState<number>(2000);
  const [duration, setDuration] = useState<Duration | "all">("all");
  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([
    "mtn",
    "orange",
    "camtel",
  ]);
  const [sortBy, setSortBy] = useState<"best-value" | "max-data" | "price-asc">(
    "best-value"
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState<boolean>(false);

  // Toggle opérateur
  const toggleOperator = (op: Operator) => {
    if (selectedOperators.includes(op)) {
      if (selectedOperators.length > 1) {
        setSelectedOperators(selectedOperators.filter((o) => o !== op));
      }
    } else {
      setSelectedOperators([...selectedOperators, op]);
    }
  };

  // Forfaits filtrés
  const plans = useMemo(() => {
    return filterAndSortPlans({
      maxBudget: budget,
      duration,
      operators: selectedOperators,
      sortBy,
    });
  }, [budget, duration, selectedOperators, sortBy]);

  // Meilleur plan absolu en rapport qualité/prix parmi les résultats
  const bestDeal = useMemo(() => {
    if (plans.length === 0) return null;
    return [...plans].sort((a, b) => {
      const rateA = calculatePricePerGb(a.price, a.dataMb);
      const rateB = calculatePricePerGb(b.price, b.dataMb);
      return rateA - rateB;
    })[0];
  }, [plans]);

  // Copie de code USSD
  const handleCopy = (plan: DataPlan) => {
    navigator.clipboard.writeText(plan.ussdCode);
    setCopiedId(plan.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Partage WhatsApp
  const handleSharePlan = (plan: DataPlan) => {
    const text = `🔥 Bon plan internet Cameroun : Le forfait ${plan.name} (${OPERATOR_METADATA[plan.operator].name}) donne ${formatDataSize(plan.dataMb)} pour ${plan.price.toLocaleString("fr-FR")} FCFA ! Code : ${plan.ussdCode}. Calcule ton forfait ici : ${window.location.origin}/calculateur-forfait-data`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleGeneralShare = () => {
    const text = `🇨🇲 Arrête de gaspiller tes sous avec des forfaits mal dosés ! J'ai comparé MTN, Orange et Camtel sur le Calculateur Forfait Data 237 : ${typeof window !== "undefined" ? window.location.href : ""}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-10">
      {/* ===== PANNEAU DE CONTRÔLE / FILTRES ===== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-surface-200/80 relative overflow-hidden">
        {/* Glow discret */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* CURSEUR DE BUDGET (Col 1-7) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="font-display text-lg sm:text-xl font-bold text-surface-900 flex items-center gap-2">
                  <span>💰</span> Mon budget maximum
                </label>
                <p className="text-xs sm:text-sm text-surface-500">
                  Déplace le curseur ou clique sur un montant rapide
                </p>
              </div>
              <div className="inline-flex items-baseline gap-1 bg-brand-50 border border-brand-200/60 px-4 py-1.5 rounded-2xl w-fit">
                <span className="font-display text-2.5xl sm:text-3xl font-extrabold text-brand-800">
                  {budget.toLocaleString("fr-FR")}
                </span>
                <span className="text-sm font-bold text-brand-700">FCFA</span>
              </div>
            </div>

            {/* Slider */}
            <div className="pt-2">
              <input
                type="range"
                min={100}
                max={25000}
                step={100}
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full h-3 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none"
              />
              <div className="flex justify-between text-2xs sm:text-xs text-surface-400 mt-2 font-mono">
                <span>100 F</span>
                <span>5 000 F</span>
                <span>10 000 F</span>
                <span>25 000 F</span>
              </div>
            </div>

            {/* Boutons de montants rapides */}
            <div className="flex flex-wrap gap-2 pt-1">
              {BUDGET_PRESETS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBudget(amount)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    budget === amount
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/20 scale-105"
                      : "bg-surface-100 text-surface-700 hover:bg-surface-200"
                  }`}
                >
                  {amount >= 1000 ? `${amount / 1000}k F` : `${amount} F`}
                </button>
              ))}
            </div>

            {/* Bouton Mini-Quiz estimateur */}
            <div className="pt-3 border-t border-surface-100 flex items-center justify-between">
              <span className="text-xs text-surface-500">
                Tu ne sais pas combien de Go il te faut ?
              </span>
              <button
                onClick={() => setIsEstimatorOpen(true)}
                className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 underline underline-offset-4 flex items-center gap-1.5"
              >
                <span>⚡</span> Estimer ma consommation
              </button>
            </div>
          </div>

          {/* FILTRES COMPLÉMENTAIRES (Col 8-12) */}
          <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-surface-200/80 lg:pl-8">
            {/* Opérateurs */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2.5 block">
                Opérateurs à inclure
              </label>
              <div className="flex flex-wrap gap-2">
                {(["mtn", "orange", "camtel"] as Operator[]).map((op) => {
                  const meta = OPERATOR_METADATA[op];
                  const active = selectedOperators.includes(op);
                  return (
                    <button
                      key={op}
                      onClick={() => toggleOperator(op)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        active
                          ? `${meta.bgColor} ${meta.borderColor} ${meta.textColor} shadow-sm ring-2 ring-brand-500/20`
                          : "bg-surface-100 border-surface-200 text-surface-400 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span>{meta.logoEmoji}</span>
                      <span>{meta.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Durée de validité */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2.5 block">
                Durée de validité
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {[
                  { key: "all", label: "Tous" },
                  { key: "day", label: "24h" },
                  { key: "week", label: "7 Jours" },
                  { key: "month", label: "30 Jours" },
                  { key: "night", label: "Nuit" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setDuration(item.key as Duration | "all")}
                    className={`py-1.5 px-2 rounded-xl text-center text-xs font-semibold transition-all ${
                      duration === item.key
                        ? "bg-surface-900 text-white shadow-sm"
                        : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tri */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2.5 block">
                Trier les résultats
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "best-value" | "max-data" | "price-asc"
                  )
                }
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="best-value">
                  ⭐ Meilleur rapport Go / Prix (FCFA/Go)
                </option>
                <option value="max-data">🚀 Volume maximal de Gigas</option>
                <option value="price-asc">💵 Prix croissant (moins cher)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BANNIÈRE "LE MEILLEUR DEAL" EN TEMPS RÉEL ===== */}
      {bestDeal && (
        <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-brand-900 via-surface-900 to-brand-950 text-white shadow-2xl border border-brand-400/30 overflow-hidden">
          {/* Background decor */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <span>🏆</span> Le Meilleur Deal pour {budget.toLocaleString("fr-FR")} F
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                <span>{bestDeal.name}</span>
                <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-white/10 border border-white/20">
                  {OPERATOR_METADATA[bestDeal.operator].name}
                </span>
              </h3>
              <p className="text-surface-300 text-sm max-w-xl">
                {bestDeal.notes || "Le coût au Go le plus bas trouvé pour ton budget actuel."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-accent-400">
                  {formatDataSize(bestDeal.dataMb)}
                </div>
                <div className="text-xs text-surface-300">
                  soit{" "}
                  <b className="text-white">
                    {calculatePricePerGb(bestDeal.price, bestDeal.dataMb)} F
                  </b>{" "}
                  / Go
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(bestDeal)}
                  className="px-4 py-2.5 bg-accent-400 hover:bg-accent-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>{copiedId === bestDeal.id ? "✓ Copié !" : "📋 " + bestDeal.ussdCode}</span>
                </button>
                <a
                  href={`tel:${bestDeal.ussdCode.replace("#", "%23")}`}
                  className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm border border-white/20 transition-colors"
                  title="Appeler directement"
                >
                  📞
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== LISTE DES RÉSULTATS COMPARATIFS ===== */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-surface-900">
              Forfaits trouvés ({plans.length})
            </h2>
            <p className="text-xs sm:text-sm text-surface-500">
              Classés selon ton critère : {sortBy === "best-value" ? "meilleur rapport Go/prix" : sortBy === "max-data" ? "volume de data" : "prix croissant"}
            </p>
          </div>
          <span className="text-xs font-mono bg-surface-100 text-surface-600 px-3 py-1.5 rounded-lg border border-surface-200">
            Max : {budget.toLocaleString("fr-FR")} FCFA
          </span>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-surface-200 space-y-4">
            <span className="text-5xl">🧐</span>
            <h3 className="font-display text-xl font-bold text-surface-900">
              Aucun forfait trouvé sous {budget.toLocaleString("fr-FR")} FCFA avec ces filtres
            </h3>
            <p className="text-surface-600 text-sm max-w-md mx-auto">
              Augmente légèrement ton budget avec le curseur ou change la durée sélectionnée (ex: passe sur &quot;Tous&quot;).
            </p>
            <button
              onClick={() => {
                setBudget(2000);
                setDuration("all");
                setSelectedOperators(["mtn", "orange", "camtel"]);
              }}
              className="inline-flex px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 transition-colors"
            >
              🔄 Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const meta = OPERATOR_METADATA[plan.operator];
              const pricePerGb = calculatePricePerGb(plan.price, plan.dataMb);
              const isFirst = index === 0;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group ${
                    isFirst
                      ? "border-brand-500 shadow-md ring-2 ring-brand-500/10"
                      : "border-surface-200/80 shadow-sm"
                  }`}
                >
                  {/* Top Bar Card */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{meta.logoEmoji}</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-surface-500">
                          {meta.name}
                        </span>
                      </div>

                      {/* Validité */}
                      <span className="text-2xs font-semibold px-2.5 py-1 rounded-full bg-surface-100 text-surface-700">
                        {plan.duration === "day"
                          ? "24 Heures"
                          : plan.duration === "week"
                          ? `${plan.validityDays} Jours`
                          : plan.duration === "night"
                          ? "Nuit (00h-06h)"
                          : "30 Jours"}
                      </span>
                    </div>

                    {/* Nom & Volume */}
                    <div className="mb-4">
                      <h3 className="font-display text-lg font-bold text-surface-900 group-hover:text-brand-700 transition-colors">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-display text-3.5xl sm:text-4xl font-extrabold text-surface-900">
                          {formatDataSize(plan.dataMb)}
                        </span>
                        <span className="text-xs text-surface-400 font-medium">
                          pour {plan.price.toLocaleString("fr-FR")} F
                        </span>
                      </div>
                    </div>

                    {/* Ratio FCFA / Go */}
                    <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-100 mb-4 flex items-center justify-between text-xs">
                      <span className="text-surface-500">Coût unitaire :</span>
                      <span className="font-bold text-surface-800">
                        <span className="text-brand-700 font-extrabold">
                          {pricePerGb} FCFA
                        </span>{" "}
                        / Go
                      </span>
                    </div>

                    {/* Notes / Avantages */}
                    {plan.notes && (
                      <p className="text-xs text-surface-600 line-clamp-2 mb-4 leading-relaxed">
                        {plan.notes}
                      </p>
                    )}
                  </div>

                  {/* Boutons d'actions */}
                  <div className="pt-4 border-t border-surface-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(plan)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          copiedId === plan.id
                            ? "bg-brand-600 text-white"
                            : "bg-surface-100 hover:bg-surface-200 text-surface-800"
                        }`}
                        title="Copier le code USSD"
                      >
                        <span>{copiedId === plan.id ? "✓ Copié !" : "📋 " + plan.ussdCode}</span>
                      </button>

                      {/* Appel direct sur smartphone */}
                      <a
                        href={`tel:${plan.ussdCode.replace("#", "%23")}`}
                        className="p-2.5 bg-surface-100 hover:bg-brand-50 hover:text-brand-700 text-surface-700 rounded-xl text-xs transition-colors border border-surface-200"
                        title="Lancer le code USSD sur mon téléphone"
                      >
                        📞
                      </a>

                      {/* Partage WhatsApp du plan */}
                      <button
                        onClick={() => handleSharePlan(plan)}
                        className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs transition-colors border border-emerald-200"
                        title="Partager cette offre sur WhatsApp"
                      >
                        💬
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== SECTION VIRALE : PARTAGE WHATSAPP DU COMPARATEUR ===== */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
            <span>📢</span> Astuce 100% Gratuite
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold">
            Fais économiser de l&apos;argent à tes contacts !
          </h3>
          <p className="text-emerald-100 text-sm leading-relaxed">
            La plupart des gens au Cameroun souscrivent de mauvais forfaits par habitude. Partage cet outil dans tes groupes WhatsApp pour les aider.
          </p>
        </div>

        <button
          onClick={handleGeneralShare}
          className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-sm sm:text-base flex items-center gap-2.5 whitespace-nowrap"
        >
          <span>📲</span> Partager sur WhatsApp
        </button>
      </div>

      {/* Modal d'estimation de données */}
      <UsageEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        onApplyEstimate={(gb, recBudget) => {
          setBudget(recBudget);
          setDuration("month");
        }}
      />
    </div>
  );
}
