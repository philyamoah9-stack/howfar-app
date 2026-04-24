const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'dashboard', 'mind');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const part1 = `"use client";

import { useState } from "react";

type JournalEntry = {
  id: string; date: string; prompt: string; content: string; mood: number;
};

const UNIVERSAL_PROMPTS = [
  "What is one thing you are genuinely grateful for today and why?",
  "What is the most important thing you need to do this week? What is stopping you?",
  "Describe a recent win, however small. What made it possible?",
  "What is one habit you want to change? What would changing it cost you?",
  "Who in your life deserves more of your attention? What would giving it look like?",
  "What is your biggest financial goal right now? What is your next concrete step?",
  "What are you avoiding? What would happen if you stopped avoiding it?",
  "How are you different from who you were a year ago? Is that progress?",
  "What does a truly good day look like for you? How often do you have one?",
  "If a trusted mentor could see your life clearly right now, what would they tell you?",
  "What relationship in your life needs more investment?",
  "What do you want to be true about you in 5 years that is not true today?",
  "What is something you have been meaning to start? What is the smallest first step?",
  "Describe a moment this week when you felt most like yourself.",
  "What is costing you the most energy right now and is it worth it?",
  "What does financial freedom mean to you personally?",
  "Who do you need to forgive including yourself?",
  "What are you learning right now in any area of life?",
  "What would you do differently if you knew you could not fail?",
  "How is your faith showing up in your daily decisions?",
];

const FAITH_PROMPTS = [
  "Where have you seen God's provision this week in big or small ways?",
  "What is God calling you to trust Him with that you are still holding tightly?",
  "How are you stewarding your time, money, and energy as gifts from God?",
  "What scripture has stayed with you recently? What is it speaking to your situation?",
  "How is your prayer life right now? Honest answer.",
  "Where is God stretching your faith in this season?",
  "What would it look like to honour God in your finances this month?",
  "Who has God placed in your life to encourage? Have you done that recently?",
  "What does rest and Sabbath look like for you? Are you practicing it?",
  "What is God asking you to let go of?",
  "How is your church community shaping who you are becoming?",
  "What is one way you can be more generous this week?",
  "Where do you sense God's peace in your life right now?",
  "What sin or pattern have you been rationalising?",
  "How does your identity in Christ change how you see your work and ambitions?",
  "What legacy are you building for your children?",
  "How are you growing in patience in your finances, relationships, or calling?",
  "What does it mean to seek first the kingdom in your specific season?",
  "Where have you experienced answered prayer recently?",
  "What would it look like to fully surrender your career to God?",
];

const MOOD_LABELS = ["", "Struggling", "Low", "Okay", "Good", "Thriving"];
const MOOD_COLORS = ["", "#c85a5a", "#c09a6a", "#999080", "#7aa87a", "#d4a947"];

type Props = { userId: string; faithMode: boolean; initialEntries: JournalEntry[]; today: string; };

export default function MindClient({ userId, faithMode, initialEntries, today }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<"journal" | "archive" | "review">("journal");

  const prompts = faithMode ? FAITH_PROMPTS : UNIVERSAL_PROMPTS;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayPrompt = prompts[dayOfYear % prompts.length];
  const todayEntry = entries.find(e => e.date === today);

  const streak = (() => {
    let s = 0;
    const d = new Date(today);
    while (entries.some(e => e.date === d.toISOString().slice(0, 10))) {
      s++; d.setDate(d.getDate() - 1);
    }
    return s;
  })();

  const handleSave = async () => {
    if (!content.trim()) return;
    if (mood === 0) { alert("Pick a mood before saving"); return; }
    setSaving(true);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      if (todayEntry) {
        const { data } = await supabase.from("journal_entries").update({ content, mood, prompt: todayPrompt }).eq("id", todayEntry.id).select().single();
        if (data) setEntries(prev => prev.map(e => e.id === todayEntry.id ? data : e));
      } else {
        const { data } = await supabase.from("journal_entries").insert({ user_id: userId, date: today, prompt: todayPrompt, content, mood }).select().single();
        if (data) setEntries(prev => [data, ...prev]);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#f4ecd8", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none" } as React.CSSProperties;
`;

fs.writeFileSync(path.join(dir, 'MindClient.tsx'), part1, 'utf8');
console.log('Done: part 1');