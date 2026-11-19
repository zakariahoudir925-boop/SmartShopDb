# Contribuer à SmartShop

Merci de votre intérêt pour SmartShop! Ce document explique comment contribuer au projet.

## 📋 Avant de Commencer

1. Fork le projet
2. Clone ton fork localement
3. Crée une branche pour ta fonctionnalité: `git checkout -b feature/ma-fonctionnalite`

## 🎯 Types de Contributions Bienvenues

### 🐛 Signaler des Bugs
- Décris le problème clairement
- Fournis des étapes pour reproduire
- Inclus ta configuration (OS, versions)
- Partage les logs d'erreur

### ✨ Proposer des Fonctionnalités
- Explique le cas d'usage
- Fournis des exemples
- Discute de l'implémentation proposée

### 📝 Améliorer la Documentation
- Corrections de typos
- Exemples supplémentaires
- Clarifications

### 🧹 Refactoring du Code
- Améliorations de performance
- Meilleure maintenabilité
- Réduction des dépendances

## 📐 Standards de Code

### Backend (JavaScript/Node.js)
```javascript
// Utiliser async/await
async function loadData() {
  try {
    const result = await database.query();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Toujours fermer les ressources
session.close();
driver.close();

// Utiliser des paramètres pour les requêtes Neo4j
session.run('MATCH (p:Product {id: $id})', { id });
```

### Frontend (React)
```javascript
// Composants fonctionnels avec hooks
function MyComponent({ prop }) {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Logique d'effet
  }, []);
  
  return <div>{state}</div>;
}

// Noms explicites
const [isLoading, setIsLoading] = useState(false);
const [productList, setProductList] = useState([]);

// Gestion d'erreur appropriée
try {
  const data = await api.getData();
} catch (error) {
  console.error('Failed to load data:', error);
}
```

### Conventions de Nommage
- Variables/functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case` (sauf composants React)

## 🧪 Tests

### Avant de proposer une PR
```bash
# Backend
cd backend
npm test
npm run lint

# Frontend
cd frontend
npm test
npm run lint
```

### Écrire des tests
```javascript
describe('ProductService', () => {
  test('should get product by id', async () => {
    const product = await service.getProductById('P1');
    expect(product).toBeDefined();
    expect(product.id).toBe('P1');
  });
});
```

## 🔄 Processus de Pull Request

1. **Avant de créer une PR**
   - Mets à jour ta branche avec main
   - Assure-toi que tous les tests passent
   - Lis la documentation pertinente

2. **Description de la PR**
   - Titre clair et concis
   - Description détaillée des changements
   - Lien vers les issues connexes
   - Screenshots si UI changes

3. **Exemple de Description**
   ```
   ## Description
   Ajoute un filtrage par prix dans la page Produits
   
   ## Type de Changement
   - [x] Nouvelle fonctionnalité
   - [ ] Bug fix
   - [ ] Documentation
   
   ## Testing
   - [x] Tests unitaires ajoutés
   - [x] Tests manuels effectués
   
   ## Screenshots
   [Image du nouveau filtre]
   ```

4. **Révision**
   - Réponds aux commentaires
   - Fais les changements demandés
   - Repousse ta branche

## 📚 Structure du Code

### Ajouter un Nouveau Service Backend
```javascript
// backend/services/myService.js
class MyService {
  constructor(driver) {
    this.driver = driver;
  }
  
  async myMethod(param) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n:Node {id: $id}) RETURN n',
        { id: param }
      );
      return result.records.map(/* transform */);
    } finally {
      await session.close();
    }
  }
}

module.exports = MyService;
```

### Ajouter une Route API
```javascript
// backend/routes/myroute.js
module.exports = (myService) => {
  router.get('/myendpoint/:id', async (req, res) => {
    try {
      const data = await myService.myMethod(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  return router;
};
```

### Ajouter un Composant React
```javascript
// frontend/src/components/MyComponent.js
import React, { useState, useEffect } from 'react';
import './MyComponent.css';

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    try {
      // Logique
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
}

export default MyComponent;
```

## 🔐 Considérations de Sécurité

- **Toujours** utiliser des paramètres pour les requêtes Neo4j
- **Ne jamais** exposer les mots de passe en dur
- **Valider** les entrées utilisateur
- **Utiliser** HTTPS en production
- **Encoder** les données sensibles

## 📚 Documentation

- Mets à jour README.md si tu ajoutes des dépendances
- Documente les APIs nouvelles
- Ajoute des commentaires pour la logique complexe
- Mets à jour GUIDE_AVANCE.md pour les concepts avancés

## 🚀 Déploiement

- S'assurer que le Docker compose fonctionne
- Tester en production mode
- Documenter les étapes de migration si nécessaire

## 💬 Questions?

- Ouvre une issue pour les discussions
- Vérifie les issues existantes
- Consulte la documentation principale

## ✅ Checklist de Contribution

- [ ] J'ai lu le CONTRIBUTING.md
- [ ] Ma branche est à jour avec main
- [ ] J'ai testé mes changements localement
- [ ] J'ai écrit/mis à jour les tests
- [ ] Le code suit les conventions du projet
- [ ] J'ai mis à jour la documentation
- [ ] Les messages de commit sont clairs
- [ ] Pas de `console.log` ou `debugger` en debug

## 📝 Convention de Commit

```
feat: Ajoute filtrage par prix
fix: Corrige bug de recommandation
docs: Met à jour README
refactor: Améliore performance
test: Ajoute tests unitaires
style: Formate le code
```

## 🎉 Merci!

Chaque contribution, grande ou petite, est appréciée. Ensemble, nous rendons SmartShop meilleur!

---

**Bon développement!** 💻✨
