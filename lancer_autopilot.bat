@echo off
title Autopilot 237 - Veille et Publication Continue
color 0A

cd /d "%~dp0content_pipeline"

echo ========================================================
echo         AUTOPILOT 237 - VEILLE ET PUBLICATION
echo ========================================================
echo.
echo 1. Lancer un cycle immediat (1 article)
echo 2. Lancer un cycle complet (3 articles : Foot, Tech, Energie)
echo 3. Lancer en continu 24/7 (toutes les 6 heures)
echo 4. Simulation sans publier (Dry Run)
echo 5. Quitter
echo.

set /p choice="Choisissez une option (1-5) : "

if "%choice%"=="1" (
    echo.
    echo [*] Lancement d'un cycle immediat (1 article)...
    python autopilot.py --run-once --count 1
    pause
) else if "%choice%"=="2" (
    echo.
    echo [*] Lancement d'un cycle complet (3 articles)...
    python autopilot.py --run-once --count 3
    pause
) else if "%choice%"=="3" (
    echo.
    echo [*] Lancement en boucle continue 24/7 (Ctrl+C pour arreter)...
    python autopilot.py --loop --interval-hours 6 --count 2
) else if "%choice%"=="4" (
    echo.
    echo [*] Simulation de veille...
    python autopilot.py --dry-run --count 5
    pause
) else (
    echo Au revoir !
)
