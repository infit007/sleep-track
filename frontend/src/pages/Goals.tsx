import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import GoalCard from "@/components/GoalCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Target } from "lucide-react";
import { setGoal, getGoal, getGoalProgress, type Goal, type GoalProgress } from "@/services/goalService";
import { getWeeklySleep, type DailySleep } from "@/services/sleepService";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const Goals = () => {
  const { session, loading: authLoading } = useProtectedRoute();
  const [targetHours, setTargetHours] = useState("");
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [goalProgress, setGoalProgressState] = useState<GoalProgress | null>(null);
  const [weeklySleep, setWeeklySleep] = useState<DailySleep[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && session?.user) {
      loadGoalData(session.user.id);
    }
  }, [authLoading, session]);

  const loadGoalData = async (userId: string) => {
    setLoadingData(true);
    try {
      const [goal, weekly] = await Promise.all([getGoal(userId), getWeeklySleep(userId)]);
      setCurrentGoal(goal);
      if (goal) {
        setTargetHours(goal.target_hours.toString());
      }
      setWeeklySleep(weekly);
      const progress = await getGoalProgress(userId, weekly);
      setGoalProgressState(progress);
    } catch (error) {
      console.error("Error loading goal data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.user?.id) return;

    const hours = parseFloat(targetHours);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      toast({
        title: "Invalid target",
        description: "Please enter a number between 1 and 24 hours.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await setGoal(hours, session.user.id);
      toast({
        title: "Goal updated",
        description: "Your target sleep hours are saved.",
      });
      await loadGoalData(session.user.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Error saving goal",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const currentTarget = useMemo(() => {
    const parsed = parseFloat(targetHours);
    return isNaN(parsed) ? 0 : parsed;
  }, [targetHours]);

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Navbar user={session.user} />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary/70">Goals</p>
          <h1 className="text-3xl font-bold">Dial in your rest routine</h1>
          <p className="text-muted-foreground">
            Set a daily target, then measure how the last 7 nights stack up.
          </p>
        </div>

        {loadingData ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <>
            {goalProgress && (
              <GoalCard
                targetHours={goalProgress.targetHours}
                averageSleep={goalProgress.averageSleep}
                progress={goalProgress.progress}
                weeklyTotal={goalProgress.weeklyTotal}
                goalTotal={goalProgress.goalTotal}
              />
            )}

            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {currentGoal ? "Update your goal" : "Set a sleep goal"}
                </CardTitle>
                <CardDescription>Keep your target between 7-9 hours for optimal rest.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="targetHours">Daily target (hours)</Label>
                    <Input
                      id="targetHours"
                      type="number"
                      min="1"
                      max="24"
                      step="0.5"
                      value={targetHours}
                      onChange={(event) => setTargetHours(event.target.value)}
                      placeholder="e.g. 8"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This goal is used throughout SleepTrack to measure your progress.
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? "Saving..." : currentGoal ? "Update goal" : "Create goal"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Last 7 nights</CardTitle>
                <CardDescription>
                  Compare your actual sleep with the target hours you set.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklySleep.map((day) => {
                  const percent = currentTarget > 0 ? Math.min((day.hours / currentTarget) * 100, 200) : 0;
                  return (
                    <div key={day.dateISO} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{day.label}</span>
                        <span>
                          {day.hours}h / {currentTarget || goalProgress?.targetHours || 0}h
                        </span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Goals;
