import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Button, inputStyle, labelStyle } from "../components/ui";
import { COLORS } from "../styles/theme";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: "60px 20px 90px" }}>
      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 4 }}>
          Selamat datang di Kebangkitan Traders Academy!
        </div>
        <div style={{ color: COLORS.muted, fontSize: 13.5, marginBottom: 20 }}>Buat akun untuk mulai belajar dari nol.</div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <label>
            <span style={labelStyle}>Nama</span>
            <input style={inputStyle} required value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            <span style={labelStyle}>Email</span>
            <input style={inputStyle} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            <span style={labelStyle}>Password</span>
            <input style={inputStyle} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          {error && <div style={{ color: COLORS.coral, fontSize: 13 }}>{error}</div>}

          <Button type="submit" variant="primary" disabled={busy} style={{ width: "100%", marginTop: 4 }}>
            {busy ? "Memproses..." : "Buat Akun"}
          </Button>
        </form>

        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 18, textAlign: "center" }}>
          Sudah punya akun? <Link to="/login" style={{ color: COLORS.teal }}>Login di sini</Link>
        </div>
      </Card>
    </div>
  );
}

function friendlyError(err) {
  const code = err?.code || "";
  if (code.includes("email-already-in-use")) return "Email ini sudah terdaftar. Coba login.";
  if (code.includes("invalid-email")) return "Format email tidak valid.";
  if (code.includes("weak-password")) return "Password terlalu lemah, minimal 6 karakter.";
  return "Terjadi kesalahan. Silakan coba lagi.";
}
