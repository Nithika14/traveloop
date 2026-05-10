const router = require('express').Router()
const auth = require('../middleware/auth')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// GET all trips
router.get('/trips', auth, async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.id },
    include: { stops: true }
  })
  res.json(trips)
})

// GET single trip
router.get('/trips/:id', auth, async (req, res) => {
  const trip = await prisma.trip.findUnique({
    where: { id: req.params.id },
    include: {
      stops: {
        include: { activities: true }
      }
    }
  })
  res.json(trip)
})

// CREATE trip
router.post('/trips', auth, async (req, res) => {
  const { name, description, startDate, endDate, totalBudget } = req.body

  const trip = await prisma.trip.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalBudget: totalBudget ? Number(totalBudget) : null,
      userId: req.user.id
    }
  })

  res.json(trip)
})

module.exports = router