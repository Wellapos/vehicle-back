const prisma = require('../config/database')

// Listar todos os veículos do usuário
const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      data: { vehicles }
    })
  } catch (error) {
    console.error('Erro ao listar veículos:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Obter um veículo específico
const getVehicle = async (req, res) => {
  try {
    const { id } = req.params

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    })

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Veículo não encontrado'
      })
    }

    res.json({
      success: true,
      data: { vehicle }
    })
  } catch (error) {
    console.error('Erro ao obter veículo:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Criar novo veículo
const createVehicle = async (req, res) => {
  try {
    const { marca, modelo, ano, quilometragemAtual, tipoCombustivel } = req.body

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: req.user.id,
        marca,
        modelo,
        ano: parseInt(ano),
        quilometragemAtual: parseFloat(quilometragemAtual),
        tipoCombustivel
      }
    })

    res.status(201).json({
      success: true,
      message: 'Veículo criado com sucesso',
      data: { vehicle }
    })
  } catch (error) {
    console.error('Erro ao criar veículo:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Atualizar veículo
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params
    const { marca, modelo, ano, quilometragemAtual, tipoCombustivel } = req.body

    // Verificar se o veículo existe e pertence ao usuário
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    })

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: 'Veículo não encontrado'
      })
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        marca,
        modelo,
        ano: parseInt(ano),
        quilometragemAtual: parseFloat(quilometragemAtual),
        tipoCombustivel
      }
    })

    res.json({
      success: true,
      message: 'Veículo atualizado com sucesso',
      data: { vehicle }
    })
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Deletar veículo
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar se o veículo existe e pertence ao usuário
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    })

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: 'Veículo não encontrado'
      })
    }

    // Deletar veículo (cascade irá deletar as despesas)
    await prisma.vehicle.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Veículo deletado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar veículo:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

module.exports = {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
}

