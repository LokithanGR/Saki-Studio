import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Loader from "./components/Loader.jsx";

function isAuthed() {
  return localStorage.getItem("sd_admin") === "true";
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Loader only once per session (optional)
    const seen = sessionStorage.getItem("sd_seen_loader");
    if (seen === "1") setLoading(false);
  }, []);

  if (loading) {
    return (
      <Loader
        onDone={() => {
          sessionStorage.setItem("sd_seen_loader", "1");
          setLoading(false);
        }}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/panel"
        element={isAuthed() ? <AdminPanel /> : <Navigate to="/admin" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}