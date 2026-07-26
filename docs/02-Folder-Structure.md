# Folder Structure

```text
warm-life-limited-website/
├── .github/
│   └── workflows/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── README.md
├── docs/
├── public/
├── scripts/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   │   ├── admin/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── validations/
├── .env.local
├── .env.local.example
├── .gitignore
├── CHANGELOG.md
├── README.md
└── package.json
```

## Rules

- `src/app` contains routes and route-specific layouts.
- `src/components/ui` contains reusable visual building blocks.
- `src/components/sections` contains public website sections.
- `src/components/admin` contains admin-only components.
- `src/lib` contains integrations and low-level helpers.
- `src/services` contains application-level business operations.
- `src/types` contains shared TypeScript types.
- `src/validations` contains form and API validation schemas.
- Database changes must be stored as migrations.
- Secrets must never be committed.
