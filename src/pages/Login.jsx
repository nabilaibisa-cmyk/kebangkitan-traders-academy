import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Button, inputStyle, labelStyle } from "../components/ui";
import { COLORS } from "../styles/theme";

export default function Login() {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Isi email dulu untuk mengirim link reset password.");
      return;
    }
    try {
      await resetPassword(email);
      setInfo("Link reset password sudah dikirim ke email kamu.");
      setError("");
    } catch (err) {
      setError(friendlyError(err));
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: "60px 20px 90px" }}>
      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 4 }}>Selamat datang kembali</div>
        <div style={{ color: COLORS.muted, fontSize: 13.5, marginBottom: 20 }}>Login untuk melanjutkan progress belajarmu.</div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <label>
            <span style={labelStyle}>Email</span>
            <input style={inputStyle} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            <span style={labelStyle}>Password</span>
            <input style={inputStyle} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          {error && <div style={{ color: COLORS.coral, fontSize: 13 }}>{error}</div>}
          {info && <div style={{ color: COLORS.teal, fontSize: 13 }}>{info}</div>}

          <Button type="submit" variant="primary" disabled={busy} style={{ width: "100%", marginTop: 4 }}>
            {busy ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <button onClick={handleReset} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 12.5, marginTop: 14, cursor: "pointer", padding: 0 }}>
          Lupa password?
        </button>

        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 18, textAlign: "center" }}>
          Belum punya akun? <Link to="/register" style={{ color: COLORS.teal }}>Daftar di sini</Link>
        </div>
      </Card>
    </div>
  );
}

function friendlyError(err) {
  const code = err?.code || "";
  if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) {
    return "Email atau password salah.";
  }
  if (code.includes("too-many-requests")) return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.";
  if (code.includes("invalid-email")) return "Format email tidak valid.";
  return "Terjadi kesalahan. Silakan coba lagi.";
}
