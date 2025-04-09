<template>
    <div class="prize-scale">
      <h3 class="prize-scale-title">Nivel</h3>
      <ul class="prize-levels">
        <li 
          v-for="(level, index) in reversedLevels" 
          :key="index"
          class="prize-level"
          :class="{
            'current-level': currentLevel === reversedLevels.length - 1 - index,
            'completed-level': currentLevel > reversedLevels.length - 1 - index
          }"
        >
          <span class="prize-amount">{{ formatNumber(level) }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed } from 'vue';
  
  const props = defineProps({
    currentLevel: {
      type: Number,
      default: 0
    },
    levels: {
      type: Array,
      required: true
    }
  });
  
  const reversedLevels = computed(() => {
    return [...props.levels].reverse();
  });
  
  function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }
  </script>
  
  <style scoped>
  .prize-scale {
    background-color: #1a1a6c;
    border-radius: 12px;
    padding: 1rem;
    width: 200px;
    max-height: 600px;
    overflow-y: auto;
  }
  
  .prize-scale-title {
    text-align: center;
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
  }
  
  .prize-levels {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .prize-level {
    padding: 0.5rem 1rem;
    margin: 0.3rem 0;
    border-radius: 4px;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
  }
  
  .current-level {
    background-color: #ffd700;
    color: #000080;
    font-weight: bold;
    transform: scale(1.05);
  }
  
  .completed-level {
    background-color: #4e4eb2;
    opacity: 0.7;
  }
  
  .prize-amount {
    font-size: 0.9rem;
  }
  </style>