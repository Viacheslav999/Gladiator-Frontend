import React from "react";

/* ===================== SPLASH ===================== */

export default function Splash() {
  return (
    <div style={screen}>
      {/* FIRE GLOW */}
      <div style={fireLeft} />
      <div style={fireRight} />

      {/* SPARKS */}
      <div style={sparks} />

      {/* LOGO */}
      <div style={logoWrap}>
        <img src="/logo-app.png" alt="GLADIATOR" style={logo} />
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const screen: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background:
    "radial-gradient(1200px 600px at 50% 100%, rgba(120,40,10,0.35), black 65%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  zIndex: 9999,
};

/* ---------- LOGO ---------- */

const logoWrap: React.CSSProperties = {
  position: "relative",
  zIndex: 3,
  animation: "logoBreath 3s ease-in-out infinite",
};

const logo: React.CSSProperties = {
  width: 180,
  height: "auto",
  filter: "drop-shadow(0 0 25px rgba(255,120,40,0.6))",
};

/* ---------- FIRE GLOW ---------- */

const fireLeft: React.CSSProperties = {
  position: "absolute",
  left: "-200px",
  bottom: "-200px",
  width: 600,
  height: 600,
  background:
    "radial-gradient(circle, rgba(255,120,40,0.45), transparent 70%)",
  animation: "fireFlicker 3.5s infinite",
};

const fireRight: React.CSSProperties = {
  position: "absolute",
  right: "-200px",
  bottom: "-220px",
  width: 600,
  height: 600,
  background:
    "radial-gradient(circle, rgba(255,80,20,0.35), transparent 70%)",
  animation: "fireFlicker 4.2s infinite",
};

/* ---------- SPARKS ---------- */

const sparks: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: `
    radial-gradient(circle at 20% 80%, rgba(255,180,80,.35) 2px, transparent 3px),
    radial-gradient(circle at 60% 90%, rgba(255,140,60,.3) 2px, transparent 3px),
    radial-gradient(circle at 40% 85%, rgba(255,200,120,.25) 2px, transparent 3px)
  `,
  backgroundRepeat: "repeat",
  backgroundSize: "200px 200px",
  animation: "sparksUp 6s linear infinite",
  opacity: 0.6,
};

/* ===================== KEYFRAMES ===================== */

const style = document.createElement("style");
style.innerHTML = `
@keyframes fireFlicker {
  0% { opacity: .6; transform: scale(1); }
  50% { opacity: .9; transform: scale(1.05); }
  100% { opacity: .6; transform: scale(1); }
}

@keyframes sparksUp {
  from { background-position: 0 0; }
  to { background-position: 0 -400px; }
}

@keyframes logoBreath {
  0% { transform: scale(1); opacity: .9; }
  50% { transform: scale(1.04); opacity: 1; }
  100% { transform: scale(1); opacity: .9; }
}
`;
document.head.appendChild(style);
