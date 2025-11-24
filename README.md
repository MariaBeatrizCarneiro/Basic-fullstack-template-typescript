# 🚀 Ver e Adicionar Nomes App (TypeScript)

Uma aplicação fullstack para ver e adicionar nomes desenvolvida com Next.js, Express e MongoDB, usando TypeScript.

## Tecnologias Utilizadas

- **Frontend**: Next.js + React + TailwindCSS + TypeScript
- **Backend**: Express.js + Node.js + TypeScript
- **Base de Dados**: MongoDB + Mongoose
- **Dev Tools**: Nodemon, TSX, ESLint

## Funcionalidades

### Interface Única com 2 Componentes:
1. **VerNomes.tsx** - Visualizar os nomes existentes na base de dados.
2. **AdicionarNomes.tsx** - Adicionar um nome novo à base de dados.

### API REST com 2 Endpoints:
- `GET /api/nomes`
- `POST /api/nomes`

### Base de Dados MongoDB:
- **nomes** → `{ _id: string, nome: string }`

## Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Criar ficheiro `.env` na raiz:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
NODE_ENV=development
PORT=3000
```

### 3. Executar Aplicação
```bash
npm run dev
```

### 4. Aceder à Aplicação
- **Interface**: http://localhost:3000
- **API Nomes**: http://localhost:3000/api/nomes

## Estrutura do Projeto

```
├── lib/
│   └── mongodb.ts              # Conexão MongoDB
├── models/
│   └── Nome.ts                 # Schema Nomes
├── src/
│   ├── components/
│   │   ├── AdicionarNomes.tsx  # Componente
│   │   └── VerNomes.tsx        # Componente
│   ├── pages/
│   │   ├── index.tsx           # Página principal
│   │   ├── _app.tsx
│   │   └── _document.tsx
│   ├── services/
│   │   └── api.ts              # Funções API
│   └── styles/
│       └── globals.css
├── server.ts                   # Servidor Express
├── tsconfig.json               # Configuração TypeScript
├── package.json
└── README.md
```


## Desenvolvido por Maria Beatriz Carneiro
**Desafio Básico** - Ver e adicionar nomes com Next.js, Express, MongoDB e TypeScript.
