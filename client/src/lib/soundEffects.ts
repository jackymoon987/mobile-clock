import { type OscillatorType } from './types';

interface SoundEffect {
  name: string;
  generate: (audioContext: AudioContext, duration: number) => void;
  icon: string;
}

// Helper function to create basic oscillator setup
const createOscillator = (
  audioContext: AudioContext,
  type: OscillatorType = 'sine'
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const panNode = audioContext.createStereoPanner();
  
  oscillator.type = type;
  oscillator.connect(gainNode);
  gainNode.connect(panNode);
  panNode.connect(audioContext.destination);
  
  return { oscillator, gainNode, panNode };
};

// White noise generator
const generateWhiteNoise = (audioContext: AudioContext, duration: number) => {
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  
  source.buffer = buffer;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + duration - 0.2);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
  
  source.start();
  source.stop(audioContext.currentTime + duration);
};

// Ocean waves effect
const generateOceanWaves = (audioContext: AudioContext, duration: number) => {
  const { oscillator, gainNode, panNode } = createOscillator(audioContext, 'sine');
  const lfoFreq = 0.2; // Wave frequency
  
  for (let i = 0; i <= duration * 20; i++) {
    const t = i / 20;
    const freq = 100 + 50 * Math.sin(2 * Math.PI * lfoFreq * t);
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + t);
    
    gainNode.gain.setValueAtTime(
      0.15 * (0.5 + 0.5 * Math.sin(2 * Math.PI * lfoFreq * t)),
      audioContext.currentTime + t
    );
  }
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

// Wind chimes effect
const generateWindChimes = (audioContext: AudioContext, duration: number) => {
  const chimeFrequencies = [880, 988, 1108, 1318, 1480];
  const numChimes = 4;
  
  for (let i = 0; i < numChimes; i++) {
    const { oscillator, gainNode } = createOscillator(audioContext, 'sine');
    const startTime = audioContext.currentTime + (Math.random() * duration * 0.8);
    const noteLength = 0.5 + Math.random() * 0.5;
    
    oscillator.frequency.setValueAtTime(
      chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)],
      startTime
    );
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteLength);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + noteLength);
  }
};

// Rain sound effect
const generateRainSound = (audioContext: AudioContext, duration: number) => {
  const droplets = 100;
  
  for (let i = 0; i < droplets; i++) {
    const { oscillator, gainNode } = createOscillator(audioContext, 'triangle');
    const startTime = audioContext.currentTime + (Math.random() * duration);
    const dropletDuration = 0.02 + Math.random() * 0.03;
    
    oscillator.frequency.setValueAtTime(2000 + Math.random() * 1000, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, startTime + dropletDuration);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.005);
    gainNode.gain.linearRampToValueAtTime(0, startTime + dropletDuration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + dropletDuration);
  }
};

export const soundEffects: SoundEffect[] = [
  {
    name: 'Radial',
    generate: (ctx, duration) => {
      const { oscillator, gainNode, panNode } = createOscillator(ctx, 'sawtooth');
      const sweepsPerSecond = 3;
      const baseFreq = 400;
      const maxFreq = 1000;

      for (let i = 0; i <= duration * 20; i++) {
        const t = i / 20;
        const freq = baseFreq + (maxFreq - baseFreq) * 
          (0.5 + 0.5 * Math.sin(2 * Math.PI * sweepsPerSecond * t));
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime + t);
        panNode.pan.setValueAtTime(
          Math.sin(2 * Math.PI * sweepsPerSecond * t),
          ctx.currentTime + t
        );
      }

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + duration - 0.2);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    icon: 'radio',
  },
  {
    name: 'White Noise',
    generate: generateWhiteNoise,
    icon: 'waves',
  },
  {
    name: 'Ocean',
    generate: generateOceanWaves,
    icon: 'waves',
  },
  {
    name: 'Wind Chimes',
    generate: generateWindChimes,
    icon: 'bell',
  },
  {
    name: 'Rain',
    generate: generateRainSound,
    icon: 'cloud-rain',
  },
];

export const playSoundEffect = (effectName: string) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const effect = soundEffects.find(e => e.name === effectName);
    
    if (effect) {
      effect.generate(audioContext, 2);
    }
  } catch (error) {
    console.error('Error playing sound effect:', error);
  }
};
