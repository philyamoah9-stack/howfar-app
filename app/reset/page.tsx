"use client";

import Footer from "../components/Footer";
import { useState } from "react";
import { createClient } from "../lib/supabase";

export default function ResetPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://yourhowfar.com/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
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
          </a>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              color: "#7a7468",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Reset your password
          </div>
        </div>

        <div
          style={{
            background: "#141414",
            border: "1px solid #2a2a2a",
            borderRadius: "20px",
            padding: "36px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-1px",
              left: "40px",
              right: "40px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #d4a947, transparent)",
            }}
          />

          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>✉</div>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "22px",
                  color: "#f4ecd8",
                  marginBottom: "12px",
                }}
              >
                Check your email
              </div>
              <p style={{ fontSize: "14px", color: "#999080", lineHeight: 1.6 }}>
                We sent a password reset link to{" "}
                <span style={{ color: "#d4a947" }}>{email}</span>. Click it
                to set a new password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#999080",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                Enter your email and we will send you a link to reset your
                password.
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    color: "#7a7468",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "#141414",
                    border: "1px solid #2a2a2a",
                    borderRadius: "12px",
                    color: "#f4ecd8",
                    fontSize: "15px",
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#d4a947")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#2a2a2a")
                  }
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(200,90,90,0.1)",
                    border: "1px solid rgba(200,90,90,0.3)",
                    borderRadius: "10px",
                    color: "#c85a5a",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: loading ? "#8a6f2e" : "#d4a947",
                  color: "#0a0a0a",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.02em",
                }}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "13px",
              color: "#7a7468",
            }}
          >
            
             <a href="/login"
              style={{ color: "#d4a947", textDecoration: "none" }}
            >
              Back to sign in
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}