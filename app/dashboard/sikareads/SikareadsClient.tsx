"use client";

import { useState } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  pillar_tag: string | null;
  sikareads_link: string | null;
};

type Progress = {
  id: string;
  book_id: string;
  status: "want" | "reading" | "done";
  progress_pct: number;
  books: Book;
};

const PILLAR_COLORS: Record<string, string> = {
  Finance: "#d4a947",
  Mind: "#6a8ac0",
  Faith: "#e8c16d",
  Health: "#7aa87a",
  Family: "#a87a8a",
  Career: "#c09a6a",
  Purpose: "#8a7ac0",
};

const STARTER_BOOKS: Book[] = [
  { id: "s1", title: "The Richest Man in Babylon", author: "George S. Clason", cover_url: null, pillar_tag: "Finance", sikareads_link: null },
  { id: "s2", title: "Atomic Habits", author: "James Clear", cover_url: null, pillar_tag: "Mind", sikareads_link: null },
  { id: "s3", title: "The Purpose Driven Life", author: "Rick Warren", cover_url: null, pillar_tag: "Faith", sikareads_link: null },
  { id: "s4", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", cover_url: null, pillar_tag: "Finance", sikareads_link: null },
  { id: "s5", title: "Think and Grow Rich", author: "Napoleon Hill", cover_url: null, pillar_tag: "Mind", sikareads_link: null },
  { id: "s6", title: "The Total Money Makeover", author: "Dave Ramsey", cover_url: null, pillar_tag: "Finance", sikareads_link: null },
  { id: "s7", title: "Boundaries", author: "Dr. Henry Cloud", cover_url: null, pillar_tag: "Family", sikareads_link: null },
  { id: "s8", title: "Deep Work", author: "Cal Newport", cover_url: null, pillar_tag: "Career", sikareads_link: null },
];

type Props = { userId: string; books: Book[]; progress: Progress[]; };

export default function SikareadsClient({ userId, books, progress }: Props) {
  const [myProgress, setMyProgress] = useState<Progress[]>(progress);
  const [filter, setFilter] = useState<"all" | "reading" | "want" | "done">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const allBooks = books.length > 0 ? books : STARTER_BOOKS;

  const getProgress = (bookId: string) => myProgress.find(p => p.book_id === bookId);

  const reading = myProgress.filter(p => p.status === "reading");
  const done = myProgress.filter(p => p.status === "done");
  const want = myProgress.filter(p => p.status === "want");

  const updateStatus = async (book: Book, status: "want" | "reading" | "done") => {
    setUpdating(book.id);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      const existing = getProgress(book.id);
      if (existing) {
        const { data } = await supabase.from("reading_progress")
          .update({ status, ...(status === "done" ? { progress_pct: 100, finished_at: new Date().toISOString() } : {}) })
          .eq("id", existing.id).select("*, books(*)").single();
        if (data) setMyProgress(prev => prev.map(p => p.id === existing.id ? data : p));
      } else {
        const { data } = await supabase.from("reading_progress")
          .insert({ user_id: userId, book_id: book.id, status, progress_pct: status === "done" ? 100 : 0, ...(status === "reading" ? { started_at: new Date().toISOString() } : {}), ...(status === "done" ? { finished_at: new Date().toISOString(), progress_pct: 100 } : {}) })
          .select("*, books(*)").single();
        if (data) setMyProgress(prev => [...prev, data]);
      }
    } catch (e) { console.error(e); }
    setUpdating(null);
  };

  const updateProgress = async (progressId: string, pct: number) => {
    const supabase = (await import("../../lib/supabase")).createClient();
    await supabase.from("reading_progress").update({ progress_pct: pct }).eq("id", progressId);
    setMyProgress(prev => prev.map(p => p.id === progressId ? { ...p, progress_pct: pct } : p));
  };

  const getCoverBg = (pillar: string | null) => {
    const colors: Record<string, string> = {
      Finance: "linear-gradient(135deg, #1a3352 0%, #0c1f36 100%)",
      Mind: "linear-gradient(135deg, #1a2a3a 0%, #0c1620 100%)",
      Faith: "linear-gradient(135deg, #2a2010 0%, #1a1408 100%)",
      Health: "linear-gradient(135deg, #1a2a1a 0%, #0c160c 100%)",
      Family: "linear-gradient(135deg, #2a1a2a 0%, #160c16 100%)",
      Career: "linear-gradient(135deg, #2a2010 0%, #1a1408 100%)",
      Purpose: "linear-gradient(135deg, #1a1a2a 0%, #0c0c16 100%)",
    };
    return colors[pillar || ""] || "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)";
  };

  const filteredBooks = filter === "all" ? allBooks :
    allBooks.filter(b => {
      const p = getProgress(b.id);
      return p?.status === filter;
    });

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>sikareads · Reading</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "#f4ecd8", lineHeight: 1.1 }}>
            Books that <em style={{ fontStyle: "italic", color: "#d4a947" }}>grow you</em>.
          </h1>
        </div>
        <a href="https://sikareads.com" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", background: "transparent", border: "1px solid #d4a947", color: "#d4a947", borderRadius: "100px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
          Visit sikareads →
        </a>
      </div>

      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "radial-gradient(circle at 90% 10%, rgba(212,169,71,0.12) 0%, transparent 40%), #141414", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Reading now</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#d4a947", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{reading.length}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>Books in progress</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Finished</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#7aa87a", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{done.length}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>Books completed</div>
        </div>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Want to read</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: "#f4ecd8", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{want.length}</div>
          <div style={{ fontSize: "12px", color: "#7a7468" }}>On your list</div>
        </div>
      </div>

      {reading.length > 0 && (
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px", marginBottom: "16px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Currently reading</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reading.map(p => (
              <div key={p.id} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "68px", borderRadius: "4px", background: getCoverBg(p.books?.pillar_tag), border: "1px solid rgba(212,169,71,0.2)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#f4ecd8", marginBottom: "2px" }}>{p.books?.title}</div>
                  <div style={{ fontSize: "12px", color: "#7a7468", marginBottom: "10px" }}>{p.books?.author}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ flex: 1, height: "4px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: p.progress_pct + "%", background: "#d4a947", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947", minWidth: "32px" }}>{p.progress_pct}%</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {[25, 50, 75, 100].map(pct => (
                      <button key={pct} onClick={() => updateProgress(p.id, pct)} style={{ padding: "4px 10px", background: p.progress_pct >= pct ? "rgba(212,169,71,0.2)" : "#0a0a0a", border: "1px solid " + (p.progress_pct >= pct ? "#d4a947" : "#2a2a2a"), borderRadius: "100px", fontSize: "10px", color: p.progress_pct >= pct ? "#d4a947" : "#7a7468", cursor: "pointer" }}>
                        {pct}%
                      </button>
                    ))}
                    <button onClick={() => updateStatus(p.books, "done")} style={{ padding: "4px 10px", background: "#0a0a0a", border: "1px solid #7aa87a", borderRadius: "100px", fontSize: "10px", color: "#7aa87a", cursor: "pointer" }}>
                      Finished
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase" }}>Book catalogue</div>
          <div style={{ display: "flex", gap: "4px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "100px", padding: "4px" }}>
            {(["all", "reading", "want", "done"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", background: filter === f ? "#d4a947" : "transparent", color: filter === f ? "#0a0a0a" : "#999080", border: "none", borderRadius: "100px", fontSize: "11px", fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
          {filteredBooks.map(book => {
            const p = getProgress(book.id);
            const isUpdating = updating === book.id;
            return (
              <div key={book.id} style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#8a6f2e"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
                <div style={{ width: "100%", aspectRatio: "2/3", maxHeight: "120px", borderRadius: "4px", background: getCoverBg(book.pillar_tag), border: "1px solid rgba(212,169,71,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "11px", color: "rgba(212,169,71,0.6)", textAlign: "center", padding: "8px" }}>{book.title.split(" ").slice(0, 3).join(" ")}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "13px", color: "#f4ecd8", lineHeight: 1.3, marginBottom: "2px" }}>{book.title}</div>
                  <div style={{ fontSize: "11px", color: "#7a7468", marginBottom: "6px" }}>{book.author}</div>
                  {book.pillar_tag && (
                    <span style={{ fontSize: "9px", color: PILLAR_COLORS[book.pillar_tag] || "#7a7468", padding: "2px 6px", border: "1px solid " + (PILLAR_COLORS[book.pillar_tag] || "#7a7468"), borderRadius: "100px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{book.pillar_tag}</span>
                  )}
                </div>
                {p ? (
                  <div>
                    <div style={{ fontSize: "10px", color: p.status === "done" ? "#7aa87a" : "#d4a947", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>{p.status === "done" ? "Finished" : p.status === "reading" ? "Reading" : "Want to read"}</div>
                    {p.status === "reading" && (
                      <div style={{ height: "3px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: p.progress_pct + "%", background: "#d4a947" }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => updateStatus(book, "reading")} disabled={isUpdating} style={{ flex: 1, padding: "6px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "6px", fontSize: "10px", fontWeight: 600, cursor: "pointer" }}>Read</button>
                    <button onClick={() => updateStatus(book, "want")} disabled={isUpdating} style={{ flex: 1, padding: "6px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "6px", fontSize: "10px", cursor: "pointer" }}>Want</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "13px", color: "#7a7468" }}>
            No books in this shelf yet. Browse the catalogue and start reading.
          </div>
        )}
      </div>
    </div>
  );
}
