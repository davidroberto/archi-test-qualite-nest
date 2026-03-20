# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # Build (prebuild: rimraf dist)
npm run start:dev      # Dev server with watch
npm test               # Unit tests (Jest)
npm test -- --testPathPattern=createProduct  # Single test file
npm run test:e2e       # E2E tests (Supertest)
npm run lint           # ESLint with --fix
npm run format         # Prettier
```

## Architecture

NestJS 9 application with **vertical feature slicing** and **CQRS-inspired separation**.

### Structure

```
src/
├── catalog/                    # Feature module
│   ├── catalog.module.ts       # Declares all catalog controllers/providers
│   ├── product.entity.ts       # TypeORM entity (UUID PK)
│   ├── category.entity.ts      # TypeORM entity (UUID PK)
│   ├── createProduct/          # One directory per use case
│   │   ├── createProduct.controller.ts
│   │   ├── createProduct.service.ts
│   │   └── createProduct.requestDTO.ts
│   ├── listAllProducts/        # Read use cases have a repository layer
│   │   ├── listAllProducts.controller.ts
│   │   ├── listAllProducts.service.ts
│   │   └── listAllProducts.repository.ts
│   └── ...
```

**Key pattern:** each use case is a self-contained directory (`createProduct/`, `deleteCategory/`, `listAllProducts/`...). Write operations use Controller → Service → TypeORM Repository. Read operations add a custom Repository with SQL queries via DataSource.

### Database

- **PostgreSQL** via TypeORM (`synchronize: true`, no migrations)
- Docker Compose for local DB on port 5433
- Entities auto-loaded via `autoLoadEntities: true`
- Entities: `Product` (name, description, price) ↔ `Category` (name) — ManyToMany

### API

- Global prefix: `/api`
- Port: 8000
- CORS enabled
- Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`

## Conventions

### Naming

- Files: `{useCaseName}.{type}.ts` — camelCase use case, dot-separated type (`createProduct.service.ts`)
- Classes: PascalCase with action verb (`CreateProductService`, `ListAllProductsController`)
- Service entry method: `execute()`
- Repository methods: `findAll()`
- Request DTOs: `{UseCase}RequestDTO` — no response DTOs, return entities directly

### Code Style

- `singleQuote: true`, `trailingComma: 'all'`
- No barrel files (`index.ts`) — direct imports to source file
- Validation via `class-validator` decorators on request DTOs
- Exception handling: NestJS built-in exceptions (`NotFoundException`, etc.)

### Tests

- Unit tests: `*.spec.ts` alongside source in `src/`
- E2E tests: `*.e2e-spec.ts` in `test/`
- E2E pattern: `Test.createTestingModule` + `supertest`
