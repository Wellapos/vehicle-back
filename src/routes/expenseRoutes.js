const express = require('express')
const { body } = require('express-validator')
const expenseController = require('../controllers/expenseController')
const authMiddleware = require('../middleware/authMiddleware')
const validateRequest = require('../middleware/validationMiddleware')

const router = express.Router()

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware)

// Validações para criação/atualização de despesa
const expenseValidation = [
  body('vehicleId')
    .notEmpty()
    .withMessage('ID do veículo é obrigatório')
    .isString()
    .withMessage('ID do veículo deve ser uma string'),
  body('tipo')
    .notEmpty()
    .withMessage('Tipo de despesa é obrigatório')
    .isIn(['abastecimento', 'manutenção', 'documento'])
    .withMessage('Tipo deve ser: abastecimento, manutenção ou documento'),
  body('descricao')
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Descrição deve ter entre 3 e 200 caracteres'),
  body('valor')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser um número positivo maior que zero'),
  body('quilometragem')
    .isFloat({ min: 0 })
    .withMessage('Quilometragem deve ser um número positivo'),
  body('data')
    .isISO8601()
    .withMessage('Data deve estar no formato ISO 8601 (YYYY-MM-DD)')
]

// Rotas
router.get('/', expenseController.getExpenses)
router.get('/:id', expenseController.getExpense)
router.post(
  '/',
  expenseValidation,
  validateRequest,
  expenseController.createExpense
)
router.put(
  '/:id',
  expenseValidation,
  validateRequest,
  expenseController.updateExpense
)
router.delete('/:id', expenseController.deleteExpense)

module.exports = router

