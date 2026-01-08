import PlayerHeader from "../../widgets/PlayerHeader/PlayerHeader";

type CityMapProps = {
  onEnterBarracks: () => void;
  onEnterColiseum: () => void; // ✅ ДОБАВИЛИ
};

export default function CityMap({
  onEnterBarracks,
  onEnterColiseum,
}: CityMapProps) {
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
      <Location
        title="КОЛИЗЕЙ"
        top="18%"
        left="42%"
        onClick={onEnterColiseum} // ✅ ТЕПЕРЬ ВСЁ СОВПАДАЕТ
      />

      <Location title="БАНЯ" top="30%" right="10%" />
      <Location title="РЫНОК" bottom="26%" right="20%" />
      <Location title="ГИЛЬДИЯ" bottom="30%" left="14%" />

      <Location
        title="КАЗАРМА"
        top="24%"
        left="4%"
        onClick={onEnterBarracks}
      />
    </div>
  );
}

type LocationProps = {
  title: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  onClick?: () => void;
};

function Location({
  title,
  top,
  left,
  right,
  bottom,
  onClick,
}: LocationProps) {
  return (
    <div
      onClick={onClick}
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
        cursor: onClick ? "pointer" : "default",
        border: "1px solid #8b6b3f",
        userSelect: "none",
      }}
    >
      {title}
    </div>
  );
}
