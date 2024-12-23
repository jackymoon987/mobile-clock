import { useState, useEffect, KeyboardEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, Check, Bell, CheckSquare, Square } from "lucide-react";
import { playAlarm } from "@/lib/audio";
import dayjs from "dayjs";

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  snoozeDuration: number;
  isSnoozing: boolean;
  snoozeEndTime?: string;
}

export function Alarm() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem("alarms");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTime, setNewTime] = useState(() => {
    return dayjs().format("HH:mm");
  });
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);
  const [selectedAlarms, setSelectedAlarms] = useState<Set<string>>(new Set());
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);

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

      alarms.forEach((alarm) => {
        if (
          alarm.enabled &&
          !alarm.isSnoozing &&
          alarm.time === currentTime
        ) {
          playAlarm();
          setActiveAlarmId(alarm.id);
        } else if (
          alarm.isSnoozing &&
          alarm.snoozeEndTime === currentTime
        ) {
          playAlarm();
          setActiveAlarmId(alarm.id);
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
    const newAlarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time: newTime,
      label: newLabel,
      enabled: true,
      snoozeDuration: 9,
      isSnoozing: false
    };
    setAlarms(prev => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
    setNewLabel("");
    setNewTime(dayjs().format("HH:mm"));
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
    setSelectedAlarms(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const deleteSelectedAlarms = () => {
    setAlarms(alarms.filter((alarm) => !selectedAlarms.has(alarm.id)));
    setSelectedAlarms(new Set());
  };

  const toggleSelectAlarm = (id: string) => {
    setSelectedAlarms(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const startEditing = (alarm: Alarm) => {
    setEditingId(alarm.id);
    setEditTime(alarm.time);
    setEditLabel(alarm.label);
  };

  const saveEdit = (id: string) => {
    setAlarms(prev =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, time: editTime, label: editLabel } : alarm
      ).sort((a, b) => a.time.localeCompare(b.time))
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
    setAlarms(alarms.map(alarm =>
      alarm.id === id
        ? {
            ...alarm,
            enabled: false,
            isSnoozing: false,
            snoozeEndTime: undefined
          }
        : alarm
    ));
    setActiveAlarmId(null);
  };

  const updateSnoozeDuration = (id: string, duration: number) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, snoozeDuration: duration } : alarm
      )
    );
  };

  const formatDisplayTime = (time: string) => {
    return dayjs(`2000-01-01 ${time}`).format("h:mm A");
  };

  const filteredAlarms = showOnlyEnabled
    ? alarms.filter(alarm => alarm.enabled)
    : alarms;

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addAlarm();
    }
  };

  return (
    <div className="space-y-4">
      {activeAlarmId && (
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Bell className="h-8 w-8 animate-bounce" />
              <div className="text-2xl font-semibold">
                {alarms.find(a => a.id === activeAlarmId)?.label || "Alarm!"}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => snoozeAlarm(activeAlarmId)}
                  className="px-8 py-6 text-lg"
                >
                  Snooze
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => dismissAlarm(activeAlarmId)}
                  className="px-8 py-6 text-lg"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={addAlarm}
              className="text-lg h-12"
            />
            <Button onClick={addAlarm} className="h-12 w-12">
              <Plus className="h-6 w-6" />
            </Button>
          </div>
          <Input
            placeholder="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="text-lg h-12"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={showOnlyEnabled}
              onCheckedChange={setShowOnlyEnabled}
              className="scale-125"
            />
            <span className="text-sm">Show enabled only</span>
          </div>
          {selectedAlarms.size > 0 && (
            <Button
              variant="destructive"
              onClick={deleteSelectedAlarms}
              className="ml-auto"
            >
              Delete Selected ({selectedAlarms.size})
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4">
          {filteredAlarms.map((alarm) => (
            <Card key={alarm.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSelectAlarm(alarm.id)}
                      className="h-10 w-10"
                    >
                      {selectedAlarms.has(alarm.id) ? (
                        <CheckSquare className="h-6 w-6" />
                      ) : (
                        <Square className="h-6 w-6" />
                      )}
                    </Button>
                    <div className="space-y-2">
                      {editingId === alarm.id ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                              className="w-32 text-lg h-12"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => saveEdit(alarm.id)}
                              className="h-12 w-12"
                            >
                              <Check className="h-6 w-6" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Label"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="text-lg h-12"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-2xl font-mono">
                            {formatDisplayTime(alarm.time)}
                            {alarm.isSnoozing && (
                              <span className="text-sm ml-2 text-muted-foreground">
                                Snoozing until {formatDisplayTime(alarm.snoozeEndTime!)}
                              </span>
                            )}
                          </div>
                          {alarm.label && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {alarm.label}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">
                          Snooze duration:
                        </span>
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          value={alarm.snoozeDuration}
                          onChange={(e) => updateSnoozeDuration(alarm.id, parseInt(e.target.value))}
                          className="w-20 h-10 text-lg"
                        />
                        <span className="text-sm text-muted-foreground">minutes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={alarm.enabled}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
                      className="scale-125"
                    />
                    {editingId !== alarm.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(alarm)}
                        className="h-10 w-10"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlarm(alarm.id)}
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-5 w-5" />
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