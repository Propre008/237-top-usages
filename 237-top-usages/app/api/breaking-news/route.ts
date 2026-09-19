import { NextResponse } from "next/server";

export const revalidate = 300; // Cache 5 minutes (ISR Next.js)

interface NewsItem {
  title: string;
  source: string;
  url: string;
  timeAgo: string;
  category: string;
  imageUrl?: string;
}

const FEEDS = [
  {
    name: "Africanews",
    url: "https://fr.africanews.com/feed/",
    category: "Afrique",
  },
  {
    name: "Actu Cameroun",
    url: "https://actucameroun.com/feed/",
    category: "Cameroun",
  },
  {
    name: "Camfoot",
    url: "https://www.camfoot.com/feed/",
    category: "Sport",
  },
];

function timeAgo(dateString: string): string {
  try {
    const pubDate = new Date(dateString);
    if (isNaN(pubDate.getTime())) return "À l'instant";
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60));
    if (diffMin < 2) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
  } catch {
    return "Récent";
  }
}

function parseXmlSimple(xml: string, sourceName: string, category: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemBlocks = xml.split("<item>");

  for (let i = 1; i < Math.min(itemBlocks.length, 6); i++) {
    const block = itemBlocks[i].split("</item>")[0];

    const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || block.match(/<title>(.*?)<\/title>/);
    const linkMatch = block.match(/<link>(.*?)<\/link>/);
    const dateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);
    const encMatch = block.match(/<enclosure[^>]+url=["']([^"']+)["']/);

    let title = titleMatch ? titleMatch[1].trim() : "";
    title = title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#039;/g, "'").replace(/&quot;/g, '"');

    const url = linkMatch ? linkMatch[1].trim() : "#";
    const pubDate = dateMatch ? dateMatch[1].trim() : "";
    const imageUrl = encMatch ? encMatch[1].trim() : undefined;

    if (title && title.length > 10) {
      items.push({
        title,
        source: sourceName,
        url,
        timeAgo: timeAgo(pubDate),
        category,
        imageUrl,
      });
    }
  }

  return items;
}

export async function GET() {
  const allNews: NewsItem[] = [];

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) 237TopUsages/1.0",
        },
        next: { revalidate: 300 },
      });

      if (res.ok) {
        const text = await res.text();
        const parsed = parseXmlSimple(text, feed.name, feed.category);
        allNews.push(...parsed);
      }
    } catch {
      // Tolérance aux pannes réseau
    }
  }

  // Si les flux externes sont indisponibles, secours immédiat de haute qualité
  if (allNews.length === 0) {
    allNews.push(
      {
        title: "CAN 2027 : Les Lions Indomptables peaufinent leur feuille de route avec rigueur",
        source: "Presse 237",
        url: "/categorie/actualites",
        timeAgo: "Il y a 15 min",
        category: "Sport",
      },
      {
        title: "Forfaits Internet au Cameroun : Les consommateurs exigent la fin des coupures de data",
        source: "Tech 237",
        url: "/calculateur-forfait-data",
        timeAgo: "Il y a 32 min",
        category: "Tech",
      },
      {
        title: "Énergie solaire à Douala : La demande de stations de secours explose face aux délestages",
        source: "Éco 237",
        url: "/categorie/problemes-solutions",
        timeAgo: "Il y a 1h",
        category: "Énergie",
      }
    );
  }

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    count: allNews.length,
    news: allNews.slice(0, 10),
  });
}
