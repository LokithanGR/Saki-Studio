import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Loader({ onDone }) {
  const [p, setP] = useState(0);

  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      // smooth-ish increments
      v += v < 70 ? 3 : v < 90 ? 2 : 1;
      if (v >= 100) {
        v = 100;
        clearInterval(t);
        setTimeout(() => onDone?.(), 350); // small delay for nice feel
      }
      setP(v);
    }, 40);

    return () => clearInterval(t);
  }, [onDone]);

  const deg = (p / 100) * 360;

  return (
    <div className="loaderWrap">
      <div className="loaderCard">
        <img src={logo} alt="Logo" className="loaderLogo" />

        <div
          className="ring"
          style={{ background: `conic-gradient(#d6a64e ${deg}deg, rgba(0,0,0,0.08) 0deg)` }}
          aria-label="Loading progress"
        >
          <div className="ringInner">
            <div className="ringPct">{p}%</div>
            <div className="ringTxt">Loading</div>
          </div>
        </div>

        <div className="loaderHint">Preparing your experience…</div>
      </div>
    </div>
  );
}