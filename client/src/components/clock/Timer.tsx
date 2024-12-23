import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";
import { playAlarm } from "@/lib/audio";

const MAX_TIME = 3600; // 1 hour in seconds

export function Timer() {
  const [targetTime, setTargetTime] = useState(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(targetTime);
  const [isRunning, setIsRunning] = useState(false);
  const [label, setLabel] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            playAlarm();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTargetTime(totalSeconds);
    setTimeLeft(totalSeconds);
    setIsRunning(true);
  };

  const cancelTimer = () => {
    setIsRunning(false);
    setTimeLeft(targetTime);
    clearInterval(intervalRef.current);
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h ? h + ":" : ""}${formatNumber(m)}:${formatNumber(s)}`;
  };

  const renderWheel = (value: number, setValue: (n: number) => void, max: number) => (
    <div className="relative h-40 overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-2xl font-light">
        {Array.from({ length: max + 1 }).map((_, i) => (
          <div
            key={i}
            className={`h-12 flex items-center transition-transform ${
              i === value ? "text-primary scale-110" : "text-muted-foreground"
            }`}
            onClick={() => setValue(i)}
          >
            {formatNumber(i)}
          </div>
        ))}
      </div>
    </div>
  );

  if (isRunning) {
    const progress = (timeLeft / targetTime) * 100;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-8">
            <div
              className="w-48 h-48 mx-auto rounded-full border-8 border-muted flex items-center justify-center relative"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${progress}%, transparent ${progress}%)`,
              }}
            >
              <div className="text-4xl font-mono">{formatTime(timeLeft)}</div>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="w-32 h-16 rounded-full"
                onClick={cancelTimer}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-around text-4xl font-light">
        <div className="w-1/3">
          {renderWheel(hours, setHours, 23)}
          <div className="text-center text-sm text-muted-foreground">hours</div>
        </div>
        <div className="w-1/3">
          {renderWheel(minutes, setMinutes, 59)}
          <div className="text-center text-sm text-muted-foreground">min</div>
        </div>
        <div className="w-1/3">
          {renderWheel(seconds, setSeconds, 59)}
          <div className="text-center text-sm text-muted-foreground">sec</div>
        </div>
      </div>

      <div className="space-y-2">
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-transparent border-none text-lg placeholder:text-muted-foreground"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">When Timer Ends</span>
              <span className="text-lg text-primary">Radar</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          className="w-32 h-16 rounded-full bg-[#30D158] hover:bg-[#30D158]/90"
          onClick={startTimer}
        >
          Start
        </Button>
      </div>
    </div>
  );
}