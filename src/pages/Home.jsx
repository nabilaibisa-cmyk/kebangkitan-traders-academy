import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Pill, SectionTitle, ProgressBar } from "../components/ui";
import { COLORS } from "../styles/theme";
import { LEVELS } from "../data/levels";
import { LESSON_LEVELS } from "../data/lessons";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  return (
    <div>
      <div style={{ padding: "56px 20px 40px", maxWidth: 720, margin: "0 auto" }}>
        <Pill tone="teal">EDUKASI FOREX UNTUK PEMULA</Pill>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: "clamp(32px, 6vw, 52px)",
            lineHeight: 1.08,
            color: COLORS.text,
            margin: "18px 0 16px",
          }}
        >
          Trading bukan tentang selalu menang.
          <br />
          <span style={{ color: COLORS.teal }}>Trading dimulai dari memahami.</span>
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 17, lineHeight: 1.7, maxWidth: 520 }}>
          Pelajari dasar forex, cara membaca chart, risk management, dan psikologi trading —
          lalu praktikkan lewat kalkulator dan trading journal. Satu platform, langkah demi
          langkah dari nol.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
          <Button variant="primary" onClick={() => navigate(user ? "/roadmap" : "/register")}>
            🚀 Mulai Belajar Gratis
          </Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>▶ Lihat Cara Kerja</Button>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 12.5,
            color: COLORS.mutedDim,
            borderLeft: `2px solid ${COLORS.coral}`,
            paddingLeft: 10,
            maxWidth: 460,
            lineHeight: 1.6,
          }}
        >
          Trading memiliki risiko kerugian. Platform ini ditujukan untuk tujuan edukasi, bukan nasihat investasi.
        </div>
      </div>

      {profile && (
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px 56px" }}>
          <Card style={{ background: `linear-gradient(160deg, ${COLORS.surface}, ${COLORS.surfaceAlt})` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ color: COLORS.muted, fontSize: 13 }}>Progress belajarmu</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: COLORS.text, marginTop: 4 }}>
                  Forex Fundamental
                </div>
              </div>
              <Pill tone="amber">⭐ +20 XP / materi selesai</Pill>
            </div>
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 14 }}>
              {LEVELS.map((l) => {
                const isLocked = l.premium && !profile.premium;
                const lessons = LESSON_LEVELS[l.key] || [];
                const completed = new Set(profile.completedLessons || []);
                const value = l.built && !isLocked && !l.linkTo ? (lessons.filter((les) => completed.has(les.id)).length / lessons.length) * 100 : 0;
                return (
                  <div key={l.id}>
                    <div style={{ fontSize: 12.5, color: COLORS.muted, marginBottom: 6 }}>{l.name} {isLocked && "🔒"}</div>
                    <ProgressBar value={value} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px 56px" }}>
        <SectionTitle eyebrow="KENAPA KEBANGKITAN TRADERS?" title="Belajar dengan cara yang menempel" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
          {[
            { icon: "📚", t: "Belajar Bertahap", d: "Materi disusun dari level paling dasar sampai lanjutan, tanpa istilah yang bikin pusing." },
            { icon: "🧪", t: "Praktik dengan Simulator", d: "Latihan mengambil keputusan memakai uang virtual — bukan uang sungguhan." },
            { icon: "🛡️", t: "Risk Management", d: "Belajar memahami risiko sebelum memikirkan keuntungan." },
            { icon: "🧠", t: "Trading Psychology", d: "Memahami FOMO, revenge trading, overconfidence, dan disiplin." },
            { icon: "📓", t: "Trading Journal", d: "Mencatat dan mengevaluasi setiap latihan trading yang kamu lakukan." },
            { icon: "🏆", t: "Gamified Learning", d: "Kumpulkan XP, naik level, buka badge, dan jaga learning streak-mu." },
          ].map((c) => (
            <Card key={c.t}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{c.t}</div>
              <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{c.d}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
