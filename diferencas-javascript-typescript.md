# Diferenças entre JavaScript e TypeScript no Projeto Full-Stack

Este documento compara as principais diferenças entre as versões JavaScript e TypeScript do mesmo projeto Next.js + Express + MongoDB.

---

## 1. Criação do Projeto

### JavaScript
```bash
npx create-next-app@latest next-express-project --tailwind --no-app --eslint --src-dir --import-alias "@/*"
```
- ✔ Would you like to use TypeScript? … **No**

### TypeScript
```bash
npx create-next-app@latest basic-fullstack-template-typescript --typescript --tailwind --no-app --eslint --src-dir --import-alias "@/*"
```
- Flag `--typescript` incluída na criação

---

## 2. Instalação de Dependências

### JavaScript
```bash
npm install express cors next mongodb mongoose dotenv
npm install -D nodemon
```

### TypeScript
```bash
npm install express cors next mongodb mongoose dotenv
npm install -D nodemon tsx @types/node @types/express @types/cors
```

**Diferenças:**
- **tsx**: Permite executar TypeScript diretamente sem compilação prévia
- **@types/\***: Definições de tipos para ter autocomplete e validação de tipos

---

## 3. Scripts do package.json

### JavaScript
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js",
    "server": "nodemon server.js"
  }
}
```

### TypeScript
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

**Diferenças:**
- Usa `tsx` para executar ficheiros `.ts`
- Extensão `.js` → `.ts`

---

## 4. Extensões de Ficheiros

| Tipo | JavaScript | TypeScript |
|------|-----------|------------|
| Ficheiros normais | `.js` | `.ts` |
| Componentes React | `.jsx` | `.tsx` |

---

## 5. Conexão MongoDB (`lib/mongodb`)

**Diferenças principais:**
- **Sistema de módulos**: `require`/`module.exports` (JS) vs `import`/`export` (TS)
- **Interface**: TypeScript define `CachedConnection` para tipagem
- **Tipos globais**: `declare global` para estender tipos globais
- **Tipo de retorno**: `: Promise<typeof mongoose>` explícito
- **const vs let**: TypeScript usa `const` para `cached`

---

## 6. Modelo Mongoose (`models/Nome`)

**Diferenças principais:**
- **Import**: `require` (JS) vs `import { Schema }` (TS)
- **Export**: `module.exports` (JS) vs `export default` (TS)

---

## 7. Servidor (`server`)

**Diferenças principais:**
- **Imports**: `require` (JS) vs `import` (TS)
- **Tipos de parâmetros**: `(req, res)` (JS) vs `(req: Request, res: Response)` (TS)
- **Tratamento de erros**: `catch (error)` (JS) vs `catch (error: unknown)` com type assertion (TS)

---

## 8. Serviço API (`src/services/api`)

**Diferenças principais:**
- **Tipo de retorno**: `: Promise<{ _id: string; nome: string }[]>` explícito (TS)
- **Tipo de parâmetros**: `(nome)` (JS) vs `(nome: string)` (TS)
- **Tipo de dados**: `const data` (JS) vs `const data: { _id: string; nome: string }[]` (TS)

---

## 9. Página Inicial (`src/pages/index`)

**Diferenças principais:**
- **Extensão do ficheiro**: `.js` (JS) vs `.tsx` (TS)
- O código é idêntico porque não usa tipos explícitos neste componente simples

---

## 10. Componente VerNomes

**Diferenças principais:**
- **Estado tipado**: `useState([])` (JS) vs `useState<{ _id: string; nome: string }[]>([])` (TS)
- **Extensão**: `.jsx` (JS) vs `.tsx` (TS)

---

## 11. Componente AdicionarNomes

**Diferenças principais:**
- **Import FormEvent**: TypeScript importa `FormEvent` do React
- **Estado tipado**: `useState('')` (JS) vs `useState<string>('')` (TS)
- **Tipo de evento**: `adicionarNome(e)` (JS) vs `adicionarNome(e: FormEvent<HTMLFormElement>)` (TS)
- **Extensão**: `.jsx` (JS) vs `.tsx` (TS)

---

## 12. Configuração nodemon.json

**Diferenças principais:**
- **Ficheiro principal**: `server.js` (JS) vs `server.ts` (TS)
- **Extensões**: `"ext": "js,jsx"` (JS) vs `"ext": "ts,tsx"` (TS)
- **Watch adicional**: TypeScript inclui `models/` e `lib/` explicitamente

---

## Vantagens do TypeScript

1. **Detecção de erros**: Apanha erros durante o desenvolvimento
2. **Autocomplete**: Melhor suporte no IDE (VS Code, etc.)
3. **Documentação implícita**: Os tipos servem como documentação
4. **Refactoring seguro**: Mudanças grandes são mais seguras
5. **Manutenibilidade**: Código mais fácil de manter a longo prazo
6. **Integração com bibliotecas**: Melhor suporte para bibliotecas modernas

