import { FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Clock } from "lucide-react";

interface SleepFormProps {
  sleepTime: string;
  wakeTime: string;
  duration: number | null;
  onSleepTimeChange: (value: string) => void;
  onWakeTimeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

const SleepForm = ({
  sleepTime,
  wakeTime,
  duration,
  onSleepTimeChange,
  onWakeTimeChange,
  onSubmit,
  loading,
}: SleepFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="sleepTime" className="flex items-center gap-2 text-sm sm:text-base">
          <Moon className="h-4 w-4 text-primary" />
          Sleep Time
        </Label>
        <input
          id="sleepTime"
          type="datetime-local"
          value={sleepTime}
          onChange={(event) => onSleepTimeChange(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 sm:py-2 text-sm sm:text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wakeTime" className="flex items-center gap-2 text-sm sm:text-base">
          <Sun className="h-4 w-4 text-secondary" />
          Wake Time
        </Label>
        <input
          id="wakeTime"
          type="datetime-local"
          value={wakeTime}
          onChange={(event) => onWakeTimeChange(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 sm:py-2 text-sm sm:text-base"
          required
        />
      </div>

      {duration !== null && (
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="font-medium text-sm sm:text-base">Duration</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-primary">{duration}h</span>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full text-sm sm:text-base py-2.5 sm:py-2" disabled={loading}>
        {loading ? "Logging sleep..." : "Log Sleep"}
      </Button>
    </form>
  );
};

export default SleepForm;

