import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { COLORS } from "../styles/theme";
import { Button } from "./ui";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: "🏠", end: true },
  { to: "/roadmap", label: "Belajar", icon: "📚" },
  { to: "/simulator", label: "Simulator", icon: "🧪" },
  { to: "/calculator", label: "Calculator", icon: "🧮" },
  { to: "/journal", label: "Journal", icon: "📓" },
  { to: "/challenge", label: "Challenge", icon: "🏆" },
  { to: "/dashboard", label: "Dashboard", icon: "👤" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className="desktop-nav"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(11,18,32,0.88)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${COLORS.line}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.amber})` }} />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: COLORS.text }}>Kebangkitan Traders</span>
        </NavLink>

        <div style={{ display: "flex", gap: 6 }}>
          {NAV_ITEMS.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              style={({ isActive }) => ({
                background: isActive ? COLORS.surfaceAlt : "transparent",
                color: isActive ? COLORS.text : COLORS.muted,
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              })}
            >
              {n.icon} {n.label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {user ? (
            <Button variant="ghost" onClick={() => logout()}>Logout</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
              <Button variant="primary" onClick={() => navigate("/register")}>Daftar</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
