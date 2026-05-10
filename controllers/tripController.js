const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.createTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        totalBudget: req.body.totalBudget ? Number(req.body.totalBudget) : null,
        userId: req.user.id
      }
    })
    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getTrips = async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.id },
    include: { stops: true }
  })
  res.json(trips)
}

exports.getTrip = async (req, res) => {
  const trip = await prisma.trip.findUnique({
    where: { id: req.params.id },
    include: { stops: { include: { activities: true } } }
  })
  res.json(trip)
}

exports.updateTrip = async (req, res) => {
  const trip = await prisma.trip.update({
    where: { id: req.params.id },
    data: req.body
  })
  res.json(trip)
}

exports.deleteTrip = async (req, res) => {
  await prisma.trip.delete({
    where: { id: req.params.id }
  })
  res.json({ message: 'deleted' })
}