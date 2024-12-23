import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorldClock } from "@/components/clock/WorldClock";
import { Stopwatch } from "@/components/clock/Stopwatch";
import { Timer } from "@/components/clock/Timer";
import { Alarm } from "@/components/clock/Alarm";
import { Clock, Timer as TimerIcon, AlarmClock, Timer as StopwatchIcon } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Tabs defaultValue="world" className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-4">
            <TabsTrigger value="world" className="flex flex-col items-center gap-2 py-4">
              <Clock className="h-6 w-6" />
              <span>World</span>
            </TabsTrigger>
            <TabsTrigger value="alarm" className="flex flex-col items-center gap-2 py-4">
              <AlarmClock className="h-6 w-6" />
              <span>Alarm</span>
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex flex-col items-center gap-2 py-4">
              <StopwatchIcon className="h-6 w-6" />
              <span>Stopwatch</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex flex-col items-center gap-2 py-4">
              <TimerIcon className="h-6 w-6" />
              <span>Timer</span>
            </TabsTrigger>
          </TabsList>
          <div className="mt-8">
            <TabsContent value="world">
              <WorldClock />
            </TabsContent>
            <TabsContent value="alarm">
              <Alarm />
            </TabsContent>
            <TabsContent value="stopwatch">
              <Stopwatch />
            </TabsContent>
            <TabsContent value="timer">
              <Timer />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default App;