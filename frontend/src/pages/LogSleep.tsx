import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addSleepLog } from "@/services/sleepService";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import SleepForm from "@/components/SleepForm";
import { Skeleton } from "@/components/ui/skeleton";

const LogSleep = () => {
  const { session, loading: authLoading } = useProtectedRoute();
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const duration = useMemo(() => {
    if (!sleepTime || !wakeTime) return null;
    const sleep = new Date(sleepTime);
    const wake = new Date(wakeTime);
    const diff = (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? Number(diff.toFixed(2)) : null;
  }, [sleepTime, wakeTime]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.user?.id) return;

    if (!sleepTime || !wakeTime || duration === null) {
      toast({
        title: "Invalid entry",
        description: "Please provide valid sleep and wake times.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await addSleepLog(new Date(sleepTime), new Date(wakeTime), session.user.id);
      toast({
        title: "Sleep logged",
        description: "Awesome! Your rest has been saved.",
      });
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Error logging sleep",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-primary/70">Log Sleep</p>
            <h1 className="text-2xl sm:text-3xl font-bold">Capture your latest rest</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter when you went to bed and when you woke up. We will calculate the rest.
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Enter sleep details</CardTitle>
              <CardDescription>Track duration accurately for better insights.</CardDescription>
            </CardHeader>
            <CardContent>
              <SleepForm
                sleepTime={sleepTime}
                wakeTime={wakeTime}
                duration={duration}
                onSleepTimeChange={setSleepTime}
                onWakeTimeChange={setWakeTime}
                onSubmit={handleSubmit}
                loading={saving}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LogSleep;
