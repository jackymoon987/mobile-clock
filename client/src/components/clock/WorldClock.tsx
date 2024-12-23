import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalogClock } from "./AnalogClock";
import { Plus, X } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONES = ["America/New_York", "Europe/London", "Asia/Tokyo"];

export function WorldClock() {
  const [timezones, setTimezones] = useState<string[]>(() => {
    const saved = localStorage.getItem("timezones");
    return saved ? JSON.parse(saved) : DEFAULT_TIMEZONES;
  });
  const [newTimezone, setNewTimezone] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("timezones", JSON.stringify(timezones));
  }, [timezones]);

  const addTimezone = () => {
    if (newTimezone && !timezones.includes(newTimezone)) {
      setTimezones([...timezones, newTimezone]);
      setNewTimezone("");
    }
  };

  const removeTimezone = (tz: string) => {
    setTimezones(timezones.filter((t) => t !== tz));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add timezone (e.g. Europe/Paris)"
          value={newTimezone}
          onChange={(e) => setNewTimezone(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTimezone()}
        />
        <Button onClick={addTimezone}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4 md:grid-cols-2">
          {timezones.map((tz) => (
            <Card key={tz}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{tz.replace("_", " ")}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimezone(tz)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <AnalogClock
                    time={dayjs().tz(tz).toDate()}
                    size={120}
                  />
                  <div className="text-2xl font-mono">
                    {dayjs().tz(tz).format("HH:mm:ss")}
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
