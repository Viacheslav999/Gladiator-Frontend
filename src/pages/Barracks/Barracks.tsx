import { useState } from "react";
import styles from "./Barracks.module.css";
import { gladiators } from "./gladiators.data";
import GladiatorSlot from "./GladiatorSlot";
import PlayerHeader from "../../widgets/PlayerHeader/PlayerHeader";

export default function Barracks() {
  const [focused, setFocused] = useState(false);
  const gladiator = gladiators[0];

  return (
    <div className={styles.barracks}>
      <PlayerHeader />
      <div className={styles.background} />

      <div className={styles.scene}>
        <GladiatorSlot
          gladiator={gladiator}
          focused={focused}
          onClick={() => setFocused(true)}
        />
      </div>

      {focused && (
        <div className={styles.bottomPanel}>
          <button
            className={styles.close}
            onClick={() => setFocused(false)}
          >
            ✕
          </button>

          <h2 className={styles.name}>{gladiator.name}</h2>

          <div className={styles.stats}>
            ❤️ {gladiator.hp}
            ⚔️ {gladiator.attack}
            🛡️ {gladiator.defense}
          </div>

          <p className={styles.lore}>{gladiator.lore}</p>

          <div className={styles.abilities}>
            {gladiator.abilities.map((a: any) => (
              <div
                key={a.id}
                className={`${styles.ability} ${
                  a.ultimate ? styles.ultimate : ""
                }`}
              >
                <strong>{a.name}</strong>
                <p>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
