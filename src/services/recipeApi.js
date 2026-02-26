import axios from 'axios'

// API Service - Handles all backend requests via BFF (Backend-For-Frontend)
// All requests go through /api/* endpoints (Vercel serverless functions)
// The BFF keeps the API key secure on the server

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      throw new Error('API authentication failed. Please check your credentials.')
    }

    if (error.response?.status === 403) {
      throw new Error('You do not have permission to perform this action.')
    }

    return Promise.reject(error)
  }
)

export default {
  // GET /recipes - Fetch all recipes
  async getAllRecipes() {
    try {
      const response = await apiClient.get('/recipes/')
      return response.data
    } catch (error) {
      console.error('Error fetching recipes:', error)
      throw error
    }
  },

  // GET /recipes/{id} - Fetch a single recipe
  async getRecipeById(id) {
    try {
      const response = await apiClient.get(`/recipes/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error)
      throw error
    }
  },

  // POST /recipes - Add a new recipe by URL
  async addRecipe(url) {
    try {
      const response = await apiClient.post('/recipes/', { url })
      return response.data
    } catch (error) {
      console.error('Error adding recipe:', error)
      throw error
    }
  },

  // PATCH /recipes/{id} - Update a recipe
  async updateRecipe(id, updates) {
    try {
      const response = await apiClient.patch(`/recipes/${id}`, updates)
      return response.data
    } catch (error) {
      console.error(`Error updating recipe ${id}:`, error)
      throw error
    }
  },

  // DELETE /recipes/{id} - Delete a recipe
  async deleteRecipe(id) {
    try {
      const response = await apiClient.delete(`/recipes/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting recipe ${id}:`, error)
      throw error
    }
  },

  // GET /recipes/search - Search recipes by title/ingredient and optional max_time
  async searchRecipes(query = null, maxTime = null) {
    try {
      const params = {};
      if (query) {
        params.q = query
      }
      if (maxTime) {
        params.max_time = maxTime
      }
      const response = await apiClient.get('/recipes/search', { params })
      return response.data
    } catch (error) {
      console.error('Error searching recipes:', error)
      throw error
    }
  }
}
