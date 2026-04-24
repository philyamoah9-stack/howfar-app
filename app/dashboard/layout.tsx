import { createServerSupabaseClient } from "../lib/supabase-server";
import { redirect } from "next/navigation";
import MobileNav from "../components/MobileNav";
import "../dashboard-responsive.css";

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
    { label: "Habits", href: "/dashboard/habits" },
    { label: "Mind", href: "/dashboard/mind" },
    { label: "sikareads", href: "/dashboard/sikareads" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Desktop sidebar */}
      <aside style={{
        display: "none",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        width: "240px",
        background: "#141414",
        borderRight: "1px solid #1e1e1e",
        padding: "28px 20px",
        flexDirection: "column",
        zIndex: 50,
        overflowY: "auto",
      }} className="desktop-sidebar">
        <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "28px", padding: "0 10px" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8" }}>
            How <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
          </div>
        </a>

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
          <a key={item.label} href={item.href} style={{ display: "block", padding: "10px 12px", borderRadius: "10px", fontSize: "13px", color: "#999080", textDecoration: "none", marginBottom: "2px" }}>
            {item.label}
          </a>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
          <a href="/dashboard/settings" style={{ display: "block", padding: "10px 12px", borderRadius: "10px", fontSize: "13px", color: "#999080", textDecoration: "none", marginBottom: "2px" }}>
          Settings
        </a>
          <a href="/signout" style={{ display: "block", padding: "10px", background: "transparent", border: "1px solid #2a2a2a", color: "#7a7468", borderRadius: "10px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", textDecoration: "none" }}>
            Sign out
          </a>
        </div>
      </aside>

      {/* Mobile nav */}
      <MobileNav name={name} initial={initial} navItems={navItems} />

      {/* Main content */}
      <main className="dashboard-main">
        {children}
      </main>

      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar {
            display: flex !important;
          }
          .dashboard-main {
            margin-left: 240px;
          }
        }
        @media (max-width: 767px) {
          .dashboard-main {
            padding-top: 60px;
          }
          .dashboard-main > div {
            padding: 20px 16px !important;
          }
          .dash-grid-3 {
            grid-template-columns: 1fr !important;
          }
          .dash-grid-2 {
            grid-template-columns: 1fr !important;
          }
          .dash-grid-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
