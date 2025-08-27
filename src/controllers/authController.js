const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

// Registrar novo usuário
const register = async (req, res) => {
  try {
    const { email, password } = req.body

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      })
    }

    // Hash da senha
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Gerar JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user,
        token
      }
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Login do usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      })
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      })
    }

    // Gerar JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })

    // Retornar dados do usuário (sem senha)
    const userData = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: userData,
        token
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Obter dados do usuário autenticado
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    })
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

module.exports = {
  register,
  login,
  getMe
}

