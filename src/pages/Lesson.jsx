import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LESSON_LEVELS, findLesson } from "../data/lessons";
import { LEVELS } from "../data/levels";
import { Card, Button, Pill } from "../components/ui";
import { COLORS } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { markLessonComplete } from "../services/userService";

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const lesson = findLesson(lessonId);
  const [phase, setPhase] = useState("read");
  const [picked, setPicked] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!lesson) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Materi tidak ditemukan. <button onClick={() => navigate("/roadmap")}>Kembali</button>
      </div>
    );
  }

  const levelInfo = LEVELS.find((l) => l.key === lesson.levelKey);
  const levelLessons = LESSON_LEVELS[lesson.levelKey] || [];
  const idx = levelLessons.findIndex((l) => l.id === lesson.id);

  // Defense in depth: even if someone lands on a premium lesson's URL
  // directly, block it here too (Roadmap already hides the list).
  if (levelInfo?.premium && !profile?.premium) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 8 }}>Materi ini bagian dari Premium</div>
        <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>Buka akses lewat halaman Roadmap untuk mempelajari materi ini.</div>
        <Button variant="primary" onClick={() => navigate("/roadmap")}>Kembali ke Roadmap</Button>
      </div>
    );
  }

  const isDone = profile?.completedLessons?.includes(lesson.id);
  const isCorrect = picked === lesson.quiz.correct;

  async function handleComplete() {
    if (isDone) {
      setPhase("done");
      return;
    }
    setSaving(true);
    try {
      const updated = await markLessonComplete(user.uid, profile, lesson.id, 20);
      refreshProfile(updated);
    } finally {
      setSaving(false);
      setPhase("done");
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 90px" }}>
      <button onClick={() => navigate("/roadmap")} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>
        ← Kembali ke roadmap
      </button>
      <Pill tone="teal">{levelInfo?.tag} · MATERI {idx + 1}/{levelLessons.length}</Pill>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px,4vw,32px)", margin: "14px 0 18px" }}>{lesson.title}</h1>

      {phase === "read" && (
        <>
          <div style={{ color: COLORS.text, lineHeight: 1.8, fontSize: 15.5, whiteSpace: "pre-line" }}>{lesson.body}</div>
          <div style={{ marginTop: 28 }}>
            <Button variant="primary" onClick={() => setPhase("quiz")}>Lanjut ke Mini Quiz →</Button>
          </div>
        </>
      )}

      {phase === "quiz" && (
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>{lesson.quiz.q}</div>
          <div style={{ display: "grid", gap: 10 }}>
            {lesson.quiz.options.map((opt, i) => {
              const chosen = picked === i;
              let border = COLORS.line;
              if (picked !== null && i === lesson.quiz.correct) border = COLORS.teal;
              else if (chosen) border = COLORS.coral;
              return (
                <div
                  key={i}
                  onClick={() => picked === null && setPicked(i)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: `1px solid ${border}`,
                    background: COLORS.surfaceAlt,
                    cursor: picked === null ? "pointer" : "default",
                    fontSize: 14.5,
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
          {picked !== null && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: isCorrect ? COLORS.teal : COLORS.text, fontWeight: 700, marginBottom: 6 }}>
                {isCorrect ? "🎉 Benar! Kamu memahami konsep ini." : "Belum tepat. Mari lihat kembali konsepnya."}
              </div>
              <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{lesson.quiz.explain}</div>
              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                {!isCorrect && <Button variant="ghost" onClick={() => setPicked(null)}>Coba Lagi</Button>}
                <Button variant="primary" disabled={saving} onClick={handleComplete}>
                  {isDone ? "Selesai" : saving ? "Menyimpan..." : "Selesaikan Materi (+20 XP)"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {phase === "done" && (
        <Card style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 6 }}>Materi selesai!</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>+20 XP ditambahkan ke akun belajarmu.</div>
          <Button variant="primary" onClick={() => navigate("/roadmap")}>Kembali ke Roadmap</Button>
        </Card>
      )}
    </div>
  );
}
