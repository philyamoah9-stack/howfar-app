import { createServerSupabaseClient } from "../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const name = profile?.name || "Friend";
  const initial = name.charAt(0).toUpperCase();

  const navItems = [
    { label: "Overview", href: "/dashboard" },
    { label: "Budget", href: "/dashboard/budget" },
    { label: "Goals", href: "/dashboard/goals" },
    { label: "Net Worth", href: "/dashboard/networth" },
    { label: "Retirement", href: "/dashboard/retirement" },
    { label: "Investments", href: "/dashboard/investments" },
    { label: "Debt", href: "/dashboard/debt" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "grid", gridTemplateColumns: "240px 1fr" }}>
      <aside style={{ background: "#141414", borderRight: "1px solid #1e1e1e", padding: "28px 20px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8", marginBottom: "28px", padding: "0 10px" }}>
          How <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", background: "#1a1a1a", border: "1px solid #2a2a2a", marginBottom: "28px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #d4a947, #8a6f2e)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces, serif", fontWeight: 500, color: "#0a0a0a", fontSize: "15px", flexShrink: 0 }}>
            {initial}
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#f4ecd8", fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: "10px", color: "#d4a947", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>Founding beta</div>
          </div>
        </div>

        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#7a7468", textTransform: "uppercase", margin: "0 12px 8px" }}>Finance</div>

        {navItems.map((item) => (
          <a key={item.label} href={item.href} style={{display:"block",padding:"10px 12px",borderRadius:"10px",fontSize:"13px",color:"#999080",textDecoration:"none",marginBottom:"2px"}}>
            {item.label}
          </a>
        ))}

        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#7a7468", textTransform: "uppercase", margin: "24px 12px 8px" }}>Coming soon</div>
        {["Habits", "Mind", "sikareads"].map((item) => (
          <div key={item} style={{ padding: "10px 12px", fontSize: "13px", color: "#7a7468", opacity: 0.5 }}>{item}</div>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
          <a href="/signout" style={{ display: "block", padding: "10px", background: "transparent", border: "1px solid #2a2a2a", color: "#7a7468", borderRadius: "10px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", textDecoration: "none" }}>
            Sign out
          </a>
        </div>
      </aside>

      <main>{children}</main>
    </div>
  );
}