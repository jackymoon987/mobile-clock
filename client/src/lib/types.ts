export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  soundEffect: string;
  snoozeDuration: number;
  isSnoozing: boolean;
  snoozeEndTime?: string;
}
