const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'dashboard', 'mind');

const part2 = `
  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Mind · Inner work</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            Reflect. <em style={{ fontStyle: "italic", color: "#d4a947" }}>Grow.</em>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "#141414", border: "1px solid #2a2a2a", borderRadius: "100px", padding: "4px" }}>
          {(["journal", "archive", "review"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 18px", background: view === v ? "#d4a947" : "transparent", color: view === v ? "#0a0a0a" : "#999080", border: "none", borderRadius: "100px", fontSize: "12px", fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "radial-gradient(circle at 90% 10%, rgba(212,169,71,0.12) 0%, transparent 40%), #141414", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Journal streak</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#d4a947", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{streak}<em style={{ fontSize: "20px", fontStyle: "italic" }}> days</em></div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>{streak > 0 ? "Keep going" : "Start today"}</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Entries this month</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#f4ecd8", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{entries.length}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>Last 30 days</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Today's mood</div>
          {todayEntry ? (
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: MOOD_COLORS[todayEntry.mood], letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "8px" }}>{MOOD_LABELS[todayEntry.mood]}</div>
          ) : (
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: 300, color: "#7a7468", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "8px" }}>Not yet</div>
          )}
        </div>
      </div>

      {view === "journal" && (
        <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "28px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>
              {faithMode ? "Faith reflection" : "Today's prompt"} · {fmtDate(today)}
            </div>
            <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "18px", fontWeight: 300, color: "#f4ecd8", lineHeight: 1.4, marginBottom: "24px", paddingLeft: "16px", borderLeft: "2px solid #d4a947" }}>
              {todayPrompt}
            </div>
            <textarea placeholder="Write your reflection here. Be honest — this is private." value={content || (todayEntry?.content || "")} onChange={e => setContent(e.target.value)} style={{ ...inputStyle, minHeight: "160px", resize: "vertical", lineHeight: 1.6 }} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
            <div style={{ marginTop: "20px" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>How are you feeling today?</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map(m => (
                  <button key={m} onClick={() => setMood(m)} style={{ padding: "10px 16px", background: mood === m ? MOOD_COLORS[m] : "#0a0a0a", border: "1px solid " + (mood === m ? MOOD_COLORS[m] : "#2a2a2a"), borderRadius: "100px", color: mood === m ? "#0a0a0a" : "#999080", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                    {MOOD_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468" }}>{streak > 0 ? streak + " day streak" : "Start your streak"}</div>
              <button onClick={handleSave} disabled={saving} style={{ padding: "12px 28px", background: saving ? "#8a6f2e" : saved ? "#7aa87a" : "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                {saving ? "Saving..." : saved ? "Saved!" : todayEntry ? "Update" : "Save entry"}
              </button>
            </div>
          </div>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Recent entries</div>
            {entries.slice(0, 5).map(e => (
              <div key={e.id} style={{ padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ fontSize: "12px", color: "#7a7468" }}>{fmtDate(e.date)}</div>
                  <span style={{ fontSize: "10px", color: MOOD_COLORS[e.mood], padding: "2px 8px", border: "1px solid " + MOOD_COLORS[e.mood], borderRadius: "100px" }}>{MOOD_LABELS[e.mood]}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#999080", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.content}</div>
              </div>
            ))}
            {entries.length === 0 && <div style={{ textAlign: "center", padding: "20px", fontSize: "13px", color: "#7a7468" }}>Your first entry will appear here</div>}
          </div>
        </div>
      )}

      {view === "archive" && (
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>All entries · Last 30 days</div>
          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#f4ecd8", marginBottom: "8px" }}>No entries yet</div>
              <button onClick={() => setView("journal")} style={{ padding: "10px 20px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Write first entry</button>
            </div>
          ) : (
            entries.map(e => (
              <div key={e.id} style={{ padding: "20px 0", borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947" }}>{fmtDate(e.date)}</div>
                  <span style={{ fontSize: "11px", color: MOOD_COLORS[e.mood], padding: "3px 10px", border: "1px solid " + MOOD_COLORS[e.mood], borderRadius: "100px" }}>{MOOD_LABELS[e.mood]}</span>
                </div>
                {e.prompt && <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "13px", color: "#7a7468", marginBottom: "8px", paddingLeft: "12px", borderLeft: "2px solid #2a2a2a" }}>{e.prompt}</div>}
                <div style={{ fontSize: "14px", color: "#f4ecd8", lineHeight: 1.6 }}>{e.content}</div>
              </div>
            ))
          )}
        </div>
      )}

      {view === "review" && (
        <div className="dash-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "28px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>Weekly review</div>
            <p style={{ fontSize: "14px", color: "#999080", lineHeight: 1.6, marginBottom: "24px" }}>Take 5 minutes every Sunday. Review the week honestly.</p>
            {[
              { q: "What was your biggest win this week?", p: "Even small wins count..." },
              { q: "What did not go as planned?", p: "Be honest, not harsh..." },
              { q: "What are you grateful for?", p: "Name it specifically..." },
              { q: "What is your one priority next week?", p: "One thing, not ten..." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "16px", color: "#f4ecd8", marginBottom: "10px" }}>{item.q}</label>
                <textarea placeholder={item.p} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} onFocus={e => e.currentTarget.style.borderColor = "#d4a947"} onBlur={e => e.currentTarget.style.borderColor = "#2a2a2a"} />
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "20px", borderTop: "1px solid #1e1e1e" }}>
              <button style={{ padding: "12px 28px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save review</button>
            </div>
          </div>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Review checklist</div>
            {[
              { label: "Daily journal today", done: todayEntry !== undefined },
              { label: "Mood tracked", done: todayEntry !== undefined },
              { label: "Weekly review", done: false },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: item.done ? "#d4a947" : "transparent", border: item.done ? "none" : "1.5px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#0a0a0a", flexShrink: 0 }}>
                  {item.done ? "✓" : ""}
                </div>
                <div style={{ fontSize: "13px", color: item.done ? "#f4ecd8" : "#7a7468" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`;

const existing = fs.readFileSync(path.join(dir, 'MindClient.tsx'), 'utf8');
fs.writeFileSync(path.join(dir, 'MindClient.tsx'), existing + part2, 'utf8');
console.log('Done: MindClient.tsx complete');