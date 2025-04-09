<template>
  <main class="app-container">
    <header class="app-header">
      <a class="template-link" href="/questions_template.csv" download>
        Descargar plantilla CSV
      </a>
    </header>

    <GameScreen />

    <footer class="app-footer">
      <p>¿Quién quiere ser millonario? - Versión educativa</p>
    </footer>
  </main>
</template>

<script setup>
import GameScreen from './components/GameScreen.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #000;
  color: white;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #000066;
  padding: 0.5rem 1rem;
  text-align: right;
}

.template-link {
  color: white;
  text-decoration: underline;
  font-size: 0.9rem;
}

.template-link:hover {
  color: #ffd700;
}

.app-footer {
  background-color: #000066;
  padding: 1rem;
  text-align: center;
  margin-top: auto;
  font-size: 0.8rem;
}
</style>