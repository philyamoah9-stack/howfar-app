import Footer from "../components/Footer";
export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "80px 40px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <a href="/" style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8", textDecoration: "none", display: "block", marginBottom: "48px" }}>
          How <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
        </a>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "48px", color: "#f4ecd8", letterSpacing: "-0.02em", marginBottom: "16px" }}>
          Terms of <em style={{ fontStyle: "italic", color: "#d4a947" }}>service</em>.
        </h1>
        <div style={{ fontSize: "13px", color: "#7a7468", marginBottom: "48px", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em" }}>Last updated: April 2026</div>

        {[
          { title: "Acceptance", body: "By creating an account and using How Far?, you agree to these terms. If you do not agree, please do not use the service." },
          { title: "What How Far? is", body: "How Far? is a personal finance and growth tracking platform. It is a tool to help you understand and improve your financial situation and personal development. It is not a licensed financial advisor, bank, or investment platform. Nothing in the app constitutes financial advice." },
          { title: "Your responsibilities", body: "You are responsible for maintaining the security of your account credentials. You agree not to use How Far? for any unlawful purpose. You agree not to attempt to access other users' data or reverse-engineer the platform." },
          { title: "Financial information disclaimer", body: "The calculations, projections, and recommendations in How Far? (including retirement projections, investment returns, and savings targets) are estimates based on general assumptions. They are not guarantees of future performance. Always consult a qualified financial advisor for major financial decisions." },
          { title: "Service availability", body: "We aim for 99.9% uptime but do not guarantee uninterrupted service. We may modify, suspend, or discontinue features at any time. We will provide reasonable notice for significant changes." },
          { title: "Termination", body: "You may delete your account at any time from Settings. We may suspend accounts that violate these terms. Upon termination, your data will be permanently deleted within 30 days." },
          { title: "Contact", body: "Questions about these terms? Email us at support@yourhowfar.com." },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 400, fontSize: "24px", color: "#f4ecd8", marginBottom: "12px", letterSpacing: "-0.01em" }}>{section.title}</h2>
            <p style={{ fontSize: "15px", color: "#999080", lineHeight: 1.8 }}>{section.body}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}