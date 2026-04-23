"use client";

export default function Pillars() {
  const pillars = [
    {
      num: "01 / Anchor",
      name: "Finance",
      desc: "Budget, net worth, investments, retirement, debt. Built for the cedi, the dollar, T-bills, SSNIT, susu, and everything in between.",
      tag: "● Live in beta",
      live: true,
    },
    {
      num: "02 / Daily",
      name: "Habits",
      desc: "Small actions, compounded. Track the rituals that build the life you want — streaks, heatmaps, no fluff.",
      tag: "Phase 2",
      live: false,
    },
    {
      num: "03 / Inner",
      name: "Mind",
      desc: "Journal, reflect, reframe. Faith-optional prompts. Weekly reviews that actually change things.",
      tag: "Phase 2",
      live: false,
    },
    {
      num: "04 / Bonds",
      name: "Relationships",
      desc: "Marriage, family, friendship, mentorship. Be intentional with the people who matter.",
      tag: "Phase 3",
      live: false,
    },
    {
      num: "05 / Work",
      name: "Career",
      desc: "Skills, income streams, side hustles, calling. Map your career on purpose.",
      tag: "Phase 3",
      live: false,
    },
    {
      num: "06 / Legacy",
      name: "Purpose",
      desc: "Why are you here? What are you building for the next generation?",
      tag: "Phase 3",
      live: false,
    },
  ];

  return (
    <section
      id="pillars"
      style={{
        padding: "100px 40px",
        background: "#0a0a0a",
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
          — Six pillars, one life
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
          Everything that shapes{" "}
          <em style={{ fontStyle: "italic", color: "#d4a947" }}>
            who you become
          </em>{" "}
          — in one place.
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
          We start with finance because it is the most measurable and most urgent. But How Far? is designed to grow with you — across habits, mind, relationships, career, and purpose. One life. One platform.
        </p>

        {/* Grid */}
        <div className="pillars-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "#2a2a2a",
            border: "1px solid #2a2a2a",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              style={{
                background: "#141414",
                padding: "40px 32px",
                transition: "background 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1a1a1a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#141414")
              }
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "11px",
                  color: "#d4a947",
                  letterSpacing: "0.15em",
                  marginBottom: "28px",
                }}
              >
                {pillar.num}
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "26px",
                  fontWeight: 400,
                  color: "#f4ecd8",
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                  fontStyle: "italic",
                }}
              >
                {pillar.name}
              </div>
              <div
                style={{
                  color: "#999080",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {pillar.desc}
              </div>
              <div
                style={{
                  display: "inline-block",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: pillar.live ? "#d4a947" : "#7a7468",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  border: pillar.live
                    ? "1px solid #8a6f2e"
                    : "1px solid #2a2a2a",
                  borderRadius: "100px",
                  background: pillar.live
                    ? "rgba(212,169,71,0.12)"
                    : "transparent",
                }}
              >
                {pillar.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}