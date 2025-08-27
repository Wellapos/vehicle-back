const prisma = require('../config/database')

// Gerar relatório de custo por km por veículo
const getCostPerKmReport = async (req, res) => {
  try {
    const { vehicleId } = req.query

    const whereClause = {
      userId: req.user.id
    }

    // Filtrar por veículo específico se fornecido
    if (vehicleId) {
      whereClause.id = vehicleId
    }

    // Buscar veículos do usuário
    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        expenses: {
          orderBy: { data: 'desc' }
        }
      }
    })

    const reports = vehicles.map((vehicle) => {
      // Calcular total de despesas
      const totalExpenses = vehicle.expenses.reduce((sum, expense) => {
        return sum + expense.valor
      }, 0)

      // Encontrar quilometragem inicial (menor valor) e atual
      const quilometragens = vehicle.expenses.map((e) => e.quilometragem)
      const quilometragemInicial =
        quilometragens.length > 0 ? Math.min(...quilometragens) : 0
      const quilometragemAtual = vehicle.quilometragemAtual
      const quilometragemRodada = quilometragemAtual - quilometragemInicial

      // Calcular custo por km
      const custoPorKm =
        quilometragemRodada > 0 ? totalExpenses / quilometragemRodada : 0

      // Agrupar despesas por tipo
      const despesasPorTipo = vehicle.expenses.reduce((acc, expense) => {
        if (!acc[expense.tipo]) {
          acc[expense.tipo] = 0
        }
        acc[expense.tipo] += expense.valor
        return acc
      }, {})

      return {
        vehicle: {
          id: vehicle.id,
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          ano: vehicle.ano,
          tipoCombustivel: vehicle.tipoCombustivel,
          quilometragemAtual: vehicle.quilometragemAtual
        },
        report: {
          totalExpenses,
          quilometragemInicial,
          quilometragemAtual,
          quilometragemRodada,
          custoPorKm: parseFloat(custoPorKm.toFixed(2)),
          despesasPorTipo,
          totalExpensesCount: vehicle.expenses.length
        }
      }
    })

    res.json({
      success: true,
      data: { reports }
    })
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Gerar relatório detalhado de um veículo específico
const getVehicleDetailedReport = async (req, res) => {
  try {
    const { vehicleId } = req.params

    // Verificar se o veículo pertence ao usuário
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: req.user.id
      },
      include: {
        expenses: {
          orderBy: { data: 'desc' }
        }
      }
    })

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Veículo não encontrado'
      })
    }

    // Calcular estatísticas
    const totalExpenses = vehicle.expenses.reduce(
      (sum, expense) => sum + expense.valor,
      0
    )
    const quilometragens = vehicle.expenses.map((e) => e.quilometragem)
    const quilometragemInicial =
      quilometragens.length > 0 ? Math.min(...quilometragens) : 0
    const quilometragemRodada =
      vehicle.quilometragemAtual - quilometragemInicial
    const custoPorKm =
      quilometragemRodada > 0 ? totalExpenses / quilometragemRodada : 0

    // Agrupar despesas por tipo
    const despesasPorTipo = vehicle.expenses.reduce((acc, expense) => {
      if (!acc[expense.tipo]) {
        acc[expense.tipo] = {
          total: 0,
          count: 0,
          expenses: []
        }
      }
      acc[expense.tipo].total += expense.valor
      acc[expense.tipo].count += 1
      acc[expense.tipo].expenses.push({
        id: expense.id,
        descricao: expense.descricao,
        valor: expense.valor,
        quilometragem: expense.quilometragem,
        data: expense.data
      })
      return acc
    }, {})

    // Calcular média mensal de despesas (últimos 12 meses)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const recentExpenses = vehicle.expenses.filter(
      (expense) => new Date(expense.data) >= twelveMonthsAgo
    )

    const totalRecentExpenses = recentExpenses.reduce(
      (sum, expense) => sum + expense.valor,
      0
    )
    const mediaMensal = totalRecentExpenses / 12

    const detailedReport = {
      vehicle: {
        id: vehicle.id,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        ano: vehicle.ano,
        tipoCombustivel: vehicle.tipoCombustivel,
        quilometragemAtual: vehicle.quilometragemAtual,
        createdAt: vehicle.createdAt
      },
      statistics: {
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        quilometragemInicial,
        quilometragemAtual: vehicle.quilometragemAtual,
        quilometragemRodada,
        custoPorKm: parseFloat(custoPorKm.toFixed(2)),
        totalExpensesCount: vehicle.expenses.length,
        mediaMensal: parseFloat(mediaMensal.toFixed(2))
      },
      despesasPorTipo,
      recentExpenses: recentExpenses.slice(0, 10) // Últimas 10 despesas
    }

    res.json({
      success: true,
      data: { report: detailedReport }
    })
  } catch (error) {
    console.error('Erro ao gerar relatório detalhado:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

module.exports = {
  getCostPerKmReport,
  getVehicleDetailedReport
}

