const express = require('express')
const { body } = require('express-validator')
const vehicleController = require('../controllers/vehicleController')
const authMiddleware = require('../middleware/authMiddleware')
const validateRequest = require('../middleware/validationMiddleware')

const router = express.Router()

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware)

// Validações para criação/atualização de veículo
const vehicleValidation = [
  body('marca')
    .notEmpty()
    .withMessage('Marca é obrigatória')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Marca deve ter entre 2 e 50 caracteres'),
  body('modelo')
    .notEmpty()
    .withMessage('Modelo é obrigatório')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Modelo deve ter entre 2 e 50 caracteres'),
  body('ano')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Ano deve ser um número válido entre 1900 e o próximo ano'),
  body('quilometragemAtual')
    .isFloat({ min: 0 })
    .withMessage('Quilometragem deve ser um número positivo'),
  body('tipoCombustivel')
    .notEmpty()
    .withMessage('Tipo de combustível é obrigatório')
    .isIn(['gasolina', 'etanol', 'diesel', 'flex', 'elétrico', 'híbrido'])
    .withMessage(
      'Tipo de combustível deve ser: gasolina, etanol, diesel, flex, elétrico ou híbrido'
    )
]

// Rotas
router.get('/', vehicleController.getVehicles)
router.get('/:id', vehicleController.getVehicle)
router.post(
  '/',
  vehicleValidation,
  validateRequest,
  vehicleController.createVehicle
)
router.put(
  '/:id',
  vehicleValidation,
  validateRequest,
  vehicleController.updateVehicle
)
router.delete('/:id', vehicleController.deleteVehicle)

module.exports = router

