import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { playAlarm } from "@/lib/audio";

interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  days: number[];
}

export function Alarm() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem("alarms");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTime, setNewTime] = useState("07:00");

  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const currentDay = now.getDay();

      alarms.forEach((alarm) => {
        if (
          alarm.enabled &&
          alarm.time === currentTime &&
          alarm.days.includes(currentDay)
        ) {
          playAlarm();
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

  const addAlarm = () => {
    const newAlarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time: newTime,
      enabled: true,
      days: [0, 1, 2, 3, 4, 5, 6],
    };
    setAlarms([...alarms, newAlarm]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  const toggleDay = (alarmId: string, day: number) => {
    setAlarms(
      alarms.map((alarm) => {
        if (alarm.id === alarmId) {
          const days = alarm.days.includes(day)
            ? alarm.days.filter((d) => d !== day)
            : [...alarm.days, day];
          return { ...alarm, days };
        }
        return alarm;
      })
    );
  };

  const getDayLabel = (day: number) => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />
        <Button onClick={addAlarm}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4">
          {alarms.map((alarm) => (
            <Card key={alarm.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="text-2xl font-mono">{alarm.time}</div>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <Button
                          key={day}
                          variant={
                            alarm.days.includes(day) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => toggleDay(alarm.id, day)}
                        >
                          {getDayLabel(day)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={alarm.enabled}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlarm(alarm.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
