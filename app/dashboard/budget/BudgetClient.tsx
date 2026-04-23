"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_COLORS, addTransaction, deleteTransaction } from "../../lib/db";

type Props = {
  userId: string;
  initialTransactions: Transaction[];
  month: string;
};

export default function BudgetClient({ userId, initialTransactions, month }: Props) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [txnType, setTxnType] = useState<"income" | "expense">("expense");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Calculations
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const saved = income - expenses;
  const savingsRate = income > 0 ? Math.round((saved / income) * 100) : 0;

  // Expense breakdown by category
  const byCat: Record<string, number> = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    byCat[t.category] = (byCat[t.category] || 0) + t.amount;
  });
  const catEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  const filtered = transactions.filter(t => filter === "all" || t.type === filter);

  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const monthLabel = new Date(month + "-01").toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const openModal = (type: "income" | "expense") => {
    setTxnType(type);
    setAmount("");
    setCategory(type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    setNote("");
    setDate(new Date().toISOString().slice(0, 10));
    setError("");
    setShowModal(true);
  };

const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) { setError("Enter a valid amount"); return; }
    setLoading(true);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      const { data, error: saveError } = await supabase
        .from("transactions")
        .insert({
          type: txnType,
          amount: parseFloat(amount),
          category,
          note: note || null,
          date,
          user_id: userId,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Update local state immediately
      setTransactions(prev => [data, ...prev]);
      setShowModal(false);
    } catch {
      setError("Failed to save. Try again.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    color: "#f4ecd8",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
  } as React.CSSProperties;

  return (
    <div style={{ padding: "40px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Finance · Budget</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            Your <em style={{ fontStyle: "italic", color: "#d4a947" }}>money</em>, {monthLabel}.
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => openModal("income")} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#f4ecd8", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            + Income
          </button>
          <button onClick={() => openModal("expense")} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            + Expense
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Income this month", value: fmt(income), color: "#7aa87a" },
          { label: "Expenses this month", value: fmt(expenses), color: "#c85a5a" },
          { label: "Saved · Savings rate", value: fmt(saved), sub: `${Math.max(0, savingsRate)}% savings rate`, color: "#d4a947" },
        ].map((card) => (
          <div key={card.label} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>{card.label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: card.color, letterSpacing: "-0.02em", marginBottom: "4px" }}>
              {card.value} <span style={{ fontSize: "14px", color: "#7a7468" }}>GHS</span>
            </div>
            {card.sub && <div style={{ fontSize: "12px", color: "#d4a947" }}>{card.sub}</div>}
          </div>
        ))}
      </div>

      {/* Savings rate bar */}
      <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase" }}>Savings rate</div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947" }}>{Math.max(0, savingsRate)}% of {fmt(income)} GHS</div>
        </div>
        <div style={{ height: "6px", background: "#2a2a2a", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, (savingsRate / 20) * 100))}%`, background: "linear-gradient(90deg, #8a6f2e, #d4a947)", borderRadius: "3px", transition: "width 0.6s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468" }}>
          <span>0%</span><span>Target: 20%</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>
        {/* Transactions */}
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase" }}>Transactions · {monthLabel}</div>
            <div style={{ display: "flex", gap: "4px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "100px", padding: "4px" }}>
              {(["all", "income", "expense"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", background: filter === f ? "#d4a947" : "transparent", color: filter === f ? "#0a0a0a" : "#999080", border: "none", borderRadius: "100px", fontSize: "11px", fontWeight: 500, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#7a7468" }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "40px", fontStyle: "italic", color: "#d4a947", opacity: 0.4, marginBottom: "12px" }}>₵</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#f4ecd8", marginBottom: "6px" }}>No transactions yet</div>
              <div style={{ fontSize: "13px", marginBottom: "16px" }}>Start by adding your monthly income.</div>
              <button onClick={() => openModal("income")} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                Add income
              </button>
            </div>
          ) : (
            <div>
              {filtered.map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1e1e1e" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: CATEGORY_COLORS[t.category] || "#7a7468", flexShrink: 0, display: "inline-block" }} />
                    <div>
                      <div style={{ fontSize: "14px", color: "#f4ecd8" }}>{t.category}</div>
                      <div style={{ fontSize: "11px", color: "#7a7468", marginTop: "2px" }}>{fmtDate(t.date)}{t.note ? ` · ${t.note}` : ""}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: t.type === "income" ? "#7aa87a" : "#c85a5a", fontWeight: 500 }}>
                      {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                    </div>
                    <button onClick={() => handleDelete(t.id)} style={{ background: "transparent", border: "none", color: "#7a7468", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "0 4px" }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense breakdown */}
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Where your money went</div>

          {catEntries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "#7a7468", fontSize: "13px" }}>
              Add expenses to see the breakdown
            </div>
          ) : (
            <div>
              {catEntries.map(([cat, val]) => (
                <div key={cat} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#f4ecd8" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: CATEGORY_COLORS[cat] || "#7a7468", display: "inline-block" }} />
                      {cat}
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#999080" }}>{fmt(val)}</span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947" }}>{Math.round((val / expenses) * 100)}%</span>
                    </div>
                  </div>
                  <div style={{ height: "4px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.round((val / expenses) * 100)}%`, background: CATEGORY_COLORS[cat] || "#7a7468", borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "32px", maxWidth: "480px", width: "100%", position: "relative" }}>
            <div style={{ position: "absolute", top: "-1px", left: "40px", right: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4a947, transparent)" }} />

            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "26px", letterSpacing: "-0.02em", color: "#f4ecd8", marginBottom: "6px" }}>
              Add <em style={{ fontStyle: "italic", color: "#d4a947" }}>{txnType}</em>
            </h3>
            <p style={{ color: "#999080", fontSize: "13px", marginBottom: "24px" }}>
              {txnType === "income" ? "Log it honestly. Every cedi counts." : "Track it clearly. Small amounts add up."}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Amount (GHS)</label>
                <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                {(txnType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Note (optional)</label>
              <input type="text" placeholder="e.g. MTN data bundle" value={note} onChange={e => setNote(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            </div>

            {error && (
              <div style={{ padding: "12px 16px", background: "rgba(200,90,90,0.1)", border: "1px solid rgba(200,90,90,0.3)", borderRadius: "10px", color: "#c85a5a", fontSize: "13px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>
                Cancel
              </button>
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