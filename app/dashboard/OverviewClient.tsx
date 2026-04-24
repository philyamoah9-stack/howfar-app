"use client";

import { useState, useEffect } from "react";

type Profile = {
  id: string; name: string; age: number; retire_age: number;
  monthly_income: number; current_savings: number; faith_mode: boolean;
};
type Transaction = { id: string; type: string; amount: number; category: string; date: string; note: string; };
type Goal = { id: string; name: string; target: number; saved: number; deadline: string; };
type Asset = { id: string; value: number; currency: string; };
type Liability = { id: string; value: number; };
type Debt = { id: string; balance: number; monthly: number; };
type Habit = { id: string; };
type HabitLog = { habit_id: string; date: string; completed: boolean; };

type Props = {
  profile: Profile | null;
  transactions: Transaction[];
  goals: Goal[];
  assets: Asset[];
  liabilities: Liability[];
  debts: Debt[];
  month: string;
  habits: Habit[];
  habitLogs: HabitLog[];
  journalEntries: { date: string }[];
};

const FX: Record<string, number> = { GHS: 1, USD: 15.5, EUR: 16.8, GBP: 19.6 };

export default function OverviewClient({ profile, transactions, goals, assets, liabilities, debts, month, habits, habitLogs, journalEntries }: Props) {
  const [countdown, setCountdown] = useState({ years: 0, months: 0, days: 0, hours: 0 });
  const name = profile?.name || "Friend";
  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
  const today = new Date().toISOString().slice(0, 10);
  const todayLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const monthLabel = new Date(month + "-01").toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  useEffect(() => {
    if (!profile?.age || !profile?.retire_age) return;
    const tick = () => {
      const now = new Date();
      const target = new Date();
      target.setFullYear(now.getFullYear() + Math.max(0, profile.retire_age - profile.age));
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
  }, [profile]);

  // Cashflow
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const saved = income - expenses;
  const savingsRate = income > 0 ? Math.round((saved / income) * 100) : 0;

  // Net worth
  const totalAssets = assets.reduce((s, a) => s + (a.value * (FX[(a as any).currency] || 1)), 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  // Retirement
  const workingYears = profile ? Math.max(0, profile.retire_age - profile.age) : 0;
  const corpus = (profile?.monthly_income || 0) * 12 * 0.7 * 25;
  const monthlyRate = 0.08 / 12;
  const retireMonths = workingYears * 12;
  const currentFV = (profile?.current_savings || 0) * Math.pow(1 + monthlyRate, retireMonths);
  const retirePct = corpus > 0 ? Math.min(100, Math.max(0, Math.round((currentFV / corpus) * 100))) : 0;

  // Goals
  const totalGoalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalGoalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const goalsPct = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 0;

  // Debt
  const totalMonthlyDebt = debts.reduce((s, d) => s + (d.monthly || 0), 0);
  const dtiRatio = (profile?.monthly_income || 0) > 0 ? Math.round((totalMonthlyDebt / profile!.monthly_income) * 100) : 0;
  const debtScore = Math.max(0, 10 - Math.round(dtiRatio * 0.3));

  // Habits score (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
  const habitsScore = habits.length > 0
    ? Math.round((last7.filter(date =>
        habits.some(h => habitLogs.some(l => l.habit_id === h.id && l.date === date && l.completed))
      ).length / 7) * 100)
    : 0;

  // Finance score
  const financeScore = Math.min(100, Math.round(
    Math.min(25, savingsRate) +
    (goalsPct * 0.2) +
    Math.min(25, netWorth > 0 ? Math.round(netWorth / (profile?.monthly_income || 1)) : 0) +
    (retirePct * 0.2) +
    debtScore
  ));

// Mind score (journal entries last 7 days)
  const mindScore = Math.round((journalEntries.length / 7) * 100);

  // How Far? score - finance + habits + mind
  const howFarScore = Math.min(100, Math.round(
    (financeScore * 0.6) +
    (habitsScore * 0.25) +
    (mindScore * 0.15)
  ));

  // Weekly focus
  const getFocus = () => {
    if (habits.length > 0 && habitsScore < 50) return { text: "Your habit completion is below 50% this week. Pick one habit and protect it.", action: "Check habits", href: "/dashboard/habits" };
    if (goals.length === 0) return { text: "Set up your first goal to see your week come together.", action: "Add a goal", href: "/dashboard/goals" };
    if (income === 0) return { text: "Log this month's income to start tracking your savings rate.", action: "Add income", href: "/dashboard/budget" };
    if (savingsRate < 10 && income > 0) return { text: "Your savings rate is below 10%. Small cuts add up faster than you think.", action: "Review budget", href: "/dashboard/budget" };
    const closest = [...goals].sort((a, b) => (a.saved / a.target) - (b.saved / b.target))[0];
    const remaining = closest.target - closest.saved;
    const monthsLeft = Math.max(1, Math.round((new Date(closest.deadline).getTime() - Date.now()) / (30.44 * 24 * 60 * 60 * 1000)));
    return { text: `Close the gap on your ${closest.name}. About GHS ${fmt(Math.round(remaining / monthsLeft))}/month gets you there on time.`, action: "Update goal", href: "/dashboard/goals" };
  };
  const focus = getFocus();

  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const quotes = profile?.faith_mode ? [
    { t: "\"The plans of the diligent lead surely to abundance.\"", a: "— Proverbs 21:5" },
    { t: "\"Commit your work to the Lord, and your plans will be established.\"", a: "— Proverbs 16:3" },
  ] : [
    { t: "\"The man who moves a mountain begins by carrying away small stones.\"", a: "— Confucius" },
    { t: "\"Time is your most honest currency. Spend it like you mean it.\"", a: "— How Far?" },
  ];
  const quote = quotes[Math.floor(Date.now() / 86400000) % quotes.length];
  const cardStyle = (extra = {}) => ({ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px", ...extra });

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>{todayLabel} · Accra</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "42px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            Akwaaba, <em style={{ fontStyle: "italic", color: "#d4a947" }}>{name}</em>.
          </h1>
        </div>
        <div style={{ textAlign: "right", maxWidth: "300px" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "13px", color: "#999080", lineHeight: 1.4 }}>{quote.t}</div>
          <div style={{ fontSize: "10px", color: "#7a7468", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "6px" }}>{quote.a}</div>
        </div>
      </div>

      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "radial-gradient(circle at 90% 10%, rgba(212,169,71,0.12) 0%, transparent 40%), #141414", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "28px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>Your How Far? score</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "80px", lineHeight: 1, color: "#d4a947", letterSpacing: "-0.04em" }}>{howFarScore}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "28px", color: "#7a7468", fontWeight: 300 }}>/100</div>
          </div>
          <div style={{ display: "flex", gap: "2px", height: "5px", marginBottom: "16px" }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ flex: 1, background: i < Math.round(howFarScore / 10) ? "#d4a947" : "#2a2a2a", borderRadius: "2px" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingTop: "16px", borderTop: "1px solid #1e1e1e" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", paddingTop: "16px", borderTop: "1px solid #1e1e1e" }}>
            <div>
              <div style={{ fontSize: "10px", color: "#7a7468", letterSpacing: "0.08em", textTransform: "uppercase" }}>Finance</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#f4ecd8", marginTop: "4px" }}>{financeScore}<em style={{ color: "#d4a947", fontStyle: "italic", fontSize: "12px" }}>%</em></div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "#7a7468", letterSpacing: "0.08em", textTransform: "uppercase" }}>Habits</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#f4ecd8", marginTop: "4px" }}>{habitsScore}<em style={{ color: "#d4a947", fontStyle: "italic", fontSize: "12px" }}>%</em></div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "#7a7468", letterSpacing: "0.08em", textTransform: "uppercase" }}>Mind</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#f4ecd8", marginTop: "4px" }}>{mindScore}<em style={{ color: "#d4a947", fontStyle: "italic", fontSize: "12px" }}>%</em></div>
            </div>
          </div>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>Retirement · How far?</div>
          {profile?.age && profile?.retire_age ? (
            <>
              <div style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "44px", color: "#f4ecd8", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "6px" }}>
                {countdown.years}y <em style={{ fontStyle: "italic", color: "#d4a947", fontSize: "0.65em" }}>{countdown.months}m</em>
              </div>
              <div style={{ fontSize: "12px", color: "#999080", marginBottom: "16px" }}>To age {profile.retire_age} · {retirePct}% ready</div>
              <div style={{ height: "4px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ height: "100%", width: retirePct + "%", background: "linear-gradient(90deg, #8a6f2e, #d4a947)", borderRadius: "2px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468" }}>
                <span>Age {profile.age}</span><span>{profile.retire_age}</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "13px", color: "#7a7468", marginBottom: "12px" }}>Set your retirement horizon</div>
              <a href="/dashboard/retirement" style={{ padding: "8px 16px", background: "#d4a947", color: "#0a0a0a", borderRadius: "100px", textDecoration: "none", fontSize: "12px", fontWeight: 600 }}>Set up now</a>
            </div>
          )}
        </div>

        <div style={cardStyle()}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>Net worth</div>
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", color: netWorth >= 0 ? "#f4ecd8" : "#c85a5a", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "4px" }}>
            {fmt(Math.abs(netWorth))}
          </div>
          <div style={{ fontSize: "12px", color: "#7a7468", marginBottom: "16px" }}>GHS {netWorth < 0 ? "deficit" : "total"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", paddingTop: "14px", borderTop: "1px solid #1e1e1e" }}>
            <div>
              <div style={{ fontSize: "10px", color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.08em" }}>Assets</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#7aa87a", marginTop: "4px" }}>{fmt(totalAssets)}</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.08em" }}>Debts</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#c85a5a", marginTop: "4px" }}>-{fmt(totalLiabilities)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={cardStyle()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase" }}>Active goals · {goals.length}</div>
            <a href="/dashboard/goals" style={{ color: "#d4a947", fontSize: "12px", textDecoration: "none" }}>All goals</a>
          </div>
          {goals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "13px", color: "#7a7468", marginBottom: "12px" }}>No goals yet.</div>
              <a href="/dashboard/goals" style={{ padding: "8px 16px", background: "#d4a947", color: "#0a0a0a", borderRadius: "100px", textDecoration: "none", fontSize: "12px", fontWeight: 600 }}>Add a goal</a>
            </div>
          ) : (
            goals.slice(0, 3).map(g => {
              const pct = Math.round((g.saved / g.target) * 100);
              return (
                <div key={g.id} style={{ paddingBottom: "14px", marginBottom: "14px", borderBottom: "1px solid #1e1e1e" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontFamily: "Fraunces, serif", fontSize: "15px", fontStyle: "italic", color: "#d4a947" }}>{g.name}</div>
                      <div style={{ fontSize: "11px", color: "#7a7468", marginTop: "2px" }}>GHS {fmt(g.saved)} of {fmt(g.target)}</div>
                    </div>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: "#d4a947" }}>{Math.min(100, pct)}%</div>
                  </div>
                  <div style={{ height: "3px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: Math.min(100, pct) + "%", background: "#d4a947", borderRadius: "2px" }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "radial-gradient(circle at 0% 0%, rgba(212,169,71,0.1) 0%, transparent 50%), #141414", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "22px", flex: 1 }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px" }}>This week's focus</div>
            <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "17px", fontWeight: 300, color: "#f4ecd8", lineHeight: 1.4, marginBottom: "20px" }}>{focus.text}</div>
            <div style={{ paddingTop: "14px", borderTop: "1px solid #1e1e1e", display: "flex", justifyContent: "flex-end" }}>
              <a href={focus.href} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>{focus.action}</a>
            </div>
          </div>

          <div style={cardStyle()}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px" }}>Cashflow · {monthLabel}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { label: "In", value: fmt(income), color: "#7aa87a" },
                { label: "Out", value: fmt(expenses), color: "#c85a5a" },
                { label: "Saved", value: fmt(Math.max(0, saved)), color: "#d4a947" },
              ].map(item => (
                <div key={item.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: item.color, fontWeight: 300 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ height: "4px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden", marginTop: "12px" }}>
              <div style={{ height: "100%", width: Math.min(100, Math.max(0, (savingsRate / 20) * 100)) + "%", background: "linear-gradient(90deg, #8a6f2e, #d4a947)", borderRadius: "2px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468" }}>
              <span>{Math.max(0, savingsRate)}% savings rate</span><span>Target: 20%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={cardStyle()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase" }}>Recent activity</div>
          <a href="/dashboard/budget" style={{ color: "#d4a947", fontSize: "12px", textDecoration: "none" }}>All transactions</a>
        </div>
        {recent.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", fontSize: "13px", color: "#7a7468" }}>
            No transactions yet. <a href="/dashboard/budget" style={{ color: "#d4a947", textDecoration: "none" }}>Add your first</a>
          </div>
        ) : (
          recent.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.type === "income" ? "#7aa87a" : "#c85a5a", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "14px", color: "#f4ecd8" }}>{t.category}</div>
                  <div style={{ fontSize: "11px", color: "#7a7468", marginTop: "2px" }}>{new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}{t.note ? " · " + t.note : ""}</div>
                </div>
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: t.type === "income" ? "#7aa87a" : "#c85a5a", fontWeight: 500 }}>
                {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
