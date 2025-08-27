const express = require('express')
const { body } = require('express-validator')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const validateRequest = require('../middleware/validationMiddleware')

const router = express.Router()

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware)

// Validações para atualização de usuário
const updateUserValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/\d/)
    .withMessage('Senha deve conter pelo menos um número')
]

// Rotas
router.get('/', userController.getUser)
router.put(
  '/',
  updateUserValidation,
  validateRequest,
  userController.updateUser
)
router.delete('/', userController.deleteUser)

module.exports = router

