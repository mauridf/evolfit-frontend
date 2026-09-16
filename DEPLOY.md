# Deploy — EvolFit Frontend

Deploy padrão: **Render Static Site** (free tier) via Blueprint.

## Pré-requisitos

- Repositório no GitHub
- Backend EvolFit publicado (Render, VPS, etc.)
- Domínio do backend liberado no CORS

## Passos

1. **Configure o CORS no backend** incluindo a URL do Render:

   ```
   https://evolfit-frontend.onrender.com
   ```

2. **Crie o Blueprint no Render**
   - Dashboard → New + → Blueprint → conecte este repositório
   - Defina `VITE_API_URL` no painel do serviço (ela está `sync: false`)
   - Clique em Apply

3. **Aguarde o build** (`pnpm install && pnpm build`) e valide a URL pública.

4. **Smoke test**
   - `/` → redireciona para `/login`
   - Login funciona (CORS ok)
   - `/dashboard` abre em nova aba (SPA rewrite ok)
   - Assets com `Cache-Control: immutable`

## Deploy manual (fallback)

```bash
pnpm install --frozen-lockfile
pnpm build
# publique a pasta dist/ em qualquer host estático
```

## Docker (VPS opcional)

```bash
docker build --build-arg VITE_API_URL=https://api.exemplo.com/api -t evolfit-frontend .
docker run -p 8080:80 evolfit-frontend
```

## Domínio customizado

No painel do Render → **Settings → Custom Domain** → adicione `app.evolfit.com.br` (ou outro) e
siga as instruções de DNS (CNAME ou A).
