import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import AddRecipe from '../pages/AddRecipe.vue'
import RecipeDetail from '../pages/RecipeDetail.vue'
import Search from '../pages/Search.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add',
    name: 'AddRecipe',
    component: AddRecipe
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetail
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
