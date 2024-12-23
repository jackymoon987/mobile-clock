let audioContext: AudioContext | null = null;

export function playAlarm() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const panNode = audioContext.createStereoPanner();

    oscillator.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(audioContext.destination);

    const startTime = audioContext.currentTime;
    const duration = 2; // 2 seconds
    const sweepsPerSecond = 3;

    // Use sawtooth wave for richer harmonic content
    oscillator.type = 'sawtooth';

    // Create continuous frequency sweep
    const baseFreq = 400;
    const maxFreq = 1000;

    // Continuous frequency modulation
    for (let i = 0; i <= duration * 20; i++) {
      const t = i / 20;
      const freq = baseFreq + (maxFreq - baseFreq) * 
        (0.5 + 0.5 * Math.sin(2 * Math.PI * sweepsPerSecond * t));
      oscillator.frequency.setValueAtTime(freq, startTime + t);

      // Stereo panning for spatial effect
      panNode.pan.setValueAtTime(
        Math.sin(2 * Math.PI * sweepsPerSecond * t),
        startTime + t
      );
    }

    // Smooth volume envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
    gainNode.gain.setValueAtTime(0.2, startTime + duration - 0.2);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

  } catch (error) {
    console.error('Error playing alarm sound:', error);
  }
}