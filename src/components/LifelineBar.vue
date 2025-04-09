<template>
  <div class="lifeline-bar">
    <h3 class="lifeline-title">Comodines</h3>
    <div class="lifelines-container">
      <TooltipProvider>
        <TooltipRoot v-for="(lifeline, key) in lifelines" :key="key">
          <TooltipTrigger asChild>
            <button 
              class="lifeline-button" 
              :class="{ 'lifeline-used': !lifeline.available }"
              :disabled="!lifeline.available"
              @click="useLifeline(key)"
            >
              <span class="lifeline-icon">
                <!-- Aquí puedes usar un ícono para cada comodín -->
                <span v-if="key === 'teacherHelp'">👩‍🏫</span>
                <span v-else-if="key === 'phoneCheck'">📱</span>
                <span v-else-if="key === 'fiftyFifty'">50:50</span>
              </span>
            </button>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent class="lifeline-tooltip">
              {{ lifeline.name }}
              <span v-if="!lifeline.available">(Usado)</span>
              <TooltipArrow />
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { 
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipPortal,
  TooltipArrow
} from 'radix-vue';

const props = defineProps({
  lifelines: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['use-lifeline']);

function useLifeline(type) {
  if (props.lifelines[type].available) {
    emit('use-lifeline', type);
  }
}
</script>

<style scoped>
.lifeline-bar {
  background-color: #1a1a6c;
  border-radius: 12px;
  padding: 1rem;
}

.lifeline-title {
  text-align: center;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
}

.lifelines-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.lifeline-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4e4eb2;
  border: 2px solid #7373ff;
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lifeline-button:hover:not(:disabled) {
  background-color: #6b6bd6;
  transform: scale(1.1);
}

.lifeline-used {
  opacity: 0.4;
  cursor: not-allowed;
}

.lifeline-icon {
  font-size: 1.5rem;
}

.lifeline-tooltip {
  background-color: #333;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  z-index: 1000;
}
</style>