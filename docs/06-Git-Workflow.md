# Git Workflow

## Permanent Branch

`main` must remain stable and deployable.

## Feature Branch Naming

```text
feature/admin-auth
feature/admin-dashboard
feature/homepage-cms
feature/services-cms
feature/media-library
feature/seo-manager
feature/chatbot
feature/crm
```

## Start a Feature

```bash
git checkout main
git pull origin main
git checkout -b feature/admin-auth
```

## Save Work

```bash
git add .
git commit -m "feat(admin): add authentication foundation"
git push -u origin feature/admin-auth
```

## Before Merge

```bash
npm run build
```

## Merge a Completed Feature

```bash
git checkout main
git pull origin main
git merge feature/admin-auth
git push origin main
```

## Version Tag

```bash
git tag -a v0.2.0 -m "Admin authentication"
git push origin v0.2.0
```

## Commit Prefixes

- `feat:` new functionality
- `fix:` bug fix
- `docs:` documentation
- `refactor:` internal code improvement
- `style:` visual or formatting change
- `test:` test changes
- `chore:` maintenance
