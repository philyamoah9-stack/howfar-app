const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'dashboard', 'networth');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const pageContent = `import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import NetWorthClient from "./NetWorthClient";

export default async function NetWorthPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: assets }, { data: liabilities }] = await Promise.all([
    supabase.from("assets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("liabilities").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  return <NetWorthClient userId={user.id} initialAssets={assets || []} initialLiabilities={liabilities || []} />;
}
`;

const clientContent = `"use client";

import { useState } from "react";

type Asset = { id: string; name: string; value: number; currency: string; category: string; };
type Liability = { id: string; name: string; value: number; category: string; };

const ASSET_CATEGORIES = ["Liquid", "Investment", "FX", "Property", "Vehicle", "Business", "Other"];
const LIABILITY_CATEGORIES = ["Bank loan", "Credit card", "MoMo loan", "Family loan", "Susu", "Mortgage", "Other"];
const CURRENCIES = ["GHS", "USD", "EUR", "GBP"];
const FX: Record<string, number> = { GHS: 1, USD: 15.5, EUR: 16.8, GBP: 19.6 };

type Props = { userId: string; initialAssets: Asset[]; initialLiabilities: Liability[]; };

export default function NetWorthClient({ userId, initialAssets, initialLiabilities }: Props) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [liabilities, setLiabilities] = useState<Liability[]>(initialLiabilities);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"asset" | "liability">("asset");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aName, setAName] = useState("");
  const [aValue, setAValue] = useState("");
  const [aCurrency, setACurrency] = useState("GHS");
  const [aCategory, setACategory] = useState("Liquid");

  const toGHS = (value: number, currency: string) => value * (FX[currency] || 1);
  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

  const totalAssets = assets.reduce((s, a) => s + toGHS(a.value, a.currency), 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const openModal = (type: "asset" | "liability") => {
    setModalType(type);
    setAName(""); setAValue(""); setACurrency("GHS"); setACategory(type === "asset" ? "Liquid" : "Bank loan");
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    if (!aName.trim() || !aValue || parseFloat(aValue) <= 0) { setError("Fill in all fields"); return; }
    setLoading(true);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      const table = modalType === "asset" ? "assets" : "liabilities";
      const payload = modalType === "asset"
        ? { user_id: userId, name: aName, value: parseFloat(aValue), currency: aCurrency, category: aCategory }
        : { user_id: userId, name: aName, value: parseFloat(aValue), category: aCategory };
      const { data, error: err } = await supabase.from(table).insert(payload).select().single();
      if (err) throw err;
      if (modalType === "asset") setAssets(prev => [data, ...prev]);
      else setLiabilities(prev => [data, ...prev]);
      setShowModal(false);
    } catch { setError("Failed to save. Try again."); }
    setLoading(false);
  };

  const handleDelete = async (id: string, type: "asset" | "liability") => {
    if (!confirm("Delete this entry?")) return;
    const supabase = (await import("../../lib/supabase")).createClient();
    const table = type === "asset" ? "assets" : "liabilities";
    await supabase.from(table).delete().eq("id", id);
    if (type === "asset") setAssets(prev => prev.filter(a => a.id !== id));
    else setLiabilities(prev => prev.filter(l => l.id !== id));
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#f4ecd8", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none" } as React.CSSProperties;
  const modalStyle = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
  const goldLine = { position: "absolute" as const, top: "-1px", left: "40px", right: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4a947, transparent)" };

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Finance · Net Worth</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            What you <em style={{ fontStyle: "italic", color: "#d4a947" }}>actually</em> own.
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => openModal("liability")} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#f4ecd8", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ Debt</button>
          <button onClick={() => openModal("asset")} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ Asset</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "radial-gradient(circle at 90% 10%, rgba(212,169,71,0.12) 0%, transparent 40%), #141414", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "28px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Net worth</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: netWorth >= 0 ? "#d4a947" : "#c85a5a", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "6px" }}>
            {fmt(Math.abs(netWorth))}
          </div>
          <div style={{ fontSize: "13px", color: "#7a7468" }}>GHS {netWorth < 0 ? "deficit" : "total"}</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7aa87a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Assets</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: "#7aa87a", letterSpacing: "-0.02em", marginBottom: "4px" }}>{fmt(totalAssets)}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>{assets.length} items tracked</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#c85a5a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Liabilities</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: "#c85a5a", letterSpacing: "-0.02em", marginBottom: "4px" }}>{fmt(totalLiabilities)}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>{liabilities.length} items tracked</div>
        </div>
      </div>

      {assets.some(a => a.currency !== "GHS") && (
        <div style={{ padding: "12px 16px", background: "rgba(212,169,71,0.06)", border: "1px solid #8a6f2e", borderRadius: "10px", fontSize: "12px", color: "#7a7468", marginBottom: "24px" }}>
          USD converted at ~15.5 · EUR at ~16.8 · GBP at ~19.6 · Indicative rates, update as needed
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase" }}>Assets</div>
            <button onClick={() => openModal("asset")} style={{ background: "transparent", border: "none", color: "#d4a947", fontSize: "12px", cursor: "pointer" }}>+ Add</button>
          </div>
          {assets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "#7a7468", fontSize: "13px" }}>No assets yet. Add cash, investments, property.</div>
          ) : (
            assets.map(a => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1e1e1e" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "#f4ecd8" }}>{a.name}</div>
                  <div style={{ fontSize: "11px", color: "#7a7468", marginTop: "2px" }}>
                    {a.category}{a.currency !== "GHS" ? " · " + a.currency + " " + fmt(a.value) : ""}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: "#7aa87a" }}>{fmt(toGHS(a.value, a.currency))}</div>
                  <button onClick={() => handleDelete(a.id, "asset")} style={{ background: "transparent", border: "none", color: "#7a7468", cursor: "pointer", fontSize: "16px" }}>x</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase" }}>Liabilities</div>
            <button onClick={() => openModal("liability")} style={{ background: "transparent", border: "none", color: "#d4a947", fontSize: "12px", cursor: "pointer" }}>+ Add</button>
          </div>
          {liabilities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "#7a7468", fontSize: "13px" }}>No liabilities tracked. Add loans, debts, obligations.</div>
          ) : (
            liabilities.map(l => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1e1e1e" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "#f4ecd8" }}>{l.name}</div>
                  <div style={{ fontSize: "11px", color: "#7a7468", marginTop: "2px" }}>{l.category}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: "#c85a5a" }}>{fmt(l.value)}</div>
                  <button onClick={() => handleDelete(l.id, "liability")} style={{ background: "transparent", border: "none", color: "#7a7468", cursor: "pointer", fontSize: "16px" }}>x</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div style={modalStyle} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "32px", maxWidth: "480px", width: "100%", position: "relative" }}>
            <div style={goldLine} />
            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "26px", color: "#f4ecd8", marginBottom: "6px" }}>
              Add <em style={{ fontStyle: "italic", color: "#d4a947" }}>{modalType}</em>
            </h3>
            <p style={{ color: "#999080", fontSize: "13px", marginBottom: "24px" }}>
              {modalType === "asset" ? "Something you own." : "Something you owe."}
            </p>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Name</label>
              <input type="text" placeholder={modalType === "asset" ? "e.g. GCB savings account" : "e.g. Bank loan"} value={aName} onChange={e => setAName(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Value</label>
                <input type="number" placeholder="0" value={aValue} onChange={e => setAValue(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
              {modalType === "asset" ? (
                <div>
                  <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Currency</label>
                  <select value={aCurrency} onChange={e => setACurrency(e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Category</label>
                  <select value={aCategory} onChange={e => setACategory(e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                    {LIABILITY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>
            {modalType === "asset" && (
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Category</label>
                <select value={aCategory} onChange={e => setACategory(e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                  {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
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
`;

fs.writeFileSync(path.join(dir, 'page.tsx'), pageContent, 'utf8');
fs.writeFileSync(path.join(dir, 'NetWorthClient.tsx'), clientContent, 'utf8');
console.log('Done: networth pages created');