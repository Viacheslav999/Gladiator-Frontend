export default function Settings() {
  return (
    <div style={wrap}>
      <h2 style={h}>SETTINGS</h2>
      <div style={p}>Скоро: язык, звук, аккаунт.</div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontFamily: "serif",
};

const h: React.CSSProperties = { margin: 0, letterSpacing: 2 };
const p: React.CSSProperties = { marginTop: 10, opacity: 0.8, fontSize: 14 };
