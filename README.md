# NAP 02 - Projeto Web

Tier List de filmes e álbuns, com login e CRUD protegido por autenticação.

- **Frontend:** React + Vite
- **Backend:** FastAPI (Python)
- **Banco de dados:** PostgreSQL (Supabase)
- **Autenticação:** Supabase Auth (email/senha, JWT)
- **Busca de mídia:** TMDb (filmes) e iTunes Search API (álbuns), via proxy no backend

## Como funciona

Cada usuário cadastra filmes/álbuns (buscando pelo nome, sem precisar digitar
tudo na mão — capa, título e diretor/artista vêm preenchidos automaticamente).
O item novo entra na área "Não classificados", e a organização nas tiers
(S, A, B, C, D) é feita arrastando o card (drag-and-drop, com `@dnd-kit`,
funciona em mouse e touch). Toda mudança de tier fica registrada num
histórico. Só é possível ver e editar os próprios itens — cada requisição
no backend valida o token JWT do Supabase e filtra os dados pelo `user_id`.

A busca por filmes/álbuns passa pelo backend (não é chamada direto do
navegador) porque as APIs externas não liberam CORS para uso client-side.
Pelo mesmo motivo, as capas exibidas no app também passam por um proxy
(`/image-proxy`) — necessário pra poder exportar a tier list como imagem
(o `<canvas>` do navegador recusa "revelar" pixels de imagens
cross-origin sem cabeçalho CORS).

Tem um botão **"Exportar imagem"** que baixa a tier list como PNG
(usando `html2canvas`), pra compartilhar ou postar em qualquer lugar.

## Configuração

Ambos os diretórios (`backend/` e `frontend/`) usam um arquivo `.env` (não
versionado) com as credenciais do projeto Supabase:

**backend/.env**
```
DATABASE_URL=postgresql://postgres.<ref>:<senha>@<pooler-host>.pooler.supabase.com:6543/postgres?sslmode=require
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SECRET_KEY=<secret key>
TMDB_API_KEY=<api key v3 do themoviedb.org>
```

Usamos a **connection pooler** do Supabase (porta 6543) em vez da conexão
direta (porta 5432) — pega em Project Settings → Connect → "Transaction
pooler". Latência de rede até o banco continua existindo (é distância física
até o servidor), mas o frontend contorna isso com atualização otimista: a
tela muda assim que você solta o item, sem esperar a resposta do servidor.

**frontend/.env**
```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key>
VITE_API_URL=http://127.0.0.1:8000
```

## Rodando o projeto

```bash
# backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# frontend (outro terminal)
cd frontend
npm run dev
```

Backend em http://127.0.0.1:8000 (docs em `/docs`), frontend em http://localhost:5173.

## Rotas da API

Todas exigem `Authorization: Bearer <token>` (token de sessão do Supabase Auth).

- `GET /items` - lista os itens do usuário logado
- `POST /items` - cria um item (`title`, `type`, `creator`, `artwork_url`); entra sem tier (pool)
- `PUT /items/{id}` - move o item para outro tier ou de volta ao pool (`tier: null`), registra no histórico
- `DELETE /items/{id}` - remove um item
- `GET /items/{id}/history` - histórico de mudanças de tier do item

Rotas públicas (sem autenticação, usadas pelo formulário de busca):

- `GET /media-search?query=&type=filme|album` - busca filmes (TMDb) ou álbuns (iTunes)
- `GET /media-search/movie-director/{id}` - busca o diretor de um filme no TMDb
