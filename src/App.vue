<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">The Recipe Box</router-link>
        <ul class="nav-menu">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/add">Add Recipe</router-link>
          </li>
          <li>
            <router-link to="/search">Search</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <router-view />

    <footer class="app-footer">
      <p>&copy; 2026 The Recipe Box. Built with Vue 3 and FastAPI.</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

body {
  font-family: 'Georgia', 'Garamond', serif;
  background: #faf8f3;
  color: #4a3728;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Navbar */
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 3px solid #d4755a;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-brand {
  font-size: 1.8rem;
  font-weight: 700;
  color: #c85a30;
  text-decoration: none;
  transition: color 0.2s;
  letter-spacing: 1px;
}

.nav-brand:hover {
  color: #a84820;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: #6b4423;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  font-size: 0.95rem;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: #d4755a;
}

/* Main content */
main {
  flex: 1;
}

/* Footer */
.app-footer {
  background: #6b4423;
  color: #faf8f3;
  text-align: center;
  padding: 30px 20px;
  margin-top: 40px;
  border-top: 3px solid #d4755a;
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    height: 56px;
  }

  .nav-brand {
    font-size: 1.2rem;
  }

  .nav-menu {
    gap: 20px;
  }

  .nav-menu a {
    font-size: 0.85rem;
  }
}

/* Smooth transitions */
.router-link-enter-active,
.router-link-leave-active {
  transition: opacity 0.3s;
}

.router-link-enter-from,
.router-link-leave-to {
  opacity: 0;
}
</style>
