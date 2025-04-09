<template>
  <div class="timer-container">
    <div class="timer-circle">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          class="timer-background"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          class="timer-progress"
          cx="50"
          cy="50"
          r="45"
          :style="circleStyle"
        />
      </svg>
      <div class="timer-text">{{ timeLeft }}</div>
    </div>
    <div class="timer-label">Tiempo restante</div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  timeLeft: {
    type: Number,
    required: true
  },
  maxTime: {
    type: Number,
    default: 20
  }
});

const circleStyle = computed(() => {
  const circumference = 2 * Math.PI * 45;
  const progress = props.timeLeft / props.maxTime;
  const dashoffset = circumference * (1 - progress);
  
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: dashoffset
  };
});
</script>

<style scoped>
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.timer-circle {
  position: relative;
  width: 100px;
  height: 100px;
}

.timer-background {
  fill: none;
  stroke: #333;
  stroke-width: 8;
}

.timer-progress {
  fill: none;
  stroke: #ffd700;
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.3s ease;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.timer-label {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: white;
}
</style>