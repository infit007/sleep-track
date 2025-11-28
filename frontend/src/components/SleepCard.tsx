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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-primary" />
          Today's Sleep
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total sleep today</p>
          <p className="text-2xl font-bold text-primary">
            {totalHours}
              <span className="text-base font-medium text-muted-foreground ml-1">hrs</span>
            </p>
          </div>
          <Clock className="h-10 w-10 text-primary" />
        </div>

        {hasData && latestLog ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Went to sleep</span>
              </div>
              <span className="font-medium">
                {format(new Date(latestLog.sleep_time), "MMM d, h:mm a")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-secondary" />
                <span className="text-sm text-muted-foreground">Woke up</span>
              </div>
              <span className="font-medium">
                {format(new Date(latestLog.wake_time), "MMM d, h:mm a")}
              </span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            No sleep logged yet today. Tap "Log Sleep" to keep your streak going.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SleepCard;
