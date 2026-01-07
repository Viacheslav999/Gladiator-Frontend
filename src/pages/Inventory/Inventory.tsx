import React, { useEffect, useMemo, useState } from "react";

/* ===================== TYPES ===================== */

type TabKey = "weapons" | "armor" | "fragments" | "materials";
type Rarity = "common" | "rare" | "epic" | "legendary";

type Item = {
  id: string;
  name: string;
  type: TabKey;
  rarity: Rarity;
  qty?: number;
  desc?: string;
};

/* ===================== FIRE ANIMATION ===================== */

const torchKeyframes = `
@keyframes torchFlicker {
  0%   { opacity: .55; transform: translateY(0); }
  40%  { opacity: .85; transform: translateY(-4px); }
  70%  { opacity: 1;   transform: translateY(-7px); }
  100% { opacity: .6;  transform: translateY(0); }
}
`;

/* ===================== COMPONENT ===================== */

export default function Inventory() {
  const [tab, setTab] = useState<TabKey>("weapons");
  const [selected, setSelected] = useState<Item | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = torchKeyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const items: Item[] = useMemo(
    () => [
      {
        id: "w1",
        name: "Rusty Sword",
        type: "weapons",
        rarity: "common",
        desc: "Basic weapon for beginners. Weak but reliable.",
      },
      {
        id: "w2",
        name: "Training Spear",
        type: "weapons",
        rarity: "common",
        desc: "Used for early fights and training.",
      },
      {
        id: "a1",
        name: "Leather Cuirass",
        type: "armor",
        rarity: "common",
        desc: "Light armor. Poor protection, better than nothing.",
      },
      {
        id: "f1",
        name: "Blade Fragments",
        type: "fragments",
        rarity: "rare",
        qty: 12,
        desc: "Collect 30 to reforge a rare blade.",
      },
      {
        id: "m1",
        name: "Iron Ingots",
        type: "materials",
        rarity: "common",
        qty: 26,
        desc: "Base material for weapons and armor.",
      },
    ],
    []
  );

  const filtered = useMemo(
    () => items.filter((i) => i.type === tab),
    [items, tab]
  );

  return (
    <div style={wrap}>
      {/* FIRE LIGHT EFFECT */}
      <div style={fireGlowLeft} />
      <div style={fireGlowRight} />

      {/* HEADER */}
      <div style={header}>
        <div>
          <div style={title}>ARMORY</div>
          <div style={subtitle}>
            Weapons • Armor • Fragments • Materials
          </div>
        </div>

        <button style={craftBtn} disabled>
          Forge (soon)
        </button>
      </div>

      {/* TABS */}
      <div style={tabsRow}>
        <Tab label="Weapons" active={tab === "weapons"} onClick={() => setTab("weapons")} />
        <Tab label="Armor" active={tab === "armor"} onClick={() => setTab("armor")} />
        <Tab label="Fragments" active={tab === "fragments"} onClick={() => setTab("fragments")} />
        <Tab label="Materials" active={tab === "materials"} onClick={() => setTab("materials")} />
      </div>

      {/* CONTENT */}
      <div style={content}>
        <div style={grid}>
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              style={{
                ...itemCard,
                borderColor: rarityBorder(item.rarity),
              }}
            >
              <div style={rarityPill}>{item.rarity.toUpperCase()}</div>
              <div style={itemName}>{item.name}</div>
              {item.qty && <div style={qty}>×{item.qty}</div>}
            </button>
          ))}
        </div>

        {/* INFO PANEL */}
        <div style={panel}>
          {!selected ? (
            <div style={{ opacity: 0.8 }}>
              Select an item to see details.
            </div>
          ) : (
            <>
              <div style={panelTitle}>{selected.name}</div>
              <div style={panelText}>{selected.desc}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== UI ===================== */

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...tabBtn,
        ...(active ? tabBtnActive : {}),
      }}
    >
      {label}
    </button>
  );
}

/* ===================== STYLES ===================== */

const wrap: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  padding: "96px 16px 96px",
  color: "#fff",
  backgroundImage: `
    linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.85)),
    url(/inventory-armory.png)
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const fireGlowLeft: React.CSSProperties = {
  position: "absolute",
  left: "-120px",
  top: "20%",
  width: 300,
  height: 300,
  background: "radial-gradient(circle, rgba(255,140,60,.45), transparent 70%)",
  animation: "torchFlicker 3.5s infinite",
  pointerEvents: "none",
};

const fireGlowRight: React.CSSProperties = {
  position: "absolute",
  right: "-120px",
  top: "25%",
  width: 300,
  height: 300,
  background: "radial-gradient(circle, rgba(255,120,40,.4), transparent 70%)",
  animation: "torchFlicker 4s infinite",
  pointerEvents: "none",
};

const header: React.CSSProperties = {
  position: "absolute",
  top: 86,
  left: 16,
  right: 16,
  display: "flex",
  justifyContent: "space-between",
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: 2,
};

const subtitle: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.75,
};

const craftBtn: React.CSSProperties = {
  height: 34,
  padding: "0 14px",
  borderRadius: 10,
  background: "rgba(255,255,255,.08)",
  border: "1px solid rgba(255,255,255,.15)",
  color: "#fff",
};

const tabsRow: React.CSSProperties = {
  marginTop: 64,
  display: "flex",
  gap: 8,
};

const tabBtn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 10,
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  color: "#fff",
};

const tabBtnActive: React.CSSProperties = {
  background: "rgba(255,255,255,.15)",
};

const content: React.CSSProperties = {
  marginTop: 16,
  height: "calc(100% - 120px)",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
  overflowY: "auto",
};

const itemCard: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  background: "rgba(0,0,0,.45)",
  border: "1px solid rgba(255,255,255,.12)",
  textAlign: "left",
};

const rarityPill: React.CSSProperties = {
  fontSize: 10,
  opacity: 0.7,
};

const itemName: React.CSSProperties = {
  marginTop: 6,
  fontWeight: 700,
};

const qty: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  opacity: 0.8,
};

const panel: React.CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "rgba(0,0,0,.5)",
  border: "1px solid rgba(255,255,255,.12)",
};

const panelTitle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 16,
};

const panelText: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  opacity: 0.85,
};

function rarityBorder(r: Rarity) {
  if (r === "rare") return "rgba(120,190,255,.6)";
  if (r === "epic") return "rgba(200,120,255,.6)";
  if (r === "legendary") return "rgba(255,210,110,.7)";
  return "rgba(255,255,255,.12)";
}
