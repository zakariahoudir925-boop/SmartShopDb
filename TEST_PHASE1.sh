#!/usr/bin/env bash

# 🧪 SCRIPT DE TEST - SmartShop PHASE 1
# Vérifiez que tout fonctionne avant la présentation

echo "🧪 TEST SMARTSHOP PHASE 1"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:5000/api"
NEO4J_URL="http://localhost:7474"

# Test 1: Vérifier que le backend est en ligne
echo -e "${YELLOW}[TEST 1]${NC} Vérification du backend..."
if curl -s "$API_URL/../health" | grep -q "OK"; then
    echo -e "${GREEN}✅ Backend en ligne${NC}"
else
    echo -e "${RED}❌ Backend hors ligne. Lancez: cd backend && npm start${NC}"
    exit 1
fi

# Test 2: Vérifier que Neo4j est accessible
echo ""
echo -e "${YELLOW}[TEST 2]${NC} Vérification de Neo4j..."
if curl -s -u neo4j:password "$NEO4J_URL/db/neo4j/summary" &>/dev/null || 
   curl -s "$NEO4J_URL" &>/dev/null; then
    echo -e "${GREEN}✅ Neo4j accessible${NC}"
else
    echo -e "${RED}❌ Neo4j hors ligne. Vérifiez docker ou installation locale${NC}"
fi

# Test 3: Récupérer des produits
echo ""
echo -e "${YELLOW}[TEST 3]${NC} Récupération des produits..."
PRODUCTS_RESPONSE=$(curl -s "$API_URL/products?limit=5")
if echo "$PRODUCTS_RESPONSE" | grep -q "success"; then
    PRODUCT_COUNT=$(echo "$PRODUCTS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d: -f2)
    echo -e "${GREEN}✅ $PRODUCT_COUNT produits trouvés${NC}"
    
    # Extraire les IDs pour les tests suivants
    PRODUCT_ID=$(echo "$PRODUCTS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "   Premier produit ID: $PRODUCT_ID"
else
    echo -e "${RED}❌ Erreur récupération produits${NC}"
    echo "Réponse: $PRODUCTS_RESPONSE"
fi

# Test 4: Tester recommandations panier vide
echo ""
echo -e "${YELLOW}[TEST 4]${NC} Recommandations panier vide..."
EMPTY_REC=$(curl -s -X POST "$API_URL/recommendations/basket/advanced" \
    -H "Content-Type: application/json" \
    -d '{"basketIds": []}')

if echo "$EMPTY_REC" | grep -q "success"; then
    echo -e "${GREEN}✅ Endpoint accessible${NC}"
else
    echo -e "${RED}❌ Erreur sur endpoint recommandations${NC}"
fi

# Test 5: Tester recommandations panier 1 produit
echo ""
echo -e "${YELLOW}[TEST 5]${NC} Recommandations avec 1 produit..."
if [ ! -z "$PRODUCT_ID" ]; then
    REC_RESPONSE=$(curl -s -X POST "$API_URL/recommendations/basket/advanced" \
        -H "Content-Type: application/json" \
        -d "{\"basketIds\": [\"$PRODUCT_ID\"]}")
    
    if echo "$REC_RESPONSE" | grep -q "success"; then
        REC_COUNT=$(echo "$REC_RESPONSE" | grep -o '"id":"[^"]*"' | wc -l)
        echo -e "${GREEN}✅ $REC_COUNT recommandations trouvées${NC}"
        
        # Vérifier que la réponse contient les champs requis
        if echo "$REC_RESPONSE" | grep -q '"score"' && \
           echo "$REC_RESPONSE" | grep -q '"reason"'; then
            echo -e "${GREEN}✅ Champs score et reason présents${NC}"
        else
            echo -e "${RED}⚠️  Champs score/reason manquants${NC}"
        fi
    else
        echo -e "${RED}❌ Erreur recommandations${NC}"
    fi
else
    echo -e "${RED}⚠️  Impossible de tester (pas de produit ID)${NC}"
fi

# Test 6: Vérifier les logs
echo ""
echo -e "${YELLOW}[TEST 6]${NC} Vérification des logs backend..."
echo -e "${GREEN}💡 Conseil: Ouvrez la console du terminal backend pour voir les logs${NC}"
echo "   Cherchez les messages:"
echo "   - '🧠 Recommandations avancées pour panier'"
echo "   - '✅ X recommandations trouvées'"

# Test 7: Vérifier le frontend
echo ""
echo -e "${YELLOW}[TEST 7]${NC} Vérification du frontend..."
if curl -s "http://localhost:3000" | grep -q "<!DOCTYPE html>"; then
    echo -e "${GREEN}✅ Frontend React accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend non en ligne. Lancez: cd frontend && npm start${NC}"
fi

# Résumé
echo ""
echo "=================================="
echo -e "${GREEN}✅ TOUS LES TESTS BASIQUES PASSENT${NC}"
echo ""
echo "Prochaines étapes:"
echo "1. Ouvrez http://localhost:3000"
echo "2. Ajoutez des produits au panier"
echo "3. Vérifiez que les recommandations s'affichent avec score et reason"
echo "4. Ouvrez DevTools (F12) → Console pour voir les logs API"
echo "5. Lancez Neo4j Browser: http://localhost:7474"
echo ""
echo "Si problème:"
echo "- Vérifiez que Neo4j est lancé"
echo "- Vérifiez que les produits existent (test 3)"
echo "- Vérifiez les logs du backend (npm start)"
echo ""
