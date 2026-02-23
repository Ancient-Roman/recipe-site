<template>
  <div class="home">
    <header class="hero">
      <h1>Recipe Collection</h1>
      <p>Discover, manage, and organize your favorite recipes</p>
      <div class="hero-actions">
        <router-link to="/add" class="btn btn-primary btn-large">Add New Recipe</router-link>
        <router-link to="/search" class="btn btn-secondary btn-large">Search Recipes</router-link>
      </div>
    </header>

    <main class="container">
      <recipe-list
        :recipes="recipes"
        :loading="loading"
        :error="error"
        @retry="fetchRecipes"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RecipeList from '../components/RecipeList.vue'
import recipeApi from '../services/recipeApi'

const recipes = ref([])
const loading = ref(false)
const error = ref(null)

const fetchRecipes = async () => {
  loading.value = true
  error.value = null
  try {
    // Calls GET /recipes endpoint
    recipes.value = await recipeApi.getAllRecipes()
  } catch (err) {
    error.value = 'Failed to load recipes. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecipes()
})
</script>

<style scoped>
.home {
  width: 100%;
}

.hero {
  background: #e8d5c4;
  color: #4a3728;
  padding: 60px 20px;
  text-align: center;
  border-radius: 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.hero p {
  font-size: 1.2rem;
  margin: 0 0 30px 0;
  opacity: 0.85;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-large {
  padding: 14px 28px;
  font-size: 1.05rem;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-block;
}

.btn-primary {
  background: #c85a30;
  color: white;
}

.btn-primary:hover {
  background: #a84820;
}

.btn-secondary {
  background: rgba(184, 134, 11, 0.15);
  color: #6b4423;
  border: 2px solid #c85a30;
}

.btn-secondary:hover {
  background: rgba(200, 90, 48, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 20px;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-large {
    width: 100%;
  }
}
</style>
