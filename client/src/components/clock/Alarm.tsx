import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, Check, Bell } from "lucide-react";
import { playAlarm } from "@/lib/audio";
import dayjs from "dayjs";

interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  days: number[];
  snoozeDuration: number; // in minutes
  isSnoozing: boolean;
  snoozeEndTime?: string;
}

export function Alarm() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem("alarms");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTime, setNewTime] = useState(() => {
    return dayjs().format("HH:mm"); // Keep 24h format for input
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("");
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);

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
          !alarm.isSnoozing &&
          alarm.time === currentTime &&
          alarm.days.includes(currentDay)
        ) {
          playAlarm();
          setActiveAlarmId(alarm.id);
        } else if (
          alarm.isSnoozing &&
          alarm.snoozeEndTime === currentTime
        ) {
          playAlarm();
          setActiveAlarmId(alarm.id);
          // Reset snoozing state
          setAlarms(alarms.map(a => 
            a.id === alarm.id 
              ? { ...a, isSnoozing: false, snoozeEndTime: undefined }
              : a
          ));
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

  const addAlarm = () => {
    const currentDay = new Date().getDay();
    const newAlarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time: newTime,
      enabled: true,
      days: [currentDay],
      snoozeDuration: 9, // Default 9 minutes like iOS
      isSnoozing: false
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

  const startEditing = (alarm: Alarm) => {
    setEditingId(alarm.id);
    setEditTime(alarm.time);
  };

  const saveEdit = (id: string) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, time: editTime } : alarm
      )
    );
    setEditingId(null);
  };

  const snoozeAlarm = (id: string) => {
    const alarm = alarms.find(a => a.id === id);
    if (!alarm) return;

    const now = dayjs();
    const snoozeEnd = now.add(alarm.snoozeDuration, 'minute');

    setAlarms(alarms.map(a => 
      a.id === id 
        ? {
            ...a,
            isSnoozing: true,
            snoozeEndTime: snoozeEnd.format('HH:mm')
          }
        : a
    ));
    setActiveAlarmId(null);
  };

  const dismissAlarm = (id: string) => {
    setActiveAlarmId(null);
  };

  const updateSnoozeDuration = (id: string, duration: number) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, snoozeDuration: duration } : alarm
      )
    );
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

  const formatDisplayTime = (time: string) => {
    return dayjs(`2000-01-01 ${time}`).format("h:mm A");
  };

  return (
    <div className="space-y-4">
      {activeAlarmId && (
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Bell className="h-8 w-8 animate-bounce" />
              <div className="text-2xl font-semibold">Alarm!</div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => snoozeAlarm(activeAlarmId)}
                >
                  Snooze
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => dismissAlarm(activeAlarmId)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                    {editingId === alarm.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="w-32"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => saveEdit(alarm.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-2xl font-mono">
                        {formatDisplayTime(alarm.time)}
                        {alarm.isSnoozing && (
                          <span className="text-sm ml-2 text-muted-foreground">
                            Snoozing until {formatDisplayTime(alarm.snoozeEndTime!)}
                          </span>
                        )}
                      </div>
                    )}
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Snooze duration:
                      </span>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={alarm.snoozeDuration}
                        onChange={(e) => updateSnoozeDuration(alarm.id, parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">minutes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={alarm.enabled}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
                    />
                    {editingId !== alarm.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(alarm)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
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