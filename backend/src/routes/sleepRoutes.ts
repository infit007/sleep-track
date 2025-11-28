import { Router } from "express";
import { z } from "zod";
import { authenticateUser } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabaseClient.js";

const router = Router();

const logInputSchema = z.object({
  sleepTime: z.string().datetime(),
  wakeTime: z.string().datetime(),
});

router.use(authenticateUser);

router.post("/", async (req, res) => {
  const parseResult = logInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: "Invalid payload", issues: parseResult.error.issues });
  }

  const { sleepTime, wakeTime } = parseResult.data;
  const sleepDate = new Date(sleepTime);
  const wakeDate = new Date(wakeTime);

  if (wakeDate <= sleepDate) {
    return res.status(400).json({ message: "Wake time must be after sleep time." });
  }

  const duration = Number(((wakeDate.getTime() - sleepDate.getTime()) / (1000 * 60 * 60)).toFixed(2));

  const { data, error } = await supabaseAdmin
    .from("sleep_logs")
    .insert({
      user_id: req.user!.id,
      sleep_time: sleepDate.toISOString(),
      wake_time: wakeDate.toISOString(),
      duration,
    })
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ message: "Failed to log sleep.", error: error.message });
  }

  return res.status(201).json(data);
});

router.get("/", async (req, res) => {
  const limit = Number(req.query.limit) || 20;

  const { data, error } = await supabaseAdmin
    .from("sleep_logs")
    .select("*")
    .eq("user_id", req.user!.id)
    .order("sleep_time", { ascending: false })
    .limit(limit);

  if (error) {
    return res.status(500).json({ message: "Failed to fetch sleep logs.", error: error.message });
  }

  return res.json(data ?? []);
});

router.get("/weekly", async (req, res) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const { data, error } = await supabaseAdmin
    .from("sleep_logs")
    .select("sleep_time,duration")
    .eq("user_id", req.user!.id)
    .gte("sleep_time", start.toISOString())
    .order("sleep_time", { ascending: true });

  if (error) {
    return res.status(500).json({ message: "Failed to load weekly sleep.", error: error.message });
  }

  const days = Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(start);
    date.setDate(start.getDate() + idx);
    return {
      dateISO: date.toISOString().split("T")[0],
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
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

  return res.json(days);
});

router.get("/today", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabaseAdmin
    .from("sleep_logs")
    .select("*")
    .eq("user_id", req.user!.id)
    .gte("sleep_time", today.toISOString())
    .order("sleep_time", { ascending: false });

  if (error) {
    return res.status(500).json({ message: "Failed to load today's sleep.", error: error.message });
  }

  const logs = data ?? [];
  const totalHours = logs.reduce((sum, log) => sum + log.duration, 0);

  return res.json({
    totalHours: Number(totalHours.toFixed(2)),
    latestLog: logs[0] ?? null,
  });
});

export default router;

