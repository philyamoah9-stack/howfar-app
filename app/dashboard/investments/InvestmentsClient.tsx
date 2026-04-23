"use client";

import { useState } from "react";

type Investment = {
  id: string;
  name: string;
  type: string;
  value: number;
  rate: string;
  maturity: string;
  note: string;
};

const TYPES = ["T-bill", "Fixed deposit", "Mutual fund", "Stocks", "Eurobond", "USD account", "Crypto", "Other"];

const TBILL_RATES = [
  { tenor: "91-day", rate: "25.8%" },
  { tenor: "182-day", rate: "27.2%" },
  { tenor: "364-day", rate: "29.4%" },
];

type Props = { userId: string; initialInvestments: Investment[] };

export default function InvestmentsClient({ userId, initialInvestments }: Props) {
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("T-bill");
  const [value, setValue] = useState("");
  const [rate, setRate] = useState("");
  const [maturity, setMaturity] = useState("");
  const [note, setNote] = useState("");

  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

  const total = investments.reduce((s, i) => s + i.value, 0);
  const byType: Record<string, number> = {};
  investments.forEach(i => { byType[i.type] = (byType[i.type] || 0) + i.value; });

  const openModal = () => {
    setName(""); setType("T-bill"); setValue(""); setRate(""); setMaturity(""); setNote("");
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !value || parseFloat(value) <= 0) { setError("Name and value are required"); return; }
    setLoading(true);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      const { data, error: err } = await supabase
        .from("investments")
        .insert({ user_id: userId, name, type, value: parseFloat(value), rate: rate || null, maturity: maturity || null, note: note || null })
        .select().single();
      if (err) throw err;
      setInvestments(prev => [data, ...prev]);
      setShowModal(false);
    } catch { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this holding?")) return;
    const supabase = (await import("../../lib/supabase")).createClient();
    await supabase.from("investments").delete().eq("id", id);
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#f4ecd8", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none" } as React.CSSProperties;
  const modalStyle = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Finance · Investments</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            Money that <em style={{ fontStyle: "italic", color: "#d4a947" }}>works</em> for you.
          </h1>
        </div>
        <button onClick={openModal} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ Add investment</button>
      </div>

      <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "radial-gradient(circle at 90% 10%, rgba(212,169,71,0.12) 0%, transparent 40%), #141414", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "28px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Total portfolio</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#d4a947", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "6px" }}>{fmt(total)}</div>
          <div style={{ fontSize: "13px", color: "#7a7468", marginBottom: "20px" }}>GHS · {investments.length} holdings</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", paddingTop: "16px", borderTop: "1px solid #1e1e1e" }}>
            {Object.entries(byType).map(([t, v]) => (
              <div key={t}>
                <div style={{ fontSize: "10px", color: "#7a7468", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>{t}</div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#f4ecd8" }}>{fmt(v)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Current T-bill rates</div>
          {TBILL_RATES.map(r => (
            <div key={r.tenor} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
              <div style={{ fontSize: "13px", color: "#999080" }}>{r.tenor}</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", fontStyle: "italic", color: "#d4a947" }}>{r.rate}</div>
            </div>
          ))}
          <div style={{ marginTop: "12px", fontSize: "11px", color: "#7a7468", lineHeight: 1.5 }}>
            Indicative rates · Verify at Bank of Ghana before investing
          </div>
        </div>
      </div>

      <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Your holdings</div>

        {investments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "48px", fontStyle: "italic", color: "#d4a947", opacity: 0.4, marginBottom: "12px" }}>I</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8", marginBottom: "8px" }}>No investments tracked</div>
            <p style={{ fontSize: "13px", color: "#7a7468", marginBottom: "20px" }}>T-bills, mutual funds, stocks, dollars. Track what is growing.</p>
            <button onClick={openModal} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Add your first investment</button>
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: "0", borderBottom: "1px solid #2a2a2a", paddingBottom: "10px", marginBottom: "4px" }}>
              {["Holding", "Type", "Rate", "Maturity", "Value (GHS)", ""].map(h => (
                <div key={h} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px" }}>{h}</div>
              ))}
            </div>
            {investments.map(inv => (
              <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: "0", padding: "14px 0", borderBottom: "1px solid #1e1e1e", alignItems: "center" }}>
                <div style={{ padding: "0 8px" }}>
                  <div style={{ fontSize: "14px", color: "#f4ecd8" }}>{inv.name}</div>
                  {inv.note && <div style={{ fontSize: "11px", color: "#7a7468", marginTop: "2px" }}>{inv.note}</div>}
                </div>
                <div style={{ padding: "0 8px" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", padding: "3px 8px", border: "1px solid #8a6f2e", borderRadius: "100px", background: "rgba(212,169,71,0.12)" }}>{inv.type}</span>
                </div>
                <div style={{ padding: "0 8px", fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#7aa87a" }}>{inv.rate || "—"}</div>
                <div style={{ padding: "0 8px", fontSize: "12px", color: "#999080" }}>{inv.maturity || "—"}</div>
                <div style={{ padding: "0 8px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: "#f4ecd8", fontWeight: 500 }}>{fmt(inv.value)}</div>
                <div style={{ padding: "0 8px" }}>
                  <button onClick={() => handleDelete(inv.id)} style={{ background: "transparent", border: "none", color: "#7a7468", cursor: "pointer", fontSize: "16px" }}>x</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={modalStyle} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "32px", maxWidth: "500px", width: "100%", position: "relative" }}>
            <div style={{ position: "absolute", top: "-1px", left: "40px", right: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4a947, transparent)" }} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "26px", color: "#f4ecd8", marginBottom: "6px" }}>
              Add <em style={{ fontStyle: "italic", color: "#d4a947" }}>investment</em>
            </h3>
            <p style={{ color: "#999080", fontSize: "13px", marginBottom: "24px" }}>Track T-bills, mutual funds, stocks, FX holdings.</p>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Holding name</label>
              <input type="text" placeholder="e.g. 91-day T-bill · Series 2026/04" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Type</label>
                <select value={type} onChange={e => setType(e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Value (GHS)</label>
                <input type="number" placeholder="0" value={value} onChange={e => setValue(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Rate / return</label>
                <input type="text" placeholder="e.g. 25.8%" value={rate} onChange={e => setRate(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Maturity</label>
                <input type="text" placeholder="e.g. 15 Jul 2026" value={maturity} onChange={e => setMaturity(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Note (optional)</label>
              <input type="text" placeholder="e.g. Auto-roll, monthly SIP" value={note} onChange={e => setNote(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
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
