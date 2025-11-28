import { supabase } from "@/lib/supabaseClient";

export interface SleepLog {
  id: string;
  user_id: string;
  sleep_time: string;
  wake_time: string;
  duration: number;
  created_at: string;
}

export interface SleepSummary {
  totalHours: number;
  latestLog: SleepLog | null;
}

export interface DailySleep {
  dateISO: string;
  label: string;
  hours: number;
}

export const addSleepLog = async (sleepTime: Date, wakeTime: Date, userId: string) => {
  const duration = (wakeTime.getTime() - sleepTime.getTime()) / (1000 * 60 * 60);

  const { data, error } = await supabase
    .from("sleep_logs")
    .insert({
      user_id: userId,
      sleep_time: sleepTime.toISOString(),
      wake_time: wakeTime.toISOString(),
      duration: Number(duration.toFixed(2)),
    })
    .select()
    .single();

  if (error) throw error;
  return data as SleepLog;
};

export const getSleepLogs = async (userId: string, limit = 20) => {
  let query = supabase
    .from("sleep_logs")
    .select("*")
    .eq("user_id", userId)
    .order("sleep_time", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data as SleepLog[]) ?? [];
};

export const getWeeklySleep = async (userId: string): Promise<DailySleep[]> => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("sleep_logs")
    .select("sleep_time,duration")
    .eq("user_id", userId)
    .gte("sleep_time", start.toISOString())
    .order("sleep_time", { ascending: true });

  if (error) throw error;

  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);

    return {
      dateISO: day.toISOString().split("T")[0],
      label: day.toLocaleDateString(undefined, { weekday: "short" }),
      hours: 0,
    };
  });

  (data ?? []).forEach((log) => {
    const dayKey = log.sleep_time.split("T")[0];
    const entry = days.find((day) => day.dateISO === dayKey);
    if (entry) {
      entry.hours = Number((entry.hours + log.duration).toFixed(2));
    }
  });

  return days;
};

export const getTodaySleepSummary = async (userId: string): Promise<SleepSummary> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("sleep_time", today.toISOString())
    .order("sleep_time", { ascending: false });

  if (error) throw error;

  const logs = (data as SleepLog[]) ?? [];
  const totalHours = logs.reduce((sum, log) => sum + log.duration, 0);

  return {
    totalHours: Number(totalHours.toFixed(2)),
    latestLog: logs[0] ?? null,
  };
};
