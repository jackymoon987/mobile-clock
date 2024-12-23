let audioContext: AudioContext | null = null;

export function playAlarm() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const startTime = audioContext.currentTime;
    const duration = 2; // 2 seconds
    const cycles = 4; // Number of high-low cycles

    // Siren frequency modulation
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, startTime); // Start at lower frequency
    for (let i = 0; i < cycles; i++) {
      // High pitch
      oscillator.frequency.exponentialRampToValueAtTime(
        1200, // Higher frequency
        startTime + (i + 0.25) * (duration / cycles)
      );
      // Low pitch
      oscillator.frequency.exponentialRampToValueAtTime(
        600, // Lower frequency
        startTime + (i + 0.75) * (duration / cycles)
      );
    }

    // Volume envelope with smooth fade in/out
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1); // Softer volume
    gainNode.gain.setValueAtTime(0.3, startTime + duration - 0.2);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

  } catch (error) {
    console.error('Error playing alarm sound:', error);
  }
}