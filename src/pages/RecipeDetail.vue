<template>
  <div class="recipe-detail-page">
    <div v-if="loading" class="loading-state">
      <p>Loading recipe...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
      <router-link to="/" class="btn btn-primary">Back to Recipes</router-link>
    </div>

    <div v-else-if="recipe" class="recipe-detail">
      <!-- Header with title and times -->
      <header class="detail-header">
        <router-link to="/" class="back-link">← Back to Recipes</router-link>
        <h1>{{ recipe.title }}</h1>

        <div class="recipe-meta">
          <div class="time-info">
            <div class="time-card">
              <span class="label">Prep Time</span>
              <span class="value">{{ recipe.prep_time }}m</span>
            </div>
            <div class="time-card">
              <span class="label">Cook Time</span>
              <span class="value">{{ recipe.cook_time }}m</span>
            </div>
            <div class="time-card highlight">
              <span class="label">Total Time</span>
              <span class="value">{{ recipe.total_time }}m</span>
            </div>
          </div>

          <div v-if="recipe.dietary_restrictions && recipe.dietary_restrictions.length" class="dietary-badges">
            <span v-for="restriction in recipe.dietary_restrictions" :key="restriction" class="dietary-badge">
              {{ restriction }}
            </span>
          </div>
        </div>
      </header>

      <!-- Recipe URL -->
      <div class="recipe-url">
        <a :href="recipe.url" target="_blank" class="url-link">
          View Original Recipe
        </a>
      </div>

      <main class="recipe-content">
        <!-- Ingredients -->
        <section class="ingredients-section">
          <h2>Ingredients</h2>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-item">
              {{ ingredient }}
            </li>
          </ul>
        </section>

        <!-- Instructions -->
        <section class="instructions-section">
          <h2>Instructions</h2>
          <ol class="instructions-list">
            <li v-for="(instruction, index) in recipe.instructions" :key="index" class="instruction-item">
              {{ instruction }}
            </li>
          </ol>
        </section>
      </main>

      <!-- Actions -->
      <footer class="detail-footer">
        <router-link :to="{ name: 'RecipeDetail', params: { id: String(recipe.id) }, query: { edit: 'true' } }" class="btn btn-primary">
          Edit Recipe
        </router-link>
        <button @click="handleDeleteRecipe" class="btn btn-danger" :disabled="deleting">
          {{ deleting ? 'Deleting...' : 'Delete Recipe' }}
        </button>
      </footer>

      <!-- Edit Modal -->
      <div v-if="isEditMode" class="modal-overlay" @click="closeEditMode">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h2>Edit Recipe</h2>
            <button @click="closeEditMode" class="close-btn">✕</button>
          </div>
          <div class="modal-body">
            <recipe-form
              :recipe="recipe"
              :loading="updating"
              :error="updateError"
              @submit="handleUpdateRecipe"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RecipeForm from '../components/RecipeForm.vue'
import recipeApi from '../services/recipeApi'

const router = useRouter()
const route = useRoute()

const recipe = ref(null)
const loading = ref(false)
const error = ref(null)
const deleting = ref(false)
const updating = ref(false)
const updateError = ref(null)

// Check if edit mode from query param
const isEditMode = computed(() => route.query.edit === 'true')

const fetchRecipe = async () => {
  loading.value = true
  error.value = null
  try {
    // Calls GET /recipes/{id} endpoint
    recipe.value = await recipeApi.getRecipeById(route.params.id)
  } catch (err) {
    error.value = 'Failed to load recipe. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleDeleteRecipe = async () => {
  if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
    return
  }

  deleting.value = true
  try {
    // Calls DELETE /recipes/{id} endpoint
    await recipeApi.deleteRecipe(recipe.value.id)
    router.push({ name: 'Home' })
  } catch (err) {
    alert('Failed to delete recipe. Please try again.')
    console.error(err)
  } finally {
    deleting.value = false
  }
}

const handleUpdateRecipe = async (formData) => {
  updating.value = true
  updateError.value = null
  try {
    // Calls PATCH /recipes/{id} endpoint with updated fields
    const updated = await recipeApi.updateRecipe(recipe.value.id, formData)
    recipe.value = updated
    closeEditMode()
  } catch (err) {
    updateError.value = err.response?.data?.detail || 'Failed to update recipe. Please try again.'
    console.error(err)
  } finally {
    updating.value = false
  }
}

const closeEditMode = () => {
  router.push({ name: 'RecipeDetail', params: { id: recipe.value.id } })
}

onMounted(() => {
  fetchRecipe()
})
</script>

<style scoped>
.recipe-detail-page {
  width: 100%;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-state p {
  font-size: 1.1rem;
  color: #1976d2;
}

.error-state {
  background: #ffebee;
}

.error-state p {
  color: #c62828;
  margin: 0 0 20px 0;
}

.recipe-detail {
  width: 100%;
}

.detail-header {
  background: #e8d5c4;
  color: #4a3728;
  padding: 40px 20px;
  border-radius: 0;
}

.back-link {
  color: rgba(74, 55, 40, 0.7);
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 16px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #4a3728;
}

.detail-header h1 {
  font-size: 2.2rem;
  margin: 0 0 20px 0;
}

.recipe-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.time-info {
  display: flex;
  gap: 12px;
}

.time-card {
  background: rgba(74, 55, 40, 0.08);
  padding: 12px 16px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.time-card.highlight {
  background: rgba(200, 90, 48, 0.1);
  font-weight: 600;
}

.time-card .label {
  font-size: 0.85rem;
  opacity: 0.85;
}

.time-card .value {
  font-size: 1.3rem;
  font-weight: 600;
}

.dietary-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dietary-badge {
  background: rgba(74, 55, 40, 0.1);
  color: #4a3728;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(74, 55, 40, 0.2);
}

.recipe-url {
  padding: 20px;
  text-align: center;
}

.url-link {
  color: #c85a30;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.url-link:hover {
  color: #a84820;
  text-decoration: underline;
}

.recipe-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.ingredients-section,
.instructions-section {
  display: flex;
  flex-direction: column;
}

.ingredients-section h2,
.instructions-section h2 {
  font-size: 1.3rem;
  color: #4a3728;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 3px solid #e8d5c4;
}

.ingredients-list,
.instructions-list {
  margin: 0;
  padding-left: 20px;
  color: #6b4423;
  font-size: 1rem;
}

.ingredients-list li,
.instructions-list li {
  margin: 10px 0;
  line-height: 1.6;
}

.detail-footer {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
  flex: 1;
  text-align: center;
}

.btn-primary {
  background: #c85a30;
  color: white;
}

.btn-primary:hover {
  background: #a84820;
}

.btn-danger {
  background: #8b4513;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #6b3410;
}

.btn-danger:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

@media (max-width: 768px) {
  .detail-header {
    padding: 30px 20px;
  }

  .detail-header h1 {
    font-size: 1.5rem;
  }

  .recipe-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .time-info {
    width: 100%;
    justify-content: space-between;
  }

  .recipe-content {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 30px 20px;
  }

  .detail-footer {
    flex-direction: column;
    gap: 10px;
  }

  .btn {
    flex: 0;
  }
}
</style>
