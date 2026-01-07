import PlayerHeader from "../../widgets/PlayerHeader/PlayerHeader";

export default function CityMap() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/map/rome-map.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PlayerHeader />

      {/* ЛОКАЦИИ */}
      <Location title="КОЛИЗЕЙ" top="18%" left="42%" />
      <Location title="БАНЯ" top="30%" right="10%" />
      <Location title="РЫНОК" bottom="26%" right="20%" />
      <Location title="ГИЛЬДИЯ" bottom="30%" left="14%" />
    </div>
  );
}

function Location({
  title,
  top,
  left,
  right,
  bottom,
}: {
  title: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        background: "linear-gradient(#f5deb3, #d2b48c)",
        color: "#3b2f1c",
        padding: "10px 22px",
        fontSize: 20,
        fontWeight: 700,
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,.45)",
        cursor: "pointer",
        border: "1px solid #8b6b3f",
      }}
    >
      {title}
    </div>
  );
}
