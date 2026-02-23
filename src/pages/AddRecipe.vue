<template>
  <div class="add-recipe-page">
    <header class="page-header">
      <router-link to="/" class="back-link">← Back to Recipes</router-link>
      <h1>Add New Recipe</h1>
      <p>Paste a recipe URL and it will be automatically fetched and added to your collection</p>
    </header>

    <main class="container">
      <recipe-form :loading="loading" :error="error" @submit="handleAddRecipe" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RecipeForm from '../components/RecipeForm.vue'
import recipeApi from '../services/recipeApi'

const router = useRouter()
const loading = ref(false)
const error = ref(null)

const handleAddRecipe = async (formData) => {
  loading.value = true
  error.value = null
  try {
    // Calls POST /recipes endpoint with URL
    await recipeApi.addRecipe(formData.url)
    // Redirect to home after successful add
    router.push({ name: 'Home' })
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to add recipe. Please check the URL and try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-recipe-page {
  width: 100%;
}

.page-header {
  background: #e8c8b8;
  color: #4a3728;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 40px;
}

.back-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 16px;
}

.back-link:hover {
  color: white;
}

.page-header h1 {
  font-size: 2rem;
  margin: 0 0 10px 0;
}

.page-header p {
  font-size: 1.05rem;
  margin: 0;
  opacity: 0.9;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 30px 20px;
    margin-bottom: 30px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .page-header p {
    font-size: 0.95rem;
  }
}
</style>
