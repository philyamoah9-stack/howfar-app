const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'dashboard', 'habits');

const content = `"use client";

import { useState, useCallback } from "react";

type Habit = { id: string; name: string; category: string; created_at: string; };
type HabitLog = { id: string; habit_id: string; date: string; completed: boolean; };

const TEMPLATES = [
  { name: "Morning prayer & reading", category: "Faith" },
  { name: "Read 10 pages", category: "Mind" },
  { name: "Exercise", category: "Health" },
  { name: "Drink 8 glasses of water", category: "Health" },
  { name: "No social media before noon", category: "Mind" },
  { name: "Walk 6,000 steps", category: "Health" },
  { name: "Journal", category: "Mind" },
  { name: "Review budget", category: "Finance" },
];

const CAT_COLORS: Record<string, string> = {
  Faith: "#d4a947", Mind: "#6a8ac0", Health: "#7aa87a", Finance: "#c09a6a", Other: "#7a7468",
};

type Props = { userId: string; initialHabits: Habit[]; initialLogs: HabitLog[]; today: string; };

export default function HabitsClient({ userId, initialHabits, initialLogs, today }: Props) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs);
  const [showModal, setShowModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCat, setCustomCat] = useState("Health");
  const [loading, setLoading] = useState<string | null>(null);

  // Get last 14 days
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });

  const isCompleted = (habitId: string, date: string) =>
    logs.some(l => l.habit_id === habitId && l.date === date && l.completed);

  const getStreak = (habitId: string) => {
    let streak = 0;
    const d = new Date(today);
    while (true) {
      const dateStr = d.toISOString().slice(0, 10);
      if (isCompleted(habitId, dateStr)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const toggleHabit = useCallback(async (habitId: string) => {
    const completed = isCompleted(habitId, today);
    setLoading(habitId);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      if (completed) {
        await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("date", today).eq("user_id", userId);
        setLogs(prev => prev.filter(l => !(l.habit_id === habitId && l.date === today)));
      } else {
        const { data } = await supabase.from("habit_logs").insert({ habit_id: habitId, user_id: userId, date: today, completed: true }).select().single();
        if (data) setLogs(prev => [...prev, data]);
      }
    } catch (e) { console.error(e); }
    setLoading(null);
  }, [logs, today, userId]);

  const addFromTemplate = async (template: { name: string; category: string }) => {
    const supabase = (await import("../../lib/supabase")).createClient();
    const { data } = await supabase.from("habits").insert({ user_id: userId, name: template.name, category: template.category }).select().single();
    if (data) setHabits(prev => [...prev, data]);
    setShowTemplates(false);
  };

  const addCustom = async () => {
    if (!customName.trim()) return;
    const supabase = (await import("../../lib/supabase")).createClient();
    const { data } = await supabase.from("habits").insert({ user_id: userId, name: customName, category: customCat }).select().single();
    if (data) setHabits(prev => [...prev, data]);
    setCustomName(""); setShowModal(false);
  };

  const deleteHabit = async (id: string) => {
    if (!confirm("Delete this habit and all its logs?")) return;
    const supabase = (await import("../../lib/supabase")).createClient();
    await supabase.from("habits").delete().eq("id", id);
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(l => l.habit_id !== id));
  };

  const todayCompleted = habits.filter(h => isCompleted(h.id, today)).length;
  const todayTotal = habits.length;
  const completionRate = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#f4ecd8", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none" } as React.CSSProperties;
  const modalStyle = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
  const goldLine = { position: "absolute" as const, top: "-1px", left: "40px", right: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4a947, transparent)" };

  return (
    <div style={{ padding: "40px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Habits · Daily</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            Small actions, <em style={{ fontStyle: "italic", color: "#d4a947" }}>compounded</em>.
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowTemplates(true)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#f4ecd8", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ From templates</button>
          <button onClick={() => setShowModal(true)} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ Custom habit</button>
        </div>
      </div>

      {/* Today's summary */}
      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "radial-gradient(circle at 90% 10%, rgba(212,169,71,0.12) 0%, transparent 40%), #141414", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Today's completion</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#d4a947", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>
            {completionRate}<em style={{ fontSize: "24px", fontStyle: "italic" }}>%</em>
          </div>
          <div style={{ height: "4px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: completionRate + "%", background: "linear-gradient(90deg, #8a6f2e, #d4a947)", borderRadius: "2px", transition: "width 0.6s" }} />
          </div>
          <div style={{ fontSize: "12px", color: "#7a7468", marginTop: "8px" }}>{todayCompleted} of {todayTotal} habits done</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Active habits</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#f4ecd8", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{habits.length}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>Tracked daily</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Best streak</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#f4ecd8", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>
            {habits.length > 0 ? Math.max(...habits.map(h => getStreak(h.id))) : 0}
            <em style={{ fontSize: "18px", fontStyle: "italic", color: "#d4a947" }}> days</em>
          </div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>Current top streak</div>
        </div>
      </div>

      <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>
        {/* Habits list */}
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
            Today · {new Date(today).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </div>

          {habits.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "48px", fontStyle: "italic", color: "#d4a947", opacity: 0.4, marginBottom: "12px" }}>H</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8", marginBottom: "8px" }}>No habits yet</div>
              <p style={{ fontSize: "13px", color: "#7a7468", marginBottom: "20px" }}>Start with 2-3 habits. Small and consistent beats ambitious and sporadic.</p>
              <button onClick={() => setShowTemplates(true)} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Pick from templates</button>
            </div>
          ) : (
            habits.map(h => {
              const done = isCompleted(h.id, today);
              const streak = getStreak(h.id);
              const isLoading = loading === h.id;
              return (
                <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #1e1e1e" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <button onClick={() => toggleHabit(h.id)} disabled={isLoading} style={{ width: "28px", height: "28px", borderRadius: "8px", border: done ? "none" : "1.5px solid #2a2a2a", background: done ? "#d4a947" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: "14px", color: "#0a0a0a", transition: "all 0.2s" }}>
                      {done ? "✓" : ""}
                    </button>
                    <div>
                      <div style={{ fontSize: "14px", color: done ? "#d4a947" : "#f4ecd8", fontWeight: done ? 500 : 400, textDecoration: done ? "none" : "none" }}>{h.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                        <span style={{ fontSize: "10px", color: CAT_COLORS[h.category] || "#7a7468", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h.category}</span>
                        {streak > 0 && <span style={{ fontSize: "11px", color: "#d4a947" }}>🔥 {streak}d</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteHabit(h.id)} style={{ background: "transparent", border: "none", color: "#7a7468", cursor: "pointer", fontSize: "16px", padding: "4px 8px" }}>×</button>
                </div>
              );
            })
          )}
        </div>

        {/* Heatmap */}
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>14-day heatmap</div>

          {habits.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", fontSize: "13px", color: "#7a7468" }}>Add habits to see your heatmap</div>
          ) : (
            <>
              {/* Day labels */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "#7a7468", textAlign: "center", letterSpacing: "0.05em" }}>{d}</div>
                ))}
              </div>

              {/* Heatmap grid - last 14 days */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "20px" }}>
                {last14.map(date => {
                  const total = habits.length;
                  const done = habits.filter(h => isCompleted(h.id, date)).length;
                  const ratio = total > 0 ? done / total : 0;
                  const bg = ratio === 0 ? "#1e1e1e" : ratio < 0.4 ? "rgba(212,169,71,0.2)" : ratio < 0.7 ? "rgba(212,169,71,0.5)" : "#d4a947";
                  const isToday = date === today;
                  return (
                    <div key={date} style={{ aspectRatio: "1", borderRadius: "4px", background: bg, border: isToday ? "1.5px solid #d4a947" : "none", title: date }} />
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <span style={{ fontSize: "10px", color: "#7a7468" }}>Less</span>
                {["#1e1e1e", "rgba(212,169,71,0.2)", "rgba(212,169,71,0.5)", "#d4a947"].map((c, i) => (
                  <div key={i} style={{ width: "12px", height: "12px", borderRadius: "3px", background: c }} />
                ))}
                <span style={{ fontSize: "10px", color: "#7a7468" }}>More</span>
              </div>

              {/* Per-habit streaks */}
              <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "16px" }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Streaks</div>
                {habits.map(h => {
                  const streak = getStreak(h.id);
                  return (
                    <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e1e1e" }}>
                      <div style={{ fontSize: "13px", color: "#f4ecd8", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</div>
                      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: streak > 0 ? "#d4a947" : "#7a7468" }}>
                        {streak > 0 ? "🔥 " + streak + "d" : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Templates modal */}
      {showTemplates && (
        <div style={modalStyle} onClick={e => { if (e.target === e.currentTarget) setShowTemplates(false); }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "32px", maxWidth: "500px", width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={goldLine} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "26px", color: "#f4ecd8", marginBottom: "6px" }}>Habit <em style={{ fontStyle: "italic", color: "#d4a947" }}>templates</em></h3>
            <p style={{ color: "#999080", fontSize: "13px", marginBottom: "24px" }}>Start with 2-3. Consistency beats ambition.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TEMPLATES.filter(t => !habits.some(h => h.name === t.name)).map(t => (
                <button key={t.name} onClick={() => addFromTemplate(t)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "12px", cursor: "pointer", textAlign: "left", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#d4a947"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
                  <div style={{ fontSize: "14px", color: "#f4ecd8" }}>{t.name}</div>
                  <span style={{ fontSize: "10px", color: CAT_COLORS[t.category] || "#7a7468", letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", border: "1px solid", borderColor: CAT_COLORS[t.category] || "#7a7468", borderRadius: "100px" }}>{t.category}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #1e1e1e", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowTemplates(false)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom habit modal */}
      {showModal && (
        <div style={modalStyle} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "32px", maxWidth: "420px", width: "100%", position: "relative" }}>
            <div style={goldLine} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "26px", color: "#f4ecd8", marginBottom: "6px" }}>Custom <em style={{ fontStyle: "italic", color: "#d4a947" }}>habit</em></h3>
            <p style={{ color: "#999080", fontSize: "13px", marginBottom: "24px" }}>Name it clearly. Vague habits die fast.</p>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Habit name</label>
              <input type="text" placeholder="e.g. Read Bible for 15 minutes" value={customName} onChange={e => setCustomName(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} autoFocus />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Category</label>
              <select value={customCat} onChange={e => setCustomCat(e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                {["Faith", "Health", "Mind", "Finance", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
              <button onClick={addCustom} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Add habit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path.join(dir, 'HabitsClient.tsx'), content, 'utf8');
console.log('Done: HabitsClient.tsx');