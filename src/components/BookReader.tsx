"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface BookReaderProps {
  content: string;
  bookId: string;
  bookTitle: string;
  isPreview: boolean;
  initialProgress?: { pagina_actual: number; palabra_actual: number };
  userId?: string;
}

const WORDS_PER_PAGE = 250;

function splitIntoPages(text: string): string[][] {
  const words = text.split(/\s+/).filter(Boolean);
  const pages: string[][] = [];
  for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
    pages.push(words.slice(i, i + WORDS_PER_PAGE));
  }
  return pages;
}

export default function BookReader({
  content,
  bookId,
  isPreview,
  initialProgress,
  userId,
}: BookReaderProps) {
  const pages = splitIntoPages(content);
  const totalPages = pages.length;

  const [currentPage, setCurrentPage] = useState(
    initialProgress?.pagina_actual ?? 0
  );
  const [fontSize, setFontSize] = useState(16);
  const [nightMode, setNightMode] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [gotoPage, setGotoPage] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [highlightWord, setHighlightWord] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pageText = pages[currentPage]?.join(" ") ?? "";
  const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  // Save reading progress
  const saveProgress = useCallback(
    async (page: number) => {
      if (!userId) return;
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId,
            pagina_actual: page,
            palabra_actual: page * WORDS_PER_PAGE,
            porcentaje: totalPages > 0 ? (page / totalPages) * 100 : 0,
          }),
        });
      } catch {
        // Silently fail
      }
    },
    [userId, bookId, totalPages]
  );

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(0, Math.min(totalPages - 1, page));
      setCurrentPage(clamped);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => saveProgress(clamped), 2000);
    },
    [totalPages, saveProgress]
  );

  // TTS
  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(pageText);
      utterance.lang = "es-ES";
      utterance.rate = 0.95;
      utterance.onend = () => setSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Stop speech on page change
  useEffect(() => {
    window.speechSynthesis?.cancel();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeaking(false);
  }, [currentPage]);

  const bg = nightMode ? "#0d0d12" : "#f8f4ee";
  const fg = nightMode ? "#d8d0c0" : "#1a1a1a";
  const controlBg = nightMode ? "#111" : "#eee";
  const controlBorder = nightMode ? "#2a2a2a" : "#ccc";

  // Highlight word in text
  const renderText = () => {
    if (!highlightWord) return pageText;
    const parts = pageText.split(new RegExp(`(${highlightWord})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlightWord.toLowerCase() ? (
            <mark
              key={i}
              style={{ background: "#c8a96e33", color: "#c8a96e", borderRadius: "2px" }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg, color: fg, minHeight: "100vh" }}>
      {/* Toolbar */}
      <div
        style={{
          background: controlBg,
          borderBottom: `1px solid ${controlBorder}`,
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          position: "sticky",
          top: "52px",
          zIndex: 40,
        }}
      >
        {/* Page navigation */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          style={{
            background: "transparent",
            border: `1px solid ${controlBorder}`,
            color: fg,
            padding: "0.3rem 0.6rem",
            cursor: currentPage === 0 ? "not-allowed" : "pointer",
            opacity: currentPage === 0 ? 0.3 : 1,
            fontSize: "0.9rem",
          }}
        >
          ←
        </button>

        <span style={{ fontSize: "0.75rem", color: nightMode ? "#888" : "#666", letterSpacing: "0.05em", minWidth: "80px", textAlign: "center" }}>
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          style={{
            background: "transparent",
            border: `1px solid ${controlBorder}`,
            color: fg,
            padding: "0.3rem 0.6rem",
            cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
            opacity: currentPage >= totalPages - 1 ? 0.3 : 1,
            fontSize: "0.9rem",
          }}
        >
          →
        </button>

        <div style={{ width: "1px", height: "20px", background: controlBorder, margin: "0 0.25rem" }} />

        {/* Go to page */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const n = parseInt(gotoPage) - 1;
            if (!isNaN(n)) { goToPage(n); setGotoPage(""); }
          }}
          style={{ display: "flex", gap: "0.25rem" }}
        >
          <input
            type="number"
            value={gotoPage}
            onChange={(e) => setGotoPage(e.target.value)}
            placeholder="Ir a..."
            min={1}
            max={totalPages}
            style={{
              background: "transparent",
              border: `1px solid ${controlBorder}`,
              color: fg,
              padding: "0.3rem 0.5rem",
              width: "70px",
              fontSize: "0.75rem",
              fontFamily: "Georgia, serif",
            }}
          />
          <button type="submit" style={{ background: "#c8a96e", border: "none", color: "#0f0f0f", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.75rem" }}>
            Ir
          </button>
        </form>

        <div style={{ width: "1px", height: "20px", background: controlBorder, margin: "0 0.25rem" }} />

        {/* Search word */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setHighlightWord(searchWord);
          }}
          style={{ display: "flex", gap: "0.25rem" }}
        >
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Buscar palabra"
            style={{
              background: "transparent",
              border: `1px solid ${controlBorder}`,
              color: fg,
              padding: "0.3rem 0.5rem",
              width: "100px",
              fontSize: "0.75rem",
              fontFamily: "Georgia, serif",
            }}
          />
          <button type="submit" style={{ background: "transparent", border: `1px solid ${controlBorder}`, color: nightMode ? "#888" : "#444", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.75rem" }}>
            🔍
          </button>
        </form>

        {highlightWord && (
          <button
            onClick={() => { setHighlightWord(""); setSearchWord(""); }}
            style={{ background: "transparent", border: "none", color: "#c87070", cursor: "pointer", fontSize: "0.8rem" }}
          >
            ✕
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* Font size */}
        <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} style={{ background: "transparent", border: `1px solid ${controlBorder}`, color: fg, padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.75rem" }}>A-</button>
        <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} style={{ background: "transparent", border: `1px solid ${controlBorder}`, color: fg, padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.75rem" }}>A+</button>

        {/* Night/Day mode */}
        <button
          onClick={() => setNightMode(!nightMode)}
          style={{ background: "transparent", border: `1px solid ${controlBorder}`, color: fg, padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.8rem" }}
          title={nightMode ? "Modo día" : "Modo noche"}
        >
          {nightMode ? "☀" : "🌙"}
        </button>

        {/* TTS */}
        <button
          onClick={toggleSpeech}
          style={{
            background: speaking ? "#c8a96e" : "transparent",
            border: `1px solid ${speaking ? "#c8a96e" : controlBorder}`,
            color: speaking ? "#0f0f0f" : fg,
            padding: "0.3rem 0.6rem",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
          title={speaking ? "Detener audio" : "Escuchar esta página"}
        >
          {speaking ? "⏹" : "▶"}
        </button>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Text content */}
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          fontSize: `${fontSize}px`,
          lineHeight: 1.9,
          fontFamily: "Georgia, 'Times New Roman', serif",
          flex: 1,
          width: "100%",
        }}
      >
        {isPreview && (
          <div
            style={{
              background: nightMode ? "#1a1a0a" : "#fffbf0",
              border: "1px solid #3a3020",
              padding: "0.75rem 1rem",
              marginBottom: "2rem",
              fontSize: "0.8rem",
              color: "#c8a96e",
            }}
          >
            Vista previa — Estás leyendo las primeras páginas del libro.
          </div>
        )}
        <p style={{ color: fg, whiteSpace: "pre-wrap" }}>
          {typeof renderText() === "string" ? pageText : renderText()}
        </p>
      </div>

      {/* Bottom navigation */}
      <div
        style={{
          borderTop: `1px solid ${controlBorder}`,
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: controlBg,
          position: "sticky",
          bottom: 0,
        }}
      >
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          style={{
            background: "transparent",
            border: `1px solid ${controlBorder}`,
            color: fg,
            padding: "0.5rem 1rem",
            cursor: currentPage === 0 ? "not-allowed" : "pointer",
            opacity: currentPage === 0 ? 0.3 : 1,
            fontSize: "0.85rem",
            fontFamily: "Georgia, serif",
          }}
        >
          ← Anterior
        </button>
        <span style={{ fontSize: "0.75rem", color: nightMode ? "#888" : "#666" }}>
          {progress}% completado
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          style={{
            background: currentPage >= totalPages - 1 ? "transparent" : "#c8a96e",
            border: `1px solid ${currentPage >= totalPages - 1 ? controlBorder : "#c8a96e"}`,
            color: currentPage >= totalPages - 1 ? fg : "#0f0f0f",
            padding: "0.5rem 1rem",
            cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
            opacity: currentPage >= totalPages - 1 ? 0.3 : 1,
            fontSize: "0.85rem",
            fontFamily: "Georgia, serif",
          }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
