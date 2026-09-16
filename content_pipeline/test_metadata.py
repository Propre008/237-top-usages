import os
import time
import urllib.request
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "fr,fr-FR;q=0.9,en;q=0.8",
}

DEFAULT_COVERS = {
    "tech": "/images/defaults/tech.jpg",
    "business": "/images/defaults/business.jpg",
    "energie": "/images/defaults/energie.jpg",
    "sport": "/images/defaults/sport.jpg",
    "football": "/images/defaults/sport.jpg",
    "cameroun": "/images/defaults/cameroun.jpg",
    "actualites": "/images/defaults/cameroun.jpg",
    "default": "/images/defaults/general.jpg",
}


def extract_meta_data(article_url: str, category: str = "default", timeout: int = 3) -> dict:
    """Extrait l'image de couverture (og:image) et le nom du média source

    avec fallback silencieux immédiat en cas de timeout ou blocage.
    """
    metadata = {
        "cover_image": DEFAULT_COVERS.get(category.lower(), DEFAULT_COVERS["default"]),
        "source_name": "",
        "source_url": article_url,
        "resolution_status": "FALLBACK",
        "time_ms": 0,
    }

    start_t = time.time()

    # Tentative d'extraction rapide
    try:
        r = requests.get(article_url, headers=HEADERS, timeout=timeout, allow_redirects=True)
        metadata["time_ms"] = int((time.time() - start_t) * 1000)

        final_url = r.url
        metadata["source_url"] = final_url

        domain = urlparse(final_url).netloc.replace("www.", "")
        if domain:
            parts = domain.split(".")
            metadata["source_name"] = parts[0].capitalize() if parts else "Source"

        if r.status_code == 200:
            soup = BeautifulSoup(r.text[:30000], "html.parser")
            og_img = (
                soup.find("meta", property="og:image")
                or soup.find("meta", attrs={"name": "twitter:image"})
                or soup.find("meta", property="twitter:image")
            )
            if og_img and og_img.get("content"):
                img_url = og_img["content"].strip()
                if img_url.startswith("http"):
                    metadata["cover_image"] = img_url
                    metadata["resolution_status"] = "CONFIRMED_OG_IMAGE"
            else:
                metadata["resolution_status"] = "NO_OG_META_FALLBACK_DEFAULT"
        else:
            metadata["resolution_status"] = f"HTTP_{r.status_code}_FALLBACK_DEFAULT"

    except requests.exceptions.Timeout:
        metadata["time_ms"] = int((time.time() - start_t) * 1000)
        metadata["resolution_status"] = "TIMEOUT_FALLBACK_DEFAULT"
    except Exception as e:
        metadata["time_ms"] = int((time.time() - start_t) * 1000)
        metadata["resolution_status"] = f"ERROR_{type(e).__name__}_FALLBACK_DEFAULT"

    return metadata


if __name__ == "__main__":
    print("==================================================")
    print("[*] TEST UNITAIRE PROTOCOLE - EXTRACTION METADONNEES")
    print("==================================================")

    # 3 URLs réelles de test :
    # 1. Un média sportif international fiable (L'Équipe / Ouest-France)
    # 2. Un média tech (Les Numériques / Frandroid)
    # 3. Une URL Google News avec redirection complexe
    test_urls = [
        {
            "category": "football",
            "label": "Article Sport / Foot direct",
            "url": "https://www.lequipe.fr/Football/Actualites/L-association-de-clubs-amateurs-du-cameroun-reclame-une-enquete-contre-samuel-eto-o-le-president-de-la-federation/1507963",
        },
        {
            "category": "tech",
            "label": "Article Tech / Smartphone direct",
            "url": "https://www.frandroid.com/marques/apple/2367482_ios-18-astuces-et-nouveautes",
        },
        {
            "category": "energie",
            "label": "Lien Google News avec redirection complexe",
            "url": "https://news.google.com/rss/articles/CBMisgJBVV95cUxQUlRqSVpHZlE4WXp5SjVja1NFM0NBUXBWUFNacVR6b3FtQWNoUkxWcEdzNmtBb2N4eFhBRkRuUGNZUW9IaDhzTzBNam1FRmRYZXUwY0JsYTZUUlI3bXN5QVYzYW5fT1hyR1M5RjFsLUgyQnZlZTZST2FOVlhzNWMzRjdvY21ZUmxiWUZyWTJzaUUzVGtDM1dxUFBnNUxmZUtTNkxadzNUem1pLXRmZ1hnaUtBeHd3Um40R0RlUzg1Z2J3X0hPT3ZKWUdQbHBHMnFEa3BJYXFScEd4LWN2SU9KMzhGZXJfZ0JRNHZWTmlhTEUzOE1aMlhJOXRmQ3NwME45SWRPOU02R3lPWFBpeE1GQVlHNWVNeUM0dlRhY0VCUlR4RC13T2pIZVlaWEM4dzNMVGc?oc=5",
        },
    ]

    for i, test in enumerate(test_urls, 1):
        print(f"\n[{i}/3] Test sur : {test['label']} (Categorie: {test['category']})")
        print(f"     URL testee : {test['url'][:70]}...")
        res = extract_meta_data(test["url"], category=test["category"], timeout=4)
        print(f"     -> Statut       : {res['resolution_status']}")
        print(f"     -> Temps        : {res['time_ms']} ms")
        print(f"     -> Source Media : {res['source_name']}")
        print(f"     -> Image Finale : {res['cover_image'][:80]}...")

    print("\n==================================================")
    print("[*] FIN DU TEST DE VALIDATION PROTOCOLE")
    print("==================================================")
