import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SleepCard from "@/components/SleepCard";
import GoalCard from "@/components/GoalCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getGoalProgress, type GoalProgress } from "@/services/goalService";
import {
  getSleepLogs,
  getTodaySleepSummary,
  getWeeklySleep,
  type DailySleep,
  type SleepLog,
  type SleepSummary,
} from "@/services/sleepService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  Clock,
  CalendarDays,
  PlusCircle,
  Target,
  NotebookPen,
} from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { session, loading: authLoading } = useProtectedRoute();
  const [loading, setLoading] = useState(true);
  const [todaySummary, setTodaySummary] = useState<SleepSummary | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailySleep[]>([]);
  const [recentLogs, setRecentLogs] = useState<SleepLog[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [chartData, setChartData] = useState<{ name: string; hours: number }[]>([]);
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  useEffect(() => {
    if (!authLoading && session?.user) {
      loadDashboardData(session.user.id);
    }
  }, [authLoading, session]);

  const loadDashboardData = async (userId: string) => {
    setLoading(true);
    try {
      const [summary, weekly, history] = await Promise.all([
        getTodaySleepSummary(userId),
        getWeeklySleep(userId),
        getSleepLogs(userId, 5),
      ]);

      setTodaySummary(summary);
      setWeeklyData(weekly);
      setRecentLogs(history);
      setChartData(weekly.map((day) => ({ name: day.label, hours: day.hours })));

      const totalWeeklyHours = weekly.reduce((sum, day) => sum + day.hours, 0);
      setWeeklyAverage(
        weekly.length ? Number((totalWeeklyHours / weekly.length).toFixed(2)) : 0,
      );

      const progress = await getGoalProgress(userId, weekly);
      setGoalProgress(progress);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeNights = useMemo(
    () => weeklyData.filter((day) => day.hours > 0).length,
    [weeklyData],
  );

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
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary/70">Dashboard</p>
            <h1 className="text-3xl font-bold">Rest well, perform better</h1>
            <p className="text-muted-foreground">
              Here's a quick summary of your most recent sleep insights.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/log-sleep">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Log sleep
              </Button>
            </Link>
            <Link to="/goals">
              <Button variant="outline" className="gap-2">
                <Target className="h-4 w-4" />
                Update goal
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="backdrop-blur bg-card/60 border-border/50">
                <CardContent className="flex items-center justify-between py-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Sleep today</p>
                    <p className="text-3xl font-bold">
                      {todaySummary?.totalHours ?? 0}
                      <span className="text-base font-medium text-muted-foreground ml-1">
                        hrs
                      </span>
                    </p>
                  </div>
                  <Clock className="h-10 w-10 text-primary" />
                </CardContent>
              </Card>
              <Card className="backdrop-blur bg-card/60 border-border/50">
                <CardContent className="flex items-center justify-between py-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly average</p>
                    <p className="text-3xl font-bold">
                      {weeklyAverage}
                      <span className="text-base font-medium text-muted-foreground ml-1">
                        hrs
                      </span>
                    </p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-secondary" />
                </CardContent>
              </Card>
              <Card className="backdrop-blur bg-card/60 border-border/50">
                <CardContent className="flex items-center justify-between py-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Logged nights</p>
                    <p className="text-3xl font-bold">{activeNights}/7</p>
                  </div>
                  <CalendarDays className="h-10 w-10 text-accent" />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SleepCard summary={todaySummary} />
              {goalProgress && (
                <GoalCard
                  targetHours={goalProgress.targetHours}
                  averageSleep={goalProgress.averageSleep}
                  progress={goalProgress.progress}
                  weeklyTotal={goalProgress.weeklyTotal}
                  goalTotal={goalProgress.goalTotal}
                />
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Weekly Sleep Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <NotebookPen className="h-5 w-5 text-primary" />
                    Recent Sleep Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Start logging your sleep to see insights here.
                    </p>
                  ) : (
                    recentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {format(new Date(log.sleep_time), "EEE, MMM d")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.sleep_time), "h:mm a")} -{" "}
                            {format(new Date(log.wake_time), "h:mm a")}
                          </p>
                        </div>
                        <span className="text-lg font-semibold text-primary">{log.duration}h</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
