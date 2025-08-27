const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário de exemplo
  const passwordHash = await bcrypt.hash('senha123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'admin@exemplo.com' },
    update: {},
    create: {
      email: 'admin@exemplo.com',
      passwordHash
    }
  })

  console.log('✅ Usuário criado:', user.email)

  // Criar veículos de exemplo
  const vehicle1 = await prisma.vehicle.create({
    data: {
      userId: user.id,
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2020,
      quilometragemAtual: 50000,
      tipoCombustivel: 'flex'
    }
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      userId: user.id,
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2019,
      quilometragemAtual: 35000,
      tipoCombustivel: 'flex'
    }
  })

  console.log('✅ Veículos criados:', vehicle1.modelo, 'e', vehicle2.modelo)

  // Criar despesas de exemplo
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        vehicleId: vehicle1.id,
        tipo: 'abastecimento',
        descricao: 'Abastecimento completo - Gasolina',
        valor: 150.5,
        quilometragem: 50000,
        data: new Date('2024-01-15')
      }
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicle1.id,
        tipo: 'manutenção',
        descricao: 'Troca de óleo e filtros',
        valor: 200.0,
        quilometragem: 48000,
        data: new Date('2024-01-10')
      }
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicle1.id,
        tipo: 'documento',
        descricao: 'Licenciamento anual',
        valor: 89.9,
        quilometragem: 45000,
        data: new Date('2024-01-05')
      }
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicle2.id,
        tipo: 'abastecimento',
        descricao: 'Abastecimento - Etanol',
        valor: 120.0,
        quilometragem: 35000,
        data: new Date('2024-01-12')
      }
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicle2.id,
        tipo: 'manutenção',
        descricao: 'Revisão geral',
        valor: 350.0,
        quilometragem: 32000,
        data: new Date('2024-01-08')
      }
    })
  ])

  console.log('✅ Despesas criadas:', expenses.length, 'registros')

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('\n📋 Dados de acesso:')
  console.log('Email: admin@exemplo.com')
  console.log('Senha: senha123')
  console.log('\n🔗 Para testar, faça login em: POST /auth/login')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

