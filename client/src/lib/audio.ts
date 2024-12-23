import { playSoundEffect } from './soundEffects';

let audioContext: AudioContext | null = null;

export function playAlarm(soundEffect: string = 'Radial') {
  playSoundEffect(soundEffect);
}