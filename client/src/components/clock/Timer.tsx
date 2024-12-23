import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import { playAlarm } from "@/lib/audio";

const MAX_TIME = 3600; // 1 hour in seconds

export function Timer() {
  const [targetTime, setTargetTime] = useState(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(targetTime);
  const [isRunning, setIsRunning] = useState(false);
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

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(targetTime);
    clearInterval(intervalRef.current);
  };

  const handleSliderChange = (value: number[]) => {
    const newTime = value[0];
    setTargetTime(newTime);
    if (!isRunning) {
      setTimeLeft(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours ? hours + ":" : ""}${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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

          <div className="space-y-6">
            <Slider
              min={60}
              max={MAX_TIME}
              step={60}
              value={[targetTime]}
              onValueChange={handleSliderChange}
              disabled={isRunning}
            />

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                disabled={timeLeft === targetTime}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={toggleTimer}>
                {isRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
