# EvolFit — Frontend

![version](https://img.shields.io/badge/version-0.1.0-blue)
![status](https://img.shields.io/badge/status-MVP-green)
![stack](https://img.shields.io/badge/stack-React%2019%20%2B%20Vite%20%2B%20TS%20%2B%20Tailwind-512BD4)

Interface web da plataforma **EvolFit** — fitness e saúde para academias, personal trainers e
usuários individuais. Consome 100% da API REST do backend EvolFit (`/api`) descrita em
`API_REFERENCE.md`.

> **Fonte de verdade visual:** `Proposta_Tela_EvolFit.md`, `DESIGN.md` (Kinetic Obsidian) e
> protótipos em `code.html`.

---

## Stack

| Camada          | Tecnologia                                                     |
| --------------- | -------------------------------------------------------------- |
| Base            | **React 19 + Vite 6 + TypeScript 5**                           |
| Estilo          | **Tailwind CSS 3** + tokens do Kinetic Obsidian (dark default) |
| Estado servidor | **TanStack Query v5**                                          |
| Estado global   | **Zustand** (sessão)                                           |
| Rotas           | **React Router v7**                                            |
| HTTP            | **Axios** com interceptor 401 → refresh → replay               |
| Formulários     | **React Hook Form + Zod**                                      |
| UI              | **Radix UI** (Dialog, AlertDialog, DropdownMenu)               |
| Toasts          | **Sonner**                                                     |
| Ícones          | **lucide-react**                                               |
| Gráficos        | **Recharts**                                                   |
| Testes          | **Vitest + Testing Library + MSW**                             |
| DX              | ESLint, Prettier, Husky, lint-staged                           |

---

## Requisitos

- **Node ≥ 20**
- **pnpm ≥ 9** (`npm i -g pnpm`)
- Backend EvolFit rodando em `http://localhost:5000`

---

## Início rápido

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# edite .env.local se o backend estiver em outra URL

# 3. Rodar em desenvolvimento
pnpm dev
# → http://localhost:5173
```

### Variáveis de ambiente

| Variável       | Obrigatória | Exemplo                     |
| -------------- | ----------- | --------------------------- |
| `VITE_API_URL` | sim         | `http://localhost:5000/api` |

> **Segurança:** apenas variáveis com prefixo `VITE_` são expostas ao browser. Nunca coloque
> segredos aqui.

---

## Scripts

| Script                   | O que faz                                     |
| ------------------------ | --------------------------------------------- |
| `pnpm dev`               | Servidor de desenvolvimento (Vite) em `:5173` |
| `pnpm build`             | Type-check + build de produção em `dist/`     |
| `pnpm preview`           | Serve o build localmente (para smoke test)    |
| `pnpm lint` / `lint:fix` | ESLint                                        |
| `pnpm format`            | Prettier                                      |
| `pnpm typecheck`         | `tsc --noEmit`                                |
| `pnpm test`              | Roda a suíte (Vitest)                         |
| `pnpm test:watch`        | Vitest em modo watch                          |
| `pnpm test:coverage`     | Cobertura (HTML em `coverage/`)               |

---

## Estrutura de pastas

```
src/
├── components/       # UI, layout, dashboard, health, workouts, exercises, auth, profile, system
├── hooks/            # TanStack Query hooks (useAuth, useHealth, ...)
├── lib/
│   ├── api/          # client.ts (axios + interceptor), queryClient.ts, problemDetails.ts
│   ├── auth/         # tokenStore
│   ├── theme/        # ThemeProvider
│   ├── ui/           # toast (wrapper pt-BR)
│   ├── constants.ts  # enums + labels pt-BR + ranges
│   ├── format.ts     # formatação pt-BR (UX-004)
│   └── utils/cn.ts   # clsx + tailwind-merge
├── pages/            # Rotas (auth, health, workouts, exercises, profile, dashboard)
├── schemas/          # Zod (VALID-001..003, SEC-001)
├── services/         # 1 função por endpoint (26 endpoints)
├── stores/           # Zustand
├── tests/            # setup, mocks (MSW), unit
└── types/            # DTOs 1:1 com a API
```

---

## Mapeamento com a API

| Rota do frontend                | Endpoints                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `/login`                        | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`                  |
| `/profile`, `/profile/password` | `GET/PUT /auth/profile`, `POST /auth/change-password`, `POST /auth/logout`       |
| `/dashboard`                    | `GET /dashboard`, `/dashboard/progress`, `/dashboard/compliance`                 |
| `/health`                       | `GET/DELETE /health/metrics`, `/latest`, `/evolution`                            |
| `/health/new`                   | `POST /health/metrics`                                                           |
| `/health/evolution`             | `GET /health/metrics/evolution`                                                  |
| `/workouts`                     | `GET /workouts`, `DELETE /workouts/{id}`                                         |
| `/workouts/new`                 | `POST /workouts/generate`                                                        |
| `/workouts/:id`                 | `GET /workouts/{id}`, `PUT /workouts/{id}/status`, `GET /workouts/{id}/progress` |
| `/workouts/today`               | `GET /workouts/today`, `POST /workouts/log`                                      |
| `/workouts/:id/progress`        | `GET /workouts/{id}/progress`                                                    |
| `/exercises`                    | `GET /exercises/search`, `GET /exercises/{id}`                                   |

---

## Autenticação

- **Access token:** mantido **em memória** (mais seguro contra XSS).
- **Refresh token:** `localStorage` no MVP (migração para **cookie httpOnly** prevista quando o
  backend expuser `Set-Cookie` no `/auth/refresh`).
- **Interceptor Axios:** ao receber `401`, tenta `POST /auth/refresh` **uma única vez** por
  requisição, com **refresh coordenado** (evita tempestades em paralelo) e replay da requisição
  original.
- **Replay/revogação (409):** dispara o evento `auth:expired` → modal **Sessão Expirada**.
- **Logout:** `POST /auth/logout` + limpeza local + `queryClient.clear()`.

---

## Tema

- **Dark é o padrão** (Kinetic Obsidian), com toggle light persistido em `localStorage`
  (`evolfit:theme`).
- Tokens semânticos em `index.css` (CSS vars) consumidos pelo Tailwind (`bg-background`,
  `text-foreground`, `bg-primary`, etc.).
- **Acessibilidade:** contraste AA, foco visível 3px emerald, `prefers-reduced-motion` respeitado,
  toasts com `aria-live`, modais com `role="dialog"` + focus trap (Radix).

---

## Testes

```bash
pnpm test              # execução única
pnpm test:watch        # watch
pnpm test:coverage     # com thresholds mínimos
```

- **Vitest** + **jsdom** para unidade e componentes.
- **MSW** simula a API do EvolFit (handlers em `src/tests/mocks/`).
- **Testing Library** para interações (login, validação de formulários).

---

## Convenções

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
  Validado pelo hook `commit-msg`.
- **Pre-commit:** `lint-staged` (ESLint + Prettier) + `tsc --noEmit`.
- **Código:** inglês; mensagens ao usuário em **pt-BR**; sem comentários desnecessários.
- **Erros:** RFC 7807 (`ProblemDetails`) mapeado por campo quando `422`.

---

## Deploy

Instruções de deploy para **Render** em [`DEPLOY.md`](./DEPLOY.md). O blueprint do serviço está em
[`render.yaml`](./render.yaml).

Resumo:

- Static Site com build `pnpm build` e publicação de `dist/`.
- Variável `VITE_API_URL` = URL pública da API.
- SPA rewrite: `/* → /index.html`.
- Ajustar CORS do backend para incluir o domínio do Render.

---

## Roadmap

- **MVP (Fase 1):** este repositório.
- **Fase 2:** perfil detalhado, notificações, exportação CSV, i18n.
- **Fase 3:** sugestões, benchmarks, wearables, PWA.
- **Fase 4:** multi-usuário por academia, dashboard de treinador.

---

## Licença

Código proprietário. Documentação interna. Todos os direitos reservados.
