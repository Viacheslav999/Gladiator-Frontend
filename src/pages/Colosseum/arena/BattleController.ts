import type { Fighter } from "./Fighter";
import { attackAnimation, deathAnimation } from "./animations";

export class BattleController {
  private fighters: Fighter[];
  private active = true;

  constructor(a: Fighter, b: Fighter) {
    this.fighters = [a, b];
    this.loop();
  }

  stop() {
    this.active = false;
  }

  private async loop() {
    while (this.active) {
      const attacker = this.randomAlive(null);
      if (!attacker) {
        this.active = false;
        break;
      }

      const target = this.randomAlive(attacker);
      if (!target) {
        this.active = false;
        break;
      }

      await this.attack(attacker, target);
      await this.delay(550);
    }
  }

  private async attack(attacker: Fighter, target: Fighter) {
    if (!attacker.alive || !target.alive) return;

    const special = Math.random() < 0.25;

    await attackAnimation(attacker, target);

    let damage = attacker.stats.attack - target.stats.defense;
    if (special) damage *= 2;
    if (Math.random() < attacker.stats.critChance) damage *= 1.5;

    target.stats.hp -= Math.max(1, Math.floor(damage));

    if (target.stats.hp <= 0) {
      target.alive = false;
      await deathAnimation(target);
      this.active = false;
    }
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
