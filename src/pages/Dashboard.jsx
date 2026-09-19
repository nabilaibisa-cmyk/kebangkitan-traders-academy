import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Pill, ProgressBar } from "../components/ui";
import { COLORS } from "../styles/theme";
import { LEVELS, XP_PER_LEVEL } from "../data/levels";
import { LESSON_LEVELS, ALL_LESSONS } from "../data/lessons";
import { BADGES } from "../data/badges";
import { useAuth } from "../context/AuthContext";
import { getJournalEntries } from "../services/userService";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    getJournalEntries(user.uid).then((entries) => setJournalCount(entries.length));
  }, [user.uid]);

  if (!profile) return null;

  const completedLessons = new Set(profile.completedLessons || []);
  const challengeCount = (profile.challengeDays || []).length;
  const xpIntoLevel = profile.xp % XP_PER_LEVEL;
  const pct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 20px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ color: COLORS.muted, fontSize: 14 }}>👋 Halo,</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px,4vw,34px)", margin: "4px 0" }}>{profile.name}</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Pill tone="amber">Level {profile.level} · {profile.levelName}</Pill>
          <Pill tone="coral">🔥 {profile.streak || 0} Day Streak</Pill>
          {profile.premium && <Pill tone="teal">⭐ Premium Member</Pill>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="dash-grid">
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: COLORS.muted }}>Learning Progress</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: COLORS.amber }}>
              {profile.xp.toLocaleString("id-ID")} XP
            </span>
          </div>
          <ProgressBar value={pct} tone="amber" height={10} />

          <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
            {LEVELS.map((l) => {
              const isLocked = l.premium && !profile.premium;
              const lessons = LESSON_LEVELS[l.key] || [];
              if (l.linkTo) {
                return (
                  <div
                    key={l.id}
                    onClick={() => navigate(l.linkTo)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, cursor: "pointer" }}
                  >
                    <span>🎯 {l.name}</span>
                    <span style={{ color: COLORS.teal }}>Buka →</span>
                  </div>
                );
              }
              const value = l.built && !isLocked ? (lessons.filter((les) => completedLessons.has(les.id)).length / lessons.length) * 100 : 0;
              return (
                <div key={l.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{l.name} {isLocked && "🔒"}</span>
                    <span style={{ color: COLORS.muted }}>{isLocked ? "Premium" : `${Math.round(value)}%`}</span>
                  </div>
                  <ProgressBar value={value} />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => navigate("/roadmap")}
              style={{ background: COLORS.teal, color: "#08231F", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 600, cursor: "pointer" }}
            >
              Continue Learning →
            </button>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>Ringkasan Aktivitas</div>
          <div style={{ display: "grid", gap: 14 }}>
            <Row label="📓 Journal entries" value={journalCount} />
            <Row label="🏆 Challenge days" value={`${challengeCount}/30`} />
            <Row label="📚 Materi selesai" value={`${completedLessons.size}/${ALL_LESSONS.length}`} />
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14 }}>Achievements</div>
        {(!profile.badges || profile.badges.length === 0) ? (
          <div style={{ color: COLORS.muted, fontSize: 13.5 }}>Badge pertamamu menunggu! Selesaikan materi pertama untuk mendapatkannya.</div>
        ) : (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {profile.badges.map((b) => {
              const badge = BADGES[b];
              if (!badge) return null;
              return (
                <div key={b} style={{ textAlign: "center", width: 92 }}>
                  <div style={{ fontSize: 30, background: COLORS.surfaceAlt, borderRadius: 12, padding: "12px 0", border: `1px solid ${COLORS.line}` }}>{badge.icon}</div>
                  <div style={{ fontSize: 11.5, marginTop: 6, color: COLORS.muted }}>{badge.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13.5 }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    </div>
  );
}
