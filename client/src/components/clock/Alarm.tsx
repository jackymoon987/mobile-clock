import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2, Edit2, Check, Bell } from "lucide-react";
import { playAlarm } from "@/lib/audio";
import { soundEffects } from "@/lib/soundEffects";
import { type Alarm } from "@/lib/types";
import dayjs from "dayjs";


export function Alarm() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem("alarms");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTime, setNewTime] = useState(() => {
    return dayjs().format("HH:mm");
  });
  const [newLabel, setNewLabel] = useState("");
  const [newSoundEffect, setNewSoundEffect] = useState("Crystal Bells");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editSoundEffect, setEditSoundEffect] = useState("");
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

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
          playAlarm(alarm.soundEffect);
          setActiveAlarmId(alarm.id);
        } else if (
          alarm.isSnoozing &&
          alarm.snoozeEndTime === currentTime
        ) {
          playAlarm(alarm.soundEffect);
          setActiveAlarmId(alarm.id);
          setAlarms(alarms.map((a) =>
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
      soundEffect: newSoundEffect,
      snoozeDuration: 9,
      isSnoozing: false,
    };
    setAlarms((prev) =>
      [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time))
    );
    setNewLabel("");
    setNewTime(dayjs().format("HH:mm"));
    setNewSoundEffect("Radial");
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
    setEditLabel(alarm.label);
    setEditSoundEffect(alarm.soundEffect);
  };

  const saveEdit = (id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id
          ? {
              ...alarm,
              time: editTime,
              label: editLabel,
              soundEffect: editSoundEffect,
            }
          : alarm
      ).sort((a, b) => a.time.localeCompare(b.time))
    );
    setEditingId(null);
  };

  const snoozeAlarm = (id: string) => {
    const alarm = alarms.find((a) => a.id === id);
    if (!alarm) return;

    const now = dayjs();
    const snoozeEnd = now.add(alarm.snoozeDuration, "minute");

    setAlarms(alarms.map((a) =>
      a.id === id
        ? {
            ...a,
            isSnoozing: true,
            snoozeEndTime: snoozeEnd.format("HH:mm"),
          }
        : a
    ));
    setActiveAlarmId(null);
  };

  const dismissAlarm = (id: string) => {
    setAlarms(alarms.map((alarm) =>
      alarm.id === id
        ? {
            ...alarm,
            enabled: false,
            isSnoozing: false,
            snoozeEndTime: undefined,
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
    ? alarms.filter((alarm) => alarm.enabled)
    : alarms;

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addAlarm();
    }
  };

  const deleteDisabledAlarms = () => {
    setAlarms(alarms.filter((alarm) => alarm.enabled));
  };

  const deleteAllAlarms = () => {
    setAlarms([]);
  };

  const previewSound = (soundName: string) => {
    playAlarm(soundName);
  };

  // Handle mobile touch interactions
  const handleTouchPreview = async (event: React.TouchEvent, soundName: string) => {
    event.preventDefault(); // Prevent default touch behavior
    await playAlarm(soundName);
  };

  return (
    <div className="space-y-4">
      {activeAlarmId && (
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center gap-4">
              <Bell className="h-8 w-8 animate-bounce" />
              <div className="text-xl sm:text-2xl font-semibold text-center">
                {alarms.find((a) => a.id === activeAlarmId)?.label || "Alarm!"}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => snoozeAlarm(activeAlarmId)}
                  className="px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg"
                >
                  Snooze
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => dismissAlarm(activeAlarmId)}
                  className="px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Switch
              checked={showOnlyEnabled}
              onCheckedChange={setShowOnlyEnabled}
              className="scale-125"
            />
            <span className="text-sm">Show enabled only</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-full sm:w-auto">
                Clean up
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={deleteDisabledAlarms}>
                Delete all disabled alarms
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteAllAlarms}>
                Delete all alarms
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full text-primary-foreground sm:static"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-[1px] bg-border">
          {filteredAlarms.map((alarm) => (
            <div key={alarm.id} className="bg-background p-4">
              <div className="flex items-center justify-between">
                <div
                  onClick={() => !editingId && startEditing(alarm)}
                  className="cursor-pointer flex-1"
                >
                  {editingId === alarm.id ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="text-2xl sm:text-4xl h-12"
                      />
                      <Input
                        placeholder="Label"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="text-base sm:text-lg"
                      />
                      <div className="flex gap-2">
                        <Select
                          value={editSoundEffect}
                          onValueChange={setEditSoundEffect}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {soundEffects.map((effect) => (
                              <SelectItem
                                key={effect.name}
                                value={effect.name}
                              >
                                {effect.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => previewSound(editSoundEffect)}
                          onTouchStart={(e) => handleTouchPreview(e, editSoundEffect)}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => saveEdit(alarm.id)}
                      >
                        <Check className="h-6 w-6" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl sm:text-4xl font-light">
                        {formatDisplayTime(alarm.time)}
                      </div>
                      <div className="text-sm sm:text-base text-muted-foreground">
                        {alarm.label}
                        {alarm.isSnoozing && (
                          <span className="ml-2">
                            Snoozing until{" "}
                            {formatDisplayTime(alarm.snoozeEndTime!)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={alarm.enabled}
                    onCheckedChange={() => toggleAlarm(alarm.id)}
                    className="scale-125"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(alarm)}
                    className="h-10 w-10"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
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
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Alarm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="text-lg h-12"
            />
            <Input
              placeholder="Label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="text-lg h-12"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Sound</label>
              <div className="flex gap-2">
                <Select
                  value={newSoundEffect}
                  onValueChange={setNewSoundEffect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {soundEffects.map((effect) => (
                      <SelectItem key={effect.name} value={effect.name}>
                        {effect.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => previewSound(newSoundEffect)}
                  onTouchStart={(e) => handleTouchPreview(e, newSoundEffect)}
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  addAlarm();
                  setShowAddDialog(false);
                }}
              >
                Add Alarm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}