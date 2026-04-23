"use client";

export default function Community() {
  const features = [
    {
      icon: "◎",
      title: "Themed circles",
      desc: "Join small groups of 12-25 people built around your season — debt freedom, first home, young professional, faith stewardship, married couples. Deep over wide.",
    },
    {
      icon: "◈",
      title: "Consented sharing",
      desc: "Share a goal milestone, a streak, or a journal reflection with your circle — always a deliberate choice, never automatic. Your private data stays private.",
    },
    {
      icon: "◇",
      title: "Weekly prompts",
      desc: "Every Sunday your circle receives a conversation starter rooted in real life. 'What is the most expensive lesson your debt has taught you?'",
    },
    {
      icon: "◉",
      title: "Accountability pairs",
      desc: "Within your circle, pair up with one person for a private weekly check-in. The kind of accountability that actually moves the needle.",
    },
  ];

  return (
    <section
      id="community"
      style={{
        padding: "100px 40px",
        background: "#0a0a0a",
        borderTop: "1px solid #1e1e1e",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Eyebrow */}
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
          — Phase 2 · Coming after launch
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 300,
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#f4ecd8",
            marginBottom: "16px",
            maxWidth: "800px",
          }}
        >
          Growth is faster{" "}
          <em style={{ fontStyle: "italic", color: "#d4a947" }}>
            in community.
          </em>
        </h2>

        <p
          style={{
            fontSize: "17px",
            color: "#999080",
            maxWidth: "620px",
            lineHeight: 1.6,
            marginBottom: "60px",
          }}
        >
          The ultimate goal of How Far? is not just a tool — it is a
          community. A place where Ghanaian and African professionals walk
          their journeys together. Share the wins, the failures, the
          in-between. With people who actually understand.
        </p>

        <div className="dash-cards" 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            marginBottom: "60px",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#141414",
                border: "1px solid #2a2a2a",
                borderRadius: "16px",
                padding: "32px",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#8a6f2e")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#2a2a2a")
              }
            >
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "28px",
                  color: "#d4a947",
                  marginBottom: "16px",
                  lineHeight: 1,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "20px",
                  fontWeight: 400,
                  color: "#f4ecd8",
                  marginBottom: "10px",
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#999080",
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Philosophy callout */}
        <div className="feature-split"
          style={{
            padding: "40px",
            background: "rgba(212,169,71,0.06)",
            border: "1px solid #8a6f2e",
            borderRadius: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a947",
                marginBottom: "16px",
              }}
            >
              The test every circle must pass
            </div>
            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontStyle: "italic",
                fontSize: "22px",
                fontWeight: 300,
                color: "#f4ecd8",
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
              }}
            >
              &ldquo;Would a wise, intentional Ghanaian elder approve of what
              is happening in this circle?&rdquo;
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: "15px",
                color: "#999080",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}
            >
              How Far? community is not built to maximise engagement. It is
              built to deepen lives. No likes, no follower counts, no viral
              mechanics. Small groups. Real names. Honest conversation.
            </p>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "11px",
                color: "#d4a947",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Launching after Phase 1 · Join the beta to be first in
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}