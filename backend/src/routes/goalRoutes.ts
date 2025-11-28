import { Router } from "express";
import { z } from "zod";
import { authenticateUser } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabaseClient.js";

const router = Router();
router.use(authenticateUser);

const goalSchema = z.object({
  targetHours: z.number().min(1).max(24),
});

router.get("/", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("goals")
    .select("*")
    .eq("user_id", req.user!.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ message: "Failed to fetch goal.", error: error.message });
  }

  return res.json(data);
});

router.post("/", async (req, res) => {
  const parseResult = goalSchema.safeParse({
    targetHours: Number(req.body.targetHours),
  });

  if (!parseResult.success) {
    return res.status(400).json({ message: "Invalid target hours.", issues: parseResult.error.issues });
  }

  const { targetHours } = parseResult.data;

  const { data: existing } = await supabaseAdmin
    .from("goals")
    .select("*")
    .eq("user_id", req.user!.id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("goals")
      .update({ target_hours: targetHours })
      .eq("user_id", req.user!.id)
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ message: "Failed to update goal.", error: error.message });
    }

    return res.json(data);
  }

  const { data, error } = await supabaseAdmin
    .from("goals")
    .insert({ user_id: req.user!.id, target_hours: targetHours })
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ message: "Failed to create goal.", error: error.message });
  }

  return res.status(201).json(data);
});

router.get("/progress", async (req, res) => {
  const { data: goal, error: goalError } = await supabaseAdmin
    .from("goals")
    .select("*")
    .eq("user_id", req.user!.id)
    .maybeSingle();

  if (goalError) {
    return res.status(500).json({ message: "Failed to load goal.", error: goalError.message });
  }

  if (!goal) {
    return res.json(null);
  }

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const { data: weekly, error: weeklyError } = await supabaseAdmin
    .from("sleep_logs")
    .select("sleep_time,duration")
    .eq("user_id", req.user!.id)
    .gte("sleep_time", start.toISOString());

  if (weeklyError) {
    return res.status(500).json({ message: "Failed to load progress.", error: weeklyError.message });
  }

  const totalSleep = (weekly ?? []).reduce((sum, log) => sum + log.duration, 0);
  const avgSleep = (weekly ?? []).length ? totalSleep / 7 : 0;
  const progressPercent = goal.target_hours > 0 ? (avgSleep / goal.target_hours) * 100 : 0;

  return res.json({
    targetHours: goal.target_hours,
    averageSleep: Number(avgSleep.toFixed(2)),
    progress: Number(Math.min(progressPercent, 200).toFixed(1)),
    weeklyTotal: Number(totalSleep.toFixed(2)),
    goalTotal: Number((goal.target_hours * 7).toFixed(2)),
  });
});

export default router;

