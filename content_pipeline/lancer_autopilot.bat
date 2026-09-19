@echo off
title Autopilot 237 - Veille et Publication Continue (Cameroun & Afrique)
color 0A

cd /d "%~dp0"

echo ========================================================
echo   AUTOPILOT 237 - PORTAIL D'ACTUALITES CAMEROUN & AFRIQUE
echo ========================================================
echo.
echo 1. Lancer un cycle immediat (1 article)
echo 2. Lancer un cycle complet (3 articles : Sport, Tech, Eco)
echo 3. Mode Express Continu (toutes les 1 heure - Breaking News)
echo 4. Mode Croisiere Continu (toutes les 4 heures - Rythme ideal)
echo 5. Simulation sans publier (Dry Run)
echo 6. Quitter
echo.

set /p choice="Choisissez une option (1-6) : "

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
    echo [*] Lancement en boucle express 24/7 (toutes les 1 heure, Ctrl+C pour arreter)...
    python autopilot.py --loop --interval-hours 1 --count 1
) else if "%choice%"=="4" (
    echo.
    echo [*] Lancement en boucle croisiere 24/7 (toutes les 4 heures, Ctrl+C pour arreter)...
    python autopilot.py --loop --interval-hours 4 --count 2
) else if "%choice%"=="5" (
    echo.
    echo [*] Simulation de veille...
    python autopilot.py --dry-run --count 5
    pause
) else (
    echo Au revoir !
)
