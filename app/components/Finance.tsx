"use client";

export default function Finance() {
  const features = [
    {
      mark: "B",
      title: "Budget that speaks Ghanaian",
      desc: "Categories for chop money, tithe, MoMo, prepaid electricity, black tax, school fees per term — not Uber Eats.",
    },
    {
      mark: "N",
      title: "Multi-currency net worth",
      desc: "GHS, USD, EUR, GBP. See nominal and inflation-adjusted over time. Cedi depreciation is real — account for it.",
    },
    {
      mark: "G",
      title: "Goals rooted in our culture",
      desc: "Land in your hometown, school fees, wedding, business capital, pilgrimage. With inflation-adjusted contributions.",
    },
    {
      mark: "I",
      title: "Investments you can actually buy",
      desc: "T-bills, fixed deposits, mutual funds, GSE stocks, dollar accounts, Bamboo and Risevest. Real returns after inflation.",
    },
    {
      mark: "R",
      title: "Retirement on your own terms",
      desc: "SSNIT Tier 1, 2 and 3 projections, countdown to your horizon, monthly gap analysis. Freedom, not just rest.",
    },
    {
      mark: "D",
      title: "Debt you can see",
      desc: "Track MoMo loans, bank loans, susu obligations, family loans. Payoff simulator. No more surprises.",
    },
  ];

  const netWorthRows = [
    { label: "Cash & MoMo", value: "42,100", color: "#f4ecd8" },
    { label: "T-bills · 91-day", value: "60,000", color: "#f4ecd8" },
    { label: "Mutual fund", value: "28,400", color: "#f4ecd8" },
    { label: "USD reserve", value: "$2,400", color: "#d4a947" },
    { label: "Vehicle", value: "82,000", color: "#f4ecd8" },
    { label: "Loans & debts", value: "−28,280", color: "#c85a5a" },
  ];

  return (
    <section
      id="finance"
      style={{
        padding: "100px 40px",
        background: "#141414",
        borderTop: "1px solid #1e1e1e",
        borderBottom: "1px solid #1e1e1e",
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
          — The anchor pillar
        </div>

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
          Your money,{" "}
          <em style={{ fontStyle: "italic", color: "#d4a947" }}>honestly</em>{" "}
          tracked — in cedis.
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
          Every Ghanaian finance app either ignores how we actually live or
          tries to be a bank. How Far? is neither. It is a mirror — showing
          you where your money is, where it is going, and how far you are
          from the life you want.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {features.map((f) => (
              <div
                key={f.mark}
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  padding: "20px",
                  border: "1px solid #1e1e1e",
                  borderRadius: "12px",
                  background: "#0a0a0a",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#8a6f2e")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#1e1e1e")
                }
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(212,169,71,0.12)",
                    border: "1px solid #8a6f2e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Fraunces, serif",
                    fontStyle: "italic",
                    color: "#d4a947",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {f.mark}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontSize: "16px",
                      color: "#f4ecd8",
                      marginBottom: "4px",
                      fontWeight: 400,
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#999080",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Net worth preview card */}
          <div
            style={{
              background: "linear-gradient(155deg, #1a1a1a 0%, #141414 100%)",
              border: "1px solid #2a2a2a",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                  color: "#7a7468",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Net worth · October
              </div>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                  color: "#d4a947",
                  letterSpacing: "0.08em",
                  padding: "3px 9px",
                  border: "1px solid #8a6f2e",
                  borderRadius: "100px",
                  background: "rgba(212,169,71,0.12)",
                }}
              >
                GHS
              </div>
            </div>

            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 300,
                fontSize: "48px",
                color: "#f4ecd8",
                letterSpacing: "-0.03em",
                marginBottom: "4px",
              }}
            >
              184,520
              <span
                style={{
                  fontSize: "14px",
                  color: "#7a7468",
                  marginLeft: "8px",
                }}
              >
                GHS
              </span>
            </div>

            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "#7aa87a",
                marginBottom: "24px",
              }}
            >
              ▲ +12,340 (7.2%) this quarter
            </div>

            {netWorthRows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: "1px solid #1e1e1e",
                }}
              >
                <div style={{ color: "#999080", fontSize: "13px" }}>
                  {row.label}
                </div>
                <div
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "18px",
                    fontWeight: 400,
                    color: row.color,
                  }}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}