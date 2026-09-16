import os
import time
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
PRIMARY_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

# Modèles de secours si le modèle principal subit une surcharge temporaire (503 UNAVAILABLE)
FALLBACK_MODELS = [
    PRIMARY_MODEL,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
]
# Éliminer les doublons tout en conservant l'ordre
UNIQUE_MODELS = []
for m in FALLBACK_MODELS:
    if m not in UNIQUE_MODELS:
        UNIQUE_MODELS.append(m)


def _ensure_key():
    if not API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY non definie.\n"
            "   Cree un fichier .env dans content_pipeline/ avec :\n"
            "   GEMINI_API_KEY=ta_cle_api_ici\n"
            "   Tu peux obtenir une cle gratuite sur https://aistudio.google.com/apikey"
        )


def generate_text(prompt: str) -> str:
    """Genere du texte via Gemini avec retry automatique et bascule sur modele de secours en cas de surcharge 503."""
    _ensure_key()

    last_err = None

    for model_name in UNIQUE_MODELS:
        for attempt in range(1, 3):  # 2 essais par modèle
            try:
                from google import genai

                client = genai.Client(api_key=API_KEY)
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                err_str = str(e)
                last_err = e
                # Si surcharge temporaire (503 ou 429), attendre un instant
                if "503" in err_str or "UNAVAILABLE" in err_str or "429" in err_str:
                    wait_sec = attempt * 3
                    print(f"   [!] Modele '{model_name}' sous forte demande (503). Nouvelle tentative dans {wait_sec}s...")
                    time.sleep(wait_sec)
                    continue
                else:
                    # Autre erreur, tenter avec l'ancien package ou le modèle suivant
                    break

        print(f"   [!] Bascule vers le modele alternatif suivant...")

    # Fallback ultime sur l'ancien package si besoin
    try:
        import google.generativeai as genai_old

        genai_old.configure(api_key=API_KEY)
        for m in ["gemini-1.5-flash", "gemini-1.5-pro"]:
            try:
                model = genai_old.GenerativeModel(m)
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text
            except Exception:
                continue
    except ImportError:
        pass

    raise RuntimeError(f"Echec de generation apres plusieurs tentatives et modeles : {last_err}")
