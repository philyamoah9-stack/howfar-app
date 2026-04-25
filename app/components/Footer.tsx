export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", borderTop: "1px solid #1e1e1e" }}>
      {/* CTA section */}
      <div style={{ textAlign: "center", padding: "80px 40px" }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>
          Private beta · 2026
        </div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "48px", color: "#f4ecd8", letterSpacing: "-0.02em", marginBottom: "16px", lineHeight: 1.1 }}>
          Ready to see how <em style={{ fontStyle: "italic", color: "#d4a947" }}>far</em> you will go?
        </h2>
        <p style={{ fontSize: "16px", color: "#999080", marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
          Join the private beta. Set your retirement horizon. Build the map. Grow on purpose.
        </p>
        <a href="/signup" style={{ display: "inline-block", padding: "16px 40px", background: "#d4a947", color: "#0a0a0a", borderRadius: "100px", textDecoration: "none", fontSize: "15px", fontWeight: 600 }}>
          Start your journey
        </a>
      </div>

      {/* Footer bar */}
      <div style={{ borderTop: "1px solid #1e1e1e", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#f4ecd8" }}>
            How <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
            <span style={{ color: "#7a7468", fontSize: "13px", fontFamily: "Inter, sans-serif", marginLeft: "12px" }}>· a Deo Volente product</span>
          </div>
        </a>
        <div style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
          <a href="/contact" style={{ fontSize: "13px", color: "#7a7468", textDecoration: "none" }}>Contact</a>
          <a href="/privacy" style={{ fontSize: "13px", color: "#7a7468", textDecoration: "none" }}>Privacy</a>
          <a href="/terms" style={{ fontSize: "13px", color: "#7a7468", textDecoration: "none" }}>Terms</a>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#7a7468" }}>2026 · Private beta</span>
        </div>
      </div>
    </footer>
  );
}