"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
  });

  useEffect(() => {
    // Demo retirement target: age 58, assume user is 31
    const target = new Date();
    target.setFullYear(target.getFullYear() + 27);

    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
      const days = Math.floor((diff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      setTimeLeft({ years, months, days, hours });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "140px 40px 100px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      {/* Gold glow */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(212,169,71,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(212,169,71,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,169,71,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "80px",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left — headline */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#d4a947",
              padding: "8px 16px",
              border: "1px solid #8a6f2e",
              borderRadius: "100px",
              marginBottom: "32px",
              background: "rgba(212,169,71,0.12)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "#d4a947",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            Built in Accra · Private beta · 2026
          </div>

          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 300,
              fontSize: "clamp(44px, 7vw, 88px)",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              color: "#f4ecd8",
              marginBottom: "32px",
            }}
          >
            How{" "}
            <em style={{ fontStyle: "italic", color: "#d4a947", fontWeight: 400 }}>
              far
            </em>{" "}
            have you
            <br />
            come? How{" "}
            <em style={{ fontStyle: "italic", color: "#d4a947", fontWeight: 400 }}>
              far
            </em>
            <br />
            will you{" "}
            <span style={{ fontSize: "1.15em", fontWeight: 500 }}>go?</span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#999080",
              maxWidth: "500px",
              marginBottom: "40px",
            }}
          >
            The personal growth platform for Ghanaian and African
            professionals. Track your money, your habits, your mind, your
            purpose — all in one place. Retire on your own terms. Grow on
            purpose.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            
              <a href="#beta"
              style={{padding:"16px 32px",background:"#d4a947",color:"#0a0a0a",borderRadius:"100px",textDecoration:"none",fontSize:"14px",fontWeight:600,letterSpacing:"0.02em"}}
            >
              Start your journey
            </a>
            
              <a href="#pillars"
              style={{padding:"16px 32px",background:"transparent",color:"#f4ecd8",borderRadius:"100px",textDecoration:"none",fontSize:"14px",fontWeight:600,border:"1px solid #2a2a2a"}}
            >
              See the six pillars
            </a>
          </div>

          {/* Proof strip */}
          <div
            style={{
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: "1px solid #1e1e1e",
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            {[
              { num: "6", label: "Life pillars" },
              { num: "GHS · USD", label: "Multi-currency" },
              { num: "90-day", label: "Reset challenge" },
            ].map((item) => (
              <div key={item.label}>
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
        </div>

        {/* Right — countdown card */}
        <div>
          <div
            style={{
              background: "linear-gradient(155deg, #1a1a1a 0%, #141414 100%)",
              border: "1px solid #2a2a2a",
              borderRadius: "24px",
              padding: "36px",
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8)",
              position: "relative",
            }}
          >
            {/* Gold top line */}
            <div
              style={{
                position: "absolute",
                top: "-1px",
                left: "40px",
                right: "40px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, #d4a947, transparent)",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "28px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "20px",
                    fontWeight: 400,
                    color: "#f4ecd8",
                  }}
                >
                  Your{" "}
                  <em style={{ fontStyle: "italic", color: "#d4a947" }}>
                    How Far?
                  </em>{" "}
                  score
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#7a7468",
                    marginTop: "4px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Kwesi · Week 14
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "40px",
                    fontWeight: 300,
                    color: "#d4a947",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  67
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#7a7468",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: "2px",
                  }}
                >
                  of 100
                </div>
              </div>
            </div>

            {/* Countdown grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1px",
                background: "#2a2a2a",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              {[
                { n: timeLeft.years, u: "Years" },
                { n: timeLeft.months, u: "Months" },
                { n: timeLeft.days, u: "Days" },
                { n: timeLeft.hours, u: "Hours" },
              ].map((item) => (
                <div
                  key={item.u}
                  style={{
                    background: "#141414",
                    padding: "18px 10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontSize: "28px",
                      fontWeight: 400,
                      color: "#f4ecd8",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {String(item.n).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#7a7468",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: "8px",
                    }}
                  >
                    {item.u}
                  </div>
                </div>
              ))}
            </div>

            {/* Quote strip */}
            <div
              style={{
                padding: "14px 16px",
                borderLeft: "2px solid #d4a947",
                background: "rgba(212,169,71,0.08)",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: "#f4ecd8",
                  lineHeight: 1.5,
                }}
              >
                &ldquo;Time is your most honest currency. Spend it like you
                mean it.&rdquo;
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: "#7a7468",
                  marginTop: "6px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Weekly reflection
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}