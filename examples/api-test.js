const axios = require('axios')

const API_BASE_URL = 'http://localhost:3000'

// Função para fazer requisições com token
const apiRequest = async (method, endpoint, data = null, token = null) => {
  const config = {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...(data && { data })
  }

  try {
    const response = await axios(config)
    console.log(`✅ ${method.toUpperCase()} ${endpoint}:`, response.data)
    return response.data
  } catch (error) {
    console.error(
      `❌ ${method.toUpperCase()} ${endpoint}:`,
      error.response?.data || error.message
    )
    return null
  }
}

// Função principal para testar a API
const testAPI = async () => {
  console.log('🚀 Iniciando testes da API...\n')

  // 1. Testar health check
  console.log('1. Testando health check...')
  await apiRequest('GET', '/health')

  // 2. Registrar usuário
  console.log('\n2. Registrando usuário...')
  const registerResponse = await apiRequest('POST', '/auth/register', {
    email: 'teste@exemplo.com',
    password: 'senha123'
  })

  if (!registerResponse) {
    console.log('❌ Falha no registro, abortando testes...')
    return
  }

  const token = registerResponse.data.token

  // 3. Fazer login
  console.log('\n3. Fazendo login...')
  await apiRequest('POST', '/auth/login', {
    email: 'teste@exemplo.com',
    password: 'senha123'
  })

  // 4. Obter dados do usuário
  console.log('\n4. Obtendo dados do usuário...')
  await apiRequest('GET', '/users', null, token)

  // 5. Criar veículo
  console.log('\n5. Criando veículo...')
  const vehicleResponse = await apiRequest(
    'POST',
    '/vehicles',
    {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2020,
      quilometragemAtual: 50000,
      tipoCombustivel: 'flex'
    },
    token
  )

  if (!vehicleResponse) {
    console.log('❌ Falha na criação do veículo, abortando testes...')
    return
  }

  const vehicleId = vehicleResponse.data.vehicle.id

  // 6. Listar veículos
  console.log('\n6. Listando veículos...')
  await apiRequest('GET', '/vehicles', null, token)

  // 7. Obter veículo específico
  console.log('\n7. Obtendo veículo específico...')
  await apiRequest('GET', `/vehicles/${vehicleId}`, null, token)

  // 8. Criar despesa
  console.log('\n8. Criando despesa...')
  const expenseResponse = await apiRequest(
    'POST',
    '/expenses',
    {
      vehicleId,
      tipo: 'abastecimento',
      descricao: 'Abastecimento completo',
      valor: 150.5,
      quilometragem: 50000,
      data: '2024-01-01'
    },
    token
  )

  if (!expenseResponse) {
    console.log('❌ Falha na criação da despesa, abortando testes...')
    return
  }

  const expenseId = expenseResponse.data.expense.id

  // 9. Listar despesas
  console.log('\n9. Listando despesas...')
  await apiRequest('GET', '/expenses', null, token)

  // 10. Obter despesa específica
  console.log('\n10. Obtendo despesa específica...')
  await apiRequest('GET', `/expenses/${expenseId}`, null, token)

  // 11. Gerar relatório de custo por km
  console.log('\n11. Gerando relatório de custo por km...')
  await apiRequest('GET', '/reports/cost-per-km', null, token)

  // 12. Gerar relatório detalhado do veículo
  console.log('\n12. Gerando relatório detalhado do veículo...')
  await apiRequest('GET', `/reports/vehicle/${vehicleId}`, null, token)

  // 13. Atualizar veículo
  console.log('\n13. Atualizando veículo...')
  await apiRequest(
    'PUT',
    `/vehicles/${vehicleId}`,
    {
      marca: 'Toyota',
      modelo: 'Corolla XEi',
      ano: 2021,
      quilometragemAtual: 55000,
      tipoCombustivel: 'flex'
    },
    token
  )

  // 14. Atualizar despesa
  console.log('\n14. Atualizando despesa...')
  await apiRequest(
    'PUT',
    `/expenses/${expenseId}`,
    {
      vehicleId,
      tipo: 'abastecimento',
      descricao: 'Abastecimento completo - atualizado',
      valor: 160.0,
      quilometragem: 55000,
      data: '2024-01-15'
    },
    token
  )

  // 15. Deletar despesa
  console.log('\n15. Deletando despesa...')
  await apiRequest('DELETE', `/expenses/${expenseId}`, null, token)

  // 16. Deletar veículo
  console.log('\n16. Deletando veículo...')
  await apiRequest('DELETE', `/vehicles/${vehicleId}`, null, token)

  // 17. Deletar usuário
  console.log('\n17. Deletando usuário...')
  await apiRequest('DELETE', '/users', null, token)

  console.log('\n🎉 Testes concluídos!')
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  testAPI().catch(console.error)
}

module.exports = { testAPI, apiRequest }

