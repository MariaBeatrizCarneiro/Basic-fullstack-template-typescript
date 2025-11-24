# Projeto Básico com Next.js + Express.js + MongoDB (TypeScript)

Abre o terminal na pasta onde queres adicionar o projeto (nunca numa cloud: Google Drive, OneDrive, ...):

```bash
npx create-next-app@latest basic-fullstack-template-typescript --typescript --tailwind --no-app --eslint --src-dir --import-alias "@/*"
```

Depois:

* ✔ Would you like to use React Compiler? … No

---

## Instalar dependências

Depois de criares a app, executa:

```bash
cd basic-fullstack-template-typescript
npm install express cors next mongodb mongoose dotenv
npm install -D nodemon tsx @types/node @types/express @types/cors
```

O express é o servidor web, o cors permite chamadas API entre domínios (Next.js + Express), o mongoose é para ser mais fácil a ligação com o MongoDB, o dotenv permite usar variáveis de ambiente (.env), o nodemon reinicia o servidor automaticamente quando alteras ficheiros e o tsx permite executar TypeScript diretamente. Os @types são necessários para ter tipagem correta no TypeScript.

## Configuração do ambiente (.env)

Cria o ficheiro `.env` na **raiz do projeto** com as seguintes variáveis:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
NODE_ENV=development
PORT=3000
```

> **Nota**: Substitui `username`, `password`, `cluster` e `database` pelos valores do teu MongoDB Atlas.

No ficheiro `package.json`, **substitui** os scripts pelos seguintes para integrar Next.js com Express:

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx server.ts",
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts",
    "server": "nodemon --exec tsx server.ts"
  }
}
```

Agora **só precisas de um terminal** para correr tudo:

```bash
npm run dev
```

---

## Configuração MongoDB

### Conexão MongoDB (`lib/mongodb.ts`)

Cria a pasta `lib` e o ficheiro `lib/mongodb.ts`:

```typescript
// Este é default e não deve ser mexido
import mongoose from 'mongoose';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Por favor define a variável MONGODB_URI no ficheiro .env');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Conectado ao MongoDB Atlas');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

### Modelo Mongoose (`models/Nome.ts`)

Cria a pasta `models` e o ficheiro `models/Nome.ts`.
Este é o modelo para a coleção "nomes", se quiseres outras coleções na tua base de dados deves criar mais ficheiros nesta pasta com o respetivo modelo.

```typescript
import mongoose, { Schema } from 'mongoose';

const nomeSchema = new Schema({
  nome: { type: String, required: true },
}, {
  versionKey: false
});

const Nome = mongoose.models.Nome || mongoose.model('Nome', nomeSchema);

export default Nome;
```

---

## Servidor Express + Next.js integrados (`server.ts`)

Cria o ficheiro `server.ts` na **raiz do projeto** que integra Express com Next.js.
Neste ficheiro começa um um monte de constantes que não se deve mexer! (apenas uma)
Depois tens os endpoints da API (GET, POST, PUT, DELETE).
E no fim a inicialização do servidor.

```typescript
// ===== CONSTANTES FIXAS =====
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import next from 'next';
import cors from 'cors';
import connectDB from './lib/mongodb';
import Nome from './models/Nome';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();

app.use(cors());
app.use(express.json());

// ===== ENDPOINTS DA API =====

// GET /api/nomes - Retorna todos os nomes existentes
app.get('/api/nomes', async (req: Request, res: Response) => {
  try {
    const nomes = await Nome.find().sort({ nome: 1 });
    res.json(nomes);
  } catch (error) {
    console.error('Erro ao carregar nomes:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/nomes - Adiciona um novo nome à coleção "nomes"
app.post('/api/nomes', async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    
    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    const novoNome = new Nome({ nome: nome.trim() });
    const nomeSalvo = await novoNome.save();
    res.status(201).json(nomeSalvo);
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      return res.status(400).json({ erro: 'Este nome já existe' });
    }
    console.error('Erro ao criar nome:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// ===== INICIALIZAÇÃO DO SERVIDOR (também não se deve mexer)=====

app.use((req: Request, res: Response) => {
  return handle(req, res);
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await connectDB();
    await nextApp.prepare();
    app.listen(PORT, () => {
      console.log(`Servidor Next.js + Express a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();
```

---

## Serviço API (`src/services/api.ts`)

Neste ficheiro tens as funções que fazem as chamadas à API a partir dos endpoints que definiste no `server.ts`.

```typescript
// GET /api/nomes - Carregar todos os nomes
export async function carregarNomesAPI(): Promise<{ _id: string; nome: string }[]> {
  try {
    const response = await fetch('/api/nomes')
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao carregar nomes')
    }
    
    const data: { _id: string; nome: string }[] = await response.json()
    return data

  } catch (error) {
    console.error('Erro ao carregar nomes:', error)
    throw error
  }
}

// POST /api/nomes - Adicionar novo nome
export async function adicionarNomeAPI(nome: string): Promise<{ _id: string; nome: string }> {
  try {
    const response = await fetch('/api/nomes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.erro || 'Erro ao adicionar nome')
    }
    
    const resultado: { _id: string; nome: string } = await response.json()
    return resultado

  } catch (error) {
    console.error('Erro ao adicionar nome:', error)
    throw error
  }
}
```

--- 

## 🎨 3️⃣ Página inicial (`src/pages/index.tsx`)

No index.tsx só chamei dois componentes: VerNomes e AdicionarNomes.

```typescript
import AdicionarNomes from '../components/AdicionarNomes';
import VerNomes from '../components/VerNomes';

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
        <VerNomes />
        <AdicionarNomes />
      </div>
    </div>
  );
}
```

---

## 🧩 4️⃣ Componentes de Layout, cria a pasta (`src/components`) e acrescenta os seguintes ficheiros:


### VerNomes.tsx
Este componente importa o GET do api.ts e mostra os nomes existentes na base de dados.

```typescript
import { useState, useEffect } from 'react';
import { carregarNomesAPI } from '../services/api';

export default function VerNomes() {
  const [nomes, setNomes] = useState<{ _id: string; nome: string }[]>([]);

  useEffect(() => {
    async function carregarNomes() {
      try {
        const data = await carregarNomesAPI();
        setNomes(data);
      } catch (error) {
        console.error('Erro ao carregar nomes:', error);
      }
    }
    
    carregarNomes();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 min-w-72 h-fit">
      <h2 className="text-lg font-semibold mb-3">Nomes</h2>

      <div>
        {nomes.map((item) => (
          <div key={item._id}>
            {item.nome}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### AdicionarNomes.tsx

Este componente importa o POST do api.ts e permite adicionar novos nomes à base de dados.

```typescript
import { useState, FormEvent } from 'react';
import { adicionarNomeAPI } from '../services/api';

export default function AdicionarNomes() {
  const [novoNome, setNovoNome] = useState<string>('');

  async function adicionarNome(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!novoNome) return;
    try {
      await adicionarNomeAPI(novoNome);
      setNovoNome('');
    } catch (error) {
      console.error('Erro ao adicionar nome:', error);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 min-w-72 h-fit">
      <h2 className="text-lg font-semibold mb-3">Adicionar Nomes</h2>
      
      <form onSubmit={adicionarNome} className="flex gap-1 mb-3">
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Nome"
          className="flex-1 border border-gray-300 ps-3 py-2 rounded"
        />
        <button type="submit" disabled={!novoNome} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Adicionar
        </button>
      </form>
    </div>
  );
}
```

---

## Ficheiros de configuração opcionais

### `nodemon.json` (opcional - melhora performance)

Se quiseres otimizar o `nodemon` para não reiniciar desnecessariamente:

```json
{
  "watch": ["server.ts", "src/", "models/", "lib/"],
  "ignore": [
    "node_modules/",
    ".next/",
    "public/",
    "*.log",
    "db.json"
  ],
  "ext": "ts,tsx",
  "delay": 2000
}
```

> **Nota**: Este ficheiro é **opcional**. O `nodemon` funciona sem ele, mas com configuração é mais eficiente.

---

## Configuração do MongoDB Atlas

1. **Criar conta** no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Criar cluster** (template gratuito)
3. **Configurar acesso**:
   - Adicionar IP atual à lista de acesso
   - Criar utilizador de base de dados e copiar palavra-pass
4. **Copiar string de conexão** e colar no `.env` com a palavra-pass copiada antes.

---

## Como executar o projeto

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento** (um só comando):
   ```bash
   npm run dev
   ```

3. **Aceder à aplicação**:
   - **Frontend Next.js**: `http://localhost:3000`
   - **API REST**: `http://localhost:3000/api/nomes`

