import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Button, Pill, SectionTitle, inputStyle, labelStyle } from "../components/ui";
import { COLORS } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { addSimTrade, getSimTrades, resetSimAccount } from "../services/userService";
import { PAIRS, findPair } from "../data/pairs";
import { fetchReferencePrices } from "../services/marketService";
import TradingViewChart from "../components/TradingViewChart";

function randomWalk(start, steps, stepSize) {
  const path = [start];
  for (let i = 0; i < steps; i++) {
    const change = (Math.random() - 0.5) * stepSize;
    path.push(path[path.length - 1] + change);
  }
  return path;
}

export default function Simulator() {
  const { user, profile, refreshProfile } = useAuth();
  const [symbol, setSymbol] = useState("EURUSD");
  const [refPrices, setRefPrices] = useState(null);
  const [refDate, setRefDate] = useState(null);
  const [loadingRef, setLoadingRef] = useState(true);
  const [prices, setPrices] = useState({}); // symbol -> current practice price
  const [mode, setMode] = useState(null);
  const [direction, setDirection] = useState("Buy");
  const [slPts, setSlPts] = useState(20);
  const [tpPts, setTpPts] = useState(40);
  const [riskPct, setRiskPct] = useState(1);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [trades, setTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const tickRef = useRef(null);

  const pair = findPair(symbol);
  const balance = profile?.simBalance ?? 10000000;
  const currentPrice = prices[symbol];

  // Fetch real reference prices once on mount, seed each pair's internal
  // practice price from its real reference.
  useEffect(() => {
    fetchReferencePrices().then(({ prices: refs, date }) => {
      setRefPrices(refs);
      setRefDate(date);
      const initial = {};
      for (const p of PAIRS) {
        initial[p.symbol] = refs[p.symbol]?.price ?? p.fallback;
      }
      setPrices(initial);
      setLoadingRef(false);
    });
  }, []);

  // Internal practice-price engine: ticks quietly in the background so
  // BUY/SELL/WAIT has a current price to work from. Not shown as a chart —
  // the chart above is the real TradingView candlestick feed.
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setPrices((prev) => {
        const cur = prev[symbol];
        if (cur == null) return prev;
        const step = (Math.random() - 0.5) * pair.chartVol * pair.tickSize;
        return { ...prev, [symbol]: cur + step };
      });
    }, 1800);
    return () => clearInterval(tickRef.current);
  }, [symbol, pair.chartVol, pair.tickSize]);

  useEffect(() => {
    getSimTrades(user.uid).then((data) => {
      setTrades(data);
      setLoadingTrades(false);
    });
  }, [user.uid]);

  const stats = useMemo(() => {
    const closed = trades.filter((t) => t.direction !== "Wait");
    const wins = closed.filter((t) => t.result === "Win").length;
    const avgRisk = closed.length ? (closed.reduce((s, t) => s + (t.riskPct || 0), 0) / closed.length).toFixed(1) : "-";
    return { total: closed.length, wins, losses: closed.length - wins, avgRisk };
  }, [trades]);

  function openForm(dir) {
    setDirection(dir);
    setMode("form");
    setResult(null);
  }

  async function handleWait() {
    setBusy(true);
    try {
      const trade = { pair: pair.label, direction: "Wait", entry: currentPrice, pnl: 0, riskPct: 0, result: "Wait", balanceAfter: balance };
      const updated = await addSimTrade(user.uid, profile, trade);
      refreshProfile(updated);
      setTrades((prev) => [{ id: `local-${Date.now()}`, ...trade }, ...prev]);
      setMode("waited");
    } finally {
      setBusy(false);
    }
  }

  async function handleExecute() {
    setBusy(true);
    try {
      const entry = currentPrice;
      const dirMult = direction === "Buy" ? 1 : -1;
      const riskAmount = (balance * riskPct) / 100;
      const dollarPerPoint = slPts > 0 ? riskAmount / slPts : 0;

      const path = randomWalk(entry, 40, pair.chartVol * pair.tickSize);
      let outcome = "Time";
      let exitPrice = path[path.length - 1];

      for (const p of path.slice(1)) {
        const movePts = ((p - entry) / pair.tickSize) * dirMult;
        if (movePts <= -slPts) {
          outcome = "Loss";
          exitPrice = p;
          break;
        }
        if (movePts >= tpPts) {
          outcome = "Win";
          exitPrice = p;
          break;
        }
      }

      let pnl;
      if (outcome === "Loss") pnl = -riskAmount;
      else if (outcome === "Win") pnl = tpPts * dollarPerPoint;
      else pnl = ((exitPrice - entry) / pair.tickSize) * dirMult * dollarPerPoint;

      const finalResult = outcome === "Time" ? (pnl >= 0 ? "Win" : "Loss") : outcome;

      const trade = {
        pair: pair.label,
        direction,
        entry,
        sl: slPts,
        tp: tpPts,
        riskPct: Number(riskPct),
        exitPrice,
        pnl: Math.round(pnl),
        result: finalResult,
        balanceAfter: Math.round(balance + pnl),
      };

      const updated = await addSimTrade(user.uid, profile, trade);
      refreshProfile(updated);
      setTrades((prev) => [{ id: `local-${Date.now()}`, ...trade }, ...prev]);
      setResult(trade);
      setMode("result");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    setBusy(true);
    try {
      const updated = await resetSimAccount(user.uid, profile);
      refreshProfile(updated);
      setMode(null);
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  const isLive = refPrices?.[symbol]?.isLive;

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 20px 90px" }}>
      <SectionTitle
        eyebrow="TRADING SIMULATOR"
        title="Latihan dengan Uang Virtual"
        sub="Baca chart pasar sungguhan, lalu praktikkan pengambilan keputusan dengan saldo virtual."
      />

      <div style={{ marginBottom: 16, background: COLORS.coralDim, border: `1px solid ${COLORS.coral}`, borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: COLORS.text, fontWeight: 600 }}>
        ⚠️ SIMULASI EDUKASI — BUKAN AKUN TRADING RIIL. Chart di bawah menampilkan data pasar sungguhan (TradingView,
        real-time) untuk latihan membaca arah pasar. Eksekusi BUY/SELL/WAIT memakai mesin harga latihan terpisah
        (harga awal mengikuti kuotasi pasar terkini, pergerakan berikutnya disimulasikan) — angkanya bisa sedikit
        berbeda dari chart di atas karena sumber datanya berbeda penyedia.
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <select
              value={symbol}
              onChange={(e) => {
                setSymbol(e.target.value);
                setMode(null);
                setResult(null);
              }}
              style={{ ...inputStyle, marginTop: 0, width: "auto", minWidth: 170 }}
            >
              {PAIRS.map((p) => (
                <option key={p.symbol} value={p.symbol}>{p.label}</option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>Chart: data pasar real-time (TradingView)</div>
        </div>

        <TradingViewChart symbol={pair.tvSymbol} height={360} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 12.5, color: COLORS.muted, marginBottom: 4 }}>Virtual Balance</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: COLORS.amber }}>
              Rp{balance.toLocaleString("id-ID")}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12.5, color: COLORS.muted, display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
              Harga latihan {isLive ? <Pill tone="teal">Kuotasi terkini</Pill> : <Pill tone="amber">Referensi tetap</Pill>}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>
              {loadingRef || currentPrice == null ? "..." : currentPrice.toFixed(pair.digits)}
            </div>
          </div>
        </div>

        {!loadingRef && mode === null && (
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => openForm("Buy")}>📈 BUY</Button>
            <Button variant="ghost" onClick={() => openForm("Sell")} style={{ borderColor: COLORS.coral, color: COLORS.coral }}>📉 SELL</Button>
            <Button variant="subtle" disabled={busy} onClick={handleWait}>⏸ WAIT</Button>
          </div>
        )}

        {mode === "form" && (
          <div style={{ marginTop: 16, background: COLORS.surfaceAlt, borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>
              {direction === "Buy" ? "📈 BUY" : "📉 SELL"} {pair.label} @ {currentPrice.toFixed(pair.digits)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12 }}>
              <label><span style={labelStyle}>Stop Loss (pip)</span><input style={inputStyle} type="number" value={slPts} onChange={(e) => setSlPts(+e.target.value || 0)} /></label>
              <label><span style={labelStyle}>Take Profit (pip)</span><input style={inputStyle} type="number" value={tpPts} onChange={(e) => setTpPts(+e.target.value || 0)} /></label>
              <label><span style={labelStyle}>Risk (%)</span><input style={inputStyle} type="number" value={riskPct} onChange={(e) => setRiskPct(+e.target.value || 0)} /></label>
            </div>
            <div style={{ marginTop: 14, fontSize: 12.5, color: COLORS.muted }}>
              Batas risiko: Rp{Math.round((balance * riskPct) / 100).toLocaleString("id-ID")}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <Button variant="ghost" onClick={() => setMode(null)}>Batal</Button>
              <Button variant="primary" disabled={busy} onClick={handleExecute}>
                {busy ? "Memproses..." : "Eksekusi Posisi"}
              </Button>
            </div>
          </div>
        )}

        {mode === "waited" && (
          <div style={{ marginTop: 16, background: COLORS.surfaceAlt, borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>⏸</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Kamu memilih WAIT</div>
            <div style={{ color: COLORS.muted, fontSize: 13.5, marginBottom: 14 }}>
              Keputusan untuk tidak membuka posisi juga merupakan bagian dari disiplin trading.
            </div>
            <Button variant="primary" onClick={() => setMode(null)}>Lanjut</Button>
          </div>
        )}

        {mode === "result" && result && (
          <div style={{ marginTop: 16, background: COLORS.surfaceAlt, borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{result.result === "Win" ? "✅" : "❌"}</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {result.pair} {result.direction} ditutup — {result.result === "Win" ? "Profit" : "Loss"}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: result.pnl >= 0 ? COLORS.teal : COLORS.coral, marginBottom: 6 }}>
              {result.pnl >= 0 ? "+" : ""}Rp{result.pnl.toLocaleString("id-ID")}
            </div>
            <div style={{ fontSize: 12.5, color: COLORS.muted, marginBottom: 14 }}>
              Entry {result.entry.toFixed(pair.digits)} → Exit {result.exitPrice.toFixed(pair.digits)} · Saldo sekarang Rp{result.balanceAfter.toLocaleString("id-ID")}
            </div>
            <Button variant="primary" onClick={() => setMode(null)}>Lanjut</Button>
          </div>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { l: "Total Trades", v: stats.total },
          { l: "Winning", v: stats.wins },
          { l: "Losing", v: stats.losses },
          { l: "Average Risk", v: stats.avgRisk === "-" ? "-" : `${stats.avgRisk}%` },
        ].map((s) => (
          <Card key={s.l} style={{ padding: 14 }}>
            <div style={{ fontSize: 11.5, color: COLORS.muted }}>{s.l}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, marginTop: 4 }}>{s.v}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>Riwayat Simulasi</div>
          <Button variant="ghost" disabled={busy} onClick={handleReset}>🔄 Reset Akun Demo</Button>
        </div>
        <div style={{ display: "grid", gap: 8, maxHeight: 320, overflowY: "auto" }}>
          {loadingTrades && <div style={{ color: COLORS.muted, fontSize: 13 }}>Memuat riwayat...</div>}
          {!loadingTrades && trades.length === 0 && (
            <div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 10 }}>Belum ada simulasi. Coba BUY/SELL/WAIT di atas.</div>
          )}
          {trades.map((t) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.surfaceAlt, borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>
              <span>{t.pair} · {t.direction}</span>
              {t.direction === "Wait" ? (
                <Pill tone="teal">WAIT</Pill>
              ) : (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: t.pnl >= 0 ? COLORS.teal : COLORS.coral }}>
                  {t.pnl >= 0 ? "+" : ""}Rp{Number(t.pnl).toLocaleString("id-ID")}
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
