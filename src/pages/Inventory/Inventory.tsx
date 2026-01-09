import React, { useMemo, useState } from "react";
import "./inventory.css";

/* ===================== TYPES ===================== */

type TabKey = "weapons" | "armor" | "fragments" | "materials";
type Rarity = "common" | "rare" | "epic" | "legendary";

type Stats = {
  atk?: number;
  def?: number;
  hp?: number;
  crit?: number;
};

type Item = {
  id: string;
  name: string;
  type: TabKey;
  rarity: Rarity;
  icon: string;
  level?: number;     // для оружия/брони
  qty?: number;       // для материалов/осколков
  desc?: string;
  stats?: Stats;
};

/* ===================== COMPONENT ===================== */

export default function Inventory() {
  const [tab, setTab] = useState<TabKey>("weapons");
  const [selected, setSelected] = useState<Item | null>(null);

  const items: Item[] = useMemo(
    () => [
      // WEAPONS
      {
        id: "w1",
        name: "Ржавый меч",
        type: "weapons",
        rarity: "common",
        icon: "🗡️",
        level: 1,
        desc: "Базовое оружие новичка. Дешёвое и надёжное.",
        stats: { atk: 8, crit: 1 },
      },
      {
        id: "w2",
        name: "Копьё тренировок",
        type: "weapons",
        rarity: "rare",
        icon: "🔱",
        level: 2,
        desc: "Удобно держать дистанцию. Хорошо в ранних боях.",
        stats: { atk: 14, crit: 2 },
      },

      // ARMOR
      {
        id: "a1",
        name: "Кожаный панцирь",
        type: "armor",
        rarity: "common",
        icon: "🛡️",
        level: 1,
        desc: "Лёгкая броня. Слабо защищает, но лучше чем ничего.",
        stats: { def: 6, hp: 10 },
      },
      {
        id: "a2",
        name: "Доспех Арены",
        type: "armor",
        rarity: "epic",
        icon: "🥋",
        level: 3,
        desc: "Броня ветерана. Усилена вставками и закалкой.",
        stats: { def: 22, hp: 40 },
      },

      // FRAGMENTS
      {
        id: "f1",
        name: "Осколки клинка",
        type: "fragments",
        rarity: "rare",
        icon: "🧩",
        qty: 12,
        desc: "Собери 30 — можно перековать редкий клинок.",
      },
      {
        id: "f2",
        name: "Осколки брони",
        type: "fragments",
        rarity: "common",
        icon: "🧱",
        qty: 41,
        desc: "Материал для усиления брони и апгрейдов.",
      },

      // MATERIALS
      {
        id: "m1",
        name: "Железные слитки",
        type: "materials",
        rarity: "common",
        icon: "🪨",
        qty: 26,
        desc: "База для крафта и улучшений оружия/брони.",
      },
      {
        id: "m2",
        name: "Закалённая сталь",
        type: "materials",
        rarity: "legendary",
        icon: "⚙️",
        qty: 2,
        desc: "Редкий материал для топовых апгрейдов.",
      },
    ],
    []
  );

  const filtered = useMemo(
    () => items.filter((i) => i.type === tab),
    [items, tab]
  );

  const selectedTypeLabel = useMemo(() => {
    if (!selected) return "";
    if (selected.type === "weapons") return "Оружие";
    if (selected.type === "armor") return "Доспехи";
    if (selected.type === "fragments") return "Осколки";
    return "Материалы";
  }, [selected]);

  return (
    <div className="armory-wrap">
      {/* FIRE LIGHT EFFECT */}
      <div className="fireGlow fireGlowLeft" />
      <div className="fireGlow fireGlowRight" />

      {/* HEADER */}
      <div className="armory-header">
        <div>
          <div className="armory-title">СКЛАД</div>
          <div className="armory-subtitle">
            Оружие • Доспехи • Осколки • Материалы
          </div>
        </div>

        <button className="armory-craftBtn" disabled>
          Кузня (скоро)
        </button>
      </div>

      {/* TABS */}
      <div className="armory-tabs">
        <Tab label="Оружие" active={tab === "weapons"} onClick={() => setTab("weapons")} />
        <Tab label="Доспехи" active={tab === "armor"} onClick={() => setTab("armor")} />
        <Tab label="Осколки" active={tab === "fragments"} onClick={() => setTab("fragments")} />
        <Tab label="Материалы" active={tab === "materials"} onClick={() => setTab("materials")} />
      </div>

      {/* CONTENT */}
      <div className="armory-content">
        {/* GRID */}
        <div className="armory-grid">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={`itemCard rarity-${item.rarity}`}
              type="button"
            >
              {/* TOP LEFT */}
              <div className="rarityPill">{rarityLabel(item.rarity)}</div>

              {/* TOP RIGHT */}
              {item.level != null && <div className="levelBadge">+{item.level}</div>}

              {/* ICON */}
              <div className="itemIcon">{item.icon}</div>

              {/* NAME */}
              <div className="itemName">{item.name}</div>

              {/* BOTTOM RIGHT */}
              {item.qty != null && <div className="qtyBadge">×{item.qty}</div>}
            </button>
          ))}
        </div>

        {/* INFO PANEL (как у тебя было справа) */}
        <div className="armory-panel">
          {!selected ? (
            <div className="panelPlaceholder">Выбери предмет, чтобы увидеть описание.</div>
          ) : (
            <>
              <div className="panelTitle">{selected.name}</div>
              <div className="panelMeta">
                {selectedTypeLabel} • {rarityLabel(selected.rarity)}
              </div>
              <div className="panelText">{selected.desc || "Нет описания."}</div>

              {selected.stats && (
                <div className="panelStats">
                  {selected.stats.atk != null && <div>⚔️ Атака: <b>{selected.stats.atk}</b></div>}
                  {selected.stats.def != null && <div>🛡️ Защита: <b>{selected.stats.def}</b></div>}
                  {selected.stats.hp != null && <div>❤️ HP: <b>{selected.stats.hp}</b></div>}
                  {selected.stats.crit != null && <div>🎯 Крит: <b>{selected.stats.crit}%</b></div>}
                </div>
              )}

              <div className="panelHint">
                Нажми на предмет ещё раз — откроется карточка по центру.
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===================== MODAL (по центру) ===================== */}
      {selected && (
        <div className="modalBackdrop" onMouseDown={() => setSelected(null)}>
          <div
            className={`modalCard rarity-${selected.rarity}`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="modalClose" onClick={() => setSelected(null)} type="button">
              ✕
            </button>

            <div className="modalTop">
              <div className="modalIcon">{selected.icon}</div>
              <div className="modalTitleBlock">
                <div className="modalTitle">{selected.name}</div>
                <div className="modalMeta">
                  {selectedTypeLabel} • {rarityLabel(selected.rarity)}
                  {selected.level != null ? ` • уровень +${selected.level}` : ""}
                </div>
              </div>
            </div>

            <div className="modalDesc">
              {selected.desc || "Нет описания."}
            </div>

            {selected.stats && (
              <div className="modalStats">
                {selected.stats.atk != null && <div>⚔️ Атака: <b>{selected.stats.atk}</b></div>}
                {selected.stats.def != null && <div>🛡️ Защита: <b>{selected.stats.def}</b></div>}
                {selected.stats.hp != null && <div>❤️ HP: <b>{selected.stats.hp}</b></div>}
                {selected.stats.crit != null && <div>🎯 Крит: <b>{selected.stats.crit}%</b></div>}
              </div>
            )}

            {selected.qty != null && (
              <div className="modalQty">В наличии: <b>×{selected.qty}</b></div>
            )}

            {(selected.type === "weapons" || selected.type === "armor") && (
              <button className="modalAction" type="button">
                ⬆️ Улучшить (скоро)
              </button>
            )}
          </div>
        </div>
      )}
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
      className={`tabBtn ${active ? "tabBtnActive" : ""}`}
      type="button"
    >
      {label}
    </button>
  );
}

function rarityLabel(r: Rarity) {
  if (r === "rare") return "РЕДКИЙ";
  if (r === "epic") return "ЭПИЧЕСКИЙ";
  if (r === "legendary") return "ЛЕГЕНДАРНЫЙ";
  return "ОБЫЧНЫЙ";
}
