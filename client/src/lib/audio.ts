import { playSoundEffect } from './soundEffects';

let audioContext: AudioContext | null = null;
let initialized = false;

async function initializeAudio() {
  if (!initialized) {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContext();

      // Create a silent oscillator to keep the audio context active
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();

      initialized = true;
      console.log('Audio context initialized:', audioContext.state);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }
  return audioContext;
}

export async function playAlarm(soundEffect: string = 'Crystal Bells') {
  try {
    const ctx = await initializeAudio();

    if (ctx.state === 'suspended') {
      await ctx.resume();
      console.log('Audio context resumed:', ctx.state);
    }

    await playSoundEffect(soundEffect);
    console.log('Alarm sound played successfully');
  } catch (error) {
    console.error('Error playing alarm:', error);
    // Try to recover on mobile devices
    if (!initialized) {
      try {
        await initializeAudio();
        await playAlarm(soundEffect);
      } catch (retryError) {
        console.error('Failed to play sound after retry:', retryError);
      }
    }
  }
}

// Initialize audio on first user interaction
document.addEventListener('touchstart', async () => {
  try {
    await initializeAudio();
  } catch (error) {
    console.error('Error initializing audio on touch:', error);
  }
}, { once: true });

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (audioContext) {
    if (document.hidden) {
      audioContext.suspend();
    } else {
      audioContext.resume();
    }
  }
});