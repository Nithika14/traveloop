const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const {
  register,
  login,
  me,
  updateUser
} = require('../controllers/authController')

router.post('/auth/register', register)
router.post('/auth/login', login)
router.get('/auth/me', auth, me)

// ✅ FIXED USER UPDATE ROUTE
router.put('/users/:id', auth, updateUser)

module.exports = router