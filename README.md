# Sievers Market — frontend

Веб-клиент маркетплейса Sievers Market.

## Запуск
```bash
nvm use            # Node из .nvmrc (22)
npm install
cp .env.example .env.local
npm run dev
```

## Скрипты
| Команда | Что делает |
|---|---|
| `npm run dev` | dev-сервер |
| `npm run typecheck` | генерация типов Next + `tsc` |
| `npm run lint` | ESLint |
| `npm run build` | production-сборка |
| `npm run gen:api` | типы из OpenAPI бэкенда в `src/lib/api/schema.d.ts` |

Правила проекта для разработки (в том числе с агентом) — в [`CLAUDE.md`](./CLAUDE.md).
