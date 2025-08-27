const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token está presente no header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      })
    }

    // Extrair o token
    const token = authHeader.substring(7)

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar o usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      })
    }

    // Adicionar o usuário ao request
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      })
    }

    console.error('Erro no middleware de autenticação:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

module.exports = authMiddleware

