import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        {/* Hero section coming next */}
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
            paddingTop: "80px",
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
        </div>
      </main>
    </>
  );
}