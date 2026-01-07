import { useState } from "react";
import {
  headerStyle,
  avatarStyle,
  levelBarWrapper,
  levelBarFill,
  currenciesStyle,
} from "./PlayerHeader.styles";

export default function PlayerHeader() {
  const [lang, setLang] = useState<"ru" | "en">("ru");
  const [sound, setSound] = useState(true);

  return (
    <div style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={avatarStyle} />

        <div style={{ marginRight: 30 }}>
          <div style={{ fontWeight: 700 }}>Lv. 90</div>
          <div style={levelBarWrapper}>
            <div style={levelBarFill} />
          </div>
        </div>

        <div style={currenciesStyle}>
          <div>🏆 10230</div>
          <div>🪙 73.7m</div>
          <div>💎 99895</div>
          <div style={{ color: "#ffd700" }}>VIP 1</div>
        </div>
      </div>

      {/* 🔊 Язык и звук — справа */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={() => setSound(!sound)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {sound ? "🔊" : "🔇"}
        </button>

        <button
          onClick={() => setLang(lang === "ru" ? "en" : "ru")}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid #555",
            borderRadius: 6,
            padding: "4px 8px",
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {lang.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

