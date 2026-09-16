"use client";

import React, { useState } from "react";

interface UsageEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEstimate: (estimatedGb: number, recommendedBudget: number) => void;
}

export default function UsageEstimatorModal({
  isOpen,
  onClose,
  onApplyEstimate,
}: UsageEstimatorModalProps) {
  // Heures passées par jour
  const [socialHours, setSocialHours] = useState(2); // WhatsApp, Facebook, X (~150 Mo/h)
  const [videoHours, setVideoHours] = useState(1); // TikTok, Reels, YouTube (~500 Mo/h)
  const [workHours, setWorkHours] = useState(1); // Visios, e-mails, recherche (~300 Mo/h)
  const [downloadGbPerMonth, setDownloadGbPerMonth] = useState(2); // Mises à jour, jeux, docs

  if (!isOpen) return null;

  // Calcul mensuel (30 jours)
  const monthlyMb =
    (socialHours * 150 + videoHours * 500 + workHours * 300) * 30 +
    downloadGbPerMonth * 1024;
  const estimatedGb = Math.max(1, Math.round(monthlyMb / 1024));

  // Estimation du budget mensuel recommandé au Cameroun
  let recommendedBudget = 2000;
  if (estimatedGb <= 4) recommendedBudget = 2000;
  else if (estimatedGb <= 16) recommendedBudget = 5000;
  else if (estimatedGb <= 40) recommendedBudget = 10000;
  else recommendedBudget = 20000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-200 relative overflow-hidden">
        {/* Glow header */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-100 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h3 className="font-display text-xl font-bold text-surface-900">
              Estimer ma consommation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-surface-600 mt-3 mb-6">
          Ajuste tes habitudes quotidiennes pour savoir exactement de combien de Gigas tu as besoin chaque mois au Cameroun.
        </p>

        <div className="space-y-5">
          {/* Sliders */}
          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span className="text-surface-800 flex items-center gap-1.5">
                💬 WhatsApp & Réseaux sociaux
              </span>
              <span className="text-brand-700 font-bold">{socialHours}h / jour</span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={0.5}
              value={socialHours}
              onChange={(e) => setSocialHours(parseFloat(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-surface-200 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span className="text-surface-800 flex items-center gap-1.5">
                🎬 TikTok, Reels & YouTube
              </span>
              <span className="text-brand-700 font-bold">{videoHours}h / jour</span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={0.5}
              value={videoHours}
              onChange={(e) => setVideoHours(parseFloat(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-surface-200 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span className="text-surface-800 flex items-center gap-1.5">
                💼 Télétravail & Réunions (Zoom/Meet)
              </span>
              <span className="text-brand-700 font-bold">{workHours}h / jour</span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={0.5}
              value={workHours}
              onChange={(e) => setWorkHours(parseFloat(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-surface-200 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span className="text-surface-800 flex items-center gap-1.5">
                📥 Mises à jour & Téléchargements
              </span>
              <span className="text-brand-700 font-bold">~{downloadGbPerMonth} Go / mois</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={downloadGbPerMonth}
              onChange={(e) => setDownloadGbPerMonth(parseInt(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-surface-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Résultat de l'estimation */}
        <div className="mt-6 p-4 rounded-2xl bg-brand-50/80 border border-brand-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-800">
              Besoin mensuel estimé
            </span>
            <div className="text-3xl font-display font-extrabold text-brand-900">
              ~{estimatedGb} Go <span className="text-sm font-normal text-surface-600">/ mois</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-surface-500 block">Budget conseillé</span>
            <span className="text-base font-bold text-surface-800">
              ~{recommendedBudget.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onApplyEstimate(estimatedGb, recommendedBudget);
              onClose();
            }}
            className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-600/30 transition-all text-center text-sm"
          >
            🎯 Voir les forfaits adaptés ({recommendedBudget.toLocaleString("fr-FR")} F)
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 bg-surface-100 hover:bg-surface-200 text-surface-700 font-medium rounded-xl transition-colors text-sm"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
