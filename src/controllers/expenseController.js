const prisma = require('../config/database')

// Listar todas as despesas do usuário
const getExpenses = async (req, res) => {
  try {
    const { vehicleId } = req.query

    const whereClause = {
      vehicle: {
        userId: req.user.id
      }
    }

    // Filtrar por veículo se fornecido
    if (vehicleId) {
      whereClause.vehicleId = vehicleId
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        vehicle: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            ano: true
          }
        }
      },
      orderBy: { data: 'desc' }
    })

    res.json({
      success: true,
      data: { expenses }
    })
  } catch (error) {
    console.error('Erro ao listar despesas:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Obter uma despesa específica
const getExpense = async (req, res) => {
  try {
    const { id } = req.params

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        vehicle: {
          userId: req.user.id
        }
      },
      include: {
        vehicle: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            ano: true
          }
        }
      }
    })

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Despesa não encontrada'
      })
    }

    res.json({
      success: true,
      data: { expense }
    })
  } catch (error) {
    console.error('Erro ao obter despesa:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Criar nova despesa
const createExpense = async (req, res) => {
  try {
    const { vehicleId, tipo, descricao, valor, quilometragem, data } = req.body

    // Verificar se o veículo pertence ao usuário
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: req.user.id
      }
    })

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Veículo não encontrado'
      })
    }

    const expense = await prisma.expense.create({
      data: {
        vehicleId,
        tipo,
        descricao,
        valor: parseFloat(valor),
        quilometragem: parseFloat(quilometragem),
        data: new Date(data)
      },
      include: {
        vehicle: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            ano: true
          }
        }
      }
    })

    // Atualizar a quilometragem atual do veículo se a nova despesa tiver quilometragem maior
    if (parseFloat(quilometragem) > vehicle.quilometragemAtual) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { quilometragemAtual: parseFloat(quilometragem) }
      })
    }

    res.status(201).json({
      success: true,
      message: 'Despesa criada com sucesso',
      data: { expense }
    })
  } catch (error) {
    console.error('Erro ao criar despesa:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Atualizar despesa
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params
    const { vehicleId, tipo, descricao, valor, quilometragem, data } = req.body

    // Verificar se a despesa existe e pertence ao usuário
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        vehicle: {
          userId: req.user.id
        }
      }
    })

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: 'Despesa não encontrada'
      })
    }

    // Se vehicleId foi fornecido, verificar se o novo veículo pertence ao usuário
    if (vehicleId && vehicleId !== existingExpense.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: {
          id: vehicleId,
          userId: req.user.id
        }
      })

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Veículo não encontrado'
        })
      }
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        vehicleId: vehicleId || existingExpense.vehicleId,
        tipo,
        descricao,
        valor: parseFloat(valor),
        quilometragem: parseFloat(quilometragem),
        data: new Date(data)
      },
      include: {
        vehicle: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            ano: true
          }
        }
      }
    })

    res.json({
      success: true,
      message: 'Despesa atualizada com sucesso',
      data: { expense }
    })
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Deletar despesa
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar se a despesa existe e pertence ao usuário
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        vehicle: {
          userId: req.user.id
        }
      }
    })

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: 'Despesa não encontrada'
      })
    }

    await prisma.expense.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Despesa deletada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar despesa:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense
}
