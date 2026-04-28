import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "80px 40px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <a href="/" style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8", textDecoration: "none", display: "block", marginBottom: "48px" }}>
          How <em style={{ fontStyle: "italic", color: "#d4a947" }}>Far?</em>
        </a>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "48px", color: "#f4ecd8", letterSpacing: "-0.02em", marginBottom: "16px" }}>
          Privacy <em style={{ fontStyle: "italic", color: "#d4a947" }}>policy</em>.
        </h1>
        <div style={{ fontSize: "13px", color: "#7a7468", marginBottom: "48px", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em" }}>Last updated: April 2026</div>

        {[
          { title: "Your data is yours", body: "How Far? does not sell your data. Ever. Your financial information, journal entries, and personal goals are private to you and stored securely in our database. We do not share your data with third parties for advertising or any other commercial purpose." },
          { title: "What we collect", body: "We collect the information you provide during signup (name, email) and the data you enter into the app (transactions, goals, habits, journal entries). We also collect basic usage analytics to understand which features are being used — this data is aggregated and anonymous." },
          { title: "How we store it", body: "Your data is stored in Supabase (PostgreSQL database) with row-level security enforced at the database level. This means even our own engineers cannot query your personal data without explicit permission. Journal entries are encrypted at rest." },
          { title: "Your rights", body: "You can export all your data at any time from Settings. You can delete your account and all associated data at any time from Settings. These actions are permanent and immediate." },
          { title: "Cookies", body: "We use session cookies for authentication only. We do not use tracking cookies, advertising cookies, or third-party analytics cookies." },
          { title: "Contact", body: "Questions about privacy? Email us at support@yourhowfar.com. We respond within 48 hours." },
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