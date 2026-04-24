"use client";

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

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Mind · Inner work</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            Reflect. <em style={{ fontStyle: "italic", color: "#d4a947" }}>Grow.</em>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "#141414", border: "1px solid #2a2a2a", borderRadius: "100px", padding: "4px" }}>
          {(["journal", "archive", "review"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 18px", background: view === v ? "#d4a947" : "transparent", color: view === v ? "#0a0a0a" : "#999080", border: "none", borderRadius: "100px", fontSize: "12px", fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "radial-gradient(circle at 90% 10%, rgba(212,169,71,0.12) 0%, transparent 40%), #141414", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Journal streak</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#d4a947", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{streak}<em style={{ fontSize: "20px", fontStyle: "italic" }}> days</em></div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>{streak > 0 ? "Keep going" : "Start today"}</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Entries this month</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#f4ecd8", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{entries.length}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>Last 30 days</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Today's mood</div>
          {todayEntry ? (
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: MOOD_COLORS[todayEntry.mood], letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "8px" }}>{MOOD_LABELS[todayEntry.mood]}</div>
          ) : (
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: "#7a7468", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "8px" }}>Not yet</div>
          )}
        </div>
      </div>

      {view === "journal" && (
        <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "28px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>
              {faithMode ? "Faith reflection" : "Today's prompt"} · {fmtDate(today)}
            </div>
            <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "18px", fontWeight: 300, color: "#f4ecd8", lineHeight: 1.4, marginBottom: "24px", paddingLeft: "16px", borderLeft: "2px solid #d4a947" }}>
              {todayPrompt}
            </div>
            <textarea placeholder="Write your reflection here. Be honest — this is private." value={content || (todayEntry?.content || "")} onChange={e => setContent(e.target.value)} style={{ ...inputStyle, minHeight: "160px", resize: "vertical", lineHeight: 1.6 }} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            <div style={{ marginTop: "20px" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>How are you feeling today?</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map(m => (
                  <button key={m} onClick={() => setMood(m)} style={{ padding: "10px 16px", background: mood === m ? MOOD_COLORS[m] : "#0a0a0a", border: "1px solid " + (mood === m ? MOOD_COLORS[m] : "#2a2a2a"), borderRadius: "100px", color: mood === m ? "#0a0a0a" : "#999080", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                    {MOOD_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468" }}>{streak > 0 ? streak + " day streak" : "Start your streak"}</div>
              <button onClick={handleSave} disabled={saving} style={{ padding: "12px 28px", background: saving ? "#8a6f2e" : saved ? "#7aa87a" : "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                {saving ? "Saving..." : saved ? "Saved!" : todayEntry ? "Update" : "Save entry"}
              </button>
            </div>
          </div>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Recent entries</div>
            {entries.slice(0, 5).map(e => (
              <div key={e.id} style={{ padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ fontSize: "12px", color: "#7a7468" }}>{fmtDate(e.date)}</div>
                  <span style={{ fontSize: "10px", color: MOOD_COLORS[e.mood], padding: "2px 8px", border: "1px solid " + MOOD_COLORS[e.mood], borderRadius: "100px" }}>{MOOD_LABELS[e.mood]}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#999080", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.content}</div>
              </div>
            ))}
            {entries.length === 0 && <div style={{ textAlign: "center", padding: "20px", fontSize: "13px", color: "#7a7468" }}>Your first entry will appear here</div>}
          </div>
        </div>
      )}

      {view === "archive" && (
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>All entries · Last 30 days</div>
          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8", marginBottom: "8px" }}>No entries yet</div>
              <button onClick={() => setView("journal")} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Write first entry</button>
            </div>
          ) : (
            entries.map(e => (
              <div key={e.id} style={{ padding: "20px 0", borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947" }}>{fmtDate(e.date)}</div>
                  <span style={{ fontSize: "11px", color: MOOD_COLORS[e.mood], padding: "3px 10px", border: "1px solid " + MOOD_COLORS[e.mood], borderRadius: "100px" }}>{MOOD_LABELS[e.mood]}</span>
                </div>
                {e.prompt && <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "13px", color: "#7a7468", marginBottom: "8px", paddingLeft: "12px", borderLeft: "2px solid #2a2a2a" }}>{e.prompt}</div>}
                <div style={{ fontSize: "14px", color: "#f4ecd8", lineHeight: 1.6 }}>{e.content}</div>
              </div>
            ))
          )}
        </div>
      )}

      {view === "review" && (
        <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "28px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>Weekly review</div>
            <p style={{ fontSize: "14px", color: "#999080", lineHeight: 1.6, marginBottom: "24px" }}>Take 5 minutes every Sunday. Review the week honestly.</p>
            {[
              { q: "What was your biggest win this week?", p: "Even small wins count..." },
              { q: "What did not go as planned?", p: "Be honest, not harsh..." },
              { q: "What are you grateful for?", p: "Name it specifically..." },
              { q: "What is your one priority next week?", p: "One thing, not ten..." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "16px", color: "#f4ecd8", marginBottom: "10px" }}>{item.q}</label>
                <textarea placeholder={item.p} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <button style={{ padding: "12px 28px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save review</button>
            </div>
          </div>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Review checklist</div>
            {[
              { label: "Daily journal today", done: todayEntry !== undefined },
              { label: "Mood tracked", done: todayEntry !== undefined },
              { label: "Weekly review", done: false },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: item.done ? "#d4a947" : "transparent", border: item.done ? "none" : "1.5px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#0a0a0a", flexShrink: 0 }}>
                  {item.done ? "✓" : ""}
                </div>
                <div style={{ fontSize: "13px", color: item.done ? "#f4ecd8" : "#7a7468" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
