export default function VerifyPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "440px" }}>
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "32px",
            fontWeight: 300,
            color: "#f4ecd8",
            marginBottom: "8px",
          }}
        >
          How{" "}
          <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
        </div>

        <div
          style={{
            width: "64px",
            height: "64px",
            background: "rgba(212,169,71,0.12)",
            border: "1px solid #8a6f2e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "32px auto",
            fontSize: "28px",
          }}
        >
          ✉
        </div>

        <h1
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 300,
            fontSize: "32px",
            color: "#f4ecd8",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          Check your{" "}
          <em style={{ fontStyle: "italic", color: "#d4a947" }}>email</em>
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "#999080",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          We sent you a confirmation link. Click it to verify your account
          and start your journey.
        </p>

        <div
          style={{
            padding: "16px",
            background: "#141414",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            fontSize: "13px",
            color: "#7a7468",
            lineHeight: 1.6,
          }}
        >
          Did not receive it? Check your spam folder. If it is still not
          there, go back and try signing up again.
        </div>

        
         <a href="/"
          style={{
            display: "inline-block",
            marginTop: "24px",
            color: "#7a7468",
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          Back to home
        </a>
      </div>
    </div>
  );
}