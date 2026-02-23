<template>
  <div class="recipe-form">
    <form @submit.prevent="handleSubmit">
      <div v-if="error" class="error-message">
        ❌ {{ error }}
      </div>

      <div v-if="validationErrors.length > 0" class="validation-errors">
        <div v-for="(err, idx) in validationErrors" :key="idx" class="error-item">
          • {{ err }}
        </div>
      </div>

      <!-- For adding recipes, only show URL input -->
      <div v-if="isAddMode" class="form-group">
        <label for="url">Recipe URL *</label>
        <input
          id="url"
          v-model="formData.url"
          type="url"
          placeholder="https://example.com/recipe"
          required
          class="form-input"
        />
        <small>Paste a URL to automatically fetch and add a new recipe</small>
      </div>

      <!-- For editing, show all editable fields -->
      <div v-if="!isAddMode && recipe">
        <div class="form-group">
          <label for="title">Title *</label>
          <input id="title" v-model="formData.title" type="text" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="prepTime">Prep Time (minutes)</label>
          <input
            id="prepTime"
            v-model.number="formData.prep_time"
            type="number"
            min="0"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="cookTime">Cook Time (minutes)</label>
          <input
            id="cookTime"
            v-model.number="formData.cook_time"
            type="number"
            min="0"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="ingredients">Ingredients (one per line) *</label>
          <textarea
            id="ingredients"
            v-model="ingredientsText"
            class="form-textarea"
            rows="6"
            placeholder="1 cup flour&#10;2 eggs&#10;1 cup milk"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="instructions">Instructions (one per line) *</label>
          <textarea
            id="instructions"
            v-model="instructionsText"
            class="form-textarea"
            rows="6"
            placeholder="Mix ingredients&#10;Cook on skillet"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="dietary">Dietary Restrictions (comma-separated)</label>
          <input
            id="dietary"
            v-model="formData.dietary_restrictions_text"
            type="text"
            placeholder="vegetarian, vegan, gluten-free"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : isAddMode ? 'Add Recipe' : 'Save Changes' }}
        </button>
        <router-link to="/" class="btn btn-secondary">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    default: null
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

const emit = defineEmits(['submit'])

const isAddMode = computed(() => !props.recipe)

const formData = ref({
  url: '',
  title: '',
  prep_time: 0,
  cook_time: 0,
  dietary_restrictions_text: ''
})

const ingredientsText = ref('')
const instructionsText = ref('')
const validationErrors = ref([])

// Validation helpers
const isValidUrl = (urlString) => {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}

const validateForm = () => {
  validationErrors.value = []

  if (isAddMode.value) {
    // URL validation for add mode
    if (!formData.value.url || formData.value.url.trim() === '') {
      validationErrors.value.push('Recipe URL is required')
    } else if (!isValidUrl(formData.value.url)) {
      validationErrors.value.push('Please enter a valid URL (e.g., https://example.com/recipe)')
    }
  } else {
    // Edit mode validations
    if (!formData.value.title || formData.value.title.trim() === '') {
      validationErrors.value.push('Recipe title is required')
    } else if (formData.value.title.length > 255) {
      validationErrors.value.push('Title must be 255 characters or less')
    }

    if (formData.value.prep_time < 0) {
      validationErrors.value.push('Prep time cannot be negative')
    }

    if (formData.value.cook_time < 0) {
      validationErrors.value.push('Cook time cannot be negative')
    }

    const ingredients = ingredientsText.value
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i)
    if (ingredients.length === 0) {
      validationErrors.value.push('At least one ingredient is required')
    }

    const instructions = instructionsText.value
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i)
    if (instructions.length === 0) {
      validationErrors.value.push('At least one instruction is required')
    }
  }

  return validationErrors.value.length === 0
}

// Initialize form with recipe data when it changes
watch(
  () => props.recipe,
  (newRecipe) => {
    if (newRecipe) {
      formData.value = {
        title: newRecipe.title || '',
        prep_time: newRecipe.prep_time || 0,
        cook_time: newRecipe.cook_time || 0,
        dietary_restrictions_text: (newRecipe.dietary_restrictions || []).join(', ')
      }
      ingredientsText.value = (newRecipe.ingredients || []).join('\n')
      instructionsText.value = (newRecipe.instructions || []).join('\n')
    }
    validationErrors.value = []
  },
  { immediate: true, deep: true }
)

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  let submitData

  if (isAddMode.value) {
    // For adding: send only URL (POST /recipes endpoint)
    submitData = {
      url: formData.value.url.trim()
    }
  } else {
    // For editing: send all updated fields (PATCH /recipes/{id} endpoint)
    submitData = {
      title: formData.value.title.trim(),
      prep_time: Math.max(0, formData.value.prep_time),
      cook_time: Math.max(0, formData.value.cook_time),
      ingredients: ingredientsText.value
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i),
      instructions: instructionsText.value
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i),
      dietary_restrictions: formData.value.dietary_restrictions_text
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d)
    }
  }

  emit('submit', submitData)
}
</script>

<style scoped>
.recipe-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-message {
  background: #f5e8e8;
  color: #8b4513;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid #c85a30;
}

.validation-errors {
  background: #ffe6e6;
  border: 1px solid #ffcccc;
  border-left: 4px solid #c85a30;
  color: #8b4513;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.validation-errors .error-item {
  margin: 4px 0;
  font-size: 0.95rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #4a3728;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #c85a30;
  box-shadow: 0 0 0 3px rgba(200, 90, 48, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group small {
  font-size: 0.85rem;
  color: #999;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  transition: background 0.2s;
  flex: 1;
  text-align: center;
  font-weight: 600;
}

.btn-primary {
  background: #c85a30;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #a84820;
}

.btn-primary:disabled {
  background: #d4c4b8;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5ede2;
  color: #4a3728;
  border: 1px solid #d4b5a0;
}

.btn-secondary:hover {
  background: #ede0d4;
}

@media (max-width: 768px) {
  .recipe-form {
    padding: 16px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
