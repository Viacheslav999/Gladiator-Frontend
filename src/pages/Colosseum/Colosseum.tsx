import { useState } from "react";
import type { Gladiator } from "./Colosseum.types";
import ColosseumLobby from "./ColosseumLobby";
import ColosseumFight from "./ColosseumFight";
import { GLADIATORS } from "./gladiators.data";

type Mode = "lobby" | "fight";

/** вражеская команда: 3 бойца из оставшихся (при нехватке — дубли с новым id) */
function buildEnemyTeam(selected: Gladiator[]): Gladiator[] {
  const rest = GLADIATORS.filter((g) => !selected.some((s) => s.id === g.id));
  const pool = rest.length > 0 ? rest : GLADIATORS;

  return Array.from({ length: 3 }, (_, i) => {
    const src = pool[i % pool.length];
    return { ...src, id: `${src.id}-enemy-${i}` };
  });
}

export default function Colosseum() {
  const [mode, setMode] = useState<Mode>("lobby");
  const [playerTeam, setPlayerTeam] = useState<Gladiator[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<Gladiator[]>([]);

  return mode === "lobby" ? (
    <ColosseumLobby
      onStartFight={(selected: Gladiator[]) => {
        setPlayerTeam(selected);
        setEnemyTeam(buildEnemyTeam(selected));
        setMode("fight");
      }}
    />
  ) : (
    <ColosseumFight
      playerTeam={playerTeam}
      enemyTeam={enemyTeam}
      onExit={() => {
        setMode("lobby");
        setPlayerTeam([]);
        setEnemyTeam([]);
      }}
    />
  );
}
