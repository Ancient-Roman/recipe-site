<template>
  <div class="search-bar">
    <form @submit.prevent="handleSearch">
      <div class="search-input-group">
        <input
          v-model="query"
          type="text"
          placeholder="Search by title or ingredient..."
          class="search-input"
        />
        <button type="submit" class="btn btn-search">Search</button>
      </div>

      <div class="search-filters">
        <label>
          Max cooking time (minutes):
          <input
            v-model.number="maxTime"
            type="number"
            min="0"
            placeholder="Optional"
            class="time-input"
          />
        </label>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['search'])

const query = ref('')
const maxTime = ref(null)

const handleSearch = () => {
  if (query.value.trim()) {
    emit('search', {
      query: query.value,
      maxTime: maxTime.value
    })
  }
}
</script>

<style scoped>
.search-bar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

form {
  width: 100%;
}

.search-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #1976d2;
}

.btn-search {
  padding: 12px 24px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-search:hover {
  background: #1565c0;
}

.search-filters {
  display: flex;
  gap: 20px;
}

.search-filters label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.95rem;
}

.time-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  width: 120px;
}

.time-input:focus {
  outline: none;
  border-color: #1976d2;
}

@media (max-width: 768px) {
  .search-input-group {
    flex-direction: column;
  }

  .search-filters {
    flex-direction: column;
  }

  .search-filters label {
    flex-wrap: wrap;
  }
}
</style>
