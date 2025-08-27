require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const prisma = require('./config/database')

// Importar rotas
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const reportRoutes = require('./routes/reportRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares de segurança
app.use(helmet())
app.use(cors())

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// Rotas da API
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/vehicles', vehicleRoutes)
app.use('/expenses', expenseRoutes)
app.use('/reports', reportRoutes)

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  })
})

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error)

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  })
})

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco
    await prisma.$connect()
    console.log('✅ Conexão com o banco de dados estabelecida')

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📊 Ambiente: ${process.env.NODE_ENV}`)
      console.log(`🔗 Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido SIGINT, encerrando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Recebido SIGTERM, encerrando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})

// Iniciar servidor
startServer()

