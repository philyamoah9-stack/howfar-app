export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          fontFamily: "Fraunces, serif",
          fontSize: "120px",
          fontWeight: 300,
          color: "#d4a947",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          opacity: 0.4,
        }}
      >
        404
      </div>
      <div
        style={{
          fontFamily: "Fraunces, serif",
          fontSize: "32px",
          fontWeight: 300,
          color: "#f4ecd8",
          letterSpacing: "-0.02em",
        }}
      >
        This page doesn&apos;t exist{" "}
        <em style={{ fontStyle: "italic", color: "#d4a947" }}>yet</em>.
      </div>
      <div
        style={{
          fontSize: "15px",
          color: "#999080",
          maxWidth: "400px",
          lineHeight: 1.6,
        }}
      >
        The journey continues elsewhere. Go back and keep building.
      </div>
      
       <a href="/"
        style={{
          marginTop: "16px",
          padding: "14px 32px",
          background: "#d4a947",
          color: "#0a0a0a",
          borderRadius: "100px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Back to How Far?
      </a>
    </div>
  );
}