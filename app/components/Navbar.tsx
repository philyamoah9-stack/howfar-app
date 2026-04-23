"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkStyle = {
    color: "#999080",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 500,
  } as React.CSSProperties;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(10, 10, 10, 0.92)"
          : "rgba(10, 10, 10, 0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid #1e1e1e"
          : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          fontFamily: "Fraunces, serif",
          fontSize: "22px",
          fontWeight: 500,
          color: "#f4ecd8",
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            background: "#d4a947",
            borderRadius: "50%",
            boxShadow: "0 0 12px #d4a947",
            display: "inline-block",
          }}
        />
        How{" "}
        <em
          style={{
            fontStyle: "italic",
            color: "#d4a947",
            fontWeight: 400,
          }}
        >
          Far?
        </em>
      </div>

      <div className="nav-links"
        style={{
          display: "flex",
          gap: "28px",
          alignItems: "center",
        }}
      >
        <a href="#pillars" style={linkStyle}>
          Pillars
        </a>
        <a href="#finance" style={linkStyle}>
          Finance
        </a>
        <a href="#community" style={linkStyle}>
          Community
        </a>
        
          <a href="/signup"
          className="join-btn"
          style={{padding:"10px 22px",background:"#d4a947",color:"#0a0a0a",borderRadius:"100px",textDecoration:"none",fontSize:"13px",fontWeight:600,letterSpacing:"0.02em"}}
        >
          Join the beta
        </a>
      </div>
    </nav>
  );
}