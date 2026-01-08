import * as PIXI from "pixi.js";

export type Ability = {
  id: string;
  cooldown: number;
  cdLeft: number;
};

export type Fighter = {
  container: PIXI.Container;
  sprite: PIXI.Sprite;

  hp: number;
  maxHp: number;
  alive: boolean;

  abilities: Ability[];

  updateLayout(x: number, groundY: number, targetHeight: number): void;
  attack(target: Fighter): Promise<void>;
  takeDamage(dmg: number): void;
};

function tween(ms: number, fn: (t: number) => void) {
  return new Promise<void>((resolve) => {
    const start = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / ms);
      fn(t);
      if (t >= 1) {
        PIXI.Ticker.shared.remove(tick);
        resolve();
      }
    };
    PIXI.Ticker.shared.add(tick);
  });
}

function showDamage(container: PIXI.Container, value: number) {
  // ✅ Pixi v8 safest constructor
  const txt = new PIXI.Text({
    text: `-${value}`,
    style: {
      fontFamily: "Arial",
      fontSize: 20,
      fill: 0xff3b3b,
      fontWeight: "900",
      // ✅ v8: stroke is object
      stroke: { color: 0x000000, width: 3 },
      // ✅ v8: dropShadow is object
      dropShadow: {
        color: 0x000000,
        alpha: 0.75,
        blur: 2,
        angle: Math.PI / 2,
        distance: 2,
      },
    },
  });

  txt.anchor.set(0.5);
  txt.y = -120;
  txt.alpha = 0.0;
  container.addChild(txt);

  // лёгкий pop + вверх + fade
  let life = 1;

  PIXI.Ticker.shared.add(function tick() {
    // pop in
    if (txt.alpha < 1) txt.alpha = Math.min(1, txt.alpha + 0.12);

    txt.y -= 1.25;
    txt.scale.set(1 + (1 - life) * 0.08);

    life -= 0.03;
    if (life < 0.35) txt.alpha -= 0.06;

    if (life <= 0 || txt.alpha <= 0) {
      PIXI.Ticker.shared.remove(tick);
      txt.destroy();
    }
  });
}

export function createFighter(config: {
  texture: string;
  flipped: boolean;
  hp: number;
}): Fighter {
  const container = new PIXI.Container();

  const sprite = PIXI.Sprite.from(config.texture);
  sprite.anchor.set(0.5, 1);
  container.addChild(sprite);

  let baseX = 0;
  let baseY = 0;
  let baseScale = 1;

  const fighter: Fighter = {
    container,
    sprite,

    hp: config.hp,
    maxHp: config.hp,
    alive: true,

    abilities: [
      { id: "a1", cooldown: 2.5, cdLeft: 0 },
      { id: "a2", cooldown: 4.0, cdLeft: 0 },
      { id: "a3", cooldown: 6.0, cdLeft: 0 },
    ],

    updateLayout(x, groundY, targetHeight) {
      const scale = targetHeight / sprite.texture.height;
      baseScale = scale;
      baseX = x;
      baseY = groundY;

      sprite.scale.set(config.flipped ? -scale : scale, scale);
      container.position.set(x, groundY);
    },

    async attack(target) {
      if (!fighter.alive || !target.alive) return;

      const dir = target.container.x > baseX ? 1 : -1;

      // небольшая “пружина” перед рывком
      await tween(120, (t) => {
        const e = t;
        container.x = baseX - dir * 6 * e;
        sprite.rotation = dir * 0.04 * e;
      });

      const step = 52;

      // рывок
      await tween(220, (t) => {
        const e = t;
        container.x = baseX + dir * step * e;
        sprite.rotation = -dir * 0.14 * e;
        // ударная поза
        sprite.scale.y = baseScale * (1 - 0.04 * e);
      });

      // hit pause
      await new Promise((r) => setTimeout(r, 70));

      if (target.alive) target.takeDamage(12);

      // откат назад
      await tween(260, (t) => {
        const e = t;
        container.x = baseX + dir * step * (1 - e);
        sprite.rotation = -dir * 0.14 * (1 - e);
        sprite.scale.y = baseScale * (1 - 0.04 * (1 - e));
      });

      container.x = baseX;
      sprite.rotation = 0;
      sprite.scale.y = baseScale;
    },

    takeDamage(dmg) {
      if (!fighter.alive) return;

      fighter.hp = Math.max(0, fighter.hp - dmg);
      showDamage(container, dmg);

      // микро-стан/встряска
      sprite.tint = 0xff7a7a;
      container.y = baseY - 5;

      setTimeout(() => {
        sprite.tint = 0xffffff;
        container.y = baseY;
      }, 140);

      if (fighter.hp <= 0) {
        fighter.alive = false;

        // смерть: наклон + падение + fade
        tween(520, (t) => {
          const e = t;
          sprite.rotation = e * (config.flipped ? -1 : 1) * 0.9;
          container.y = baseY + 44 * e;
          container.alpha = 1 - e;
        });
      }
    },
  };

  // idle breathing
  PIXI.Ticker.shared.add(() => {
    if (!fighter.alive) return;
    const t = performance.now() * 0.002;
    sprite.scale.y = baseScale * (1 + Math.sin(t) * 0.02);
  });

  return fighter;
}
