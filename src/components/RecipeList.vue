<template>
  <div class="recipe-list">
    <div v-if="loading" class="loading">
      <p>Loading recipes...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
      <button @click="$emit('retry')" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else-if="recipes.length === 0" class="empty-state">
      <p>No recipes found. <router-link to="/add">Add your first recipe!</router-link></p>
    </div>

    <div v-else class="recipes-grid">
      <recipe-card v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import RecipeCard from './RecipeCard.vue'

defineProps({
  recipes: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

defineEmits(['retry'])
</script>

<style scoped>
.recipe-list {
  width: 100%;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.loading p {
  font-size: 1.1rem;
  color: #1976d2;
}

.error {
  background: #ffebee;
  border-radius: 8px;
  border-left: 4px solid #c62828;
}

.error p {
  margin: 0 0 16px 0;
  color: #c62828;
}

.empty-state {
  background: #f5f5f5;
  border-radius: 8px;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

.empty-state a {
  color: #1976d2;
  text-decoration: none;
  font-weight: 600;
}

.empty-state a:hover {
  text-decoration: underline;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.btn-secondary {
  background: #757575;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
}

.btn-secondary:hover {
  background: #616161;
}

@media (max-width: 768px) {
  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
