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
          <TabsList className="grid w-full grid-cols-4 h-20">
            <TabsTrigger value="world" className="flex flex-col items-center justify-center space-y-1">
              <Clock className="h-6 w-6" />
              <span className="text-sm">World</span>
            </TabsTrigger>
            <TabsTrigger value="alarm" className="flex flex-col items-center justify-center space-y-1">
              <AlarmClock className="h-6 w-6" />
              <span className="text-sm">Alarm</span>
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex flex-col items-center justify-center space-y-1">
              <StopwatchIcon className="h-6 w-6" />
              <span className="text-sm">Stopwatch</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex flex-col items-center justify-center space-y-1">
              <TimerIcon className="h-6 w-6" />
              <span className="text-sm">Timer</span>
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