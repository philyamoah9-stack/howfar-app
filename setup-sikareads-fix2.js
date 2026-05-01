const fs = require('fs');
const path = require('path');

const content = `"use client";

import { useState, useEffect } from "react";

type Book = { id: string; title: string; author: string; cover_url: string | null; pillar_tag: string | null; sikareads_link: string | null; };
type Progress = { id: string; book_id: string; status: "want" | "reading" | "done"; progress_pct: number; books: Book; };
type Purchase = { book_id: string; book_title: string; book_author: string; book_genre: string; order_ref: string; purchased_at: string; };

const STARTER_BOOKS = [
  { id: "1", title: "The Richest Man in Babylon", author: "George S. Clason", cover_url: null, pillar_tag: "Finance", sikareads_link: null, isbn: "9780451205360" },
  { id: "2", title: "Atomic Habits", author: "James Clear", cover_url: null, pillar_tag: "Mind", sikareads_link: null, isbn: "9780735211292" },
  { id: "3", title: "The Purpose Driven Life", author: "Rick Warren", cover_url: null, pillar_tag: "Faith", sikareads_link: null, isbn: "9780310330023" },
  { id: "4", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", cover_url: null, pillar_tag: "Finance", sikareads_link: null, isbn: "9781612680194" },
  { id: "5", title: "Think and Grow Rich", author: "Napoleon Hill", cover_url: null, pillar_tag: "Mind", sikareads_link: null, isbn: "9781585424337" },
  { id: "6", title: "The Total Money Makeover", author: "Dave Ramsey", cover_url: null, pillar_tag: "Finance", sikareads_link: null, isbn: "9781595555274" },
  { id: "7", title: "Boundaries", author: "Dr. Henry Cloud", cover_url: null, pillar_tag: "Family", sikareads_link: null, isbn: "9780310247456" },
  { id: "8", title: "Deep Work", author: "Cal Newport", cover_url: null, pillar_tag: "Career", sikareads_link: null, isbn: "9781455586691" },
];

const COVER_COLORS: Record<string, string> = {
  Finance: "linear-gradient(135deg, #1a3352 0%, #0c1f36 100%)",
  Mind: "linear-gradient(135deg, #1a2a3a 0%, #0c1620 100%)",
  Faith: "linear-gradient(135deg, #2a2010 0%, #1a1408 100%)",
  Health: "linear-gradient(135deg, #1a2a1a 0%, #0c160c 100%)",
  Family: "linear-gradient(135deg, #2a1a2a 0%, #160c16 100%)",
  Career: "linear-gradient(135deg, #2a2010 0%, #1a1408 100%)",
  Purpose: "linear-gradient(135deg, #1a1a2a 0%, #0c0c16 100%)",
};

const PILLAR_COLORS: Record<string, string> = {
  Finance: "#d4a947", Mind: "#6a8ac0", Faith: "#e8c16d",
  Health: "#7aa87a", Family: "#a87a8a", Career: "#c09a6a", Purpose: "#8a7ac0",
};

const ISBN_MAP: Record<string, string> = {
  "1": "9780451205360", "2": "9780735211292", "3": "9780310330023",
  "4": "9781612680194", "5": "9781585424337", "6": "9781595555274",
  "7": "9780310247456", "8": "9781455586691",
};

type Props = {
  userId: string;
  userEmail: string;
  books: Book[];
  progress: Progress[];
  purchases: Purchase[];
};

export default function SikareadsClient({ userId, userEmail, books, progress, purchases }: Props) {
  const [myProgress, setMyProgress] = useState<Progress[]>(progress);
  const [filter, setFilter] = useState<"all" | "reading" | "want" | "done">("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [coverErrors, setCoverErrors] = useState<Record<string, boolean>>({});

  const allBooks = books.length > 0 ? books : STARTER_BOOKS;

  const getProgress = (bookId: string) => myProgress.find(p => p.book_id === bookId);

  const reading = myProgress.filter(p => p.status === "reading");
  const done = myProgress.filter(p => p.status === "done");
  const want = myProgress.filter(p => p.status === "want");

  // Auto-add purchased books
  useEffect(() => {
    const addPurchasedBooks = async () => {
      if (purchases.length === 0) return;
      const untracked = purchases.filter(p =>
        !myProgress.some(pr => pr.book_id === p.book_id)
      );
      if (untracked.length === 0) return;
      try {
        const supabase = (await import("../../lib/supabase")).createClient();
        for (const purchase of untracked) {
          const { data } = await supabase
            .from("reading_progress")
            .insert({ user_id: userId, book_id: purchase.book_id, status: "want", progress_pct: 0 })
            .select("*, books(*)")
            .single();
          if (data) setMyProgress(prev => [...prev, data]);
        }
      } catch (e) { console.error(e); }
    };
    addPurchasedBooks();
  }, []);

  const updateStatus = async (bookId: string, book: Book, status: "want" | "reading" | "done") => {
    setUpdating(bookId);
    try {
      const supabase = (await import("../../lib/supabase")).createClient();
      const existing = myProgress.find(p => p.book_id === bookId);
      if (existing) {
        const { data } = await supabase.from("reading_progress")
          .update({ status, ...(status === "done" ? { progress_pct: 100, finished_at: new Date().toISOString() } : {}) })
          .eq("id", existing.id).select("*, books(*)").single();
        if (data) setMyProgress(prev => prev.map(p => p.id === existing.id ? data : p));
      } else {
        const { data } = await supabase.from("reading_progress")
          .insert({ user_id: userId, book_id: bookId, status, progress_pct: status === "done" ? 100 : 0, ...(status === "reading" ? { started_at: new Date().toISOString() } : {}) })
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

  const filteredBooks = filter === "all" ? allBooks :
    allBooks.filter(b => {
      const p = getProgress(b.id);
      return p?.status === filter;
    });

  const getCoverUrl = (bookId: string) => {
    const isbn = ISBN_MAP[bookId];
    if (!isbn || coverErrors[bookId]) return null;
    return \`https://covers.openlibrary.org/b/isbn/\${isbn}-M.jpg\`;
  };

  return (
    <div style={{ padding: "40px 48px" }}>
      {/* Header */}
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

      {/* Stats */}
      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Reading now", value: reading.length, color: "#d4a947", sub: "Books in progress" },
          { label: "Finished", value: done.length, color: "#7aa87a", sub: "Books completed" },
          { label: "Purchased", value: purchases.length, color: "#f4ecd8", sub: "From sikareads.com" },
        ].map(card => (
          <div key={card.label} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#7a7468", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>{card.label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "52px", fontWeight: 300, color: card.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px" }}>{card.value}</div>
            <div style={{ fontSize: "12px", color: "#7a7468" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Currently reading */}
      {reading.length > 0 && (
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "22px", marginBottom: "16px" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#d4a947", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Currently reading</div>
          {reading.map(p => {
            const coverUrl = getCoverUrl(p.book_id);
            return (
              <div key={p.id} style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "68px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, background: COVER_COLORS[p.books?.pillar_tag || ""] || "#1a1a1a" }}>
                  {coverUrl ? (
                    <img src={coverUrl} alt={p.books?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setCoverErrors(prev => ({ ...prev, [p.book_id]: true }))} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontFamily: "Fraunces, serif", fontSize: "9px", color: "rgba(212,169,71,0.6)", textAlign: "center", padding: "4px" }}>{p.books?.title?.split(" ")[0]}</div>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#f4ecd8", marginBottom: "2px" }}>{p.books?.title}</div>
                  <div style={{ fontSize: "12px", color: "#7a7468", marginBottom: "10px" }}>{p.books?.author}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ flex: 1, height: "4px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: p.progress_pct + "%", background: "#d4a947", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#d4a947" }}>{p.progress_pct}%</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {[25, 50, 75, 100].map(pct => (
                      <button key={pct} onClick={() => updateProgress(p.id, pct)} style={{ padding: "4px 10px", background: p.progress_pct >= pct ? "rgba(212,169,71,0.2)" : "#0a0a0a", border: "1px solid " + (p.progress_pct >= pct ? "#d4a947" : "#2a2a2a"), borderRadius: "100px", fontSize: "10px", color: p.progress_pct >= pct ? "#d4a947" : "#7a7468", cursor: "pointer" }}>
                        {pct}%
                      </button>
                    ))}
                    <button onClick={() => updateStatus(p.book_id, p.books, "done")} style={{ padding: "4px 10px", background: "#0a0a0a", border: "1px solid #7aa87a", borderRadius: "100px", fontSize: "10px", color: "#7aa87a", cursor: "pointer" }}>Finished</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Catalogue */}
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
          {filteredBooks.map(book => {
            const p = getProgress(book.id);
            const isUpdating = updating === book.id;
            const isPurchased = purchases.some(pu => pu.book_id === book.id);
            const coverUrl = getCoverUrl(book.id);

            return (
              <div key={book.id} style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#8a6f2e"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>

                {/* Cover image */}
                <a href={\`https://sikareads.com/books/\${book.id}\`} target="_blank" rel="noopener noreferrer" style={{ display: "block", height: "180px", background: COVER_COLORS[book.pillar_tag || ""] || "#1a1a1a", position: "relative", overflow: "hidden" }}>
                  {coverUrl && !coverErrors[book.id] ? (
                    <img
                      src={coverUrl}
                      alt={book.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={() => setCoverErrors(prev => ({ ...prev, [book.id]: true }))}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "12px", color: "rgba(212,169,71,0.7)", lineHeight: 1.3 }}>{book.title.split(" ").slice(0, 4).join(" ")}</div>
                        <div style={{ fontSize: "10px", color: "rgba(212,169,71,0.4)", marginTop: "6px" }}>{book.author.split(" ").slice(-1)[0]}</div>
                      </div>
                    </div>
                  )}
                  {isPurchased && (
                    <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(122,168,122,0.9)", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 7px", borderRadius: "100px" }}>✓ Owned</div>
                  )}
                </a>

                {/* Info */}
                <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <a href={\`https://sikareads.com/books/\${book.id}\`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: "13px", color: "#f4ecd8", lineHeight: 1.3, fontWeight: 600 }}>{book.title}</div>
                  </a>
                  <div style={{ fontSize: "11px", color: "#7a7468" }}>{book.author}</div>

                  {book.pillar_tag && (
                    <span style={{ alignSelf: "flex-start", fontSize: "9px", color: PILLAR_COLORS[book.pillar_tag] || "#7a7468", padding: "2px 6px", border: "1px solid", borderColor: PILLAR_COLORS[book.pillar_tag] || "#7a7468", borderRadius: "100px" }}>{book.pillar_tag}</span>
                  )}

                  {/* Action buttons */}
                  <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                    {p ? (
                      <div>
                        <div style={{ fontSize: "10px", color: p.status === "done" ? "#7aa87a" : "#d4a947", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                          {p.status === "done" ? "✓ Finished" : p.status === "reading" ? "Reading" : "Want to read"}
                        </div>
                        {p.status === "reading" && (
                          <div style={{ height: "3px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: p.progress_pct + "%", background: "#d4a947" }} />
                          </div>
                        )}
                        {p.status !== "done" && (
                          <button
                            onClick={e => { e.stopPropagation(); updateStatus(book.id, book, p.status === "want" ? "reading" : "done"); }}
                            disabled={isUpdating}
                            style={{ marginTop: "6px", width: "100%", padding: "6px", background: "transparent", border: "1px solid #2a2a2a", color: "#999080", borderRadius: "6px", fontSize: "10px", cursor: "pointer" }}>
                            {isUpdating ? "..." : p.status === "want" ? "Start reading" : "Mark done"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={e => { e.stopPropagation(); updateStatus(book.id, book, "reading"); }}
                          disabled={isUpdating}
                          style={{ flex: 1, padding: "7px 4px", background: "#d4a947", border: "none", color: "#0a0a0a", borderRadius: "6px", fontSize: "10px", fontWeight: 600, cursor: "pointer" }}>
                          {isUpdating ? "..." : "Read"}
                        </button>
                        
                          href={\`https://sikareads.com/books/\${book.id}\`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ flex: 1, padding: "7px 4px", background: "transparent", border: "1px solid #d4a947", color: "#d4a947", borderRadius: "6px", fontSize: "10px", fontWeight: 600, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>
                          Buy
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "13px", color: "#7a7468" }}>
            No books in this shelf yet.
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(
  path.join(__dirname, 'app', 'dashboard', 'sikareads', 'SikareadsClient.tsx'),
  content, 'utf8'
);
console.log('Done: SikareadsClient.tsx rewritten with book covers and Buy button');