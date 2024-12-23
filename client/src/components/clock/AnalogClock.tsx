import { useEffect, useState } from "react";

interface AnalogClockProps {
  time: Date;
  size?: number;
}

export function AnalogClock({ time, size = 200 }: AnalogClockProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setHours(time.getHours() * 30 + time.getMinutes() * 0.5);
    setMinutes(time.getMinutes() * 6);
    setSeconds(time.getSeconds() * 6);
  }, [time]);

  const center = size / 2;
  const strokeWidth = size / 100;

  return (
    <svg width={size} height={size} className="rounded-full bg-card">
      {/* Clock face */}
      {[...Array(12)].map((_, i) => {
        const angle = ((i + 1) * 30 * Math.PI) / 180;
        const x1 = center + (center - 20) * Math.sin(angle);
        const y1 = center - (center - 20) * Math.cos(angle);
        return (
          <circle
            key={i}
            cx={x1}
            cy={y1}
            r={size / 50}
            className="fill-primary"
          />
        );
      })}

      {/* Hour hand */}
      <line
        x1={center}
        y1={center}
        x2={center + (size * 0.3) * Math.sin((hours * Math.PI) / 180)}
        y2={center - (size * 0.3) * Math.cos((hours * Math.PI) / 180)}
        stroke="currentColor"
        strokeWidth={strokeWidth * 3}
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={center}
        y1={center}
        x2={center + (size * 0.4) * Math.sin((minutes * Math.PI) / 180)}
        y2={center - (size * 0.4) * Math.cos((minutes * Math.PI) / 180)}
        stroke="currentColor"
        strokeWidth={strokeWidth * 2}
        strokeLinecap="round"
      />

      {/* Second hand */}
      <line
        x1={center}
        y1={center}
        x2={center + (size * 0.45) * Math.sin((seconds * Math.PI) / 180)}
        y2={center - (size * 0.45) * Math.cos((seconds * Math.PI) / 180)}
        stroke="hsl(var(--primary))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle
        cx={center}
        cy={center}
        r={size / 40}
        className="fill-primary"
      />
    </svg>
  );
}
