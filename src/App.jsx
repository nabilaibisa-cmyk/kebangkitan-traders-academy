import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Roadmap from "./pages/Roadmap";
import Lesson from "./pages/Lesson";
import Simulator from "./pages/Simulator";
import Calculator from "./pages/Calculator";
import Journal from "./pages/Journal";
import Challenge from "./pages/Challenge";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ background: "#0B1220", minHeight: "100vh", color: "#E9EDF7", paddingBottom: 70 }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/calculator" element={<Calculator />} />

            <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
            <Route path="/roadmap/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/challenge" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
