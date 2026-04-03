# Séparation des responsabilités (Controller / Service / Repository)

## Principe

Chaque couche a un rôle strict et unique. Aucune couche ne déborde sur les responsabilités d'une autre.

## Pourquoi

Quand les responsabilités se mélangent, le code devient imprévisible : on ne sait plus où chercher la logique métier, les requêtes SQL se retrouvent éparpillées, et les tests unitaires deviennent impossibles à écrire proprement. Des responsabilités claires rendent chaque fichier prévisible.

## Les 3 couches

### Controller — Point d'entrée HTTP

**Responsabilité** : recevoir la requête, valider les inputs, déléguer au service, retourner la réponse.

**Ce qu'il fait :**
- Déclare la route HTTP (`@Get`, `@Post`, `@Delete`, etc.)
- Valide les inputs via les DTOs et les Pipes (`ParseUUIDPipe`)
- Extrait les données de la requête (`@Body`, `@Param`, `@Query`)
- Appelle `service.execute()` avec les paramètres extraits
- Retourne le résultat directement (pas de transformation)

**Ce qu'il ne fait JAMAIS :**
- Logique métier (if/else sur des règles business)
- Accès aux données (repository, DataSource, SQL)
- Transformation de données
- Try/catch (les exceptions NestJS sont gérées globalement)

### Service — Logique métier

**Responsabilité** : appliquer les règles métier, orchestrer les opérations, garantir la cohérence.

**Ce qu'il fait :**
- Vérifie l'existence des entités → `NotFoundException`
- Applique les règles métier → `BadRequestException`
- Orchestre les appels (vérifier, puis créer, puis sauvegarder)
- Manipule les entités TypeORM (pour les writes)
- Délègue au repository custom (pour les reads)

**Ce qu'il ne fait JAMAIS :**
- Requêtes SQL brutes (`DataSource.query()`)
- Filtrage ou mapping JS sur des résultats de requête (`.filter()`, `.map()`, `.reduce()` sur des rows SQL)
- Décorateurs HTTP (`@Get`, `@Body`, etc.)
- Logique de présentation (formater des dates, construire des labels)

### Repository — Accès aux données

**Deux types de repositories** dans cette architecture :

**Repository TypeORM natif** (writes) :
- Injecté via `@InjectRepository(Entity)`
- Utilisé dans les services d'écriture
- Méthodes : `save()`, `delete()`, `findOneBy()`, `findOne()`

**Repository custom** (reads) :
- Classe `@Injectable()` avec `DataSource` injecté
- Injecté dans le service via `@Inject(CustomRepository)`
- Exécute des requêtes SQL paramétrées via `this.dataSource.query()`
- Gère TOUTE la logique d'accès aux données : jointures, agrégations, filtrage, calculs
- Retourne des objets prêts à consommer — pas de transformation nécessaire après

**Ce qu'il ne fait JAMAIS :**
- Logique métier (vérifications, règles business)
- Lancer des exceptions métier (`NotFoundException`, `BadRequestException`)
- Appeler d'autres services

## Test décisif

Pour chaque ligne de code, demande-toi :

| Question | Si oui → |
|----------|----------|
| Est-ce que ça touche HTTP ? (route, body, param) | Controller |
| Est-ce une règle métier ? (vérification, contrainte, orchestration) | Service |
| Est-ce que ça accède à la base de données ? (SQL, query, save) | Repository |

Si une ligne est difficile à classer, c'est un signe que les responsabilités sont mélangées.

## Anti-patterns courants

- **Fat controller** : le controller contient des `if` métier ou des appels repository → extraire dans le service
- **Fat service** : le service fait du SQL, du `.filter()`, du `.map()` sur des rows → déplacer dans le repository
- **Anemic repository** : le repository retourne des données brutes que le service retransforme → enrichir la requête SQL
- **Service qui catch les exceptions** : le service wrap tout dans un try/catch → laisser les exceptions remonter naturellement
