import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Pill, SectionTitle, inputStyle, labelStyle } from "../components/ui";
import { COLORS } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { addJournalEntry, getJournalEntries } from "../services/userService";

const EMOTIONS = ["😌 Calm", "😰 Fear", "😡 Revenge", "🤩 Overconfident", "😵 FOMO"];

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ pair: "XAUUSD", direction: "Buy", result: "Win", emotion: EMOTIONS[0], lesson: "" });

  useEffect(() => {
    let active = true;
    getJournalEntries(user.uid).then((data) => {
      if (active) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => (active = false);
  }, [user.uid]);

  const stats = useMemo(() => {
    const total = entries.length;
    const win = entries.filter((e) => e.result === "Win").length;
    const emoCount = {};
    entries.forEach((e) => (emoCount[e.emotion] = (emoCount[e.emotion] || 0) + 1));
    const topEmotion = Object.entries(emoCount).sort((a, b) => b[1] - a[1])[0];
    return { total, win, loss: total - win, topEmotion: topEmotion ? topEmotion[0] : "-" };
  }, [entries]);

  async function handleSave() {
    setSaving(true);
    const entry = { ...form, date: new Date().toLocaleDateString("id-ID") };
    try {
      await addJournalEntry(user.uid, entry);
      setEntries((prev) => [{ id: `local-${Date.now()}`, ...entry }, ...prev]);
      setForm({ ...form, lesson: "" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 20px 90px" }}>
      <SectionTitle eyebrow="MY TRADING JOURNAL" title="Catat dan evaluasi latihanmu" sub="Gunakan data latihan untuk melihat pola — bukan sekadar mencatat untung-rugi." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { l: "Total Trades", v: stats.total },
          { l: "Win", v: stats.win },
          { l: "Loss", v: stats.loss },
          { l: "Emosi Dominan", v: stats.topEmotion },
        ].map((s) => (
          <Card key={s.l} style={{ padding: 14 }}>
            <div style={{ fontSize: 11.5, color: COLORS.muted }}>{s.l}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, marginTop: 4 }}>{s.v}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 14 }}>+ Tambah Journal Entry</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
          <label><span style={labelStyle}>Pair / Instrument</span>
            <input style={inputStyle} value={form.pair} onChange={(e) => setForm({ ...form, pair: e.target.value })} />
          </label>
          <label><span style={labelStyle}>Direction</span>
            <select style={inputStyle} value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
              <option>Buy</option><option>Sell</option>
            </select>
          </label>
          <label><span style={labelStyle}>Result</span>
            <select style={inputStyle} value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}>
              <option>Win</option><option>Loss</option>
            </select>
          </label>
          <label><span style={labelStyle}>Emotion</span>
            <select style={inputStyle} value={form.emotion} onChange={(e) => setForm({ ...form, emotion: e.target.value })}>
              {EMOTIONS.map((e) => <option key={e}>{e}</option>)}
            </select>
          </label>
        </div>
        <label style={{ display: "block", marginTop: 14 }}>
          <span style={labelStyle}>Lesson Learned</span>
          <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.lesson} onChange={(e) => setForm({ ...form, lesson: e.target.value })} />
        </label>
        <div style={{ marginTop: 16 }}>
          <Button variant="primary" disabled={saving} onClick={handleSave}>
            {saving ? "Menyimpan..." : "Simpan Entry (+10 XP)"}
          </Button>
        </div>
      </Card>

      <div style={{ display: "grid", gap: 10 }}>
        {loading && <Card style={{ textAlign: "center", color: COLORS.muted }}>Memuat journal...</Card>}
        {!loading && entries.length === 0 && (
          <Card style={{ textAlign: "center", color: COLORS.muted }}>Belum ada catatan trading. Tambahkan entry pertamamu di atas.</Card>
        )}
        {entries.map((e) => (
          <Card key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700 }}>{e.pair} · {e.direction}</div>
              <div style={{ fontSize: 13, color: COLORS.muted }}>{e.date} · {e.emotion}</div>
              {e.lesson && <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4, maxWidth: 400 }}>{e.lesson}</div>}
            </div>
            <Pill tone={e.result === "Win" ? "teal" : "coral"}>{e.result}</Pill>
          </Card>
        ))}
      </div>
    </div>
  );
}
