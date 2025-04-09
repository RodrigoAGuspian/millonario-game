<template>
  <button 
    class="option-button"
    :class="{ 'option-hidden': disabled }"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="option-letter">{{ letter }}</span>
    <span class="option-text">{{ text }}</span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  letter: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.option-button {
  background-color: #4e4eb2;
  border: 2px solid #7373ff;
  color: white;
  font-size: 1.2rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.option-button:hover:not(:disabled) {
  background-color: #6b6bd6;
  transform: translateY(-2px);
}

.option-button:active:not(:disabled) {
  transform: translateY(1px);
}

.option-letter {
  font-weight: bold;
  background-color: #2d2d8a;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-text {
  flex-grow: 1;
}

.option-hidden {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>