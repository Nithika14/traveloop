const router = require('express').Router()
const auth = require('../middleware/auth')
const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

/* ---------------------------
   SAFE JSON PARSER
---------------------------- */
const parseAIResponse = (raw) => {
  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    console.error("❌ AI JSON Parse Error:\n", raw)
    throw new Error("Invalid AI response format")
  }
}

/* ---------------------------
   A. AI ITINERARY GENERATOR
---------------------------- */
router.post('/generate-itinerary', auth, async (req, res) => {
  const { city, days, budget, style } = req.body

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `
You are a professional travel planner.

Generate a complete travel itinerary.

Destination: ${city}
Duration: ${days} days
Budget: ${budget} USD
Travel style: ${style}

IMPORTANT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

JSON FORMAT:
{
  "stops": [
    {
      "cityName": "",
      "country": "",
      "startDate": "2025-06-01",
      "endDate": "2025-06-02",
      "order": 0,
      "activities": [
        {
          "name": "",
          "type": "sightseeing",
          "time": "09:00 AM",
          "cost": 0,
          "duration": 60,
          "description": ""
        }
      ]
    }
  ]
}
`
        }
      ]
    })

    const data = parseAIResponse(message.content[0].text)
    res.json(data)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'AI itinerary generation failed' })
  }
})

/* ---------------------------
   B. PACKING LIST GENERATOR
---------------------------- */
router.post('/packing-list', auth, async (req, res) => {
  const { destination, tripType, days } = req.body

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [
        {
          role: 'user',
          content: `
Create a packing list.

Destination: ${destination}
Trip type: ${tripType}
Duration: ${days} days

IMPORTANT:
Return ONLY valid JSON.

FORMAT:
{
  "items": [
    { "label": "Passport", "category": "documents" },
    { "label": "T-shirts x3", "category": "clothing" }
  ]
}

Categories allowed:
- clothing
- documents
- electronics
- misc
`
        }
      ]
    })

    const data = parseAIResponse(message.content[0].text)
    res.json(data)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Packing list generation failed' })
  }
})

/* ---------------------------
   C. BUDGET OPTIMIZER
---------------------------- */
router.post('/budget-optimizer', auth, async (req, res) => {
  const { activities, targetBudget, currentCost } = req.body

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [
        {
          role: 'user',
          content: `
You are a budget travel optimizer.

Current cost: ${currentCost}
Target budget: ${targetBudget}
Activities: ${JSON.stringify(activities)}

Return ONLY JSON:
{
  "suggestions": [
    {
      "original": "",
      "alternative": "",
      "savings": 0,
      "tip": ""
    }
  ]
}

Give 3 suggestions maximum.
`
        }
      ]
    })

    const data = parseAIResponse(message.content[0].text)
    res.json(data)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Budget optimization failed' })
  }
})

/* ---------------------------
   D. LOCAL TIPS GENERATOR
---------------------------- */
router.post('/local-tips', auth, async (req, res) => {
  const { city } = req.body

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `
Give 5 insider travel tips for ${city}.

Return ONLY JSON:
{
  "tips": [
    { "emoji": "🍜", "tip": "short useful tip" }
  ]
}

Make tips practical, local, and traveler-focused.
`
        }
      ]
    })

    const data = parseAIResponse(message.content[0].text)
    res.json(data)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Local tips generation failed' })
  }
})

module.exports = router