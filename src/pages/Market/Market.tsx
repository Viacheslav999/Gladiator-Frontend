import React, { useMemo, useState } from "react";
import "./market.css";

/* =========================
   TYPES
   ========================= */

type Rarity = "common" | "rare" | "epic" | "legendary";
type Tab = "sets" | "trades";

type Stat = { k: string; v: string };

type Item = {
  id: string;
  slot: string;
  name: string;
  icon: string;
  stats: Stat[];
};

type SetData = {
  id: string;
  name: string;
  rarity: Rarity;
  archetype: string;
  description: string;
  art: string;
  price: { gold?: number; aur?: number };
  items: Item[];
};

/* =========================
   DATA
   ========================= */

const SETS: SetData[] = [
  {
    id: "recruit",
    name: "Комплект рекрута",
    rarity: "common",
    archetype: "Новичок арены",
    description: "Базовый комплект для старта.",
    art: "🛡️",
    price: { gold: 12000 },
    items: [
      {
        id: "h",
        slot: "Голова",
        name: "Шлем",
        icon: "🪖",
        stats: [
          { k: "HP", v: "+40" },
          { k: "Защита", v: "+2" },
        ],
      },
      {
        id: "b",
        slot: "Тело",
        name: "Кираса",
        icon: "🥋",
        stats: [
          { k: "Защита", v: "+4" },
          { k: "Вес", v: "Лёгкий" },
        ],
      },
      {
        id: "w",
        slot: "Оружие",
        name: "Гладиус",
        icon: "🗡️",
        stats: [
          { k: "Атака", v: "+6" },
          { k: "Скорость", v: "+1" },
        ],
      },
    ],
  },
];

/* =========================
   HELPERS
   ========================= */

function priceText(p: SetData["price"]) {
  const r: string[] = [];
  if (p.gold) r.push(`🪙 ${p.gold}`);
  if (p.aur) r.push(`💎 ${p.aur}`);
  return r.join(" • ");
}

/* =========================
   COMPONENT
   ========================= */

export default function Market() {
  const [tab, setTab] = useState<Tab>("sets");
  const [rarity, setRarity] = useState<Rarity>("common");
  const [active, setActive] = useState<SetData | null>(null);

  const filtered = useMemo(
    () => SETS.filter((s) => s.rarity === rarity),
    [rarity]
  );

  return (
    <div className="mk">
      <div className="mk__bg" />
      <div className="mk__shade" />

      {/* USER BAR */}
      <div className="mkUser">
        <div className="mkUser__left">
          <div className="mkAvatar" />
          <div className="mkUser__lvl">Ур. 12</div>
        </div>
        <div className="mkUser__right">
          <div className="mkWallet">🪙 10230</div>
          <div className="mkWallet">💎 1</div>
        </div>
      </div>

      <div className="mk__wrap">
        {/* TABS */}
        <div className="mkTabs">
          <button
            className={`mkTab ${tab === "sets" ? "mkTab--active" : ""}`}
            onClick={() => setTab("sets")}
          >
            Комплекты
          </button>
          <button
            className={`mkTab ${tab === "trades" ? "mkTab--active" : ""}`}
            onClick={() => setTab("trades")}
          >
            Трейды
          </button>
        </div>

        {/* SET LIST */}
        {tab === "sets" && (
          <>
            <div className="mkRarity">
              {(["common", "rare", "epic", "legendary"] as Rarity[]).map((r) => (
                <button
                  key={r}
                  className={`mkRarityBtn mkRarityBtn--${r}`}
                  onClick={() => setRarity(r)}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="mkList">
              {filtered.map((s) => (
                <div key={s.id} className={`mkSet mkSet--${s.rarity}`}>
                  <div className="mkArt">{s.art}</div>

                  <div>
                    <div className="mkSet__name">{s.name}</div>
                    <div className="mkSet__desc">{s.description}</div>
                  </div>

                  <div className="mkSet__right">
                    <button className="mkBtn" onClick={() => setActive(s)}>
                      Просмотреть
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {active && (
        <div className="mkModal">
          <div className="mkModal__back" onClick={() => setActive(null)} />

          <div className="mkCard">
            <div className="mkCard__scroll">
              {/* HEADER */}
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 34 }}>{active.art}</div>
                <div>
                  <h3 style={{ margin: 0 }}>{active.name}</h3>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {active.archetype}
                  </div>
                </div>
              </div>

              <p style={{ opacity: 0.8 }}>{active.description}</p>

              {/* ITEMS */}
              {active.items.map((i) => (
                <div
                  key={i.id}
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 14,
                    background: "rgba(0,0,0,.35)",
                    border: "1px solid rgba(255,255,255,.15)",
                  }}
                >
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ fontSize: 28 }}>{i.icon}</div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900 }}>{i.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        {i.slot}
                      </div>

                      {/* STATS */}
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          marginTop: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        {i.stats.map((s, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: "4px 8px",
                              fontSize: 11,
                              borderRadius: 8,
                              background: "rgba(90,170,255,.18)",
                              border: "1px solid rgba(90,170,255,.45)",
                              fontWeight: 700,
                            }}
                          >
                            {s.k} {s.v}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BUY BAR */}
            <div className="mkBuybar">
              <div style={{ fontWeight: 900 }}>
                {priceText(active.price)}
              </div>
              <button className="mkBuy">Купить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
