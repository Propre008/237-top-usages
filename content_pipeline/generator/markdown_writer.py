import os
from datetime import date

# Dossier de sortie par défaut (brouillons)
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def extract_slug_from_markdown(content: str) -> str:
    """Extrait le slug depuis le frontmatter YAML de l'article."""
    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith("slug:"):
            return stripped.split(":", 1)[1].strip().strip('"').strip("'")
    # Fallback : slug basé sur la date
    return f"article-{date.today().isoformat()}"


def save_article(content: str, slug: str | None = None) -> str:
    """Sauvegarde l'article Markdown dans le dossier output/.

    Retourne le chemin absolu du fichier créé.
    """
    if slug is None:
        slug = extract_slug_from_markdown(content)

    # Nettoyage du slug pour être sûr qu'il soit valide comme nom de fichier
    safe_slug = (
        slug
        .lower()
        .replace(" ", "-")
        .replace("'", "")
        .replace('"', "")
    )

    filename = f"{safe_slug}.md"
    path = os.path.join(OUTPUT_DIR, filename)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    return path
