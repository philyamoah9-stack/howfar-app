export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        background: "#0a0a0a",
      }}
    >
      <div
        style={{
          fontFamily: "Fraunces, serif",
          fontSize: "72px",
          fontWeight: 300,
          color: "#f4ecd8",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        How{" "}
        <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
      </div>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "18px",
          color: "#999080",
          fontStyle: "italic",
        }}
      >
        Track your life. Grow on purpose.
      </div>
      <div
        style={{
          marginTop: "24px",
          padding: "12px 28px",
          background: "#d4a947",
          color: "#0a0a0a",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          borderRadius: "100px",
          letterSpacing: "0.02em",
        }}
      >
        Coming soon — Private beta · Accra, Ghana
      </div>
    </main>
  );
}