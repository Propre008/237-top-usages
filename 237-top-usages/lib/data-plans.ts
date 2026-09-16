export type Operator = "mtn" | "orange" | "camtel";
export type Duration = "day" | "week" | "month" | "night";

export interface DataPlan {
  id: string;
  name: string;
  operator: Operator;
  price: number; // en FCFA
  dataMb: number; // volume en Mo pour faciliter les calculs
  duration: Duration;
  validityDays: number;
  ussdCode: string;
  isPopular?: boolean;
  bestValue?: boolean;
  notes?: string;
}

export const OPERATOR_METADATA: Record<
  Operator,
  {
    name: string;
    brandColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    badgeBg: string;
    logoEmoji: string;
    ussdRoot: string;
    rechargeApp: string;
  }
> = {
  mtn: {
    name: "MTN Cameroon",
    brandColor: "#ffcc00",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-400/40",
    textColor: "text-amber-800",
    badgeBg: "bg-amber-400 text-slate-900",
    logoEmoji: "🟡",
    ussdRoot: "*123#",
    rechargeApp: "MTN MoMo / Ayoba",
  },
  orange: {
    name: "Orange Cameroun",
    brandColor: "#ff7900",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-400/40",
    textColor: "text-orange-800",
    badgeBg: "bg-orange-500 text-white",
    logoEmoji: "🟠",
    ussdRoot: "*145#",
    rechargeApp: "Orange Money / Max It",
  },
  camtel: {
    name: "CAMTEL (Blue)",
    brandColor: "#0072bc",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-400/40",
    textColor: "text-blue-800",
    badgeBg: "bg-blue-600 text-white",
    logoEmoji: "🔵",
    ussdRoot: "*825#",
    rechargeApp: "Blue App / Camtel Agence",
  },
};

export const DATA_PLANS: DataPlan[] = [
  // --- MTN CAMEROON ---
  // Pass Jour
  {
    id: "mtn-day-100",
    name: "Pass Maxi 100",
    operator: "mtn",
    price: 100,
    dataMb: 100,
    duration: "day",
    validityDays: 1,
    ussdCode: "*123*11#",
    notes: "Dépannage rapide WhatsApp / urgence",
  },
  {
    id: "mtn-day-250",
    name: "Pass Maxi 250",
    operator: "mtn",
    price: 250,
    dataMb: 400,
    duration: "day",
    validityDays: 1,
    ussdCode: "*123*11#",
    notes: "Idéal pour une journée de recherche et réseaux sociaux",
  },
  {
    id: "mtn-day-500",
    name: "Pass Maxi 500",
    operator: "mtn",
    price: 500,
    dataMb: 1536, // 1.5 Go
    duration: "day",
    validityDays: 1,
    ussdCode: "*123*11#",
    isPopular: true,
    notes: "1.5 Go valable 24h, l'un des plus souscrits de MTN",
  },
  {
    id: "mtn-day-1000",
    name: "Pass Maxi 1000 24H",
    operator: "mtn",
    price: 1000,
    dataMb: 3584, // 3.5 Go
    duration: "day",
    validityDays: 1,
    ussdCode: "*123*11#",
    notes: "Pour télétravail ponctuel ou gros téléchargement d'un jour",
  },

  // Pass Semaine
  {
    id: "mtn-week-1000",
    name: "Pass Semaine 1000",
    operator: "mtn",
    price: 1000,
    dataMb: 2560, // 2.5 Go
    duration: "week",
    validityDays: 7,
    ussdCode: "*123*12#",
    isPopular: true,
    notes: "Le classique des étudiants et jeunes pros pour la semaine",
  },
  {
    id: "mtn-week-2000",
    name: "Pass Semaine 2000",
    operator: "mtn",
    price: 2000,
    dataMb: 7168, // 7 Go
    duration: "week",
    validityDays: 7,
    ussdCode: "*123*12#",
    bestValue: true,
    notes: "7 Go pour 7 jours, excellent compromis pour créateurs de contenu",
  },
  {
    id: "mtn-week-3000",
    name: "Pass Semaine 3000",
    operator: "mtn",
    price: 3000,
    dataMb: 12288, // 12 Go
    duration: "week",
    validityDays: 7,
    ussdCode: "*123*12#",
    notes: "Confort total pour 1 semaine de réunions vidéo et streaming",
  },

  // Pass Mois
  {
    id: "mtn-month-2000",
    name: "Pass Mensuel 2000",
    operator: "mtn",
    price: 2000,
    dataMb: 3584, // 3.5 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*123*13#",
    notes: "Petit budget pour garder la connexion 30 jours sans coupure",
  },
  {
    id: "mtn-month-5000",
    name: "Pass Mensuel 5000",
    operator: "mtn",
    price: 5000,
    dataMb: 14336, // 14 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*123*13#",
    isPopular: true,
    bestValue: true,
    notes: "Le forfait référence au Cameroun pour usage smartphone quotidien",
  },
  {
    id: "mtn-month-10000",
    name: "Pass Mensuel 10000",
    operator: "mtn",
    price: 10000,
    dataMb: 35840, // 35 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*123*13#",
    notes: "35 Go pour freelances et familles avec partage modem",
  },
  {
    id: "mtn-month-20000",
    name: "Pass Mensuel 20000",
    operator: "mtn",
    price: 20000,
    dataMb: 81920, // 80 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*123*13#",
    notes: "Gros volume pour bureau ou PME connectée en 4G",
  },

  // Pass Nuit
  {
    id: "mtn-night-200",
    name: "Pass Nuit MTN",
    operator: "mtn",
    price: 200,
    dataMb: 2048, // 2 Go
    duration: "night",
    validityDays: 1,
    ussdCode: "*123*11#",
    notes: "Valable de 00h à 06h du matin, parfait pour mises à jour lourdes",
  },

  // --- ORANGE CAMEROUN ---
  // Pass Jour
  {
    id: "ora-day-100",
    name: "Orange Pass 100",
    operator: "orange",
    price: 100,
    dataMb: 120,
    duration: "day",
    validityDays: 1,
    ussdCode: "*145#",
    notes: "Usage messagerie rapide",
  },
  {
    id: "ora-day-250",
    name: "Orange Pass 250",
    operator: "orange",
    price: 250,
    dataMb: 450,
    duration: "day",
    validityDays: 1,
    ussdCode: "*145#",
    notes: "450 Mo pour 24h, très stable sur Douala/Yaoundé",
  },
  {
    id: "ora-day-500",
    name: "Orange Kif 500",
    operator: "orange",
    price: 500,
    dataMb: 1638, // 1.6 Go
    duration: "day",
    validityDays: 1,
    ussdCode: "*148*1#",
    isPopular: true,
    bestValue: true,
    notes: "1.6 Go valable 24h via le menu Orange Kif",
  },
  {
    id: "ora-day-1000",
    name: "Orange Pass 1000 24H",
    operator: "orange",
    price: 1000,
    dataMb: 3840, // 3.75 Go
    duration: "day",
    validityDays: 1,
    ussdCode: "*145#",
    notes: "Près de 4 Go pour une grosse session de travail",
  },

  // Pass Semaine
  {
    id: "ora-week-1000",
    name: "Orange Kif Semaine 1000",
    operator: "orange",
    price: 1000,
    dataMb: 2764, // 2.7 Go
    duration: "week",
    validityDays: 7,
    ussdCode: "*148#",
    isPopular: true,
    notes: "2.7 Go pour 7 jours de navigation tranquille",
  },
  {
    id: "ora-week-2000",
    name: "Orange Semaine 2000",
    operator: "orange",
    price: 2000,
    dataMb: 7680, // 7.5 Go
    duration: "week",
    validityDays: 7,
    ussdCode: "*148#",
    bestValue: true,
    notes: "7.5 Go sur 7 jours avec une excellente réactivité réseau",
  },
  {
    id: "ora-week-3000",
    name: "Orange Semaine 3000",
    operator: "orange",
    price: 3000,
    dataMb: 12800, // 12.5 Go
    duration: "week",
    validityDays: 7,
    ussdCode: "*148#",
    notes: "Pour les gros consommateurs hebdomadaires de vidéo TikTok/YouTube",
  },

  // Pass Mois
  {
    id: "ora-month-2000",
    name: "Orange Mois 2000",
    operator: "orange",
    price: 2000,
    dataMb: 3584, // 3.5 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*145#",
    notes: "3.5 Go sur 30 jours, idéal pour WhatsApp/e-mails",
  },
  {
    id: "ora-month-5000",
    name: "Orange Mois 5000",
    operator: "orange",
    price: 5000,
    dataMb: 15360, // 15 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*145#",
    isPopular: true,
    bestValue: true,
    notes: "15 Go pendant 1 mois, l'offre vedette d'Orange",
  },
  {
    id: "ora-month-10000",
    name: "Orange Mois 10000",
    operator: "orange",
    price: 10000,
    dataMb: 36864, // 36 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*145#",
    notes: "36 Go pour indépendants et télétravailleurs réguliers",
  },
  {
    id: "ora-month-20000",
    name: "Orange Mois 20000",
    operator: "orange",
    price: 20000,
    dataMb: 87040, // 85 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*145#",
    notes: "85 Go pour modem Flybox ou multi-écrans",
  },

  // Pass Nuit
  {
    id: "ora-night-200",
    name: "Orange Pass Nuit",
    operator: "orange",
    price: 200,
    dataMb: 2560, // 2.5 Go
    duration: "night",
    validityDays: 1,
    ussdCode: "*148#",
    notes: "2.5 Go de minuit à 6h du matin",
  },

  // --- CAMTEL (BLUE) ---
  // Pass Nuit
  {
    id: "cam-night-500",
    name: "Blue Night 500",
    operator: "camtel",
    price: 500,
    dataMb: 10240, // 10 Go
    duration: "night",
    validityDays: 1,
    ussdCode: "*825#",
    bestValue: true,
    notes: "Le record absolu : 10 Go pour 500 FCFA la nuit !",
  },

  // Pass Semaine
  {
    id: "cam-week-2000",
    name: "Blue Moov Semaine 2000",
    operator: "camtel",
    price: 2000,
    dataMb: 12288, // 12 Go
    duration: "week",
    validityDays: 7,
    ussdCode: "*825#",
    isPopular: true,
    bestValue: true,
    notes: "12 Go pour 2 000 F ! Presque le double de MTN et Orange",
  },
  {
    id: "cam-week-3000",
    name: "Blue Moov 3000 (15 Jours)",
    operator: "camtel",
    price: 3000,
    dataMb: 20480, // 20 Go
    duration: "week",
    validityDays: 15,
    ussdCode: "*825#",
    notes: "20 Go valables 15 jours, imbattable en rapport volume/prix",
  },

  // Pass Mois
  {
    id: "cam-month-5000",
    name: "Blue Relax 5000",
    operator: "camtel",
    price: 5000,
    dataMb: 35840, // 35 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*825#",
    isPopular: true,
    bestValue: true,
    notes: "35 Go pour 5 000 F (plus de 2x le volume de la concurrence)",
  },
  {
    id: "cam-month-10000",
    name: "Blue Infinite 10000",
    operator: "camtel",
    price: 10000,
    dataMb: 76800, // 75 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*825#",
    bestValue: true,
    notes: "75 Go sur 30 jours, idéal pour routeurs 4G Blue Box",
  },
  {
    id: "cam-month-20000",
    name: "Blue XL 20000",
    operator: "camtel",
    price: 20000,
    dataMb: 163840, // 160 Go
    duration: "month",
    validityDays: 30,
    ussdCode: "*825#",
    notes: "Volume massif pour agences, cybercafés et développeurs",
  },
];

/**
 * Convertit un volume en Mo vers un format affichable propre (Go ou Mo)
 */
export function formatDataSize(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return gb % 1 === 0 ? `${gb} Go` : `${gb.toFixed(1)} Go`;
  }
  return `${mb} Mo`;
}

/**
 * Calcule le coût unitaire en FCFA par Go
 */
export function calculatePricePerGb(priceFcfa: number, dataMb: number): number {
  if (dataMb <= 0) return 0;
  const gb = dataMb / 1024;
  return Math.round(priceFcfa / gb);
}

/**
 * Filtre et trie les forfaits selon les critères de l'utilisateur
 */
export function filterAndSortPlans(options: {
  maxBudget: number;
  duration?: Duration | "all";
  operators?: Operator[];
  sortBy?: "best-value" | "max-data" | "price-asc";
}): DataPlan[] {
  const {
    maxBudget,
    duration = "all",
    operators = ["mtn", "orange", "camtel"],
    sortBy = "best-value",
  } = options;

  const filtered = DATA_PLANS.filter((plan) => {
    if (plan.price > maxBudget) return false;
    if (duration !== "all" && plan.duration !== duration) return false;
    if (!operators.includes(plan.operator)) return false;
    return true;
  });

  if (sortBy === "best-value") {
    filtered.sort((a, b) => {
      const pricePerGbA = calculatePricePerGb(a.price, a.dataMb);
      const pricePerGbB = calculatePricePerGb(b.price, b.dataMb);
      return pricePerGbA - pricePerGbB;
    });
  } else if (sortBy === "max-data") {
    filtered.sort((a, b) => b.dataMb - a.dataMb);
  } else if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  }

  return filtered;
}
