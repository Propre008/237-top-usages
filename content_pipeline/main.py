import os
import argparse
import shutil
from datetime import date

from generator.llm_client import generate_text
from generator.markdown_writer import save_article

PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "prompts")
# Dossier de sortie interne au pipeline (brouillons)
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
# Dossier de publication du site Next.js
SITE_ARTICLES_DIR = os.path.join(
    os.path.dirname(__file__), "..", "237-top-usages", "content", "articles"
)

os.makedirs(OUTPUT_DIR, exist_ok=True)


def load_prompt(name: str) -> str:
    path = os.path.join(PROMPTS_DIR, f"{name}.txt")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def publish_to_site(source_path: str) -> str | None:
    """Copie un article généré dans le dossier content/articles/ du site Next.js."""
    if not os.path.exists(SITE_ARTICLES_DIR):
        print(f"[!] Dossier site introuvable : {SITE_ARTICLES_DIR}")
        print("   L'article a été sauvegardé dans output/ mais pas publié.")
        return None

    filename = os.path.basename(source_path)
    dest = os.path.join(SITE_ARTICLES_DIR, filename)

    if os.path.exists(dest):
        print(f"[!] Un article avec ce slug existe deja : {filename}")
        confirm = input("   Écraser ? (o/n) : ").strip().lower()
        if confirm != "o":
            print("   Publication annulée.")
            return None

    shutil.copy2(source_path, dest)
    return dest


# ──────────────────────────────────────────────
# COMMANDE : article
# Usage : python main.py article --sujet "Starlink au Cameroun : prix, installation et avis"
# ──────────────────────────────────────────────
def cmd_article(args):
    sujet = args.sujet
    template = load_prompt("article_master")
    prompt = template.replace("{SUJET}", sujet).replace("{DATE}", date.today().isoformat())
    print(f"[article] Generation de l'article sur : {sujet}")
    content = generate_text(prompt)
    path = save_article(content)
    print(f"[OK] Brouillon genere : {path}")

    if not args.draft:
        dest = publish_to_site(path)
        if dest:
            print(f"[PUBLIE] Sur le site : {dest}")
            print("   -> Relance `npm run dev` ou `npm run build` pour voir l'article.")
    else:
        print("   (mode brouillon, pas publié sur le site)")


# ──────────────────────────────────────────────
# COMMANDE : actu
# Usage : python main.py actu --sujet "Panne générale Orange Cameroun du 15 septembre 2026"
# Pour les breaking news / sujets chauds à publier rapidement
# ──────────────────────────────────────────────
def cmd_actu(args):
    sujet = args.sujet
    template = load_prompt("actu_flash")
    prompt = template.replace("{SUJET}", sujet).replace("{DATE}", date.today().isoformat())
    print(f"[actu] Generation de l'actu flash : {sujet}")
    content = generate_text(prompt)
    path = save_article(content)
    print(f"[OK] Brouillon genere : {path}")

    if not args.draft:
        dest = publish_to_site(path)
        if dest:
            print(f"[PUBLIE] Sur le site : {dest}")
    else:
        print("   (mode brouillon)")


# ──────────────────────────────────────────────
# COMMANDE : weekly
# Usage : python main.py weekly --elements "Internet: panne Orange mardi. Énergie: nouveaux tarifs ENEO. Business: lancement de Jumia Food à Douala."
# ──────────────────────────────────────────────
def cmd_weekly(args):
    elements = args.elements
    semaine = args.semaine or date.today().isocalendar()[1]
    annee = date.today().year

    template = load_prompt("weekly_summary")
    prompt = (
        template
        .replace("{ELEMENTS}", elements)
        .replace("{SEMAINE}", str(semaine))
        .replace("{ANNEE}", str(annee))
        .replace("{DATE}", date.today().isoformat())
    )
    print(f"[weekly] Generation du resume : Semaine {semaine} - {annee}")
    content = generate_text(prompt)
    path = save_article(content)
    print(f"[OK] Brouillon genere : {path}")

    if not args.draft:
        dest = publish_to_site(path)
        if dest:
            print(f"[PUBLIE] Sur le site : {dest}")
    else:
        print("   (mode brouillon)")


# ──────────────────────────────────────────────
# COMMANDE : list
# Affiche la liste des articles publiés sur le site
# ──────────────────────────────────────────────
def cmd_list(args):
    if not os.path.exists(SITE_ARTICLES_DIR):
        print("[!] Dossier articles introuvable.")
        return

    articles = sorted(
        [f for f in os.listdir(SITE_ARTICLES_DIR) if f.endswith(".md")]
    )
    if not articles:
        print("Aucun article publie.")
        return

    print(f"\n--- {len(articles)} article(s) publie(s) ---\n")
    for i, filename in enumerate(articles, 1):
        filepath = os.path.join(SITE_ARTICLES_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            first_lines = f.read(500)

        # Extraire le titre du frontmatter
        title = filename.replace(".md", "")
        for line in first_lines.splitlines():
            if line.strip().startswith("title:"):
                title = line.split(":", 1)[1].strip().strip('"').strip("'")
                break

        print(f"  {i}. {title}  ({filename})")
    print()


def main():
    parser = argparse.ArgumentParser(
        description="237 Top Usages — Pipeline de contenu"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # article
    p_article = sub.add_parser("article", help="Générer un article complet")
    p_article.add_argument("--sujet", required=True, help="Sujet de l'article")
    p_article.add_argument(
        "--draft", action="store_true",
        help="Sauvegarder en brouillon seulement (pas de publication)"
    )
    p_article.set_defaults(func=cmd_article)

    # actu (breaking news / actualité flash)
    p_actu = sub.add_parser("actu", help="Générer une actualité flash courte")
    p_actu.add_argument("--sujet", required=True, help="Sujet de l'actualité")
    p_actu.add_argument("--draft", action="store_true")
    p_actu.set_defaults(func=cmd_actu)

    # weekly
    p_weekly = sub.add_parser("weekly", help="Générer un résumé hebdomadaire")
    p_weekly.add_argument(
        "--elements", required=True,
        help="Les faits marquants de la semaine (en une phrase par sujet, séparés par des points)"
    )
    p_weekly.add_argument("--semaine", type=int, help="Numéro de semaine (auto si omis)")
    p_weekly.add_argument("--draft", action="store_true")
    p_weekly.set_defaults(func=cmd_weekly)

    # list
    p_list = sub.add_parser("list", help="Lister les articles publiés")
    p_list.set_defaults(func=cmd_list)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
