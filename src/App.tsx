import React, { useEffect, useMemo, useState } from "react";
import CityMap from "./pages/CityMap/CityMap";
import Coliseum from "./pages/Coliseum/Coliseum";
import Exchange from "./pages/Exchange/Exchange";
import Inventory from "./pages/Inventory/Inventory";
import Settings from "./pages/Settings/Settings";
import BottomNav from "./widgets/BottomNav/BottomNav";

type TabKey = "city" | "coliseum" | "exchange" | "inventory" | "settings";

export default function App() {
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState<TabKey>("city");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const Screen = useMemo(() => {
    switch (tab) {
      case "city":
        return <CityMap />;
      case "coliseum":
        return <Coliseum />;
      case "exchange":
        return <Exchange />;
      case "inventory":
        return <Inventory />;
      case "settings":
        return <Settings />;
      default:
        return <CityMap />;
    }
  }, [tab]);

  // ⬇️ LOADING SCREEN — ЛОГО НА ВЕСЬ ЭКРАН
  if (progress < 100) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: "url(/map/logo-app.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {/* затемнение */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 80,
          }}
        >
          <div style={{ width: "60%", maxWidth: 360 }}>
            <div
              style={{
                width: "100%",
                height: 8,
                background: "rgba(255,255,255,0.25)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #d4af37, #ffec8b)",
                  transition: "width 0.2s linear",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 10,
                textAlign: "center",
                fontSize: 12,
                color: "#ddd",
                letterSpacing: 1,
              }}
            >
              Загрузка {progress}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ⬇️ GAME SHELL
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {Screen}
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </div>
  );
}
