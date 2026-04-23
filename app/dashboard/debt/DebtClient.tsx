"use client";

import { useState } from "react";

type Debt = {
  id: string;
  name: string;
  type: string;
  balance: number;
  rate: string;
  monthly: number;
};

const DEBT_TYPES = ["Bank loan", "Credit card", "MoMo loan", "Family loan", "Susu obligation", "Mortgage", "Student loan", "Other"];

type Props = { userId: string; initialDebts: Debt[]; monthlyIncome: number };

export default function DebtClient({ userId, initialDebts, monthlyIncome }: Props) {
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Bank loan");
  const [balance, setBalance] = useState("");
  const [rate, setRate] = useState("");
  const [monthly, setMonthly] = useState("");

  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalMonthly = debts.reduce((s, d) => s + (d.monthly || 0), 0);
  const dtiRatio = monthlyIncome > 0 ? Math.round((totalMonthly / monthlyIncome) * 100) : 0;

  const dtiLabel = dtiRatio === 0 ? "No debt tracked" :
    dtiRatio < 20 ? "Comfortable" :
    dtiRatio < 36 ? "Manageable" :
    dtiRatio < 50 ? "Stretched" : "High risk";

  const dtiColor = dtiRatio === 0 ? "#7a7468" :
    dtiRatio < 20 ? "#7aa87a" :
    dtiRatio < 36 ? "#d4a947" :
    "#c85a5a";

  const openModal = () => {
    setName(""); setType("Bank loan"); setBalance(""); setRate(""); setMonthly("");
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !balance || parseFloat(balance) <= 0) { setError("Name and balance are required"); return; }
    setLoading(true);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      const { data, error: err } = await supabase
        .from("debts")
        .insert({ user_id: userId, name, type, balance: parseFloat(balance), rate: rate || null, monthly: parseFloat(monthly) || 0 })
        .select().single();
      if (err) throw err;
      setDebts(prev => [data, ...prev]);
      setShowModal(false);
    } catch { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this debt?")) return;
    const supabase = (await import("../../lib/supabase")).createClient();
    await supabase.from("debts").delete().eq("id", id);
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#f4ecd8", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none" } as React.CSSProperties;
  const modalStyle = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Finance · Debt</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            What you <em style={{ fontStyle: "italic", color: "#d4a947" }}>owe</em>, clearly.
          </h1>
        </div>
        <button onClick={openModal} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ Add debt</button>
      </div>

      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#c85a5a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Total debt</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "40px", fontWeight: 300, color: "#c85a5a", letterSpacing: "-0.02em", marginBottom: "4px" }}>{fmt(totalDebt)}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>GHS · {debts.length} loans tracked</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Monthly obligation</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "40px", fontWeight: 300, color: "#f4ecd8", letterSpacing: "-0.02em", marginBottom: "4px" }}>{fmt(totalMonthly)}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>GHS per month</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Debt-to-income ratio</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "40px", fontWeight: 300, color: dtiColor, letterSpacing: "-0.02em", marginBottom: "4px" }}>
            {dtiRatio}<em style={{ fontSize: "20px", fontStyle: "italic" }}>%</em>
          </div>
          <div style={{ fontSize: "12px", color: dtiColor }}>{dtiLabel}</div>
        </div>
      </div>

      {totalDebt > 0 && (
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase" }}>Debt-to-income</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: dtiColor }}>{dtiRatio}% of GHS {fmt(monthlyIncome)} income</div>
          </div>
          <div style={{ height: "6px", background: "#2a2a2a", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: Math.min(100, dtiRatio) + "%", background: dtiRatio < 20 ? "#7aa87a" : dtiRatio < 36 ? "#d4a947" : "#c85a5a", borderRadius: "3px", transition: "width 0.6s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468" }}>
            <span>0%</span><span>Healthy: under 36%</span>
          </div>
        </div>
      )}

      <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Your debts</div>

        {debts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "48px", fontStyle: "italic", color: "#d4a947", opacity: 0.4, marginBottom: "12px" }}>D</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8", marginBottom: "8px" }}>No debts tracked</div>
            <p style={{ fontSize: "13px", color: "#7a7468", marginBottom: "20px" }}>Clarity beats avoidance. Track what you owe to take it back.</p>
            <button onClick={openModal} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Add a debt</button>
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", borderBottom: "1px solid #2a2a2a", paddingBottom: "10px", marginBottom: "4px" }}>
              {["Lender", "Type", "Rate", "Monthly", "Balance", ""].map(h => (
                <div key={h} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px" }}>{h}</div>
              ))}
            </div>
            {debts.map(d => (
              <div key={d.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", padding: "14px 0", borderBottom: "1px solid #1e1e1e", alignItems: "center" }}>
                <div style={{ padding: "0 8px", fontSize: "14px", color: "#f4ecd8" }}>{d.name}</div>
                <div style={{ padding: "0 8px" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#c85a5a", padding: "3px 8px", border: "1px solid rgba(200,90,90,0.3)", borderRadius: "100px", background: "rgba(200,90,90,0.1)" }}>{d.type}</span>
                </div>
                <div style={{ padding: "0 8px", fontSize: "12px", color: "#999080" }}>{d.rate || "—"}</div>
                <div style={{ padding: "0 8px", fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#f4ecd8" }}>{fmt(d.monthly || 0)}</div>
                <div style={{ padding: "0 8px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: "#c85a5a", fontWeight: 500 }}>{fmt(d.balance)}</div>
                <div style={{ padding: "0 8px" }}>
                  <button onClick={() => handleDelete(d.id)} style={{ background: "transparent", border: "none", color: "#7a7468", cursor: "pointer", fontSize: "16px" }}>x</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={modalStyle} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "32px", maxWidth: "480px", width: "100%", position: "relative" }}>
            <div style={{ position: "absolute", top: "-1px", left: "40px", right: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4a947, transparent)" }} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "26px", color: "#f4ecd8", marginBottom: "6px" }}>
              Add <em style={{ fontStyle: "italic", color: "#d4a947" }}>debt</em>
            </h3>
            <p style={{ color: "#999080", fontSize: "13px", marginBottom: "24px" }}>Clarity beats avoidance. List what you owe.</p>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Lender / loan name</label>
              <input type="text" placeholder="e.g. GCB Personal Loan, Qwikloan" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Type</label>
                <select value={type} onChange={e => setType(e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                  {DEBT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Balance (GHS)</label>
                <input type="number" placeholder="0" value={balance} onChange={e => setBalance(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Interest rate</label>
                <input type="text" placeholder="e.g. 28%" value={rate} onChange={e => setRate(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Monthly payment</label>
                <input type="number" placeholder="0" value={monthly} onChange={e => setMonthly(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
            </div>

            {error && <div style={{ padding: "12px 16px", background: "rgba(200,90,90,0.1)", border: "1px solid rgba(200,90,90,0.3)", borderRadius: "10px", color: "#c85a5a", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={loading} style={{ padding: "10px 20px", background: loading ? "#8a6f2e" : "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
