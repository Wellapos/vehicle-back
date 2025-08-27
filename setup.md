# 🚀 Guia de Configuração Rápida

## 1. Configurar Banco de Dados PostgreSQL

### Instalar PostgreSQL (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Criar banco de dados

```bash
sudo -u postgres psql
CREATE DATABASE vehicle_expense_db;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE vehicle_expense_db TO myuser;
\q
```

### Configurar variáveis de ambiente

```bash
cp env.example .env
```

Editar `.env`:

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/vehicle_expense_db"
JWT_SECRET="sua_chave_secreta_muito_segura_aqui_2024"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

## 2. Configurar Prisma

```bash
# Gerar cliente Prisma
npm run db:generate

# Criar tabelas no banco
npm run db:push

# Popular banco com dados de exemplo (opcional)
npm run db:seed
```

## 3. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 4. Testar API

```bash
# Executar testes automatizados
npm run test:api
```

## 5. Acessar Prisma Studio (Opcional)

```bash
npm run db:studio
```

## 🔗 Endpoints Principais

- **Health Check:** `GET http://localhost:3000/health`
- **Registro:** `POST http://localhost:3000/auth/register`
- **Login:** `POST http://localhost:3000/auth/login`
- **Veículos:** `GET http://localhost:3000/vehicles`
- **Despesas:** `GET http://localhost:3000/expenses`
- **Relatórios:** `GET http://localhost:3000/reports/cost-per-km`

## 📝 Exemplo de Uso

### 1. Registrar usuário

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

### 3. Criar veículo (usando token)

```bash
curl -X POST http://localhost:3000/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"marca":"Toyota","modelo":"Corolla","ano":2020,"quilometragemAtual":50000,"tipoCombustivel":"flex"}'
```

## 🛠️ Troubleshooting

### Erro de conexão com banco

- Verificar se PostgreSQL está rodando: `sudo systemctl status postgresql`
- Verificar DATABASE_URL no arquivo .env
- Verificar permissões do usuário no banco

### Erro de dependências

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de Prisma

```bash
npm run db:generate
npm run db:push
```
