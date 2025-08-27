const express = require('express')
const reportController = require('../controllers/reportController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware)

// Rotas
router.get('/cost-per-km', reportController.getCostPerKmReport)
router.get('/vehicle/:vehicleId', reportController.getVehicleDetailedReport)

module.exports = router

