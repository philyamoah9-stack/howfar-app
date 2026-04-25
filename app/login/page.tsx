"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    color: "#f4ecd8",
    fontSize: "15px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

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
            Welcome back
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

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
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
                style={inputStyle}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#d4a947")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#2a2a2a")
                }
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <label
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    color: "#7a7468",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
                
                 <a href="/reset"
                  style={{
                    fontSize: "12px",
                    color: "#d4a947",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
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
                transition: "background 0.2s",
                letterSpacing: "0.02em",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "13px",
              color: "#7a7468",
            }}
          >
            New to How Far?{" "}
            
            <a  href="/signup"
              style={{ color: "#d4a947", textDecoration: "none" }}
            >
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}