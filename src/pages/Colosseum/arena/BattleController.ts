import type { Fighter } from "./Fighter";

const WANDER_CHANCE = 0.18; // иногда боец просто переходит по арене
const MIN_PAUSE = 1100; // пауза между действиями бойца, мс
const MAX_PAUSE = 2600;
const ENTER_DELAY = 1100; // пауза перед выходом следующего бойца

export type Side = "left" | "right";

/**
 * Бой командами, но дерутся 1 на 1:
 * на арене по одному бойцу с каждой стороны,
 * следующий выходит только когда предыдущий погиб.
 */
export class BattleController {
  private active = true;
  private current: Record<Side, Fighter | null> = { left: null, right: null };

  constructor(
    private left: Fighter[],
    private right: Fighter[],
    private hooks: {
      /** x-координата за краем экрана, откуда заходит боец */
      enterFrom: (side: Side) => number;
      onActiveChange?: (side: Side, f: Fighter) => void;
    }
  ) {}

  getActive(side: Side) {
    return this.current[side];
  }

  start() {
    void this.runSide("left");
    void this.runSide("right");
  }

  stop() {
    this.active = false;
  }

  private team(side: Side) {
    return side === "left" ? this.left : this.right;
  }

  private other(side: Side): Side {
    return side === "left" ? "right" : "left";
  }

  private async runSide(side: Side) {
    const team = this.team(side);

    for (let i = 0; i < team.length; i++) {
      if (!this.active) return;
      const f = team[i];
      if (!f.alive) continue;

      if (i > 0) {
        await this.delay(ENTER_DELAY);
        if (!this.active) return;
        await f.enterArena(this.hooks.enterFrom(side));
      }

      this.current[side] = f;
      this.hooks.onActiveChange?.(side, f);

      await this.fightLoop(f, side);

      // враги кончились — победа, следующих не выпускаем
      if (!this.team(this.other(side)).some((e) => e.alive)) return;
    }
  }

  /** личный цикл бойца: рандомные паузы -> удар по текущему противнику или переход */
  private async fightLoop(f: Fighter, side: Side) {
    await this.delay(600 + Math.random() * 1000);

    while (this.active && f.alive) {
      const enemyTeam = this.team(this.other(side));
      if (!enemyTeam.some((e) => e.alive)) return;

      const enemy = this.current[this.other(side)];
      if (!enemy || !enemy.alive) {
        // противник погиб — ждём выхода следующего
        await this.delay(400);
        continue;
      }

      if (Math.random() < WANDER_CHANCE) {
        await f.wander();
      } else {
        await f.performAttack(enemy);
      }

      await this.delay(MIN_PAUSE + Math.random() * (MAX_PAUSE - MIN_PAUSE));
    }
  }

  private delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
