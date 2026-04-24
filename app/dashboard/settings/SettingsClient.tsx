"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  name: string;
  age: number;
  retire_age: number;
  monthly_income: number;
  current_savings: number;
  faith_mode: boolean;
  currency: string;
};

type Props = { userId: string; email: string; profile: Profile | null };

export default function SettingsClient({ userId, email, profile }: Props) {
  const router = useRouter();
  const [name, setName] = useState(profile?.name || "");
  const [faithMode, setFaithMode] = useState(profile?.faith_mode || false);
  const [currency, setCurrency] = useState(profile?.currency || "GHS");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      await supabase.from("profiles").update({ name, faith_mode: faithMode, currency }).eq("id", userId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("This will permanently delete your account and all your data. This cannot be undone. Are you absolutely sure?")) return;
    const supabase = (await import("../../lib/supabase")).createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#f4ecd8", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none" } as React.CSSProperties;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "28px", marginBottom: "16px" }}>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{ padding: "40px 48px", maxWidth: "720px" }}>
      <div style={{ marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e" }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Settings</div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
          Your <em style={{ fontStyle: "italic", color: "#d4a947" }}>preferences</em>.
        </h1>
      </div>

      <Section title="Profile">
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Display name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
        </div>
        <div>
          <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Email address</label>
          <input type="email" value={email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
          <div style={{ fontSize: "11px", color: "#7a7468", marginTop: "6px" }}>Email cannot be changed here. Contact support if needed.</div>
        </div>
      </Section>

      <Section title="Preferences">
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Default currency</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["GHS", "USD", "EUR", "GBP"].map(c => (
              <button key={c} onClick={() => setCurrency(c)} style={{ padding: "10px 20px", background: currency === c ? "#d4a947" : "#0a0a0a", border: "1px solid " + (currency === c ? "#d4a947" : "#2a2a2a"), borderRadius: "100px", color: currency === c ? "#0a0a0a" : "#999080", fontSize: "13px", fontWeight: currency === c ? 600 : 400, cursor: "pointer", fontFamily: "JetBrains Mono, monospace" }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: "#7a7468", marginTop: "8px" }}>GHS is the default. USD and other currencies are supported across all modules.</div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>Faith mode</div>
              <div style={{ fontSize: "13px", color: "#f4ecd8", marginBottom: "2px" }}>Scripture-based journal prompts and stewardship framing</div>
              <div style={{ fontSize: "11px", color: "#7a7468" }}>Affects journal prompts, retirement quotes, and focus cards</div>
            </div>
            <button onClick={() => setFaithMode(!faithMode)} style={{ width: "52px", height: "28px", borderRadius: "14px", background: faithMode ? "#d4a947" : "#2a2a2a", border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f4ecd8", position: "absolute", top: "4px", transition: "left 0.3s", left: faithMode ? "28px" : "4px" }} />
            </button>
          </div>
        </div>
      </Section>

      <Section title="Retirement plan">
        <div style={{ fontSize: "13px", color: "#999080", lineHeight: 1.6, marginBottom: "16px" }}>
          Update your retirement horizon, income, and savings from the Retirement module.
        </div>
        <a href="/dashboard/retirement" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "transparent", border: "1px solid #2a2a2a", color: "#f4ecd8", borderRadius: "100px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
          Go to Retirement
        </a>
      </Section>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
        <button onClick={handleSave} disabled={saving} style={{ padding: "14px 32px", background: saving ? "#8a6f2e" : saved ? "#7aa87a" : "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save changes"}
        </button>
      </div>

      <Section title="Danger zone">
        <div style={{ fontSize: "13px", color: "#999080", lineHeight: 1.6, marginBottom: "16px" }}>
          Permanently delete your account and all your data. This action cannot be undone.
        </div>
        <button onClick={() => setShowDelete(!showDelete)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(200,90,90,0.4)", color: "#c85a5a", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>
          Delete account
        </button>
        {showDelete && (
          <div style={{ marginTop: "16px", padding: "16px", background: "rgba(200,90,90,0.08)", border: "1px solid rgba(200,90,90,0.3)", borderRadius: "12px" }}>
            <div style={{ fontSize: "13px", color: "#c85a5a", marginBottom: "12px", fontWeight: 500 }}>Are you sure? This deletes everything permanently.</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowDelete(false)} style={{ padding: "8px 18px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "100px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDeleteAccount} style={{ padding: "8px 18px", background: "#c85a5a", border: "none", color: "#fff", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Yes, delete my account</button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
