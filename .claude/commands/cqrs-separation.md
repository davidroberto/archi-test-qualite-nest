# Séparation CQRS (Command / Query)

## Principe

CQRS sépare les opérations de **lecture** (Query) des opérations d'**écriture** (Command). Les deux chemins ont des besoins différents et doivent être traités différemment.

## Pourquoi

Les lectures et les écritures ont des contraintes opposées :
- **Écriture** : garantir la cohérence du domaine, appliquer les règles métier, manipuler des entités riches
- **Lecture** : retourner des données optimisées pour l'affichage, agréger, joindre, calculer — sans logique métier

Mélanger les deux pousse à surcharger les entités (méthodes de calcul pour l'affichage) ou à sous-optimiser les lectures (charger un graphe d'objets entier pour afficher 3 champs).

## Règles

### Write path : Controller → Service → TypeORM Repository

Les opérations d'écriture (create, update, delete, actions métier) passent par le Repository TypeORM natif.

```
Controller  →  Service  →  Repository<Entity>
   (HTTP)      (métier)     (TypeORM natif)
```

- Le **controller** reçoit la requête, valide le body via le DTO, délègue au service
- Le **service** applique la logique métier, utilise `@InjectRepository(Entity)` pour accéder aux repos TypeORM, lance des exceptions si les règles sont violées
- Le **repository TypeORM** gère la persistance : `save()`, `delete()`, `findOneBy()`

Le service manipule des **entités** (objets riches avec relations). C'est le bon endroit pour vérifier l'existence, valider les règles métier, orchestrer les modifications.

### Read path : Controller → Service → Custom Repository (SQL)

Les opérations de lecture passent par un repository custom qui exécute du SQL directement.

```
Controller  →  Service  →  Custom Repository
   (HTTP)      (orchestre)   (DataSource + SQL)
```

- Le **controller** reçoit la requête, délègue au service
- Le **service** orchestre (vérification d'existence si nécessaire), délègue au repository
- Le **repository custom** utilise `DataSource.query()` avec du SQL brut, paramétré (`$1, $2`), et retourne des objets plats

Le repository de lecture est le seul endroit où vivent les requêtes SQL. Il gère les jointures, agrégations, filtrage, calculs, et retourne les données prêtes à être consommées par le controller — aucune transformation JS dans le service.

### Comment choisir le path

| Situation | Path |
|-----------|------|
| L'opération modifie l'état (create, update, delete) | Write |
| L'opération applique une action métier (payer, valider) | Write |
| L'opération retourne des données sans modifier l'état | Read |
| L'opération a besoin de jointures complexes ou d'agrégation | Read |

### Le service read est léger

Un service de lecture ne contient que :
1. Vérification d'existence (optionnelle) → `NotFoundException`
2. Appel au repository
3. Retour du résultat

Il ne contient JAMAIS : du filtrage JS, du mapping, du calcul, de la transformation de données.

## Anti-patterns

- **Repository TypeORM pour les lectures complexes** : `findOne({ relations: [...] })` charge tout un graphe d'objets en mémoire → utiliser du SQL ciblé
- **SQL dans le service** : le service utilise `DataSource.query()` directement → déplacer dans un repository custom
- **Filtrage JS après une requête SQL** : `.filter()` ou `.map()` dans le service sur les résultats du repository → faire le filtrage en SQL
- **Repository custom pour les écritures** : écrire du SQL INSERT/UPDATE à la main → utiliser le Repository TypeORM natif qui gère les relations et le cascade
