import { useEffect, useRef } from "react";
import styles from "./ColosseumFight.module.css";
import { createArena } from "./arena/ArenaScene";
import type { Gladiator } from "./Colosseum.types";

type Props = {
  playerTeam: Gladiator[];
  enemyTeam: Gladiator[];
  onExit: () => void;
};

export default function ColosseumFight({ playerTeam, enemyTeam, onExit }: Props) {
  const arenaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = arenaRef.current;
    if (!el || playerTeam.length === 0 || enemyTeam.length === 0) return;

    let arena: { destroy?: () => void } | null = null;
    let cancelled = false;

    (async () => {
      await new Promise((r) => requestAnimationFrame(r));
      if (cancelled || !arenaRef.current) return;

      arena = await createArena(arenaRef.current, playerTeam, enemyTeam, onExit);
    })();

    return () => {
      cancelled = true;
      arena?.destroy?.();
      arena = null;
    };
  }, [playerTeam, enemyTeam, onExit]);

  return (
    <div className={styles.scene}>
      <div className={styles.topBar} />
      <div ref={arenaRef} className={styles.arena} />
    </div>
  );
}
