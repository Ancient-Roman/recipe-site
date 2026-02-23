<template>
  <div class="search-page">
    <header class="page-header">
      <router-link to="/" class="back-link">← Back to Recipes</router-link>
      <h1>Search Recipes</h1>
      <p>Find recipes by title, ingredient, or cooking time</p>
    </header>

    <main class="container">
      <search-bar @search="handleSearch" />

      <!-- Show results or initial state -->
      <div v-if="hasSearched">
        <recipe-list
          :recipes="results"
          :loading="loading"
          :error="error"
          @retry="retrySearch"
        />
      </div>
      <div v-else class="initial-state">
        <p>Enter a search query and filter to find recipes</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import RecipeList from '../components/RecipeList.vue'
import recipeApi from '../services/recipeApi'

const results = ref([])
const loading = ref(false)
const error = ref(null)
const hasSearched = ref(false)
const lastSearchQuery = ref(null)
const lastMaxTime = ref(null)

const handleSearch = async (searchData) => {
  loading.value = true
  error.value = null
  hasSearched.value = true
  lastSearchQuery.value = searchData.query
  lastMaxTime.value = searchData.maxTime

  try {
    // Calls GET /recipes/search endpoint with query and optional max_time
    results.value = await recipeApi.searchRecipes(searchData.query, searchData.maxTime)
  } catch (err) {
    error.value = 'Failed to search recipes. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const retrySearch = () => {
  if (lastSearchQuery.value) {
    handleSearch({
      query: lastSearchQuery.value,
      maxTime: lastMaxTime.value
    })
  }
}
</script>

<style scoped>
.search-page {
  width: 100%;
}

.page-header {
  background: #d5d8a0;
  color: #4a3728;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 40px;
}

.back-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 16px;
  transition: color 0.2s;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
}

.initial-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.1rem;
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
