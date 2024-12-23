import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react";
import { playAlarm } from "@/lib/audio";

const MAX_TIME = 3600; // 1 hour in seconds

interface Timer {
  id: string;
  label: string;
  targetTime: number;
  timeLeft: number;
  isRunning: boolean;
}

export function Timer() {
  const [timers, setTimers] = useState<Timer[]>(() => {
    const saved = localStorage.getItem("timers");
    return saved ? JSON.parse(saved) : [];
  });
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState(300); // 5 minutes default
  const intervalRefs = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    timers.forEach((timer) => {
      if (timer.isRunning && timer.timeLeft > 0) {
        intervalRefs.current[timer.id] = window.setInterval(() => {
          setTimers((prev) =>
            prev.map((t) => {
              if (t.id !== timer.id) return t;
              const newTimeLeft = t.timeLeft - 1;
              if (newTimeLeft <= 0) {
                clearInterval(intervalRefs.current[t.id]);
                playAlarm("Crystal Bells"); // Always use Crystal Bells
                return { ...t, timeLeft: 0, isRunning: false };
              }
              return { ...t, timeLeft: newTimeLeft };
            })
          );
        }, 1000);
      }
    });

    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, [timers]);

  const addTimer = () => {
    const newTimer: Timer = {
      id: Math.random().toString(36).substr(2, 9),
      label: newLabel || "Timer",
      targetTime: newTime,
      timeLeft: newTime,
      isRunning: false,
    };
    setTimers((prev) => [...prev, newTimer]);
    setNewLabel("");
    setNewTime(300);
  };

  const toggleTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
      )
    );
  };

  const resetTimer = (id: string) => {
    clearInterval(intervalRefs.current[id]);
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? { ...timer, isRunning: false, timeLeft: timer.targetTime }
          : timer
      )
    );
  };

  const deleteTimer = (id: string) => {
    clearInterval(intervalRefs.current[id]);
    setTimers((prev) => prev.filter((timer) => timer.id !== id));
  };

  const handleSliderChange = (value: number[]) => {
    const newTime = value[0];
    setNewTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours ? hours + ":" : ""}${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <Input
              placeholder="Timer label (optional)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="text-base sm:text-lg h-12"
            />
            <div className="space-y-2">
              <div className="text-xl sm:text-2xl font-mono text-center">
                {formatTime(newTime)}
              </div>
              <Slider
                min={60}
                max={MAX_TIME}
                step={60}
                value={[newTime]}
                onValueChange={handleSliderChange}
                className="touch-none"
              />
            </div>
            <Button onClick={addTimer} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Timer
            </Button>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4">
          {timers.map((timer) => (
            <Card key={timer.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-base sm:text-lg font-semibold">
                      {timer.label}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTimer(timer.id)}
                      className="touch-manipulation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border-8 border-muted flex items-center justify-center relative"
                    style={{
                      background: `conic-gradient(hsl(var(--primary)) ${
                        (timer.timeLeft / timer.targetTime) * 100
                      }%, transparent ${(timer.timeLeft / timer.targetTime) * 100}%)`,
                    }}
                  >
                    <div className="text-xl sm:text-2xl font-mono">
                      {formatTime(timer.timeLeft)}
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => resetTimer(timer.id)}
                      disabled={timer.timeLeft === timer.targetTime}
                      className="touch-manipulation"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => toggleTimer(timer.id)}
                      className="touch-manipulation"
                    >
                      {timer.isRunning ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}