import { useEffect, useRef } from "react";
import styles from "./ColosseumFight.module.css";
import { createArena } from "./arena/ArenaScene";
import type { Gladiator } from "./Colosseum.types";

type Props = {
  fighters: Gladiator[];
  onExit: () => void;
};

export default function ColosseumFight({ fighters, onExit }: Props) {
  const arenaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!arenaRef.current || fighters.length < 2) return;

    const arena = createArena(arenaRef.current, fighters);

    return () => {
      arena?.destroy?.();
    };
  }, [fighters]);

  return (
    <div className={styles.scene}>
      <div className={styles.topBar}>
        <div className={styles.status}>Бой начинается!</div>
        <button className={styles.exit} onClick={onExit}>
          ← Назад
        </button>
      </div>

      {/* ВАЖНО: этот div должен иметь размеры */}
      <div ref={arenaRef} className={styles.arena} />
    </div>
  );
}
