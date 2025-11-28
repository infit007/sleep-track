import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Clock } from "lucide-react";
import type { SleepSummary } from "@/services/sleepService";
import { format } from "date-fns";

interface SleepCardProps {
  summary: SleepSummary | null;
}

const SleepCard = ({ summary }: SleepCardProps) => {
  const latestLog = summary?.latestLog ?? null;
  const totalHours = summary?.totalHours ?? 0;
  const hasData = totalHours > 0 && !!latestLog;

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-border/50">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Today's Sleep
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total sleep today</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {totalHours}
              <span className="text-sm sm:text-base font-medium text-muted-foreground ml-1">hrs</span>
            </p>
          </div>
          <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>

        {hasData && latestLog ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm text-muted-foreground">Went to sleep</span>
              </div>
              <span className="font-medium text-xs sm:text-sm">
                {format(new Date(latestLog.sleep_time), "MMM d, h:mm a")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" />
                <span className="text-xs sm:text-sm text-muted-foreground">Woke up</span>
              </div>
              <span className="font-medium text-xs sm:text-sm">
                {format(new Date(latestLog.wake_time), "MMM d, h:mm a")}
              </span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-xs sm:text-sm">
            No sleep logged yet today. Tap "Log Sleep" to keep your streak going.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SleepCard;
