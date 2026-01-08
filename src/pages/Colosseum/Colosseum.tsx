import { useState } from "react";
import type { Gladiator } from "./Colosseum.types";
import ColosseumLobby from "./ColosseumLobby";
import ColosseumFight from "./ColosseumFight";

type Mode = "lobby" | "fight";

export default function Colosseum() {
  const [mode, setMode] = useState<Mode>("lobby");
  const [fighters, setFighters] = useState<Gladiator[]>([]);

  return mode === "lobby" ? (
    <ColosseumLobby
      onStartFight={(selected: Gladiator[]) => {
        setFighters(selected);
        setMode("fight");
      }}
    />
  ) : (
    <ColosseumFight
      fighters={fighters}
      onExit={() => {
        setMode("lobby");
        setFighters([]);
      }}
    />
  );
}

