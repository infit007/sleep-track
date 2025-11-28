import { supabase } from "@/lib/supabaseClient";
import type { DailySleep } from "./sleepService";

export interface Goal {
  id: string;
  user_id: string;
  target_hours: number;
  created_at: string;
}

export interface GoalProgress {
  targetHours: number;
  averageSleep: number;
  progress: number;
  weeklyTotal: number;
  goalTotal: number;
}

export const setGoal = async (targetHours: number, userId: string) => {
  const { data: existingGoal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingGoal) {
    const { data, error } = await supabase
      .from("goals")
      .update({ target_hours: targetHours })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("goals")
      .insert({ user_id: userId, target_hours: targetHours })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const getGoal = async (userId: string) => {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Goal | null;
};

export const getGoalProgress = async (userId: string, weeklySleep: DailySleep[]): Promise<GoalProgress | null> => {
  const goal = await getGoal(userId);
  if (!goal) return null;

  const totalSleep = weeklySleep.reduce((sum, day) => sum + day.hours, 0);
  const avgSleep = weeklySleep.length > 0 ? totalSleep / weeklySleep.length : 0;
  const progressPercent = goal.target_hours > 0 ? (avgSleep / goal.target_hours) * 100 : 0;
  const goalTotal = goal.target_hours * weeklySleep.length;

  return {
    targetHours: goal.target_hours,
    averageSleep: Number(avgSleep.toFixed(2)),
    progress: Number(Math.min(progressPercent, 200).toFixed(1)),
    weeklyTotal: Number(totalSleep.toFixed(2)),
    goalTotal: Number(goalTotal.toFixed(2)),
  };
};
