<template>
  <div class="recipe-card">
    <div class="recipe-card-header">
      <h3>{{ recipe.title }}</h3>
      <div class="recipe-times">
        <span class="time-badge">Prep: {{ recipe.prep_time }}m</span>
        <span class="time-badge">Cook: {{ recipe.cook_time }}m</span>
        <span class="time-badge total">Total: {{ recipe.total_time }}m</span>
      </div>
    </div>

    <div class="recipe-card-body">
      <div v-if="recipe.dietary_restrictions && recipe.dietary_restrictions.length" class="dietary-tags">
        <span v-for="restriction in recipe.dietary_restrictions" :key="restriction" class="dietary-tag">
          {{ restriction }}
        </span>
      </div>

      <div class="ingredients-preview">
        <h4>Ingredients:</h4>
        <ul>
          <li v-for="(ingredient, index) in recipe.ingredients.slice(0, 3)" :key="index">
            {{ ingredient }}
          </li>
          <li v-if="recipe.ingredients.length > 3" class="more-items">
            +{{ recipe.ingredients.length - 3 }} more...
          </li>
        </ul>
      </div>
    </div>

    <div class="recipe-card-footer">
      <router-link :to="{ name: 'RecipeDetail', params: { id: String(recipe.id) } }" class="btn btn-primary">
        View Details
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.recipe-card {
  background: white;
  border: 1px solid #e8d5c4;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.12);
}

.recipe-card-header {
  margin-bottom: 12px;
}

.recipe-card-header h3 {
  margin: 0 0 8px 0;
  color: #4a3728;
  font-size: 1.3rem;
}

.recipe-times {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.time-badge {
  background: #f5ede2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #8b4513;
}

.time-badge.total {
  background: #fce4d6;
  color: #c85a30;
  font-weight: 600;
}

.dietary-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.dietary-tag {
  background: #d4e8d4;
  color: #2d5a2d;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.ingredients-preview {
  margin-bottom: 12px;
}

.ingredients-preview h4 {
  margin: 0 0 6px 0;
  color: #555;
  font-size: 0.95rem;
}

.ingredients-preview ul {
  margin: 0;
  padding-left: 20px;
  font-size: 0.9rem;
  color: #666;
}

.ingredients-preview li {
  margin: 4px 0;
}

.more-items {
  font-style: italic;
  color: #999;
}

.recipe-card-footer {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.2s;
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
</style>
