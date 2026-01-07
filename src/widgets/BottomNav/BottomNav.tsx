type TabKey = "city" | "coliseum" | "exchange" | "inventory" | "settings";

export default function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const items: Array<{ key: TabKey; label: string; icon: string }> = [
    { key: "city", label: "Город", icon: "🏛️" },
    { key: "coliseum", label: "Колизей", icon: "⚔️" },
    { key: "exchange", label: "Обмен", icon: "💱" },
    { key: "inventory", label: "Склад", icon: "🎒" },
    { key: "settings", label: "Настр.", icon: "⚙️" },
  ];

  return (
    <div style={wrap}>
      <div style={bar}>
        {items.map((it) => {
          const isActive = it.key === active;

          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              style={{
                ...btn,
                ...(isActive ? btnActive : null),
              }}
            >
              <div style={{ fontSize: 20, lineHeight: "20px" }}>{it.icon}</div>
              <div style={{ fontSize: 11, marginTop: 2 }}>{it.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  padding: "10px 12px 14px",
  zIndex: 50,
  pointerEvents: "none",
};

const bar: React.CSSProperties = {
  pointerEvents: "auto",
  height: 64,
  borderRadius: 16,
  background: "rgba(10,10,10,0.78)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 10px 30px rgba(0,0,0,.65)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 10px",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

const btn: React.CSSProperties = {
  width: "20%",
  height: "100%",
  border: "none",
  background: "transparent",
  color: "rgba(255,255,255,0.78)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: 12,
  transition: "all .15s ease",
};

const btnActive: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  transform: "translateY(-1px)",
};
