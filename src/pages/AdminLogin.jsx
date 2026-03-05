import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (u === "Sakila" && p === "SakiDazzle") {
      localStorage.setItem("sd_admin", "true");
      nav("/admin/panel");
    } else {
      setMsg("Wrong username or password");
    }
  }

  return (
    <div className="authBg">
      <div className="authCard">
        <div className="authTitle">Admin Login</div>
        <form onSubmit={submit} className="form" style={{ marginTop: 10 }}>
          <label>Username</label>
          <input value={u} onChange={(e) => setU(e.target.value)} />

          <label>Password</label>
          <input value={p} onChange={(e) => setP(e.target.value)} type="password" />

          {msg ? <div className="alert">⚠️ {msg}</div> : null}

          <button className="btn wide" type="submit">Login</button>
        </form>

        <div className="tiny" style={{ marginTop: 12 }}>
          <Link to="/">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}
