import type { Fighter } from "./Fighter";

export class BattleController {
  private fighters: Fighter[];
  private active = true;

  constructor(a: Fighter, b: Fighter) {
    this.fighters = [a, b];
  }

  stop() {
    this.active = false;
  }

  async start() {
    while (this.active && this.fighters.every((f) => f.alive)) {
      const attacker = this.randomAlive(null);
      const target = this.randomAlive(attacker);
      if (!attacker || !target) break;

      await attacker.attack(target);

      // темп боя (чтобы не “долбили” слишком быстро)
      await this.delay(420);
    }

    this.active = false;
  }

  private randomAlive(exclude: Fighter | null): Fighter | null {
    const alive = this.fighters.filter((f) => f.alive && f !== exclude);
    if (alive.length === 0) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }

  private delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
