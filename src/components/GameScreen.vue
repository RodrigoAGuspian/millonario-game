<template>
  <div class="game-container">
    <!-- SVG Background -->
    <div class="background-svg">
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="blueGradient" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stop-color="#1a2a6c" />
            <stop offset="50%" stop-color="#3f51b5" />
            <stop offset="100%" stop-color="#0f0c29" />
          </radialGradient>
          <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.1)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#blueGradient)" />
        <g transform="translate(960,540)">
          <g>
            <g stroke="url(#rayGradient)" stroke-width="2">
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(0)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(30)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(60)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(90)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(120)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(150)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(180)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(210)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(240)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(270)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(300)" />
              <line x1="0" y1="0" x2="0" y2="-1000" transform="rotate(330)" />
            </g>
          </g>
          <g stroke="rgba(255,255,255,0.05)" fill="none">
            <circle r="100" />
            <circle r="200" />
            <circle r="300" />
            <circle r="400" />
            <circle r="500" />
            <circle r="600" />
            <circle r="700" />
            <circle r="800" />
          </g>
        </g>
      </svg>
    </div>

    <!-- Audio Controls -->
    <div class="audio-controls">
      <button @click="toggleMute" class="mute-button">
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1" 
        v-model="volume"
        @input="changeVolume"
        class="volume-slider"
      >
    </div>

    <!-- Start Screen -->
    <div v-if="gameState === 'start'" class="start-screen">
      <h1 class="game-title">¿Quién quiere ser millonario?</h1>
      <div class="csv-upload-container">
        <h2>Cargar preguntas</h2>
        <p class="csv-instructions">
          Carga un archivo CSV con tus preguntas personalizadas o utiliza las preguntas predeterminadas.
          <br><br>
          Formato del CSV: <br>
          <code>pregunta,opcion1,opcion2,opcion3,opcion4,respuesta_correcta(0-3),dificultad</code>
        </p>
        <div class="upload-area"
             :class="{ 'drag-over': isDragging }"
             @dragover.prevent="isDragging = true"
             @dragleave.prevent="isDragging = false"
             @drop.prevent="handleFileDrop">
          <input
            type="file"
            id="csv-file"
            accept=".csv"
            @change="handleFileUpload"
            class="file-input"
            ref="fileInput"
          >
          <div class="upload-content">
            <span class="upload-icon">📁</span>
            <p>Arrastra un archivo CSV aquí o <button @click="triggerFileInput" class="browse-button">Busca archivo</button></p>
          </div>
        </div>
        <div v-if="uploadError" class="error-message">
          {{ uploadError }}
        </div>
        <div class="start-buttons">
          <button @click="startGameWithDefault" class="start-button default-button">
            Jugar con preguntas predeterminadas
          </button>
          <button
            @click="startGameWithCustom"
            class="start-button custom-button"
            :disabled="!customQuestions.length">
            Jugar con preguntas personalizadas
          </button>
        </div>
      </div>
    </div>
    
    <!-- Game Screen -->
    <div v-else-if="gameState === 'playing'" class="game-playing">
      <h1 class="game-title">¿Quién quiere ser millonario?</h1>
      
      <div class="game-layout">
        <div class="game-main">
          <div class="question-display-container fixed-size-container">
            <QuestionDisplay
              v-if="currentQuestion"
              :question="currentQuestion.question"
              :options="currentQuestion.options"
              :hiddenOptions="hiddenOptions"
              @select-option="checkAnswer"
            />
          </div>
          <div class="controls-section">
            <LifelineBar
              :lifelines="lifelines"
              @use-lifeline="useLifeline"
            />
            
            <div class="game-feedback" v-if="feedbackMessage">
              <div class="alert-box">
                <h3 class="alert-title">{{ feedbackMessage.title }}</h3>
                <p class="alert-description">{{ feedbackMessage.description }}</p>
              </div>
            </div>
            
            <Timer
              v-if="lifelines.phoneCheck.active"
              :timeLeft="lifelines.phoneCheck.timeLeft"
            />
          </div>
        </div>
        
        <div class="game-sidebar">
          <PrizeScale
            :currentLevel="currentLevel"
            :levels="prizeLevels"
          />
        </div>
      </div>
      
      <div v-if="gameOverDialogOpen" class="dialog-overlay">
        <div class="dialog-content">
          <h2 class="dialog-title">Juego terminado</h2>
          <p class="dialog-description">
            {{ gameOverMessage }}
          </p>
          <div class="dialog-buttons">
            <button @click="resetGame" class="dialog-button">Jugar otra vez</button>
            <button @click="backToStart" class="dialog-button">Volver al inicio</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, watch } from 'vue';
import QuestionDisplay from './QuestionDisplay.vue';
import PrizeScale from './PrizeScale.vue';
import LifelineBar from './LifelineBar.vue';
import Timer from './TimerDisplay.vue';
import audioService from '../services/audio-service.js';
import defaultQuestions from '../data/questions.js';

// Audio controls
const isMuted = ref(false);
const volume = ref(0.5);

function toggleMute() {
  isMuted.value = audioService.toggleMute();
}

function changeVolume() {
  audioService.setVolume(volume.value);
}

// Load sounds when component mounts
onMounted(() => {
  audioService.loadSounds();
});

// File upload state
const fileInput = ref(null);
const isDragging = ref(false);
const uploadError = ref('');
const customQuestions = ref([]);

// Game state
const gameState = ref('start');
const questions = ref([]);
const currentLevel = ref(0);
const currentQuestionIndex = ref(0);
const hiddenOptions = ref([]);
const gameOverDialogOpen = ref(false);
const gameOverMessage = ref('');
const feedbackMessage = ref(null);
const timerInterval = ref(null);

// Prize levels
const prizeLevels = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]);

// Lifelines
const lifelines = ref({
  teacherHelp: {
    name: 'Ayuda de la Profesora',
    available: true,
    icon: 'teacher-icon'
  },
  phoneCheck: {
    name: 'Mirar el Celular',
    available: true,
    active: false,
    timeLeft: 20,
    icon: 'phone-icon'
  },
  fiftyFifty: {
    name: '50/50',
    available: true,
    icon: 'fifty-icon'
  }
});

// Watch for level changes to update background music
watch(currentLevel, () => {
  const difficulty = getDifficultyLevel();
  audioService.changeBackgroundMusic(difficulty);
});

// File handling functions
function triggerFileInput() {
  fileInput.value.click();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    readCSVFile(file);
  }
}

function handleFileDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    readCSVFile(file);
  }
}

function readCSVFile(file) {
  uploadError.value = '';
  if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
    uploadError.value = 'Por favor sube un archivo CSV válido.';
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const csvText = e.target.result;
      const parsedQuestions = parseCSV(csvText);
      if (parsedQuestions.length === 0) {
        uploadError.value = 'No se pudo extraer ninguna pregunta del archivo.';
        return;
      }
      customQuestions.value = parsedQuestions;
      console.log('Preguntas cargadas:', customQuestions.value);
      uploadError.value = '';
    } catch (error) {
      console.error('Error al procesar el CSV:', error);
      uploadError.value = 'Error al procesar el archivo: ' + error.message;
    }
  };
  reader.onerror = () => {
    uploadError.value = 'Error al leer el archivo.';
  };
  reader.readAsText(file);
}

function parseCSV(csvText) {
  const lines = csvText.split(/\r\n|\n/);
  const questions = [];
  const firstLine = lines[0].toLowerCase();
  const startIndex = firstLine.includes('pregunta') ||
                    firstLine.includes('question') ? 1 : 0;
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    let inQuotes = false;
    let currentValue = '';
    let values = [];
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    values.push(currentValue);
    values = values.map(val => val.replace(/^"|"$/g, '').trim());
    
    if (values.length < 7) {
      console.warn(`La línea ${i+1} no tiene suficientes valores`, values);
      continue;
    }
    
    const questionObj = {
      question: values[0],
      options: [values[1], values[2], values[3], values[4]],
      correctOption: parseInt(values[5], 10) || 0,
      difficulty: values[6].toLowerCase() || 'easy'
    };
    
    if (questionObj.correctOption < 0 || questionObj.correctOption > 3) {
      questionObj.correctOption = 0;
    }
    
    if (!['easy', 'medium', 'hard'].includes(questionObj.difficulty)) {
      questionObj.difficulty = 'easy';
    }
    
    questions.push(questionObj);
  }
  return questions;
}

// Game functions with audio integration
async function startGameWithDefault() {
  audioService.play('game-start', { interrupt: false });
  audioService.gameEnded = false;
  questions.value = [...defaultQuestions];
  gameState.value = 'playing';
  resetGameState();
  await audioService.playWithDelay('game-start', 'easy');

}

async function startGameWithCustom() {
  if (customQuestions.value.length === 0) {
    uploadError.value = 'No hay preguntas personalizadas disponibles.';
    return;
  }
  audioService.play('game-start', { interrupt: false });
  questions.value = [...customQuestions.value];
  gameState.value = 'playing';
  resetGameState();
  await audioService.playWithDelay('game-start', 'easy');

}

function resetGameState() {
  currentLevel.value = 0;
  currentQuestionIndex.value = 0;
  hiddenOptions.value = [];
  feedbackMessage.value = null;
  gameOverDialogOpen.value = false;
  audioService.play('game-start', { interrupt: false });
  gameState.value = 'playing';
  
  Object.keys(lifelines.value).forEach(key => {
    lifelines.value[key].available = true;
    if (key === 'phoneCheck') {
      lifelines.value[key].active = false;
      lifelines.value[key].timeLeft = 20;
    }
  });
  
  clearInterval(timerInterval.value);
}

function backToStart() {
  gameState.value = 'start';
  gameOverDialogOpen.value = false;
}

const currentQuestion = computed(() => {
  const questionPool = questions.value.filter(q => q.difficulty === getDifficultyLevel());
  if (questionPool.length > 0) {
    const index = currentQuestionIndex.value % questionPool.length;
    return questionPool[index];
  }
  return questions.value[currentQuestionIndex.value % questions.value.length] || null;
});

function getDifficultyLevel() {
  if (currentLevel.value < 3) return 'easy';
  if (currentLevel.value < 9) return 'medium';
  return 'hard';
}

function checkAnswer(selectedIndex) {
  audioService.cancelLifelineEffects();
  if (!currentQuestion.value) return;
  const isCorrect = selectedIndex === currentQuestion.value.correctOption;
  
  if (isCorrect) {
    feedbackMessage.value = {
      title: '¡Correcto!',
      description: 'Avanzas al siguiente nivel'
    };
    setTimeout(() => {
      feedbackMessage.value = null;
      currentLevel.value++;
      currentQuestionIndex.value++;
      hiddenOptions.value = [];
      if (currentLevel.value >= prizeLevels.value.length) {
        endGame(true);
      }
    }, 2000);
  } else {
    feedbackMessage.value = {
      title: 'Incorrecto',
      description: `La respuesta correcta era: ${currentQuestion.value.options[currentQuestion.value.correctOption]}`
    };
    setTimeout(() => {
      endGame(false);
    }, 2000);
  }
}

function useLifeline(type) {
  if (!lifelines.value[type].available) return;
  lifelines.value[type].available = false;
  
  switch (type) {
    case 'teacherHelp':
      audioService.activateLifeline('teacher-help');
      useTeacherHelp();
      break;
    case 'phoneCheck':
      audioService.activateLifeline('phone-check');
      usePhoneCheck();
      break;
    case 'fiftyFifty':
      audioService.activateLifeline('fifty-fifty');
      useFiftyFifty();
      break;
  }
}

function useTeacherHelp() {
  if (!currentQuestion.value) return;
  feedbackMessage.value = {
    title: 'Ayuda de la Profesora',
    description: 'Puedes consultar a la profesora'
  };
  setTimeout(() => {
    feedbackMessage.value = null;
  }, 3000);
}

function usePhoneCheck() {
  lifelines.value.phoneCheck.active = true;
  lifelines.value.phoneCheck.timeLeft = 20;
  feedbackMessage.value = {
    title: 'Mirar el Celular',
    description: 'Tienes 20 segundos para consultar tu celular'
  };
  timerInterval.value = setInterval(() => {
    lifelines.value.phoneCheck.timeLeft--;
    if (lifelines.value.phoneCheck.timeLeft <= 0) {
      clearInterval(timerInterval.value);
      lifelines.value.phoneCheck.active = false;
      feedbackMessage.value = {
        title: 'Tiempo agotado',
        description: 'Se acabó el tiempo para consultar tu celular'
      };
      setTimeout(() => {
        feedbackMessage.value = null;
      }, 2000);
    }
  }, 1000);
}

function useFiftyFifty() {
  if (!currentQuestion.value) return;
  const correctOption = currentQuestion.value.correctOption;
  const incorrectOptions = [0, 1, 2, 3].filter(opt =>
    opt !== correctOption && !hiddenOptions.value.includes(opt)
  );
  const numToHide = Math.min(2, incorrectOptions.length);
  const shuffled = [...incorrectOptions].sort(() => 0.5 - Math.random());
  const optionsToHide = shuffled.slice(0, numToHide);
  hiddenOptions.value.push(...optionsToHide);
  feedbackMessage.value = {
    title: '50/50',
    description: 'Se han eliminado dos opciones incorrectas'
  };
  setTimeout(() => {
    feedbackMessage.value = null;
  }, 2000);
}

function endGame(hasWon) {
  clearInterval(timerInterval.value);
  if (hasWon) {
    audioService.play('win', { fadeIn: true });
    gameOverMessage.value = `¡Felicidades! Has ganado el juego`;
  } else {
    audioService.play('game-over', { fadeIn: true });
    const safeLevel = currentLevel.value;
    gameOverMessage.value = `Juego terminado. Puntos: ${safeLevel.toLocaleString()}`;
  }
  gameOverDialogOpen.value = true;
}

function resetGame() {
  resetGameState();
}

onUnmounted(() => {
  clearInterval(timerInterval.value);
});
</script>

<style scoped>
.game-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  background-color: transparent;
}

.background-svg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
}

/* Audio Controls */
.audio-controls {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;
  background-color: rgba(26, 26, 108, 0.7);
  padding: 8px 12px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.mute-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.mute-button:hover {
  transform: scale(1.1);
}

.volume-slider {
  width: 100px;
  cursor: pointer;
}

/* Start Screen */
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.csv-upload-container {
  background-color: rgba(26, 26, 108, 0.8);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
}

.csv-instructions {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: left;
}

.csv-instructions code {
  background-color: rgba(42, 42, 124, 0.7);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
}

.upload-area {
  border: 2px dashed #7373ff;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(78, 78, 178, 0.2);
}

.upload-area:hover, .drag-over {
  border-color: #a3a3ff;
  background-color: rgba(78, 78, 178, 0.4);
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  font-size: 3rem;
}

.browse-button {
  background: none;
  border: none;
  color: #a3a3ff;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
}

.browse-button:hover {
  color: white;
}

.error-message {
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-weight: bold;
  background-color: rgba(255, 70, 70, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
}

.start-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.start-button {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: rgba(78, 78, 178, 0.8);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.start-button:hover:not(:disabled) {
  background-color: rgba(107, 107, 214, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.default-button {
  background-color: rgba(78, 78, 178, 0.8);
}

.custom-button {
  background-color: rgba(94, 154, 94, 0.8);
}

.custom-button:disabled {
  background-color: rgba(68, 68, 68, 0.5);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Game Screen */
.game-playing {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.game-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  color: #ffd700;
}

.game-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.game-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.fixed-size-container {
  width: 700px;
  height: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.question-display-container {
  background-color: rgba(26, 26, 108, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.question-display-container > * {
  width: 100%;
  overflow-wrap: break-word;
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 700px;
}

.game-sidebar {
  width: 200px;
  flex-shrink: 0;
}

.game-feedback {
  margin: 0.5rem 0;
}

.alert-box {
  background-color: rgba(26, 26, 108, 0.8);
  border-left: 4px solid #4e4eb2;
  border-radius: 4px;
  padding: 1rem;
  margin: 0.5rem 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.alert-title {
  color: #ffd700;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.alert-description {
  margin: 0;
  font-size: 1rem;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.dialog-content {
  background-color: rgba(26, 26, 108, 0.9);
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(115, 115, 255, 0.3);
}

.dialog-title {
  color: #ffd700;
  margin-top: 0;
  font-size: 1.8rem;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

.dialog-description {
  margin: 1rem 0;
  font-size: 1.2rem;
  line-height: 1.5;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.dialog-button {
  padding: 0.7rem 1.5rem;
  background-color: rgba(78, 78, 178, 0.8);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.dialog-button:hover {
  background-color: rgba(107, 107, 214, 0.9);
  transform: translateY(-2px);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .audio-controls {
    top: 10px;
    right: 10px;
    padding: 6px 10px;
  }
  
  .volume-slider {
    width: 80px;
  }

  .start-buttons {
    flex-direction: column;
  }
  
  .game-layout {
    flex-direction: column;
  }
  
  .game-sidebar {
    width: 100%;
    margin-top: 1rem;
  }
  
  .dialog-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  
  .fixed-size-container {
    width: 100%;
    height: 350px;
  }
  
  .controls-section {
    width: 100%;
  }
}
</style>