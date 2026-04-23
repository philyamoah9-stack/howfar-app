"use client";

import { useState, useEffect } from "react";

type Profile = {
  id: string;
  name: string;
  age: number;
  retire_age: number;
  monthly_income: number;
  current_savings: number;
  faith_mode: boolean;
};

type Props = { userId: string; profile: Profile | null };

export default function RetirementClient({ userId, profile }: Props) {
  const [age, setAge] = useState(profile?.age || 30);
  const [retireAge, setRetireAge] = useState(profile?.retire_age || 58);
  const [income, setIncome] = useState(profile?.monthly_income || 0);
  const [savings, setSavings] = useState(profile?.current_savings || 0);
  const [showEdit, setShowEdit] = useState(!profile?.age);
  const [loading, setLoading] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [countdown, setCountdown] = useState({ years: 0, months: 0, days: 0, hours: 0 });
  const faithMode = profile?.faith_mode || false;
  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date();
      target.setFullYear(now.getFullYear() + Math.max(0, retireAge - age));
      const diff = Math.max(0, target.getTime() - now.getTime());
      setCountdown({
        years: Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)),
        months: Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000)),
        days: Math.floor((diff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)),
        hours: Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [age, retireAge]);

  const workingYears = Math.max(0, retireAge - age);
  const annualNeed = income * 12 * 0.7;
  const corpus = annualNeed * 25;
  const monthlyRate = 0.08 / 12;
  const months = workingYears * 12;
  const currentFV = savings * Math.pow(1 + monthlyRate, months);
  const gap = Math.max(0, corpus - currentFV);
  const monthlySave = months > 0 && monthlyRate > 0 ? Math.round(gap / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)) : 0;
  const readinessPct = Math.min(100, Math.max(0, Math.round((currentFV / corpus) * 100)));
  const ssnitEst = Math.round(income * 0.5);
  const elapsedPct = Math.min(100, Math.max(0, Math.round(((age - 22) / (retireAge - 22)) * 100)));

  const quotes = faithMode
    ? ["The plans of the diligent lead surely to abundance. — Proverbs 21:5", "Commit your work to the Lord, and your plans will be established. — Proverbs 16:3"]
    : ["Retirement is not about stopping. It is about reaching the point where work is a choice, not a chain.", "Time is your most honest currency. Spend it like you mean it."];
  const quote = quotes[Math.floor(Date.now() / 86400000) % quotes.length];

  const handleSave = async () => {
    setLoading(true);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      await supabase.from("profiles").update({ age, retire_age: retireAge, monthly_income: income, current_savings: savings, onboarding_complete: true }).eq("id", userId);
      setSavedOk(true);
      setShowEdit(false);
      setTimeout(() => setSavedOk(false), 2000);
    } catch { console.error("Save failed"); }
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#f4ecd8", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none" } as React.CSSProperties;

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Finance · Retirement</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            How <em style={{ fontStyle: "italic", color: "#d4a947" }}>far</em> from freedom?
          </h1>
        </div>
        <button onClick={() => setShowEdit(!showEdit)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#f4ecd8", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          {showEdit ? "Hide" : "Edit plan"}
        </button>
      </div>

      {showEdit && (
        <div style={{ background: "#141414", border: "1px solid #8a6f2e", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>Your retirement plan</div>
          <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Current age</label>
              <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 0)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Target retirement age</label>
              <input type="number" value={retireAge} onChange={e => setRetireAge(parseInt(e.target.value) || 0)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Monthly income (GHS)</label>
              <input type="number" value={income} onChange={e => setIncome(parseFloat(e.target.value) || 0)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Current savings (GHS)</label>
              <input type="number" value={savings} onChange={e => setSavings(parseFloat(e.target.value) || 0)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>
          </div>
          <button onClick={handleSave} disabled={loading} style={{ padding: "12px 28px", background: loading ? "#8a6f2e" : "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Saving..." : savedOk ? "Saved!" : "Update plan"}
          </button>
        </div>
      )}

      <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "linear-gradient(155deg, #1a1a1a 0%, #141414 100%)", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "28px", position: "relative" }}>
          <div style={{ position: "absolute", top: "-1px", left: "40px", right: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4a947, transparent)" }} />
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Countdown to freedom</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "#2a2a2a", border: "1px solid #2a2a2a", borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
            {[{ n: countdown.years, u: "Years" }, { n: countdown.months, u: "Months" }, { n: countdown.days, u: "Days" }, { n: countdown.hours, u: "Hours" }].map(item => (
              <div key={item.u} style={{ background: "#141414", padding: "18px 10px", textAlign: "center" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: 400, color: "#f4ecd8", lineHeight: 1, letterSpacing: "-0.02em" }}>{String(item.n).padStart(2, "0")}</div>
                <div style={{ fontSize: "9px", color: "#7a7468", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "8px" }}>{item.u}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 16px", borderLeft: "2px solid #d4a947", background: "rgba(212,169,71,0.08)", borderRadius: "0 8px 8px 0" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "13px", color: "#f4ecd8", lineHeight: 1.5 }}>{quote}</div>
          </div>
        </div>

        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Readiness score</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "64px", fontWeight: 300, color: readinessPct >= 60 ? "#d4a947" : readinessPct >= 30 ? "#e8c16d" : "#c85a5a", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "8px" }}>
            {readinessPct}<em style={{ fontSize: "28px", fontStyle: "italic" }}>%</em>
          </div>
          <div style={{ fontSize: "13px", color: "#999080", marginBottom: "16px" }}>
            {readinessPct >= 80 ? "On track. Keep going." : readinessPct >= 50 ? "Making progress. Close the gap." : readinessPct >= 25 ? "Early days. Time is on your side." : "Big gap. Start closing it today."}
          </div>
          <div style={{ height: "6px", background: "#2a2a2a", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: readinessPct + "%", background: "linear-gradient(90deg, #8a6f2e, #d4a947)", borderRadius: "3px" }} />
          </div>
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #1e1e1e" }}>
            <div style={{ height: "4px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
              <div style={{ height: "100%", width: elapsedPct + "%", background: "#d4a947", borderRadius: "2px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468" }}>
              <span>Age {age}</span><span>Age {retireAge}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Your plan</div>
          {[
            { label: "Current age", value: age + " years" },
            { label: "Target retirement age", value: retireAge + " years" },
            { label: "Working years remaining", value: workingYears + " years" },
            { label: "Monthly income", value: "GHS " + fmt(income) },
            { label: "Current savings", value: "GHS " + fmt(savings) },
            { label: "Target corpus (4% rule)", value: "GHS " + fmt(corpus) },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
              <div style={{ fontSize: "13px", color: "#999080" }}>{row.label}</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#f4ecd8", fontStyle: "italic" }}>{row.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Gap analysis</div>
          {[
            { label: "Suggested monthly savings", value: "GHS " + fmt(monthlySave), highlight: true },
            { label: "Projected at current rate", value: "GHS " + fmt(currentFV) },
            { label: "Gap to target", value: gap > 0 ? "GHS " + fmt(gap) : "On track", color: gap > 0 ? "#c85a5a" : "#7aa87a" },
            { label: "SSNIT Tier 1 estimate", value: "GHS " + fmt(ssnitEst) + "/mo" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
              <div style={{ fontSize: "13px", color: "#999080" }}>{row.label}</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: row.color || (row.highlight ? "#d4a947" : "#f4ecd8"), fontStyle: row.highlight ? "italic" : "normal" }}>{row.value}</div>
            </div>
          ))}
          <div style={{ marginTop: "20px", padding: "16px", background: "rgba(212,169,71,0.06)", border: "1px solid #8a6f2e", borderRadius: "12px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Assumption</div>
            <div style={{ fontSize: "12px", color: "#7a7468", lineHeight: 1.5 }}>4% safe withdrawal rate · 8% annual real return · 70% income replacement at retirement</div>
          </div>
        </div>
      </div>
    </div>
  );
}
