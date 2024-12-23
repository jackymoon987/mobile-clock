import { playSoundEffect } from './soundEffects';

let audioInitialized = false;

export async function playAlarm(soundEffect: string = 'Crystal Bells') {
  try {
    console.log('Attempting to play sound:', soundEffect);
    await playSoundEffect(soundEffect);
    audioInitialized = true;
  } catch (error) {
    console.error('Error playing alarm sound:', error);
    // Attempt to recover from common mobile audio context errors
    if (!audioInitialized && error instanceof Error) {
      console.log('First playback attempt, retrying...');
      try {
        await playSoundEffect(soundEffect);
        audioInitialized = true;
      } catch (retryError) {
        console.error('Failed to play sound after retry:', retryError);
      }
    }
  }
}