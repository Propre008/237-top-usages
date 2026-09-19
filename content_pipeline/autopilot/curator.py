import os
import json
import re
import html
import xml.etree.ElementTree as ET
import urllib.parse
import urllib.request
from datetime import datetime
import requests

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
HISTORY_FILE = os.path.join(DATA_DIR, "history.json")

os.makedirs(DATA_DIR, exist_ok=True)

# Piliers éditoriaux étendus : Cameroun & Afrique (Style MSN / Google News)
THEMES = {
    "football": {
        "query": "(Cameroun OR Afrique) (football OR Lions Indomptables OR Fecafoot OR Eto'o OR CAN OR CAF)",
        "default_category": "actualites",
        "description": "Football, Lions Indomptables et sport continental",
    },
    "tech": {
        "query": "(Cameroun OR Afrique) (internet OR telecom OR MTN OR Orange OR Camtel OR Starlink OR fintech OR IA)",
        "default_category": "top-usages",
        "description": "Internet, télécoms, data et innovation numérique",
    },
    "energie": {
        "query": "(Cameroun OR Afrique) (ENEO OR electricite OR delestage OR solaire OR energie renouvelable)",
        "default_category": "problemes-solutions",
        "description": "Énergie, délestages, solaire et solutions concrètes",
    },
    "business": {
        "query": "(Cameroun OR Afrique) (mobile money OR MoMo OR startup OR investissement OR franc CFA OR PME)",
        "default_category": "tendances",
        "description": "Business, paiements mobiles, économie et investissements",
    },
    "societe": {
        "query": "(Cameroun OR Douala OR Yaounde OR Afrique centrale) (societe OR economie OR transport OR vie)",
        "default_category": "actualites",
        "description": "Actualités de société, faits marquants et vie urbaine",
    },
}

# Flux RSS directs de grands médias fiables (vraies photos de presse garanties)
DIRECT_FEEDS = [
    {
        "name": "Africanews",
        "url": "https://fr.africanews.com/feed/",
        "theme": "societe",
        "category": "actualites",
        "source": "Africanews",
    },
    {
        "name": "Camfoot",
        "url": "https://www.camfoot.com/feed/",
        "theme": "football",
        "category": "actualites",
        "source": "Camfoot",
    },
    {
        "name": "Actu Cameroun",
        "url": "https://actucameroun.com/feed/",
        "theme": "societe",
        "category": "actualites",
        "source": "Actu Cameroun",
    },
    {
        "name": "Agence Ecofin",
        "url": "https://www.agenceecofin.com/a-la-une/rss",
        "theme": "business",
        "category": "tendances",
        "source": "Agence Ecofin",
    },
]

# Pool de secours haute définition sans répétition
THEMED_IMAGE_POOLS = {
    "football": [
        "/images/articles/arthur-avom.jpg",
        "/images/articles/lionnes-accueil.jpg",
        "/images/articles/fecafoot-press.jpg",
        "/images/articles/fecafoot-enquete.jpg",
        "/images/defaults/sport.jpg",
    ],
    "tech": [
        "/images/articles/starlink.jpg",
        "/images/articles/telecom-regulateur.jpg",
        "/images/articles/top-apps.jpg",
        "/images/defaults/tech.jpg",
    ],
    "energie": [
        "/images/articles/delestages-freelance.jpg",
        "/images/defaults/energie.jpg",
    ],
    "business": [
        "/images/articles/tendances-tech.jpg",
        "/images/articles/top-apps.jpg",
        "/images/defaults/business.jpg",
    ],
    "societe": [
        "/images/articles/telecom-regulateur.jpg",
        "/images/articles/lionnes-accueil.jpg",
        "/images/defaults/actualites.jpg",
    ],
}


def load_history() -> dict:
    """Charge l'historique des sujets déjà traités."""
    if not os.path.exists(HISTORY_FILE):
        return {"processed_titles": [], "processed_links": [], "articles": []}
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"processed_titles": [], "processed_links": [], "articles": []}


def save_history(history: dict):
    """Sauvegarde l'historique."""
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def is_already_processed(title: str, link: str, history: dict) -> bool:
    """Vérifie si un titre ou lien a déjà été traité."""
    if link in history.get("processed_links", []):
        return True

    clean = normalize_title(title)
    for past in history.get("processed_titles", []):
        if clean in past or past in clean:
            return True
    return False


def normalize_title(title: str) -> str:
    """Normalise un titre pour comparaison."""
    t = title.lower()
    t = re.sub(r"[^\w\s]", "", t)
    return " ".join(t.split()[:8])


def clean_html(raw_html: str) -> str:
    """Retire les balises HTML et décode les entités."""
    if not raw_html:
        return ""
    clean = re.sub(r"<[^>]+>", "", raw_html)
    return html.unescape(clean).strip()


def parse_item_title(raw_title: str) -> tuple[str, str]:
    """Sépare le titre de l'article et la source (ex: 'Titre - Camfoot')."""
    raw_title = clean_html(raw_title)
    if " - " in raw_title:
        parts = raw_title.rsplit(" - ", 1)
        return parts[0].strip(), parts[1].strip()
    return raw_title.strip(), "Média 237"


def extract_press_image_from_xml(item_el) -> str | None:
    """Extrait directement la vraie photo de presse du flux XML (enclosure, media, img)."""
    # 1. Enclosure (ex: Africanews, RFI, etc.)
    enc = item_el.find("enclosure")
    if enc is not None:
        url = enc.get("url")
        enc_type = enc.get("type", "image")
        if url and ("image" in enc_type or url.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))):
            return url.strip()

    # 2. Media content ou media thumbnail (Yahoo Media RSS)
    for child in item_el:
        tag_lower = child.tag.lower()
        if "content" in tag_lower or "thumbnail" in tag_lower:
            url = child.get("url")
            if url and url.startswith("http"):
                return url.strip()

    # 3. Balise <img> dans description ou content:encoded
    for tag_name in ["description", "{http://purl.org/rss/1.0/modules/content/}encoded"]:
        el = item_el.find(tag_name)
        if el is not None and el.text:
            m = re.search(r'<img[^>]+src=["\'](https?://[^"\']+)["\']', el.text, re.IGNORECASE)
            if m:
                img_url = m.group(1)
                if not any(x in img_url.lower() for x in ["gravatar", "tracker", "pixel", "1x1"]):
                    return img_url.strip()

    return None


def get_fallback_image(theme: str) -> str:
    """Retourne une image locale de qualité supérieure sans répétition."""
    pool = THEMED_IMAGE_POOLS.get(theme, THEMED_IMAGE_POOLS["societe"])
    # Rotation pseudo-aléatoire basée sur l'heure actuelle
    idx = int(datetime.now().timestamp()) % len(pool)
    return pool[idx]


def fetch_direct_feed(feed_cfg: dict, limit: int = 3) -> list[dict]:
    """Récupère les actualités fraîches depuis un flux RSS direct fiable avec vraie photo."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }

    try:
        resp = requests.get(feed_cfg["url"], headers=headers, timeout=6)
        if resp.status_code != 200:
            return []

        root = ET.fromstring(resp.content)
        items = root.findall(".//item")
        history = load_history()
        candidates = []

        for it in items[:limit]:
            title_el = it.find("title")
            link_el = it.find("link")
            pub_date_el = it.find("pubDate")
            desc_el = it.find("description")

            if title_el is None or link_el is None:
                continue

            raw_title = clean_html(title_el.text or "")
            link = (link_el.text or "").strip()
            pub_date = pub_date_el.text if pub_date_el is not None else ""
            snippet = clean_html(desc_el.text or "") if desc_el is not None else ""

            if not raw_title or len(raw_title) < 15:
                continue

            if is_already_processed(raw_title, link, history):
                continue

            # Extraction de la vraie photo de presse
            press_image = extract_press_image_from_xml(it)
            if not press_image:
                press_image = get_fallback_image(feed_cfg["theme"])

            candidates.append({
                "title": raw_title,
                "source": feed_cfg["source"],
                "link": link,
                "cover_image": press_image,
                "pub_date": pub_date,
                "theme": feed_cfg["theme"],
                "category_hint": feed_cfg["category"],
                "snippet": snippet,
                "is_direct_press_photo": bool(press_image and press_image.startswith("http")),
            })

        return candidates
    except Exception as e:
        print(f"[!] Erreur sur le flux direct {feed_cfg['name']}: {e}")
        return []


def fetch_google_news_theme(theme_key: str, limit: int = 5) -> list[dict]:
    """Récupère les actualités ciblées via Google News Cameroun & Afrique."""
    if theme_key not in THEMES:
        return []

    theme_cfg = THEMES[theme_key]
    encoded_query = urllib.parse.quote(theme_cfg["query"])
    rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=fr&gl=CM&ceid=CM:fr"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }

    try:
        resp = requests.get(rss_url, headers=headers, timeout=8)
        if resp.status_code != 200:
            return []

        root = ET.fromstring(resp.content)
        items = root.findall(".//item")
        history = load_history()
        candidates = []

        for it in items[:limit]:
            title_el = it.find("title")
            link_el = it.find("link")
            pub_date_el = it.find("pubDate")
            desc_el = it.find("description")

            if title_el is None or link_el is None:
                continue

            clean_title, source = parse_item_title(title_el.text or "")
            link = (link_el.text or "").strip()
            pub_date = pub_date_el.text if pub_date_el is not None else ""
            snippet = clean_html(desc_el.text or "") if desc_el is not None else ""

            if not clean_title or len(clean_title) < 15:
                continue

            if is_already_processed(clean_title, link, history):
                continue

            # Recherche d'image ou fallback de haute qualité sans répétition
            press_image = extract_press_image_from_xml(it) or get_fallback_image(theme_key)

            candidates.append({
                "title": clean_title,
                "source": source,
                "link": link,
                "cover_image": press_image,
                "pub_date": pub_date,
                "theme": theme_key,
                "category_hint": theme_cfg["default_category"],
                "snippet": snippet,
                "is_direct_press_photo": bool(press_image and press_image.startswith("http")),
            })

        return candidates
    except Exception as e:
        print(f"[!] Erreur Google News ({theme_key}): {e}")
        return []


def get_fresh_candidates(theme: str | None = None, max_candidates: int = 5) -> list[dict]:
    """Agrège les flux directs fiables (avec vraies photos de presse)
    et complète avec les flux thématiques Google News (Cameroun & Afrique).
    """
    selected = []
    seen_titles = set()

    # 1. Priorité aux flux RSS directs de presse avec photos officielles
    for feed in DIRECT_FEEDS:
        if len(selected) >= max_candidates:
            break
        if theme and feed["theme"] != theme:
            continue
        direct_items = fetch_direct_feed(feed, limit=2)
        for it in direct_items:
            norm = normalize_title(it["title"])
            if norm not in seen_titles:
                seen_titles.add(norm)
                selected.append(it)
                if len(selected) >= max_candidates:
                    break

    # 2. Complément avec les requêtes ciblées si nécessaire
    if len(selected) < max_candidates:
        themes_to_check = [theme] if theme and theme in THEMES else list(THEMES.keys())
        for t in themes_to_check:
            if len(selected) >= max_candidates:
                break
            theme_items = fetch_google_news_theme(t, limit=2)
            for it in theme_items:
                norm = normalize_title(it["title"])
                if norm not in seen_titles:
                    seen_titles.add(norm)
                    selected.append(it)
                    if len(selected) >= max_candidates:
                        break

    return selected[:max_candidates]


if __name__ == "__main__":
    print("[*] Test du module de curation Cameroun & Afrique...")
    items = get_fresh_candidates(max_candidates=5)
    print(f"[*] {len(items)} sujets frais identifiés :")
    for i, it in enumerate(items, 1):
        photo_type = "Photo de presse" if it.get("is_direct_press_photo") else "Visuel thématique"
        print(f"  {i}. [{it['theme'].upper()}] {it['title']}")
        print(f"     Source : {it['source']} | Image ({photo_type}) : {it['cover_image'][:65]}")
