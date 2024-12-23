import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

export function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    clearInterval(intervalRef.current);
  };

  const addLap = () => {
    setLaps([...laps, time]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-6xl font-mono mb-6">{formatTime(time)}</div>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={reset}
                disabled={time === 0}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={toggleRunning}>
                {isRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={addLap}
                disabled={!isRunning}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {laps.map((lapTime, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex justify-between items-center">
                <span>Lap {laps.length - index}</span>
                <span className="font-mono">{formatTime(lapTime)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
