import os
import re
import shutil
from datetime import datetime
from autopilot.curator import load_history, save_history, normalize_title

SITE_ARTICLES_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "237-top-usages", "content", "articles"
)
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")

os.makedirs(SITE_ARTICLES_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def extract_frontmatter_field(content: str, field_name: str) -> str | None:
    """Extrait la valeur d'un champ YAML dans le frontmatter."""
    pattern = rf"^{field_name}\s*:\s*(.+)$"
    for line in content.splitlines()[:30]:
        match = re.match(pattern, line.strip(), re.IGNORECASE)
        if match:
            val = match.group(1).strip()
            # Retirer les guillemets
            return val.strip('"').strip("'")
    return None


def sanitize_slug(slug: str) -> str:
    """Nettoie le slug pour en faire un nom de fichier valide et propre."""
    s = slug.lower()
    s = re.sub(r"[àáâãäå]", "a", s)
    s = re.sub(r"[èéêë]", "e", s)
    s = re.sub(r"[ìíîï]", "i", s)
    s = re.sub(r"[òóôõö]", "o", s)
    s = re.sub(r"[ùúûü]", "u", s)
    s = re.sub(r"[ç]", "c", s)
    s = re.sub(r"[^a-z0-9\-]", "-", s)
    s = re.sub(r"-+", "-", s)
    return s.strip("-")[:70]


def publish_article(content: str, candidate: dict) -> tuple[str, str]:
    """Valide, sauvegarde et publie l'article directement sur le site, puis met à jour l'historique."""
    raw_slug = extract_frontmatter_field(content, "slug")
    title = extract_frontmatter_field(content, "title") or candidate.get("title", "Article")
    category = extract_frontmatter_field(content, "category") or candidate.get("category_hint", "actualites")

    if not raw_slug:
        raw_slug = sanitize_slug(title)
    else:
        raw_slug = sanitize_slug(raw_slug)

    filename = f"{raw_slug}.md"
    site_path = os.path.join(SITE_ARTICLES_DIR, filename)
    backup_path = os.path.join(OUTPUT_DIR, filename)

    # Sauvegarde du fichier Markdown
    with open(backup_path, "w", encoding="utf-8") as f:
        f.write(content)

    with open(site_path, "w", encoding="utf-8") as f:
        f.write(content)

    # Mise à jour de l'historique anti-doublon
    history = load_history()
    history.setdefault("processed_titles", []).append(normalize_title(candidate.get("title", "")))
    if candidate.get("link"):
        history.setdefault("processed_links", []).append(candidate.get("link"))

    article_record = {
        "slug": raw_slug,
        "title": title,
        "category": category,
        "theme": candidate.get("theme", ""),
        "source": candidate.get("source", ""),
        "published_at": datetime.now().isoformat(),
        "site_path": site_path,
    }
    history.setdefault("articles", []).append(article_record)
    save_history(history)

    return site_path, raw_slug
