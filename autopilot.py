"""Point d'entree racine pour lancer l'Autopilot directement depuis la racine du projet BLOG."""
import os
import sys
import subprocess

PIPELINE_DIR = os.path.join(os.path.dirname(__file__), "content_pipeline")
AUTOPILOT_SCRIPT = os.path.join(PIPELINE_DIR, "autopilot.py")

if __name__ == "__main__":
    if not os.path.exists(AUTOPILOT_SCRIPT):
        print(f"[!] Erreur : Impossible de trouver {AUTOPILOT_SCRIPT}")
        sys.exit(1)

    cmd = [sys.executable, AUTOPILOT_SCRIPT] + sys.argv[1:]
    # Executer dans le dossier content_pipeline pour que les chemins relatifs (.env, data, etc.) fonctionnent parfaitement
    ret = subprocess.call(cmd, cwd=PIPELINE_DIR)
    sys.exit(ret)
