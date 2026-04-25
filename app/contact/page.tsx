"use client";

import { useState } from "react";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "YOUR_WEB3FORMS_KEY",
          name,
          email,
          subject: subject || "How Far? Contact Form",
          message,
          from_name: "How Far? Contact Form",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setName(""); setEmail(""); setSubject(""); setMessage("");
      } else {
        setError("Something went wrong. Please email us directly at support@yourhowfar.com");
      }
    } catch {
      setError("Could not send. Please email us directly at support@yourhowfar.com");
    }
    setSending(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    color: "#f4ecd8",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const topics = [
    { icon: "?", label: "General question", value: "General question about How Far?" },
    { icon: "!", label: "Report a bug", value: "Bug report" },
    { icon: "$", label: "Billing", value: "Billing enquiry" },
    { icon: "i", label: "Feature request", value: "Feature request" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: "64px", background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1e1e1e", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#f4ecd8", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "8px", height: "8px", background: "#d4a947", borderRadius: "50%", boxShadow: "0 0 12px #d4a947", display: "inline-block" }} />
            How <em style={{ fontStyle: "italic", color: "#d4a947", marginLeft: "6px" }}>Far?</em>
          </div>
        </a>
        <a href="/dashboard" style={{ padding: "8px 20px", background: "#d4a947", color: "#0a0a0a", borderRadius: "100px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
          Go to dashboard
        </a>
      </nav>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "120px 40px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "60px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>
            Support
          </div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "52px", color: "#f4ecd8", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "16px" }}>
            How can we <em style={{ fontStyle: "italic", color: "#d4a947" }}>help?</em>
          </h1>
          <p style={{ fontSize: "16px", color: "#999080", lineHeight: 1.7, maxWidth: "560px" }}>
            We are a small team and we read every message. Whether it is a bug, a question, a feature idea, or just feedback — we want to hear from you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "40px", alignItems: "start" }} className="contact-split">
          {/* Left — contact info */}
          <div>
            <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "20px", padding: "32px", marginBottom: "16px" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
                Direct contact
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontFamily: "JetBrains Mono, monospace" }}>Email</div>
                <a href="mailto:support@yourhowfar.com" style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#d4a947", textDecoration: "none", fontStyle: "italic" }}>
                  support@yourhowfar.com
                </a>
                <div style={{ fontSize: "12px", color: "#7a7468", marginTop: "6px" }}>We respond within 48 hours</div>
              </div>
              <div style={{ paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
                <div style={{ fontSize: "11px", color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontFamily: "JetBrains Mono, monospace" }}>Platform</div>
                <a href="https://yourhowfar.com" style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#d4a947", textDecoration: "none", fontStyle: "italic" }}>
                  yourhowfar.com
                </a>
              </div>
            </div>

            <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "20px", padding: "32px" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
                Common topics
              </div>
              {[
                { label: "Getting started", detail: "Signup, verification, and first steps" },
                { label: "Finance modules", detail: "Budget, goals, net worth, retirement" },
                { label: "Habits and mind", detail: "Check-ins, streaks, journaling" },
                { label: "Account and billing", detail: "Settings, passwords, subscriptions" },
                { label: "Bug reports", detail: "Something broken? Tell us exactly what happened" },
                { label: "Feature requests", detail: "Ideas for what to build next" },
              ].map(item => (
                <div key={item.label} style={{ paddingBottom: "12px", marginBottom: "12px", borderBottom: "1px solid #1e1e1e" }}>
                  <div style={{ fontSize: "13px", color: "#f4ecd8", marginBottom: "2px" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "#7a7468" }}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "20px", padding: "36px", position: "relative" as const }}>
            <div style={{ position: "absolute" as const, top: "-1px", left: "40px", right: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4a947, transparent)" }} />

            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "64px", color: "#d4a947", marginBottom: "16px" }}>✓</div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "28px", fontWeight: 300, color: "#f4ecd8", marginBottom: "12px" }}>
                  Message <em style={{ fontStyle: "italic", color: "#d4a947" }}>received</em>.
                </div>
                <p style={{ fontSize: "14px", color: "#999080", lineHeight: 1.6, marginBottom: "28px" }}>
                  Thank you for reaching out. We will respond to {email || "your email"} within 48 hours.
                </p>
                <button onClick={() => setSent(false)} style={{ padding: "12px 28px", background: "transparent", border: "1px solid #2a2a2a", color: "#f4ecd8", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "24px" }}>
                  Send us a message
                </div>

                {/* Topic pills */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "10px" }}>
                    Topic
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {topics.map(t => (
                      <button key={t.value} onClick={() => setSubject(t.value)} style={{ padding: "8px 14px", background: subject === t.value ? "#d4a947" : "transparent", border: `1px solid ${subject === t.value ? "#d4a947" : "#2a2a2a"}`, borderRadius: "100px", color: subject === t.value ? "#0a0a0a" : "#999080", fontSize: "12px", fontWeight: subject === t.value ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Your name</label>
                    <input type="text" placeholder="Kwesi" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Your email</label>
                    <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#7a7468", textTransform: "uppercase", marginBottom: "8px" }}>Message</label>
                  <textarea placeholder="Tell us what's on your mind. The more detail the better — especially for bug reports." value={message} onChange={e => setMessage(e.target.value)} style={{ ...inputStyle, minHeight: "140px", resize: "vertical", lineHeight: 1.6 }} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
                </div>

                {error && (
                  <div style={{ padding: "12px 16px", background: "rgba(200,90,90,0.1)", border: "1px solid rgba(200,90,90,0.3)", borderRadius: "10px", color: "#c85a5a", fontSize: "13px", marginBottom: "16px" }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
                  <div style={{ fontSize: "12px", color: "#7a7468" }}>We respond within 48 hours</div>
                  <button onClick={handleSubmit} disabled={sending} style={{ padding: "12px 32px", background: sending ? "#8a6f2e" : "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: sending ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
                    {sending ? "Sending..." : "Send message"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .contact-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <Footer />
    </div>
  );
}