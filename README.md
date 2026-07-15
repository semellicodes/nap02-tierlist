# NAP 02 - Tier List de Filmes, Séries e Álbuns

## Objetivo

Aplicação web para montar tier lists pessoais (rankings em S, A, B, C, D) de
filmes, séries e álbuns. Cada usuário faz login, cadastra seus itens
buscando pelo nome (capa, título e diretor/artista vêm preenchidos
automaticamente) e organiza tudo arrastando os cards entre as tiers.

## Tecnologias utilizadas

- **Frontend:** React + Vite
- **Backend:** FastAPI (Python)
- **Banco de dados:** PostgreSQL (Supabase)
- **Autenticação:** Supabase Auth (email/senha, JWT)
- **Busca de mídia:** TMDb (filmes e séries) e iTunes Search API (álbuns), via proxy no backend
- **Drag-and-drop:** `@dnd-kit`
- **Exportação de imagem:** `html2canvas`

## Estrutura do projeto

```
nap02-web/
├── backend/
│   ├── main.py            # rotas de tier-lists e items, autenticação por rota
│   ├── auth.py             # validação do JWT do Supabase
│   ├── database.py         # engine/sessão do SQLAlchemy
│   ├── models.py           # modelos ORM (TierList, Item, TierHistory)
│   ├── schemas.py          # schemas Pydantic (request/response)
│   ├── media_search.py     # proxy de busca (TMDb / iTunes)
│   └── image_proxy.py      # proxy de imagens (capas)
└── frontend/
    └── src/
        ├── api/             # chamadas fetch para o backend (uma por recurso)
        ├── components/      # componentes React + CSS por componente
        ├── hooks/           # useItems, useTierLists, useSession... (estado + chamadas de API)
        ├── constants/       # constantes (tiers)
        └── lib/             # utilidades (export de imagem, proxy de mídia, cliente Supabase)
```

## Como funciona

O item novo entra na área "Não classificados", e a organização nas tiers
(S, A, B, C, D) é feita arrastando o card (drag-and-drop, funciona em mouse
e touch). Toda mudança de tier fica registrada num histórico. Só é possível
ver e editar os próprios itens — cada requisição no backend valida o token
JWT do Supabase e filtra os dados pelo `user_id`.

A busca por filmes/séries/álbuns passa pelo backend (não é chamada direto do
navegador) porque as APIs externas não liberam CORS para uso client-side.
Pelo mesmo motivo, as capas exibidas no app também passam por um proxy
(`/image-proxy`) — necessário pra poder exportar a tier list como imagem
(o `<canvas>` do navegador recusa "revelar" pixels de imagens cross-origin
sem cabeçalho CORS).

## Funcionalidades

- Login, cadastro (com confirmação de email por código) e redefinição de senha
- Múltiplas tier lists por usuário
- Busca de filmes, séries (TMDb) e álbuns (iTunes) com preenchimento automático de capa e diretor/artista
- Adicionar, mover (drag-and-drop) e excluir itens
- Histórico de mudanças de tier por item
- Exportar a tier list como imagem PNG
- Feedback visual de sucesso (toast) ao criar, mover/editar ou excluir um item
- Indicador de carregamento enquanto os dados são buscados na API
- Confirmação antes de excluir qualquer item ou tier list
- Validação dos formulários (campos obrigatórios) antes de enviar para a API
- Mensagens de erro amigáveis para falhas de comunicação com a API

## Dependências necessárias

- Python 3.11+ e `pip` (backend)
- Node.js 18+ e `npm` (frontend)
- Uma conta/projeto no [Supabase](https://supabase.com) (banco + autenticação)
- Uma API key da [TMDb](https://www.themoviedb.org) (v3)

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

## Como executar o backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend em http://127.0.0.1:8000 (documentação interativa em `/docs`).

## Como executar o frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend em http://localhost:5173.

## Como acessar a aplicação

Com backend e frontend rodando (veja as duas seções acima), abra
http://localhost:5173 no navegador, crie uma conta (ou entre com uma
existente) e comece a montar suas tier lists.

## Rotas da API

Todas exigem `Authorization: Bearer <token>` (token de sessão do Supabase Auth).

- `GET /items` - lista os itens do usuário logado
- `POST /items` - cria um item (`title`, `type`, `creator`, `artwork_url`); entra sem tier (pool)
- `PUT /items/{id}` - move o item para outro tier ou de volta ao pool (`tier: null`), registra no histórico
- `DELETE /items/{id}` - remove um item
- `GET /items/{id}/history` - histórico de mudanças de tier do item
- `GET /tier-lists` - lista as tier lists do usuário logado
- `POST /tier-lists` - cria uma tier list (`name`)
- `PUT /tier-lists/{id}` - renomeia uma tier list
- `DELETE /tier-lists/{id}` - remove uma tier list e todos os seus itens

Rotas públicas (sem autenticação, usadas pelo formulário de busca):

- `GET /media-search?query=&type=filme|serie|album` - busca filmes/séries (TMDb) ou álbuns (iTunes)
- `GET /media-search/movie-director/{id}` - busca o diretor de um filme no TMDb
- `GET /media-search/tv-creator/{id}` - busca o(s) criador(es) de uma série no TMDb

### O que cada operação faz

- **GET** — busca dados sem alterar nada no servidor (listar itens, tier lists, histórico, resultados de busca). No frontend, dispara o indicador de carregamento enquanto está pendente.
- **POST** — cria um novo registro (um item ou uma tier list). No frontend, só é enviado depois da validação do formulário e, ao terminar com sucesso, mostra um toast de confirmação.
- **PUT** — atualiza um registro existente (mover um item de tier, renomear uma tier list). O frontend aplica a mudança na tela imediatamente (atualização otimista) e desfaz caso a API retorne erro.
- **DELETE** — remove um registro (um item ou uma tier list). Sempre pedido com uma confirmação antes de ser enviado, já que é uma ação irreversível.

## Prints

<!-- Adicionar aqui screenshots da aplicação (tela de login, tier board, formulário de busca, etc.) -->
