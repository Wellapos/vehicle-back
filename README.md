# API de Gerenciamento de Veículos e Despesas

API completa em Node.js com Express, JWT, PostgreSQL e Prisma ORM para gerenciamento de veículos e despesas.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JWT** - Autenticação
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados
- **helmet** - Segurança
- **cors** - Cross-origin resource sharing

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd vehicle-expense-api
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://username:password@localhost:5432/vehicle_expense_db"

# Configurações JWT
JWT_SECRET="sua_chave_secreta_muito_segura_aqui_2024"
JWT_EXPIRES_IN="7d"

# Configurações do Servidor
PORT=3000
NODE_ENV=development
```

4. **Configure o banco de dados**

```bash
# Gerar cliente Prisma
npm run db:generate

# Criar tabelas no banco
npm run db:push
```

5. **Inicie o servidor**

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Endpoints da API

### 🔐 Autenticação

#### POST /auth/register

Registra um novo usuário.

**Body:**

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": "user_id",
      "email": "usuario@exemplo.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login

Autentica um usuário.

**Body:**

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "user_id",
      "email": "usuario@exemplo.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

### 👤 Usuários

#### GET /users

Retorna dados do usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

#### PUT /users

Atualiza dados do usuário.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "email": "novo@exemplo.com",
  "password": "nova_senha123"
}
```

#### DELETE /users

Deleta o usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

### 🚗 Veículos

#### GET /vehicles

Lista todos os veículos do usuário.

**Headers:** `Authorization: Bearer <token>`

#### GET /vehicles/:id

Retorna um veículo específico.

**Headers:** `Authorization: Bearer <token>`

#### POST /vehicles

Cria um novo veículo.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2020,
  "quilometragemAtual": 50000,
  "tipoCombustivel": "flex"
}
```

#### PUT /vehicles/:id

Atualiza um veículo.

**Headers:** `Authorization: Bearer <token>`

#### DELETE /vehicles/:id

Deleta um veículo.

**Headers:** `Authorization: Bearer <token>`

### 💰 Despesas

#### GET /expenses

Lista todas as despesas do usuário.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `vehicleId` (opcional): Filtrar por veículo específico

#### GET /expenses/:id

Retorna uma despesa específica.

**Headers:** `Authorization: Bearer <token>`

#### POST /expenses

Cria uma nova despesa.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "vehicleId": "vehicle_id",
  "tipo": "abastecimento",
  "descricao": "Abastecimento completo",
  "valor": 150.5,
  "quilometragem": 50000,
  "data": "2024-01-01"
}
```

#### PUT /expenses/:id

Atualiza uma despesa.

**Headers:** `Authorization: Bearer <token>`

#### DELETE /expenses/:id

Deleta uma despesa.

**Headers:** `Authorization: Bearer <token>`

### 📊 Relatórios

#### GET /reports/cost-per-km

Gera relatório de custo por km de todos os veículos.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `vehicleId` (opcional): Filtrar por veículo específico

#### GET /reports/vehicle/:vehicleId

Gera relatório detalhado de um veículo específico.

**Headers:** `Authorization: Bearer <token>`

## 🔒 Segurança

- **JWT**: Autenticação baseada em tokens
- **bcrypt**: Hash seguro de senhas
- **Helmet**: Headers de segurança
- **CORS**: Configuração de cross-origin
- **Validação**: Validação de entrada com express-validator

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── database.js          # Configuração do Prisma
├── controllers/
│   ├── authController.js    # Lógica de autenticação
│   ├── userController.js    # Lógica de usuários
│   ├── vehicleController.js # Lógica de veículos
│   ├── expenseController.js # Lógica de despesas
│   └── reportController.js  # Lógica de relatórios
├── middleware/
│   ├── authMiddleware.js    # Middleware de autenticação
│   └── validationMiddleware.js # Middleware de validação
├── routes/
│   ├── authRoutes.js        # Rotas de autenticação
│   ├── userRoutes.js        # Rotas de usuários
│   ├── vehicleRoutes.js     # Rotas de veículos
│   ├── expenseRoutes.js     # Rotas de despesas
│   └── reportRoutes.js      # Rotas de relatórios
└── server.js                # Arquivo principal
```

## 🛠️ Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento com nodemon
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:push` - Sincroniza o schema com o banco
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre o Prisma Studio

## 🧪 Testando a API

### 1. Registrar um usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha123"}'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha123"}'
```

### 3. Criar um veículo (usando o token retornado)

```bash
curl -X POST http://localhost:3000/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"marca":"Toyota","modelo":"Corolla","ano":2020,"quilometragemAtual":50000,"tipoCombustivel":"flex"}'
```

## 📝 Licença

Este projeto está sob a licença MIT.

