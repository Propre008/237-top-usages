import os
import json
import re
import html
import xml.etree.ElementTree as ET
import urllib.parse
from datetime import datetime
import requests

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
HISTORY_FILE = os.path.join(DATA_DIR, "history.json")

os.makedirs(DATA_DIR, exist_ok=True)

# Définition des piliers éditoriaux et requêtes de recherche ciblées Cameroun
THEMES = {
    "football": {
        "query": "Cameroun (football OR Lions Indomptables OR Fecafoot OR Eto'o OR Marc Brys OR CAN)",
        "default_category": "actualites",
        "description": "Football, Lions Indomptables et sport national",
    },
    "tech": {
        "query": "Cameroun (internet OR telecom OR MTN OR Orange OR Camtel OR Starlink OR fibre OR forfait)",
        "default_category": "top-usages",
        "description": "Internet, télécoms, data et technologies",
    },
    "energie": {
        "query": "Cameroun (ENEO OR electricite OR delestage OR coupure OR solaire OR onduleur)",
        "default_category": "problemes-solutions",
        "description": "Énergie, délestages, solaire et solutions concrètes",
    },
    "business": {
        "query": "Cameroun (mobile money OR MoMo OR Orange Money OR startup OR investissement OR commerce)",
        "default_category": "tendances",
        "description": "Business, paiements mobiles, freelancing et investissement",
    },
    "societe": {
        "query": "Cameroun (Douala OR Yaounde OR societe OR economie OR transport)",
        "default_category": "actualites",
        "description": "Actualités de société et faits marquants",
    },
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
    return " ".join(t.split()[:8])  # Les 8 premiers mots signifiants


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


CATEGORY_DEFAULTS = {
    "tech": "/images/defaults/tech.jpg",
    "business": "/images/defaults/business.jpg",
    "energie": "/images/defaults/energie.jpg",
    "sport": "/images/defaults/sport.jpg",
    "football": "/images/defaults/sport.jpg",
    "actualites": "/images/defaults/actualites.jpg",
    "societe": "/images/defaults/actualites.jpg",
    "top-usages": "/images/defaults/tech.jpg",
    "problemes-solutions": "/images/defaults/energie.jpg",
    "tendances": "/images/defaults/business.jpg",
}


def resolve_card_metadata(article_url: str, category: str, fallback_source: str = "Actualités 237") -> dict:
    """Extrait l'image officielle (og:image) et résout l'URL source avec timeout strict de 2s

    et bascule instantanée vers l'image locale garantie.
    """
    default_img = CATEGORY_DEFAULTS.get(category.lower(), "/images/defaults/actualites.jpg")
    meta = {
        "cover_image": default_img,
        "source_name": fallback_source,
        "source_url": article_url,
    }

    try:
        req = urllib.request.Request(
            article_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            },
        )
        with urllib.request.urlopen(req, timeout=2.0) as resp:
            final_url = resp.geturl()
            meta["source_url"] = final_url

            domain = urllib.parse.urlparse(final_url).netloc.replace("www.", "")
            if domain and "google" not in domain:
                meta["source_name"] = domain.split(".")[0].capitalize()

            chunk = resp.read(32768).decode("utf-8", errors="ignore")
            from bs4 import BeautifulSoup

            soup = BeautifulSoup(chunk, "html.parser")
            og = soup.find("meta", property="og:image") or soup.find("meta", attrs={"name": "twitter:image"})
            if og and og.get("content") and og["content"].strip().startswith("http"):
                meta["cover_image"] = og["content"].strip()
    except Exception:
        # Bascule silencieuse instantanée sur les images locales garanties
        pass

    return meta


def fetch_theme_news(theme_key: str, limit: int = 10) -> list[dict]:
    """Récupère les actualités fraîches pour un thème donné."""
    if theme_key not in THEMES:
        return []

    theme_cfg = THEMES[theme_key]
    query = theme_cfg["query"]
    encoded_query = urllib.parse.quote(query)
    rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=fr&gl=CM&ceid=CM:fr"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        resp = requests.get(rss_url, headers=headers, timeout=12)
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

            raw_title = title_el.text or ""
            link = link_el.text or ""
            clean_title, source = parse_item_title(raw_title)
            pub_date = pub_date_el.text if pub_date_el is not None else ""
            snippet = clean_html(desc_el.text or "") if desc_el is not None else ""

            if not clean_title or len(clean_title) < 15:
                continue

            if is_already_processed(clean_title, link, history):
                continue

            # Résolution visuelle ultra-rapide (image + source)
            card_meta = resolve_card_metadata(link, theme_key, fallback_source=source)

            candidates.append({
                "title": clean_title,
                "source": card_meta["source_name"],
                "link": card_meta["source_url"],
                "cover_image": card_meta["cover_image"],
                "pub_date": pub_date,
                "theme": theme_key,
                "category_hint": theme_cfg["default_category"],
                "snippet": snippet,
            })

        return candidates

    except Exception as e:
        print(f"[!] Erreur de recuperation ({theme_key}): {e}")
        return []


def get_fresh_candidates(theme: str | None = None, max_candidates: int = 5) -> list[dict]:
    """Parcourt les thèmes et retourne une sélection équilibrée (round-robin)
    pour varier les sujets entre Tech, Football, Énergie, Business et Société.
    """
    themes_to_check = [theme] if theme and theme in THEMES else list(THEMES.keys())
    theme_candidates = {}

    for t in themes_to_check:
        news = fetch_theme_news(t, limit=4)
        if news:
            theme_candidates[t] = news

    # Distribution équilibrée (round-robin entre les thèmes)
    selected = []
    seen_titles = set()
    idx = 0

    while len(selected) < max_candidates and any(theme_candidates.values()):
        for t in list(theme_candidates.keys()):
            if len(selected) >= max_candidates:
                break
            items = theme_candidates[t]
            if items:
                item = items.pop(0)
                norm = normalize_title(item["title"])
                if norm not in seen_titles:
                    seen_titles.add(norm)
                    selected.append(item)
            else:
                del theme_candidates[t]

    return selected[:max_candidates]


if __name__ == "__main__":
    print("[*] Test du module de curation 237...")
    items = get_fresh_candidates(max_candidates=5)
    print(f"[*] {len(items)} sujets frais trouves :")
    for i, it in enumerate(items, 1):
        print(f"  {i}. [{it['theme'].upper()}] {it['title']} ({it['source']})")
