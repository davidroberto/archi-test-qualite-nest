# Vertical Slice Architecture

## Principe

L'architecture vertical slice organise le code par **fonctionnalité métier** (use case), pas par couche technique. Chaque use case est un dossier autonome contenant tout ce qui lui est propre. On peut supprimer un use case sans impacter les autres.

## Pourquoi

L'architecture en couches (controllers/, services/, repositories/) crée un **couplage horizontal** : modifier une feature oblige à toucher des fichiers dispersés dans toute l'arborescence. Le vertical slicing localise le changement : une feature = un dossier. Cela facilite la lisibilité, le review, le refactoring et la suppression de code mort.

## Règles

### Un use case = un dossier isolé

Chaque opération métier vit dans son propre répertoire. Le nom du dossier EST le nom du use case, en camelCase avec un verbe d'action.

```
src/order/
├── createOrder/        ← use case autonome
├── addProductToOrder/  ← use case autonome
├── payOrder/           ← use case autonome
└── getOrderSummary/    ← use case autonome
```

Chaque dossier contient **uniquement** les fichiers nécessaires à ce use case. Pas de fichier partagé entre use cases sauf les entités.

### Les entités sont le seul élément partagé

Les entités TypeORM (`*.entity.ts`) vivent à la racine du module car elles représentent le modèle de domaine partagé. Tout le reste est propre au use case.

### Pas de couches horizontales

Interdit :
- `controllers/` avec tous les controllers du module
- `services/` avec tous les services
- `repositories/` avec tous les repositories
- `dtos/` avec tous les DTOs
- `index.ts` (barrel files) qui regroupent des exports

### Nommage des fichiers

Le nom du fichier encode le use case ET le rôle technique :

```
{useCaseName}.{role}.ts
```

Exemples : `createProduct.controller.ts`, `listAllProducts.repository.ts`, `addProductToOrder.requestDTO.ts`

### Quand créer un nouveau use case

Un nouveau dossier use case se justifie quand :
- Il y a une **nouvelle intention utilisateur** distincte (créer, lire, supprimer, payer...)
- L'opération a ses **propres règles métier**
- L'opération pourrait exister ou disparaître indépendamment des autres

Ne PAS créer un use case pour un helper interne ou un service technique partagé — ceux-là vivent à la racine du module.

## Anti-patterns

- **God service** : un service qui gère plusieurs use cases → découper
- **Réutilisation prématurée** : abstraire un service commun entre 2 use cases avant d'avoir 3+ cas concrets → dupliquer est OK
- **Shared DTOs** : un DTO utilisé par plusieurs use cases → chaque use case a son propre DTO
- **Cross-slice imports** : un use case qui importe depuis un autre use case du même module → remonter le code partagé au niveau entité ou créer un service à la racine du module
