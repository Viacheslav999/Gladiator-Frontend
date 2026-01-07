import styles from "./Barracks.module.css";
import { Gladiator } from "./gladiators.data";

export default function GladiatorModal({
  gladiator,
  onClose,
}: {
  gladiator: Gladiator;
  onClose: () => void;
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.close} onClick={onClose}>✖</div>

        <h2>{gladiator.name}</h2>

        <p className={styles.lore}>
          {gladiator.lore}
        </p>

        <div className={styles.stats}>
          <div>❤️ {gladiator.hp}</div>
          <div>⚔️ {gladiator.attack}</div>
          <div>🛡 {gladiator.defense}</div>
        </div>

        <div className={styles.abilities}>
          {gladiator.abilities.map((a) => (
            <div
              key={a.id}
              className={`${styles.ability} ${
                a.ultimate ? styles.ultimate : ""
              }`}
            >
              <strong>{a.name}</strong>
              <div>{a.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
