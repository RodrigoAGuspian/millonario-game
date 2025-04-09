<template>
  <div class="question-container">
    <div class="question-text">
      <h2 class="two-line-question">{{ question }}</h2>
    </div>
    <div class="options-grid">
      <OptionButton
        v-for="(option, index) in options"
        :key="index"
        :letter="getOptionLetter(index)"
        :text="option"
        :disabled="isOptionHidden(index)"
        @click="selectOption(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import OptionButton from './OptionButton.vue';

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  hiddenOptions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['select-option']);

function getOptionLetter(index) {
  return String.fromCharCode(65 + index); // A, B, C, D...
}

function isOptionHidden(index) {
  return props.hiddenOptions.includes(index);
}

function selectOption(index) {
  if (!isOptionHidden(index)) {
    emit('select-option', index);
  }
}
</script>

<style scoped>
.question-container {
  background-color: #1a1a6c; /* Azul un poco más claro que el fondo */
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.question-text {
  text-align: center;
  margin-bottom: 2rem;
  min-height: 80px; /* Altura mínima para la pregunta */
  display: flex;
  justify-content: center;
  align-items: center;
}

.question-text h2 {
  font-size: 1.8rem;
  color: white;
}

/* Clase para forzar al menos dos líneas */
.two-line-question {
  min-height: 2.2em; /* Altura mínima de dos líneas */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Técnica para forzar salto de línea en textos cortos */
.two-line-question::after {
  content: "";
  display: block;
  width: 100%;
  height: 0;
  /* Forzar un salto de línea si el texto es corto */
  margin-top: 0.8em;
  max-width: 1px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .question-text {
    min-height: 70px; /* Ligeramente menor en móviles */
  }
}
</style>