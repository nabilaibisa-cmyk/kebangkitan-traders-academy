import React, { useState } from "react";
import { Card, Pill, SectionTitle, inputStyle, labelStyle } from "../components/ui";
import { COLORS } from "../styles/theme";

export default function Calculator() {
  const [modal, setModal] = useState(1000);
  const [risk, setRisk] = useState(1);
  const [sl, setSl] = useState(20);
  const riskAmount = (modal * risk) / 100;
  const PIP_VALUE_STD_LOT = 10;
  const suggestedLot = sl > 0 ? riskAmount / (sl * PIP_VALUE_STD_LOT) : 0;
  const potentialLoss = suggestedLot * sl * PIP_VALUE_STD_LOT;

  const [entry, setEntry] = useState(100);
  const [slrr, setSlrr] = useState(90);
  const [tprr, setTprr] = useState(120);
  const riskPts = Math.abs(entry - slrr);
  const rewardPts = Math.abs(tprr - entry);
  const rr = riskPts > 0 ? (rewardPts / riskPts).toFixed(2) : "-";

  const [startBal, setStartBal] = useState(10000);
  const [curBal, setCurBal] = useState(9200);
  const dd = startBal > 0 ? (((startBal - curBal) / startBal) * 100).toFixed(1) : "0";

  const [centBalance, setCentBalance] = useState(500000);
  const [centRisk, setCentRisk] = useState(1);
  const [centSl, setCentSl] = useState(20);
  const centRiskAmount = (centBalance * centRisk) / 100;
  const centRiskUsd = centRiskAmount / 100;
  const centBalanceUsd = centBalance / 100;
  const PIP_VALUE_STD_LOT_CENT = 1000;
  const centSuggestedLot = centSl > 0 ? centRiskAmount / (centSl * PIP_VALUE_STD_LOT_CENT) : 0;
  const centPotentialLoss = centSuggestedLot * centSl * PIP_VALUE_STD_LOT_CENT;

  const fmtUsd = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtCent = (n) => `${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}¢`;

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 20px 90px" }}>
      <SectionTitle eyebrow="TRADING CALCULATOR" title="Kalkulator latihan" sub="Estimasi edukatif untuk membantu latihan menghitung risiko — bukan rekomendasi posisi nyata." />

      <div style={{ display: "grid", gap: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Risk Calculator</div>
          <div style={{ color: COLORS.mutedDim, fontSize: 13, marginBottom: 16 }}>Berapa besar risiko dalam USD dari satu keputusan latihan pada akun standar.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
            <label><span style={labelStyle}>Modal virtual (USD)</span><input style={inputStyle} type="number" value={modal} onChange={(e) => setModal(+e.target.value || 0)} /></label>
            <label><span style={labelStyle}>Risiko per transaksi (%)</span><input style={inputStyle} type="number" value={risk} onChange={(e) => setRisk(+e.target.value || 0)} /></label>
            <label><span style={labelStyle}>Stop Loss (pip)</span><input style={inputStyle} type="number" value={sl} onChange={(e) => setSl(+e.target.value || 0)} /></label>
          </div>
          <div style={{ marginTop: 18, background: COLORS.surfaceAlt, borderRadius: 10, padding: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Risk Amount</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: COLORS.amber }}>{fmtUsd(riskAmount)}</div></div>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Suggested Position Size</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: COLORS.teal }}>{suggestedLot.toFixed(2)} lot</div></div>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Potential Loss</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: COLORS.coral }}>{fmtUsd(potentialLoss)}</div></div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: COLORS.mutedDim, lineHeight: 1.6 }}>
            Perhitungan lot mengasumsikan nilai pip ≈ $10/pip untuk 1 standard lot (umum pada pair mayor berbasis USD).
            Ini estimasi edukatif — spesifikasi kontrak dan nilai pip/tick sebenarnya berbeda tergantung instrumen dan broker.
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Risk / Reward Calculator</div>
          <div style={{ color: COLORS.mutedDim, fontSize: 13, marginBottom: 16 }}>Bandingkan potensi risiko dan potensi hasil sebelum entry.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
            <label><span style={labelStyle}>Entry</span><input style={inputStyle} type="number" value={entry} onChange={(e) => setEntry(+e.target.value || 0)} /></label>
            <label><span style={labelStyle}>Stop Loss</span><input style={inputStyle} type="number" value={slrr} onChange={(e) => setSlrr(+e.target.value || 0)} /></label>
            <label><span style={labelStyle}>Take Profit</span><input style={inputStyle} type="number" value={tprr} onChange={(e) => setTprr(+e.target.value || 0)} /></label>
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Risk</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>{riskPts} pts</div></div>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Reward</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>{rewardPts} pts</div></div>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Ratio</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: COLORS.teal }}>1 : {rr}</div></div>
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Drawdown Calculator</div>
          <div style={{ color: COLORS.mutedDim, fontSize: 13, marginBottom: 16 }}>Lihat seberapa besar penurunan saldo dari titik awal.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
            <label><span style={labelStyle}>Starting Balance (USD)</span><input style={inputStyle} type="number" value={startBal} onChange={(e) => setStartBal(+e.target.value || 0)} /></label>
            <label><span style={labelStyle}>Current Balance (USD)</span><input style={inputStyle} type="number" value={curBal} onChange={(e) => setCurBal(+e.target.value || 0)} /></label>
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12.5, color: COLORS.muted }}>Drawdown</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: dd > 0 ? COLORS.coral : COLORS.teal }}>{dd}%</div>
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 700 }}>Cent Account Calculator</div>
            <Pill tone="amber">100¢ = $1</Pill>
          </div>
          <div style={{ color: COLORS.mutedDim, fontSize: 13, marginBottom: 16 }}>
            Untuk akun cent, saldo ditampilkan dalam satuan sen (¢) — 100¢ setara $1. Kalkulator ini membantu
            menghitung risiko latihan langsung dalam satuan akun cent, plus padanan USD-nya.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
            <label><span style={labelStyle}>Saldo akun cent (¢)</span><input style={inputStyle} type="number" value={centBalance} onChange={(e) => setCentBalance(+e.target.value || 0)} /></label>
            <label><span style={labelStyle}>Risiko per transaksi (%)</span><input style={inputStyle} type="number" value={centRisk} onChange={(e) => setCentRisk(+e.target.value || 0)} /></label>
            <label><span style={labelStyle}>Stop Loss (pip)</span><input style={inputStyle} type="number" value={centSl} onChange={(e) => setCentSl(+e.target.value || 0)} /></label>
          </div>
          <div style={{ marginTop: 18, background: COLORS.surfaceAlt, borderRadius: 10, padding: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Saldo setara</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16 }}>{fmtUsd(centBalanceUsd)}</div></div>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Risk Amount (¢)</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: COLORS.amber }}>{fmtCent(centRiskAmount)}</div></div>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Setara USD</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: COLORS.amber }}>{fmtUsd(centRiskUsd)}</div></div>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Suggested Position Size</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: COLORS.teal }}>{centSuggestedLot.toFixed(2)} lot</div></div>
            <div><div style={{ fontSize: 12.5, color: COLORS.muted }}>Potential Loss (¢)</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: COLORS.coral }}>{fmtCent(centPotentialLoss)}</div></div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: COLORS.mutedDim, lineHeight: 1.6 }}>
            Perhitungan lot mengasumsikan nilai pip ≈ 1000¢ (setara $10) untuk 1 standard lot pada akun cent.
            Nilai per pip sebenarnya bisa berbeda — selalu cek spesifikasi kontrak brokermu.
          </div>
        </Card>
      </div>
    </div>
  );
}
