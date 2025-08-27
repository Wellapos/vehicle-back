#!/bin/bash

echo "🐘 Configurando PostgreSQL para a API de Veículos..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL não está instalado!"
    echo "Instale o PostgreSQL primeiro:"
    echo "Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "CentOS/RHEL: sudo dnf install postgresql postgresql-server"
    echo "macOS: brew install postgresql"
    exit 1
fi

print_status "PostgreSQL encontrado"

# Verificar se PostgreSQL está rodando
if ! sudo systemctl is-active --quiet postgresql; then
    print_warning "PostgreSQL não está rodando. Iniciando..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

print_status "PostgreSQL está rodando"

# Configurações do banco
DB_NAME="vehicle_expense_db"
DB_USER="myuser"
DB_PASSWORD="mypassword"

echo ""
echo "📋 Configurações do banco:"
echo "   Nome do banco: $DB_NAME"
echo "   Usuário: $DB_USER"
echo "   Senha: $DB_PASSWORD"
echo ""

# Criar banco e usuário
print_status "Criando banco de dados e usuário..."

sudo -u postgres psql << EOF
-- Criar banco de dados
CREATE DATABASE $DB_NAME;

-- Criar usuário
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Conectar ao banco e dar permissões adicionais
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Sair
\q
EOF

if [ $? -eq 0 ]; then
    print_status "Banco de dados criado com sucesso!"
else
    print_error "Erro ao criar banco de dados"
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    print_warning "Arquivo .env não encontrado. Criando..."
    cp env.example .env
fi

# Atualizar DATABASE_URL no .env
print_status "Configurando variáveis de ambiente..."

# Backup do arquivo .env
cp .env .env.backup

# Atualizar DATABASE_URL
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME\"|" .env

print_status "Variáveis de ambiente configuradas"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependências..."
    npm install
fi

# Gerar cliente Prisma
print_status "Gerando cliente Prisma..."
npm run db:generate

# Criar tabelas
print_status "Criando tabelas no banco..."
npm run db:push

# Perguntar se quer popular com dados de exemplo
echo ""
read -p "🤔 Deseja popular o banco com dados de exemplo? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Populando banco com dados de exemplo..."
    npm run db:seed
fi

echo ""
print_status "Configuração concluída!"
echo ""
echo "📋 Resumo da configuração:"
echo "   Banco: $DB_NAME"
echo "   Usuário: $DB_USER"
echo "   Senha: $DB_PASSWORD"
echo "   Host: localhost"
echo "   Porta: 5432"
echo ""
echo "🚀 Para iniciar a API:"
echo "   npm run dev"
echo ""
echo "🧪 Para testar:"
echo "   npm run test:api"
echo ""
echo "📊 Para acessar o Prisma Studio:"
echo "   npm run db:studio"
