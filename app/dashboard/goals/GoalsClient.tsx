"use client";

import { useState } from "react";

type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  category: string;
};

const GOAL_CATEGORIES = [
  "Safety", "Property", "Family", "Business",
  "Vehicle", "Education", "Wedding", "Pilgrimage", "Travel", "Other"
];

type Props = { userId: string; initialGoals: Goal[] };

export default function GoalsClient({ userId, initialGoals }: Props) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showModal, setShowModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("0");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Safety");
  const [addAmount, setAddAmount] = useState("");

  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const monthsBetween = (a: Date, b: Date) => Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()));
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const addYears = (n: number) => { const d = new Date(); d.setFullYear(d.getFullYear() + n); return d.toISOString().slice(0, 10); };

  const openGoal = () => { setName(""); setTarget(""); setSaved("0"); setDeadline(addYears(2)); setCategory("Safety"); setError(""); setShowModal(true); };
  const openSave = (goal: Goal) => { setActiveGoal(goal); setAddAmount(""); setError(""); setShowSaveModal(true); };

  const handleCreate = async () => {
    if (!name.trim()) { setError("Give your goal a name"); return; }
    if (!target || parseFloat(target) <= 0) { setError("Enter a target amount"); return; }
    if (!deadline) { setError("Pick a target date"); return; }
    setLoading(true);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      const { data, error: err } = await supabase.from("goals").insert({ user_id: userId, name, target: parseFloat(target), saved: parseFloat(saved) || 0, deadline, category }).select().single();
      if (err) throw err;
      setGoals(prev => [data, ...prev]);
      setShowModal(false);
    } catch { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  const handleAddSavings = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) { setError("Enter a valid amount"); return; }
    if (!activeGoal) return;
    setLoading(true);
    try {
      const newSaved = Math.min(activeGoal.target, activeGoal.saved + parseFloat(addAmount));
      const supabase = (await import("../../lib/supabase")).createClient();
      const { error: err } = await supabase.from("goals").update({ saved: newSaved }).eq("id", activeGoal.id);
      if (err) throw err;
      setGoals(prev => prev.map(g => g.id === activeGoal.id ? { ...g, saved: newSaved } : g));
      setShowSaveModal(false);
    } catch { setError("Failed to update. Try again."); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this goal?")) return;
    const supabase = (await import("../../lib/supabase")).createClient();
    await supabase.from("goals").delete().eq("id", id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#f4ecd8", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none" } as React.CSSProperties;
  const modalStyle = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
  const cardStyle = { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "32px", maxWidth: "480px", width: "100%", position: "relative" as const };
  const goldLine = { position: "absolute" as const, top: "-1px", left: "40px", right: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4a947, transparent)" };

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Finance · Goals</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            The life you are <em style={{ fontStyle: "italic", color: "#d4a947" }}>building</em>.
          </h1>
        </div>
        <button onClick={openGoal} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ New goal</button>
      </div>

      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Active goals", value: goals.length.toString(), color: "#f4ecd8" },
          { label: "Total target", value: fmt(totalTarget) + " GHS", color: "#f4ecd8" },
          { label: "Saved so far", value: fmt(totalSaved) + " GHS", sub: overallPct + "% overall", color: "#d4a947" },
        ].map(card => (
          <div key={card.label} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>{card.label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: card.color, letterSpacing: "-0.02em", marginBottom: "4px" }}>{card.value}</div>
            {card.sub && <div style={{ fontSize: "12px", color: "#d4a947" }}>{card.sub}</div>}
          </div>
        ))}
      </div>

      {goals.length === 0 ? (
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "48px", fontStyle: "italic", color: "#d4a947", opacity: 0.4, marginBottom: "16px" }}>G</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#f4ecd8", marginBottom: "8px" }}>No goals yet</div>
          <p style={{ fontSize: "14px", color: "#7a7468", marginBottom: "24px" }}>Land in your hometown. Emergency fund. Kids school fees. Add what matters.</p>
          <button onClick={openGoal} style={{ padding: "12px 24px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Add your first goal</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {goals.map(g => {
            const pct = Math.round((g.saved / g.target) * 100);
            const remaining = g.target - g.saved;
            const monthsLeft = monthsBetween(new Date(), new Date(g.deadline));
            const monthly = Math.round(remaining / monthsLeft);
            return (
              <div key={g.id} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: "22px", fontStyle: "italic", color: "#d4a947", marginBottom: "4px" }}>{g.name}</div>
                    <div style={{ fontSize: "12px", color: "#7a7468" }}>GHS {fmt(g.saved)} of {fmt(g.target)} · Target: {fmtDate(g.deadline)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "18px", color: "#d4a947" }}>{Math.min(100, pct)}%</div>
                    <button onClick={() => openSave(g)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #2a2a2a", color: "#f4ecd8", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>+ Save</button>
                    <button onClick={() => handleDelete(g.id)} style={{ background: "transparent", border: "none", color: "#7a7468", cursor: "pointer", fontSize: "18px" }}>x</button>
                  </div>
                </div>
                <div style={{ height: "6px", background: "#2a2a2a", borderRadius: "3px", overflow: "hidden", marginBottom: "12px" }}>
                  <div style={{ height: "100%", width: Math.min(100, pct) + "%", background: "linear-gradient(90deg, #8a6f2e, #d4a947)", borderRadius: "3px" }} />
                </div>
                <div style={{ display: "flex", gap: "24px", fontSize: "12px", color: "#7a7468", flexWrap: "wrap" }}>
                  <span>GHS <span style={{ color: "#d4a947" }}>{fmt(monthly)}</span>/mo to stay on track</span>
                  <span>·</span>
                  <span>{monthsLeft} months remaining</span>
                  <span>·</span>
                  <span style={{ display: "inline-block", padding: "2px 8px", border: "1px solid #2a2a2a", borderRadius: "100px" }}>{g.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={modalStyle} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={cardStyle}>
            <div style={goldLine} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "26px", color: "#f4ecd8", marginBottom: "6px" }}>New <em style={{ fontStyle: "italic", color: "#d4a947" }}>goal</em></h3>
            <p style={{ color: "#999080", fontSize: "13px", marginBottom: "24px" }}>What are you building? Make it concrete with a number and a deadline.</p>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Goal name</label>
              <input type="text" placeholder="e.g. Land in Oyibi, Emergency fund" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Target (GHS)</label>
                <input type="number" placeholder="50000" value={target} onChange={e => setTarget(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Already saved</label>
                <input type="number" placeholder="0" value={saved} onChange={e => setSaved(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Target date</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                  {GOAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {error && <div style={{ padding: "12px 16px", background: "rgba(200,90,90,0.1)", border: "1px solid rgba(200,90,90,0.3)", borderRadius: "10px", color: "#c85a5a", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleCreate} disabled={loading} style={{ padding: "10px 20px", background: loading ? "#8a6f2e" : "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Saving..." : "Create goal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && activeGoal && (
        <div style={modalStyle} onClick={e => { if (e.target === e.currentTarget) setShowSaveModal(false); }}>
          <div style={{ ...cardStyle, maxWidth: "380px" }}>
            <div style={goldLine} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "24px", color: "#f4ecd8", marginBottom: "6px" }}>
              Save to <em style={{ fontStyle: "italic", color: "#d4a947" }}>{activeGoal.name}</em>
            </h3>
            <p style={{ color: "#999080", fontSize: "13px", marginBottom: "24px" }}>Currently GHS {fmt(activeGoal.saved)} of {fmt(activeGoal.target)}</p>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Amount to add (GHS)</label>
              <input type="number" placeholder="e.g. 500" value={addAmount} onChange={e => setAddAmount(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} autoFocus />
            </div>
            {error && <div style={{ padding: "12px 16px", background: "rgba(200,90,90,0.1)", border: "1px solid rgba(200,90,90,0.3)", borderRadius: "10px", color: "#c85a5a", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <button onClick={() => setShowSaveModal(false)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAddSavings} disabled={loading} style={{ padding: "10px 20px", background: loading ? "#8a6f2e" : "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Saving..." : "Add savings"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
