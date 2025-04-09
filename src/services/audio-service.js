class AudioService {
    constructor() {
      this.sounds = {};
      this.backgroundSounds = {};
      this.currentBackground = null;
      this.currentBackgroundSound = null;
      this.isMuted = false;
      this.volume = 0.5;
      this.originalVolume = 0.5;
      this.fadeInterval = null;
      this.lifelineTimeout = null;
      this.activeLifelineSound = null;
      this.backgroundMuteTimeout = null;
      this.gameEnded = false;
    }
  
    temporarilyMuteBackground(duration = 10000) {
      Object.values(this.backgroundSounds).forEach(s => s.muted = true);
  
      clearTimeout(this.backgroundMuteTimeout);
      this.backgroundMuteTimeout = setTimeout(() => {
        if (!this.isMuted) {
          Object.values(this.backgroundSounds).forEach(s => s.muted = false);
        }
      }, duration);
    }
  
    stopBackground() {
        if (this.currentBackgroundSound) {
            this.currentBackgroundSound.pause();
            this.currentBackgroundSound.currentTime = 0;
            this.currentBackgroundSound = null;
            this.currentBackground = null;
        }
    }
  
    async playWithDelay(name, backgroundName) {
      this.play(name);
      await new Promise(resolve => {
        const sound = this.sounds[name];
        if (!sound) return resolve();
        sound.onended = resolve;
        setTimeout(resolve, sound.duration * 1000 + 500);
      });
      this.changeBackgroundMusic(backgroundName);
    }
  
    async activateLifeline(soundName, duration = 10000) {
      this.cancelLifelineEffects();
      this.originalVolume = this.volume;
      await this.fadeOut(300);
      this.temporarilyMuteBackground(duration);
  
      this.play(soundName, { interrupt: false });
      this.activeLifelineSound = this.sounds[soundName];
  
      this.lifelineTimeout = setTimeout(() => {
        if (this.activeLifelineSound) {
          this.activeLifelineSound.pause();
          this.activeLifelineSound.currentTime = 0;
          this.activeLifelineSound = null;
        }
        this.fadeIn(300);
      }, duration);
    }
  
    cancelLifelineEffects() {
      if (this.lifelineTimeout) clearTimeout(this.lifelineTimeout);
      if (this.activeLifelineSound) {
        this.activeLifelineSound.pause();
        this.activeLifelineSound.currentTime = 0;
        this.activeLifelineSound = null;
      }
      this.setVolume(this.originalVolume);
    }
  
    async fadeOut(duration = 300) {
      const steps = 10;
      const stepTime = duration / steps;
      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepTime));
        this.setVolume(this.volume * 0.8);
      }
      this.setVolume(0.1);
    }
  
    async fadeIn(duration = 300) {
      const steps = 10;
      const stepTime = duration / steps;
      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepTime));
        const newVol = 0.1 + (this.originalVolume - 0.1) * (i / steps);
        this.setVolume(newVol);
      }
      this.setVolume(this.originalVolume);
    }
  
    loadSounds() {
      this.loadSound('correct', '/sounds/answer.mp3');
      this.loadSound('wrong', '/sounds/answer.mp3');
      this.loadSound('fifty-fifty', '/sounds/fifty-fifty.mp3');
      this.loadSound('teacher-help', '/sounds/teacher-help.mp3');
      this.loadSound('phone-check', '/sounds/phone-check.mp3');
      this.loadSound('level-change', '/sounds/level-change.mp3');
      this.loadSound('game-start', '/sounds/game-start.mp3');
      this.loadSound('game-over', '/sounds/game-over.mp3');
      this.loadSound('win', '/sounds/win.mp3');
  
      this.loadBackgroundSound('easy', '/sounds/background-easy.mp3');
      this.loadBackgroundSound('medium', '/sounds/background-hard.mp3');
      this.loadBackgroundSound('hard', '/sounds/background-hard.mp3');
    }
  
    loadSound(name, url) {
      const audio = new Audio(url);
      audio.volume = this.volume;
      audio.muted = this.isMuted;
      this.sounds[name] = audio;
    }
  
    loadBackgroundSound(name, url) {
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = this.volume * 0.5;
      audio.muted = this.isMuted;
      this.backgroundSounds[name] = audio;
    }
  
    play(name, options = {}) {
      const sound = this.sounds[name];
      if (!sound || this.isMuted) return;
  
      const isLifelineSound = sound === this.activeLifelineSound;
      if (!isLifelineSound) this.cancelLifelineEffects();
  
      const { interrupt = true, onEnded = null } = options;
  
      // Detener música de fondo si se gana o se pierde
      if (name === 'win' || name === 'game-over') {
        this.gameEnded = true;
        this.stopBackground();
      }
  
      if (interrupt) {
        sound.pause();
        sound.currentTime = 0;
      }
  
      sound.play().catch(error => {
        console.warn(`Error al reproducir sonido ${name}:`, error);
      });
  
      if (onEnded) sound.onended = onEnded;
    }
  
    changeBackgroundMusic(difficulty) {
      if (this.gameEnded) return; 
      if (this.currentBackground === difficulty) return;
  
      const newBackground = this.backgroundSounds[difficulty];
      if (!newBackground) return;
  
      if (this.currentBackgroundSound) {
        this.fadeAudioOut(this.currentBackgroundSound, () => {
          this.playNewBackground(difficulty);
        });
      } else {
        this.playNewBackground(difficulty);
      }
    }
  
    playNewBackground(name) {
      const bgSound = this.backgroundSounds[name];
      if (!bgSound || this.isMuted) return;
  
      this.currentBackground = name;
      this.currentBackgroundSound = bgSound;
      bgSound.currentTime = 0;
      bgSound.volume = 0;
  
      bgSound.play()
        .then(() => this.fadeAudioIn(bgSound))
        .catch(error => {
          console.warn(`Error al reproducir música de fondo ${name}:`, error);
        });
    }
  
    fadeAudioIn(audio) {
      clearInterval(this.fadeInterval);
      const targetVolume = audio === this.currentBackgroundSound ? this.volume * 0.5 : this.volume;
  
      this.fadeInterval = setInterval(() => {
        if (audio.volume < targetVolume) {
          audio.volume = Math.min(audio.volume + 0.05, targetVolume);
        } else {
          clearInterval(this.fadeInterval);
        }
      }, 100);
    }
  
    fadeAudioOut(audio, callback) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume = Math.max(audio.volume - 0.05, 0);
        } else {
          audio.pause();
          audio.currentTime = 0;
          clearInterval(this.fadeInterval);
          if (callback) callback();
        }
      }, 100);
    }
  
    toggleMute() {
      this.isMuted = !this.isMuted;
  
      Object.values(this.sounds).forEach(sound => {
        sound.muted = this.isMuted;
      });
  
      Object.values(this.backgroundSounds).forEach(sound => {
        sound.muted = this.isMuted;
      });
  
      return this.isMuted;
    }
  
    setVolume(level) {
      this.volume = Math.min(1, Math.max(0, level));
  
      Object.entries(this.sounds).forEach(([, sound]) => {
        if (sound !== this.currentBackgroundSound) {
          sound.volume = this.volume;
        }
      });
  
      if (this.currentBackgroundSound) {
        this.currentBackgroundSound.volume = this.volume * 0.5;
      }
    }
  }
  
  const audioService = new AudioService();
  export default audioService;
  