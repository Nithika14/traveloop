const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      city,
      country
    } = req.body

    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return res.status(400).json({
        error: 'Email already in use'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        city,
        country
      }
    })

    res.json({
      token: generateToken(user),
      user: {
        id: user.id,
        firstName,
        lastName,
        email
      }
    })

  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(400).json({
        error: 'Invalid credentials'
      })
    }

    const valid = await bcrypt.compare(
      password,
      user.passwordHash
    )

    if (!valid) {
      return res.status(400).json({
        error: 'Invalid credentials'
      })
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user.id,
        firstName: user.firstName,
        email
      }
    })

  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}

exports.me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      photo: true,
      city: true,
      country: true,
      role: true
    }
  })

  res.json(user)
}
exports.updateUser = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        city: true,
        country: true
      }
    })

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}