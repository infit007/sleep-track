import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
  targetHours: number;
  averageSleep: number;
  progress: number;
  weeklyTotal?: number;
  goalTotal?: number;
}

const GoalCard = ({ targetHours, averageSleep, progress, weeklyTotal, goalTotal }: GoalCardProps) => {
  const remainingPerNight = Math.max(targetHours - averageSleep, 0);

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Sleep Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Average per night</span>
            <span className="font-medium">
              {averageSleep}h / {targetHours}h
            </span>
          </div>
          {weeklyTotal !== undefined && goalTotal !== undefined && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last 7 days</span>
              <span>
                {weeklyTotal}h / {goalTotal}h
              </span>
            </div>
          )}
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">{progress}% of goal</p>
        </div>
        {progress >= 100 ? (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span>Great job! You're meeting your target.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>You're {remainingPerNight.toFixed(1)}h short per night</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
