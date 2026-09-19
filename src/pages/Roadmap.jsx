import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Pill, ProgressBar, SectionTitle, Button } from "../components/ui";
import { COLORS } from "../styles/theme";
import { LEVELS } from "../data/levels";
import { LESSON_LEVELS } from "../data/lessons";
import { PREMIUM_PRICE_LABEL } from "../data/pricing";
import { useAuth } from "../context/AuthContext";
import { createPremiumTransaction, payWithSnap } from "../services/paymentService";

export default function Roadmap() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const completed = new Set(profile?.completedLessons || []);
  const [payingLevel, setPayingLevel] = useState(null);
  const [payError, setPayError] = useState("");

  async function handleUnlock(level) {
    setPayError("");
    setPayingLevel(level.id);
    try {
      const token = await createPremiumTransaction({
        uid: user.uid,
        name: profile?.name || user.displayName || "Trader",
        email: user.email,
      });
      payWithSnap(token, {
        onSuccess: () => {
          // Firestore's `premium` field flips via the webhook + realtime
          // subscription in AuthContext — no manual state update needed here.
          setPayingLevel(null);
        },
        onPending: () => setPayingLevel(null),
        onError: (err) => {
          setPayError(typeof err === "string" ? err : err?.message || "Pembayaran gagal, coba lagi.");
          setPayingLevel(null);
        },
        onClose: () => setPayingLevel(null),
      });
    } catch (err) {
      setPayError(err.message || "Gagal memulai pembayaran.");
      setPayingLevel(null);
    }
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 20px 80px" }}>
      <SectionTitle
        eyebrow="TRADING LEARNING ROADMAP"
        title="Perjalanan belajarmu"
        sub="Setiap level membangun fondasi untuk level berikutnya. Selesaikan level sebelumnya dulu sebelum lanjut."
      />
      <div style={{ display: "grid", gap: 14 }}>
        {LEVELS.map((lvl) => {
          const isLinkLevel = !!lvl.linkTo;
          const lessons = LESSON_LEVELS[lvl.key] || [];
          const doneCount = lvl.built && !isLinkLevel ? lessons.filter((l) => completed.has(l.id)).length : 0;
          const total = lvl.built && !isLinkLevel ? lessons.length : null;
          const isLocked = lvl.premium && !profile?.premium;

          return (
            <Card key={lvl.id} style={{ opacity: lvl.built ? 1 : 0.65 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Pill tone="teal">{lvl.tag}</Pill>
                    {lvl.premium && <Pill tone="amber">{isLocked ? "🔒 Premium" : "✓ Premium Terbuka"}</Pill>}
                    {isLinkLevel && <Pill tone="amber">🎯 Tujuan Akhir</Pill>}
                  </div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 21, marginTop: 8 }}>{lvl.name}</div>
                  {isLinkLevel ? (
                    <div style={{ color: COLORS.muted, fontSize: 13.5, marginTop: 6 }}>
                      Praktikkan semua yang sudah kamu pelajari dari Level 1-6 di sini
                    </div>
                  ) : lvl.built ? (
                    <div style={{ color: COLORS.muted, fontSize: 13.5, marginTop: 6 }}>
                      {isLocked ? "Buka akses untuk mulai belajar modul ini" : `${doneCount}/${total} materi selesai`}
                    </div>
                  ) : (
                    <div style={{ color: COLORS.mutedDim, fontSize: 13.5, marginTop: 6 }}>Dibuka pada tahap pengembangan berikutnya</div>
                  )}
                </div>
                {lvl.built && !isLocked && !isLinkLevel && (
                  <div style={{ minWidth: 140 }}>
                    <ProgressBar value={(doneCount / total) * 100} />
                  </div>
                )}
              </div>

              {isLinkLevel && (
                <div style={{ marginTop: 16, background: COLORS.surfaceAlt, borderRadius: 10, padding: 18 }}>
                  <div style={{ fontSize: 14, color: COLORS.text, marginBottom: 14 }}>
                    Ini titik puncak roadmap — akun demo dengan saldo virtual, 8 pair forex + emas, dan harga yang mengikuti kurs referensi pasar sungguhan. Gratis, tanpa batas latihan.
                  </div>
                  <Button variant="primary" onClick={() => navigate(lvl.linkTo)}>🧪 Buka Trading Simulator →</Button>
                </div>
              )}

              {lvl.built && isLocked && !isLinkLevel && (
                <div style={{ marginTop: 16, background: COLORS.surfaceAlt, borderRadius: 10, padding: 18 }}>
                  <div style={{ fontSize: 14, color: COLORS.text, marginBottom: 4 }}>
                    Modul ini membahas risk management secara mendalam — position sizing, Stop Loss, drawdown, sampai psikologi menghindari overtrading.
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14 }}>
                    Buka selamanya dengan sekali bayar {PREMIUM_PRICE_LABEL}. Pembayaran diproses aman lewat Midtrans (GoPay, OVO, transfer bank, QRIS).
                  </div>
                  {payError && <div style={{ color: COLORS.coral, fontSize: 13, marginBottom: 10 }}>{payError}</div>}
                  <Button variant="amber" disabled={payingLevel === lvl.id} onClick={() => handleUnlock(lvl)}>
                    {payingLevel === lvl.id ? "Membuka pembayaran..." : `🔓 Buka Akses Premium — ${PREMIUM_PRICE_LABEL}`}
                  </Button>
                </div>
              )}

              {lvl.built && !isLocked && !isLinkLevel && (
                <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
                  {lessons.map((les, i) => {
                    const done = completed.has(les.id);
                    return (
                      <div
                        key={les.id}
                        onClick={() => navigate(`/roadmap/${les.id}`)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: COLORS.surfaceAlt,
                          borderRadius: 10,
                          padding: "12px 14px",
                          cursor: "pointer",
                          border: `1px solid ${done ? COLORS.tealDim : "transparent"}`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ color: done ? COLORS.teal : COLORS.mutedDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                            {done ? "✓" : String(i + 1).padStart(2, "0")}
                          </span>
                          <span style={{ fontSize: 14.5 }}>{les.title}</span>
                        </div>
                        <span style={{ color: COLORS.mutedDim, fontSize: 13 }}>{done ? "Selesai" : "Mulai →"}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
