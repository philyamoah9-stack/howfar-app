export default function Footer() {
  return (
    <>
      {/* CTA section */}
      <section
        id="beta"
        style={{
          padding: "100px 40px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(212,169,71,0.1) 0%, transparent 60%), #0a0a0a",
          borderTop: "1px solid #1e1e1e",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#d4a947",
            marginBottom: "20px",
          }}
        >
          Private beta · 2026
        </div>

        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 300,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#f4ecd8",
            marginBottom: "20px",
          }}
        >
          Ready to see how{" "}
          <em style={{ fontStyle: "italic", color: "#d4a947" }}>far</em>
          <br />
          you will go?
        </h2>

        <p
          style={{
            fontSize: "17px",
            color: "#999080",
            marginBottom: "40px",
            maxWidth: "520px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Join the private beta. Set your retirement horizon. Build the map.
          Grow on purpose.
        </p>

        
         <a href="/signup"
          style={{padding:"16px 40px",background:"#d4a947",color:"#0a0a0a",borderRadius:"100px",textDecoration:"none",fontSize:"15px",fontWeight:600,letterSpacing:"0.02em",display:"inline-block"}}
        >
          Start your journey
        </a>

        <div
          style={{
            marginTop: "60px",
            paddingTop: "40px",
            borderTop: "1px solid #1e1e1e",
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          {[
            { num: "Free", label: "To get started" },
            { num: "6", label: "Life pillars" },
            { num: "GHS", label: "Native currency" },
            { num: "90-day", label: "Reset challenge" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "#d4a947",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.num}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7a7468",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
<footer
        style={{
          padding: "40px",
          background: "#0a0a0a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          borderTop: "1px solid #1e1e1e",
        }}
      >
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "18px",
            color: "#f4ecd8",
          }}
        >
          How{" "}
          <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
          <span style={{ color: "#7a7468", fontSize: "13px", fontFamily: "Inter, sans-serif", marginLeft: "12px" }}>
            · a Deo Volente product
          </span>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
          <a href="/privacy" style={{ fontSize: "12px", color: "#7a7468", textDecoration: "none" }}>Privacy</a>
          <a href="/terms" style={{ fontSize: "12px", color: "#7a7468", textDecoration: "none" }}>Terms</a>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#7a7468", letterSpacing: "0.05em" }}>
            2026 · Private beta
          </div>
        </div>
      </footer>
    </>
  );
}