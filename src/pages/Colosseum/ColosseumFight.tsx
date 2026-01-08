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
    const el = arenaRef.current;
    if (!el || fighters.length < 2) return;

    let arena: { destroy?: () => void } | null = null;
    let cancelled = false;

    (async () => {
      await new Promise((r) => requestAnimationFrame(r));
      if (cancelled || !arenaRef.current) return;

      arena = await createArena(arenaRef.current, fighters, onExit);
    })();

    return () => {
      cancelled = true;
      arena?.destroy?.();
      arena = null;
    };
  }, [fighters, onExit]);

  return (
    <div className={styles.scene}>
      {/* убрали “Бой начинается!” */}
      <div className={styles.topBar} />
      <div ref={arenaRef} className={styles.arena} />
    </div>
  );
}
