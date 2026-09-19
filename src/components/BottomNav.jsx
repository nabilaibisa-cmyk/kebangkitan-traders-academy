import React from "react";
import { NavLink } from "react-router-dom";
import { COLORS } from "../styles/theme";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: "🏠", end: true },
  { to: "/roadmap", label: "Belajar", icon: "📚" },
  { to: "/simulator", label: "Simulator", icon: "🧪" },
  { to: "/calculator", label: "Calculator", icon: "🧮" },
  { to: "/journal", label: "Journal", icon: "📓" },
  { to: "/challenge", label: "Challenge", icon: "🏆" },
  { to: "/dashboard", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  return (
    <div
      className="mobile-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "rgba(15,24,48,0.96)",
        backdropFilter: "blur(10px)",
        borderTop: `1px solid ${COLORS.line}`,
        justifyContent: "space-around",
        padding: "8px 4px calc(env(safe-area-inset-bottom, 0px) + 6px)",
      }}
    >
      {NAV_ITEMS.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          style={({ isActive }) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            color: isActive ? COLORS.teal : COLORS.mutedDim,
            fontSize: 10.5,
            fontWeight: 600,
            textDecoration: "none",
            padding: "4px 8px",
          })}
        >
          <span style={{ fontSize: 18 }}>{n.icon}</span>
          {n.label}
        </NavLink>
      ))}
    </div>
  );
}
