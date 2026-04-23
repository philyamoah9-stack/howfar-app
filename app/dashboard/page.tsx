import { createServerSupabaseClient } from "../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const name = profile?.name || "Friend";
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  const cards = [
    { label: "How Far? score", value: "—", sub: "Add data to calculate" },
    { label: "Retirement", value: "— years", sub: "Set your horizon" },
    { label: "Net worth", value: "GHS 0", sub: "Add your assets" },
  ];

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ marginBottom: "40px", paddingBottom: "24px", borderBottom: "1px solid #1e1e1e" }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>
          {today} · Accra
        </div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "42px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
          Akwaaba, <em style={{ fontStyle: "italic", color: "#d4a947" }}>{name}</em>.
        </h1>
      </div>

      <div style={{ padding: "32px", background: "rgba(212,169,71,0.06)", border: "1px solid #8a6f2e", borderRadius: "16px", marginBottom: "32px" }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>
          Welcome to How Far?
        </div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "22px", fontWeight: 300, color: "#f4ecd8", marginBottom: "12px" }}>
          Your journey starts here.
        </div>
        <p style={{ fontSize: "14px", color: "#999080", lineHeight: 1.6 }}>
          The finance pillar is ready. Start by adding your first transaction, setting a goal, or checking your retirement horizon.
        </p>
      </div>

      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
              {card.label}
            </div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: "#d4a947", letterSpacing: "-0.02em", marginBottom: "6px" }}>
              {card.value}
            </div>
            <div style={{ fontSize: "12px", color: "#7a7468" }}>{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}