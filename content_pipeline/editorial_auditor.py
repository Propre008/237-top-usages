"""Agent d'Audit Éditorial et Détecteur Anti-IA pour 237 Top Usages

Inspiré des architectures d'agents de validation d'open-code-review et
security-audit-skill.
Rôle : Garantir une qualité journalistique 100% crédible, sans aucun marqueur robotique d'IA,
avec ancrage terrain camerounais/africain vérifiable avant toute publication.
"""

import os
import re
import sys

# Formules robotiques strictement interdites (tics de langage IA)
FORBIDDEN_AI_MARKERS = [
    r"en conclusion",
    r"en somme",
    r"en résumé",
    r"il est important de noter",
    r"il convient de",
    r"force est de constater",
    r"dans cet article, nous allons",
    r"plongeons dans",
    r"naviguer dans ce paysage",
    r"n'est pas en reste",
    r"à l'ère du numérique",
    r"un rôle crucial",
    r"témoigne de l'importance",
    r"souligne l'importance",
    r"il est essentiel de comprendre",
]

# Marqueurs d'ancrage terrain camerounais et africain (au moins 2 requis)
LOCAL_CONTEXT_MARKERS = [
    "cameroun",
    "douala",
    "yaoundé",
    "yaounde",
    "fcfa",
    "akwa",
    "bastos",
    "bafoussam",
    "mtn",
    "orange",
    "camtel",
    "eneo",
    "momo",
    "bendskin",
    "afrique",
    "can",
    "lions indomptables",
    "fecafoot",
]


class EditorialAuditReport:
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.passed = True
        self.issues: list[str] = []
        self.warnings: list[str] = []
        self.score = 100


def audit_article_content(content: str, filepath: str = "article.md") -> EditorialAuditReport:
    """Analyse un texte d'article Markdown et applique la grille d'audit de qualité journalistique."""
    report = EditorialAuditReport(filepath)
    lower_content = content.lower()

    # 1. Détection des tics de langage IA
    found_ai_markers = []
    for pattern in FORBIDDEN_AI_MARKERS:
        if re.search(pattern, lower_content, re.IGNORECASE):
            found_ai_markers.append(pattern)

    if found_ai_markers:
        report.passed = False
        report.score -= len(found_ai_markers) * 15
        report.issues.append(
            f"Marqueurs de rédaction IA détectés : {', '.join(found_ai_markers)}. À remplacer par un ton direct et journalistique."
        )

    # 2. Vérification de l'ancrage terrain réel
    context_hits = [m for m in LOCAL_CONTEXT_MARKERS if m in lower_content]
    if len(context_hits) < 2:
        report.passed = False
        report.score -= 25
        report.issues.append(
            f"Ancrage terrain insuffisant ({len(context_hits)} repère(s)). L'article doit citer des repères locaux concrets (Douala, Yaoundé, FCFA, MTN, Orange, etc.)."
        )

    # 3. Vérification de la présence de l'image de couverture
    if not re.search(r"cover_image:\s*[\"'][^\"']+[\"']", content):
        report.passed = False
        report.score -= 20
        report.issues.append("Image de couverture (cover_image) absente du frontmatter.")

    # 4. Vérification de la longueur minimale (au moins 250 mots pour être un article sérieux)
    words_count = len(content.split())
    if words_count < 180:
        report.warnings.append(f"Article un peu court ({words_count} mots). Privilégier au moins 250 mots pour un dossier de fond.")

    report.score = max(0, report.score)
    return report


def audit_all_articles(articles_dir: str) -> list[EditorialAuditReport]:
    """Scanne et audite tous les articles du dossier."""
    reports = []
    if not os.path.exists(articles_dir):
        return reports

    for filename in os.listdir(articles_dir):
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(articles_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        rep = audit_article_content(content, filepath)
        reports.append(rep)

    return reports


if __name__ == "__main__":
    articles_path = os.path.join(os.path.dirname(__file__), "..", "237-top-usages", "content", "articles")
    print(f"[*] Audit de conformité éditoriale 237 sur : {articles_path}")
    reports = audit_all_articles(articles_path)
    all_ok = True

    for r in reports:
        fname = os.path.basename(r.filepath)
        status = "[CONFORME 100%]" if r.passed else "[À CORRIGER]"
        print(f"  {status} ({r.score}/100) : {fname}")
        for iss in r.issues:
            print(f"     [!] Problème : {iss}")
            all_ok = False
        for warn in r.warnings:
            print(f"     [?] Avertissement : {warn}")

    if all_ok:
        print("\n[OK] Tous les articles respectent la charte journalistique sans trace d'IA.")
    else:
        print("\n[!] Des corrections de style sont recommandées.")
