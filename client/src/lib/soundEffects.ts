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

// Crystal Bells effect
const generateCrystalBells = (audioContext: AudioContext, duration: number) => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  const delayBetweenNotes = 0.2;
  const pauseBetweenLoops = 1.0; // One second pause between loops
  const sequenceDuration = (notes.length * delayBetweenNotes) + pauseBetweenLoops;
  const loops = Math.floor(duration / sequenceDuration);

  for (let loop = 0; loop < loops; loop++) {
    notes.forEach((freq, index) => {
      const { oscillator, gainNode } = createOscillator(audioContext, 'sine');
      const startTime = audioContext.currentTime + (loop * sequenceDuration) + (index * delayBetweenNotes);
      const noteDuration = 0.3;

      oscillator.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    });
  }
};

// Gentle Rise effect
const generateGentleRise = (audioContext: AudioContext, duration: number) => {
  const { oscillator, gainNode } = createOscillator(audioContext, 'sine');

  oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + duration);

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.5);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

// Morning Birds effect
const generateMorningBirds = (audioContext: AudioContext, duration: number) => {
  const chirps = 6;
  const baseFreq = 2000;

  for (let i = 0; i < chirps; i++) {
    const { oscillator, gainNode } = createOscillator(audioContext, 'sine');
    const startTime = audioContext.currentTime + (i * (duration / chirps));
    const chirpDuration = 0.15;

    oscillator.frequency.setValueAtTime(baseFreq + Math.random() * 500, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      baseFreq + 1000 + Math.random() * 500,
      startTime + chirpDuration
    );

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, startTime + chirpDuration);

    oscillator.start(startTime);
    oscillator.stop(startTime + chirpDuration);
  }
};

// Soft Pulse effect
const generateSoftPulse = (audioContext: AudioContext, duration: number) => {
  const { oscillator, gainNode } = createOscillator(audioContext, 'sine');
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();

  lfo.frequency.value = 2; // 2 Hz pulse
  lfo.connect(lfoGain);
  lfoGain.gain.value = 0.15;
  lfoGain.connect(gainNode.gain);

  oscillator.frequency.value = 350;
  gainNode.gain.value = 0;

  lfo.start();
  oscillator.start();
  gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + duration - 0.2);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

  lfo.stop(audioContext.currentTime + duration);
  oscillator.stop(audioContext.currentTime + duration);
};

// Calm Wave effect
const generateCalmWave = (audioContext: AudioContext, duration: number) => {
  const { oscillator, gainNode, panNode } = createOscillator(audioContext, 'sine');
  const waveFreq = 0.25; // Wave frequency

  oscillator.frequency.value = 150;

  for (let i = 0; i <= duration * 20; i++) {
    const t = i / 20;
    gainNode.gain.setValueAtTime(
      0.15 * (0.6 + 0.4 * Math.sin(2 * Math.PI * waveFreq * t)),
      audioContext.currentTime + t
    );
    panNode.pan.setValueAtTime(
      0.7 * Math.sin(2 * Math.PI * waveFreq * t),
      audioContext.currentTime + t
    );
  }

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
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
  {
    name: 'Crystal Bells',
    generate: generateCrystalBells,
    icon: 'bell',
  },
  {
    name: 'Gentle Rise',
    generate: generateGentleRise,
    icon: 'trending-up',
  },
  {
    name: 'Morning Birds',
    generate: generateMorningBirds,
    icon: 'bird',
  },
  {
    name: 'Soft Pulse',
    generate: generateSoftPulse,
    icon: 'activity',
  },
  {
    name: 'Calm Wave',
    generate: generateCalmWave,
    icon: 'waves',
  }
];

let audioContext: AudioContext | null = null;

export const playSoundEffect = async (effectName: string) => {
  try {
    // Initialize audio context on first user interaction
    if (!audioContext) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContext();

      // Resume audio context if it's suspended (common on mobile)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    }

    const effect = soundEffects.find(e => e.name === effectName);
    if (effect) {
      // For mobile browsers, we need to resume the context within the user gesture
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      effect.generate(audioContext, 2);
    }
  } catch (error) {
    console.error('Error playing sound effect:', error);
  }
};

// Cleanup function to handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioContext) {
    audioContext.suspend();
  }
});