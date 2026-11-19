@echo off
REM 🧪 SCRIPT DE TEST - SmartShop PHASE 1 (Windows)
REM Vérifiez que tout fonctionne avant la présentation

echo.
echo 🧪 TEST SMARTSHOP PHASE 1
echo ==================================
echo.

REM Configuration
set API_URL=http://localhost:5000/api
set NEO4J_URL=http://localhost:7474

REM Test 1: Vérifier backend
echo [TEST 1] Vérification du backend...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5000/health' -ErrorAction Stop; if ($r.Content -match 'OK') { Write-Host '✅ Backend en ligne'; exit 0 } else { exit 1 } } catch { exit 1 }"
if %ERRORLEVEL% EQU 0 (
    goto TEST2
) else (
    echo ❌ Backend hors ligne. Lancez: cd backend ^&^& npm start
    exit /b 1
)

:TEST2
echo.
echo [TEST 2] Vérification de Neo4j...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:7474' -ErrorAction Stop; Write-Host '✅ Neo4j accessible'; exit 0 } catch { Write-Host '⚠️  Neo4j peut être hors ligne'; exit 0 }"

REM Test 3: Produits
echo.
echo [TEST 3] Récupération des produits...
for /f "delims=" %%A in ('powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://localhost:5000/api/products?limit=5' -ErrorAction Stop; $r.count } catch { Write-Host '❌ Erreur'; exit 1 }"') do set PRODUCT_COUNT=%%A

if defined PRODUCT_COUNT (
    echo ✅ %PRODUCT_COUNT% produits trouvés
) else (
    echo ❌ Erreur récupération produits
)

REM Test 4: Frontend
echo.
echo [TEST 4] Vérification du frontend React...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -ErrorAction Stop; Write-Host '✅ Frontend accessible'; exit 0 } catch { Write-Host '⚠️  Frontend non en ligne. Lancez: cd frontend ^&^& npm start'; exit 0 }"

echo.
echo ==================================
echo ✅ TESTS BASIQUES TERMINÉS
echo.
echo Prochaines étapes:
echo 1. Ouvrez http://localhost:3000
echo 2. Ajoutez des produits au panier
echo 3. Vérifiez que les recommandations s'affichent
echo 4. Ouvrez DevTools (F12) pour voir les logs API
echo 5. Lancez Neo4j Browser: http://localhost:7474
echo.
pause
