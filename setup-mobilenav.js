const fs = require('fs');
const path = require('path');

const content = `"use client";

import { useState } from "react";

type NavItem = { label: string; href: string };
type Props = { name: string; initial: string; navItems: NavItem[] };

export default function MobileNav({ name, initial, navItems }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile topbar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "60px",
        background: "rgba(20,20,20,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1e1e1e", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
      }} className="mobile-topbar">
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8" }}>
          How <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
        </div>
        <button onClick={() => setOpen(true)} style={{
          background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f4ecd8",
          width: "40px", height: "40px", borderRadius: "10px", fontSize: "18px",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>☰</button>
      </div>

      {/* Drawer overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)", zIndex: 200,
        }} />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: "280px",
        background: "#141414", borderRight: "1px solid #1e1e1e",
        padding: "28px 20px", zIndex: 300, overflowY: "auto",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8" }}>
            How <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
          </div>
          <button onClick={() => setOpen(false)} style={{
            background: "transparent", border: "none", color: "#7a7468",
            fontSize: "24px", cursor: "pointer", lineHeight: 1,
          }}>×</button>
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
          <a key={item.label} href={item.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "12px", borderRadius: "10px", fontSize: "14px", color: "#999080", textDecoration: "none", marginBottom: "2px" }}>
            {item.label}
          </a>
        ))}

        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#7a7468", textTransform: "uppercase", margin: "24px 12px 8px" }}>Coming soon</div>
        {["Habits", "Mind", "sikareads"].map((item) => (
          <div key={item} style={{ padding: "12px", fontSize: "14px", color: "#7a7468", opacity: 0.5 }}>{item}</div>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
          <a href="/signout" style={{ display: "block", padding: "12px", background: "transparent", border: "1px solid #2a2a2a", color: "#7a7468", borderRadius: "10px", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", textDecoration: "none" }}>
            Sign out
          </a>
        </div>
      </div>

      <style>{\`
        @media (min-width: 768px) {
          .mobile-topbar { display: none !important; }
        }
      \`}</style>
    </>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'app', 'components', 'MobileNav.tsx'), content, 'utf8');
console.log('Done: MobileNav.tsx');