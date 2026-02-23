// BFF Proxy: /api/recipes
// Handles GET (list all) and POST (create new) for recipes

import axios from 'axios'

const BACKEND_URL = process.env.VITE_API_BASE_URL
const API_KEY = process.env.VITE_API_KEY

if (!BACKEND_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not set')
}

const backendClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add API key header if configured
if (API_KEY) {
  backendClient.defaults.headers.common['X-API-Key'] = API_KEY
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // GET /recipes - Fetch all recipes
      const response = await backendClient.get('/recipes/')
      res.status(response.status).json(response.data)
    } else if (req.method === 'POST') {
      // POST /recipes - Create new recipe
      const response = await backendClient.post('/recipes', req.body)
      res.status(response.status).json(response.data)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data?.detail || error.response.data || error.message
      })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
