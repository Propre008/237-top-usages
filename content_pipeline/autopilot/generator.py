import os
import re
from datetime import date
from generator.llm_client import generate_text

PROMPT_TEMPLATE = """Tu es un grand reporter et éditorialiste économique, tech et sportif pour le média en ligne camerounais "237 Top Usages".
Ton lectorat est composé de Camerounais (Douala, Yaoundé, Bafoussam, diaspora, jeunes actifs, entrepreneurs, passionnés de foot et de tech).

Tu dois rédiger un article complet, fouillé et percutant à partir de la dépêche d'actualité suivante :
- Titre de l'actualité : {TITLE}
- Source : {SOURCE}
- Thème : {THEME}
- Catégorie suggérée : {CATEGORY_HINT}
- Informations / extrait : {SNIPPET}

RÈGLES ÉDITORIALES STRICTES :
1. TON ET STYLE :
   - Ton journalistique professionnel, engagé, vivant et ancré dans le quotidien camerounais.
   - Ne commence JAMAIS par "Dans cet article..." ou "Aujourd'hui nous allons...".
   - Utilise des références locales concrètes (quartiers d'affaires d'Akwa, Bastos, Bonanjo, réalités de la vie chère, coupures de courant, réseau instable, ferveur sportive).
   - Montre en quoi cette actualité touche directement les citoyens, les entreprises ou les supporters.
   - Mentionne naturellement la source de l'information (ex: "Selon des informations rapportées par {SOURCE}...").

2. STRUCTURE DE L'ARTICLE (au moins 550 mots) :
   - Une accroche forte qui pose les faits et le contexte immédiat au Cameroun.
   - 2 à 3 sections avec des sous-titres H2 captivants et structurés.
   - Des paragraphes aérés, fluides et rythmés.
   - Une dernière section H2 intitulée soit "Ce que cela change sur le terrain" soit "Ce qu'il faut retenir" avec 3 ou 4 points clés à puces.

3. FORMAT FRONTMATTER YAML (OBLIGATOIRE au début du fichier) :
---
title: "[Titre percutant et informatif, max 80 caractères]"
slug: "[slug-en-minuscules-avec-tirets-sans-accents-ni-caracteres-speciaux]"
category: "{CATEGORY_HINT}"
date: "{DATE}"
tags: ["cameroun", "{THEME}", "tag3", "tag4"]
---

IMPORTANT : La catégorie DOIT être l'une des 4 suivantes :
- "actualites" (idéal pour le football, la politique sportive, les faits de société et les grandes annonces)
- "top-usages" (guides, comparatifs d'applications ou de services, classements)
- "problemes-solutions" (pannes de courant, délestages Eneo, coupures internet, astuces de dépannage)
- "tendances" (business, mobile money, startups, nouveaux forfaits data, innovations)

Renvoie UNIQUEMENT le document Markdown complet avec son bloc frontmatter YAML au tout début, sans balises ```markdown au début ou à la fin.
"""


def generate_article_from_news(candidate: dict) -> str:
    """Génère un article de presse complet ancré au Cameroun à partir d'un sujet d'actualité."""
    title = candidate.get("title", "")
    source = candidate.get("source", "Sources locales")
    theme = candidate.get("theme", "actualites")
    category_hint = candidate.get("category_hint", "actualites")
    snippet = candidate.get("snippet", "")
    today_str = date.today().isoformat()

    prompt = (
        PROMPT_TEMPLATE
        .replace("{TITLE}", title)
        .replace("{SOURCE}", source)
        .replace("{THEME}", theme)
        .replace("{CATEGORY_HINT}", category_hint)
        .replace("{SNIPPET}", snippet if snippet else "Actualité du jour au Cameroun")
        .replace("{DATE}", today_str)
    )

    raw_output = generate_text(prompt)

    # Nettoyer les éventuels ```markdown englobants si le LLM en a mis
    cleaned = raw_output.strip()
    if cleaned.startswith("```markdown"):
        cleaned = cleaned[len("```markdown"):].strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:].strip()

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    return cleaned
