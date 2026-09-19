import React, { useState } from "react";
import { Card, ProgressBar, SectionTitle } from "../components/ui";
import { CHALLENGE_DAYS } from "../data/challengeDays";
import { useAuth } from "../context/AuthContext";
import { toggleChallengeDay } from "../services/userService";

export default function Challenge() {
  const { user, profile, refreshProfile } = useAuth();
  const [busyDay, setBusyDay] = useState(null);
  const completedDays = new Set(profile?.challengeDays || []);

  async function handleToggle(day) {
    setBusyDay(day);
    try {
      const updated = await toggleChallengeDay(user.uid, profile, day, 100);
      refreshProfile(updated);
    } finally {
      setBusyDay(null);
    }
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 20px 90px" }}>
      <SectionTitle eyebrow="30 DAYS FOREX LEARNING CHALLENGE" title="Konsisten selama 30 hari" sub="Satu materi kecil per hari, agar belajar forex terasa ringan dan berkelanjutan." />
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.75, marginBottom: 6 }}>
          <span>Progress Challenge</span>
          <span>{completedDays.size}/30 hari</span>
        </div>
        <ProgressBar value={(completedDays.size / 30) * 100} tone="amber" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
        {CHALLENGE_DAYS.map((title, i) => {
          const day = i + 1;
          const done = completedDays.has(day);
          return (
            <Card
              key={day}
              onClick={() => busyDay === null && handleToggle(day)}
              style={{
                padding: 14,
                borderColor: done ? "#45D6C0" : undefined,
                background: done ? "#1F575022" : undefined,
                opacity: busyDay === day ? 0.6 : 1,
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: done ? "#45D6C0" : "#5F6B8C" }}>
                DAY {day} {done && "✓"}
              </div>
              <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>{title}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
