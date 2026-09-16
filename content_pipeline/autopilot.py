import os
import sys
import time
import argparse
from datetime import datetime

from autopilot.curator import get_fresh_candidates, THEMES
from autopilot.generator import generate_article_from_news
from autopilot.publisher import publish_article


def run_cycle(count: int = 1, theme: str | None = None, dry_run: bool = False) -> list[dict]:
    """Exécute un cycle de veille et de publication autonome."""
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n==================================================")
    print(f"[*] AUTOPILOT 237 - Demarrage du cycle : {now_str}")
    print(f"    Objectif : {count} article(s) | Theme : {theme or 'Tous (equilibre)'}")
    print(f"==================================================")

    # 1. Détection des sujets chauds non encore traités
    print("[1/3] Recherche des tendances et actualites du Cameroun...")
    candidates = get_fresh_candidates(theme=theme, max_candidates=count + 3)

    if not candidates:
        print("[!] Aucun nouveau sujet detecte pour le moment (toutes les actualites recentes ont deja ete traitees).")
        return []

    print(f"[+] {len(candidates)} sujet(s) potentiel(s) identifie(s) :")
    for i, c in enumerate(candidates[:count], 1):
        print(f"    {i}. [{c['theme'].upper()}] {c['title']} ({c['source']})")

    if dry_run:
        print("\n[DRY RUN] Mode simulation active, aucune generation de texte ni publication.")
        return candidates[:count]

    published_articles = []

    # 2. Génération et Publication
    for i, cand in enumerate(candidates[:count], 1):
        print(f"\n[2/3] [{i}/{count}] Generation IA (Gemini 3.6 Flash) : {cand['title'][:60]}...")
        try:
            content = generate_article_from_news(cand)
            print("[3/3] Publication automatique sur le site 237 Top Usages...")
            dest_path, slug = publish_article(content, cand)
            print(f"[OK] Publie avec succes : {dest_path}")
            print(f"     Slug : {slug}")
            published_articles.append({
                "title": cand["title"],
                "slug": slug,
                "path": dest_path,
                "theme": cand["theme"],
            })
        except Exception as e:
            print(f"[!] Erreur lors du traitement de '{cand['title']}' : {e}")

    print(f"\n[*] Cycle termine avec succes : {len(published_articles)} article(s) publie(s).")
    return published_articles


def run_continuous_loop(count_per_cycle: int = 2, interval_hours: float = 6.0, theme: str | None = None):
    """Fait tourner le système en continu en tâche de fond."""
    print(f"\n[***] AUTOPILOT EN MODE CONTINU ACTIF [***]")
    print(f"      Frequence : toutes les {interval_hours} heure(s)")
    print(f"      Articles par cycle : {count_per_cycle}")
    print(f"      Appuyez sur Ctrl+C pour arreter.\n")

    while True:
        try:
            run_cycle(count=count_per_cycle, theme=theme)
        except Exception as e:
            print(f"[!] Exception dans le cycle : {e}")

        sleep_seconds = int(interval_hours * 3600)
        next_time = datetime.fromtimestamp(time.time() + sleep_seconds).strftime("%H:%M:%S")
        print(f"\n[zzz] En veille... Prochain cycle prevu a {next_time} ({interval_hours}h d'attente).")
        try:
            time.sleep(sleep_seconds)
        except KeyboardInterrupt:
            print("\n[!] Arret du mode continu demande par l'utilisateur.")
            break


def main():
    parser = argparse.ArgumentParser(
        description="Autopilot 237 - Moteur de veille et de publication autonome pour 237 Top Usages"
    )
    parser.add_argument(
        "--run-once", action="store_true",
        help="Executer un cycle immediat et s'arreter"
    )
    parser.add_argument(
        "--loop", action="store_true",
        help="Lancer la boucle continue 24/7 en arriere-plan"
    )
    parser.add_argument(
        "--count", type=int, default=1,
        help="Nombre d'articles a generer par cycle (defaut: 1)"
    )
    parser.add_argument(
        "--theme", type=str, choices=list(THEMES.keys()),
        help=f"Cibler un theme specifique ({', '.join(THEMES.keys())})"
    )
    parser.add_argument(
        "--interval-hours", type=float, default=6.0,
        help="Intervalle en heures entre chaque cycle en mode boucle (defaut: 6)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Simuler la recherche sans appeler l'API ni publier"
    )

    args = parser.parse_args()

    # Si aucun argument n'est fourni, exécuter un cycle simple
    if not args.loop and not args.run_once and not args.dry_run:
        args.run_once = True

    if args.loop:
        run_continuous_loop(
            count_per_cycle=args.count,
            interval_hours=args.interval_hours,
            theme=args.theme,
        )
    else:
        run_cycle(
            count=args.count,
            theme=args.theme,
            dry_run=args.dry_run,
        )


if __name__ == "__main__":
    main()
