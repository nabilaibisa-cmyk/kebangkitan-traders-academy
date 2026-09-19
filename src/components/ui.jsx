import React from "react";
import { COLORS } from "../styles/theme";

export function Pill({ children, tone = "teal" }) {
  const map = {
    teal: { bg: COLORS.tealDim, fg: COLORS.teal },
    amber: { bg: COLORS.amberDim, fg: COLORS.amber },
    coral: { bg: COLORS.coralDim, fg: COLORS.coral },
  };
  const c = map[tone];
  return (
    <span
      style={{
        background: c.bg,
        color: c.fg,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        fontWeight: 500,
        padding: "3px 10px",
        borderRadius: 999,
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, tone = "teal", height = 8 }) {
  const fg = tone === "amber" ? COLORS.amber : tone === "coral" ? COLORS.coral : COLORS.teal;
  return (
    <div style={{ background: "#0E1830", borderRadius: 999, height, overflow: "hidden", border: `1px solid ${COLORS.line}` }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          background: fg,
          borderRadius: 999,
          transition: "width 500ms cubic-bezier(.2,.8,.2,1)",
        }}
      />
    </div>
  );
}

export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 14,
        padding: 20,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 180ms ease",
        ...style,
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.borderColor = COLORS.teal)}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.borderColor = COLORS.line)}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", style, disabled, type = "button" }) {
  const base = {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: 14.5,
    padding: "11px 20px",
    borderRadius: 10,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "transform 120ms ease, opacity 120ms ease",
  };
  const variants = {
    primary: { background: COLORS.teal, color: "#08231F" },
    ghost: { background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.line}` },
    amber: { background: COLORS.amber, color: "#2E210A" },
    subtle: { background: COLORS.surfaceAlt, color: COLORS.text },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && (
        <div style={{ color: COLORS.teal, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginBottom: 8 }}>
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: "clamp(24px, 3.4vw, 34px)",
          color: COLORS.text,
          margin: 0,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {sub && <p style={{ color: COLORS.muted, marginTop: 10, maxWidth: 560, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

export const inputStyle = {
  width: "100%",
  background: COLORS.bg2,
  border: `1px solid ${COLORS.line}`,
  borderRadius: 8,
  color: COLORS.text,
  padding: "10px 12px",
  fontSize: 14,
  marginTop: 6,
};

export const labelStyle = { fontSize: 13, color: COLORS.muted };
