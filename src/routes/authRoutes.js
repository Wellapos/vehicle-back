const express = require('express')
const { body } = require('express-validator')
const authController = require('../controllers/authController')
const validateRequest = require('../middleware/validationMiddleware')

const router = express.Router()

// Validações para registro
const registerValidation = [
  body('email').isEmail().withMessage('Email deve ser válido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/\d/)
    .withMessage('Senha deve conter pelo menos um número')
]

// Validações para login
const loginValidation = [
  body('email').isEmail().withMessage('Email deve ser válido').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória')
]

// Rotas
router.post(
  '/register',
  registerValidation,
  validateRequest,
  authController.register
)
router.post('/login', loginValidation, validateRequest, authController.login)

module.exports = router

