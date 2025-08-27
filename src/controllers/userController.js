const bcrypt = require('bcryptjs')
const prisma = require('../config/database')

// Obter dados do usuário
const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Atualizar dados do usuário
const updateUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const updateData = {}

    // Verificar se o email foi fornecido e é diferente do atual
    if (email && email !== req.user.email) {
      // Verificar se o novo email já está em uso
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        })
      }
      updateData.email = email
    }

    // Verificar se a senha foi fornecida
    if (password) {
      const saltRounds = 12
      updateData.passwordHash = await bcrypt.hash(password, saltRounds)
    }

    // Se não há dados para atualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum dado fornecido para atualização'
      })
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: { user: updatedUser }
    })
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Deletar usuário
const deleteUser = async (req, res) => {
  try {
    // Deletar usuário (cascade irá deletar veículos e despesas)
    await prisma.user.delete({
      where: { id: req.user.id }
    })

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

module.exports = {
  getUser,
  updateUser,
  deleteUser
}

