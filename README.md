# Mobile-Optimized Clock Application

A sophisticated cross-platform mobile clock and alarm management application delivering an intelligent and personalized time tracking experience.

## Features

- World Clock with timezone support
- Alarm system with snooze functionality
- Mobile-optimized stopwatch with lap timing
- Countdown timer with multiple concurrent timers
- Crystal Bells default sound effect
- Wake lock support for reliable alarms
- Mobile-first design with touch optimization

## Project Structure

```
src/
├── components/
│   └── clock/
│       ├── Alarm.tsx
│       ├── Timer.tsx
│       ├── Stopwatch.tsx
│       └── WorldClock.tsx
├── lib/
│   ├── audio.ts
│   ├── soundEffects.ts
│   ├── time.ts
│   ├── types.ts
│   └── wakeLock.ts
└── App.tsx
```

## Dependencies

Required packages:
```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "dayjs": "^3.6.0",
    "lucide-react": "^0.453.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^3.4.14"
  }
}
```

## Key Features Implementation

### Audio Support
The application uses the Web Audio API with proper mobile device handling:
- Automatic audio context initialization
- Touch event handling for mobile devices
- Wake lock API integration for reliable alarms
- Default Crystal Bells sound effect

### Mobile Optimization
- Touch-friendly interface
- Responsive design for all screen sizes
- Wake lock support for reliable background operation
- Optimized audio playback for mobile devices

### Time Management
- Accurate timezone handling with dayjs
- Precise stopwatch implementation
- Multiple concurrent timer support
- Flexible alarm scheduling

## Usage

1. Import the components and utilities
2. Set up the required dependencies
3. Initialize the audio context on user interaction
4. Implement the wake lock functionality for reliable alarms

## Important Notes

- Always initialize audio on user interaction for mobile devices
- Implement wake lock for reliable alarm functionality
- Use the provided sound effects system for consistent audio behavior
- Follow the mobile-first design principles in the components

The application is designed to work seamlessly across different devices while maintaining optimal performance and reliability.
