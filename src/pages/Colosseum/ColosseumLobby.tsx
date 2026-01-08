import type { Gladiator } from "./Colosseum.types";
import styles from "./ColosseumLobby.module.css";
import { GLADIATORS } from "./gladiators.data";
import { useState } from "react";

type Props = {
  onStartFight: (selected: Gladiator[]) => void;
};

export default function ColosseumLobby({ onStartFight }: Props) {
  const [selected, setSelected] = useState<Gladiator[]>([]);

  const toggle = (g: Gladiator) => {
    setSelected((prev) =>
      prev.some((x) => x.id === g.id)
        ? prev.filter((x) => x.id !== g.id)
        : prev.length < 2
        ? [...prev, g]
        : prev
    );
  };

  return (
    <div className={styles.scene}>
      {/* ВЕРХ */}
      <div className={styles.selectionPanel}>
        {[0, 1].map((i) => (
          <div key={i} className={styles.slot}>
            {selected[i] ? (
              <div className={styles.slotFilled}>
                <img src={selected[i].image} />
                {selected[i].name}
              </div>
            ) : (
              <div className={styles.slotEmpty}>Выбери бойца</div>
            )}
          </div>
        ))}

        <button
          className={styles.fightButton}
          disabled={selected.length < 2}
          onClick={() => onStartFight(selected)}
        >
          В БОЙ
        </button>
      </div>

      {/* ГЛАДИАТОРЫ */}
      <div className={styles.fighters}>
        {GLADIATORS.map((g) => (
          <div
            key={g.id}
            className={`${styles.card} ${
              selected.some((x) => x.id === g.id) ? styles.active : ""
            }`}
            onClick={() => toggle(g)}
          >
            <img src={g.image} />
            <div className={styles.name}>{g.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
