import * as PIXI from "pixi.js";
import { floatText, spawnBlood, spawnSpark, spawnStain } from "./effects";

export type Ability = {
  id: string;
  cooldown: number;
  cdLeft: number;
};

export type FighterStats = {
  attack: number;
  defense: number;
  critChance: number;
};

/** Кадры анимации: 2.png … 14.png (по очереди) */
export const FIGHTER_FRAME_URLS = Array.from(
  { length: 13 },
  (_, i) => `/gladiators/first-gladiator/${i + 2}.png`
);

// индексы в FIGHTER_FRAME_URLS (0 = "2.png")
const FRAME = {
  idle: 0, // 2.png — стойка
  step: 1, // 3.png — шаг
  guard: 3, // 5.png — щит вперёд (блок)
  windupFrom: 2, // 4.png — начало замаха
  windupTo: 5, // 7.png
  strike: 6, // 8.png — выпад
  strike2: 7, // 9.png
  recoverFrom: 8, // 10.png
  recoverTo: 12, // 14.png
};

// все дистанции/скорости — в долях роста бойца, чтобы одинаково
// работало и на маленьком, и на широком экране
const WALK_SPEED_K = 1.7; // px/сек = рост * K (минимум 230)
const REACH_K = 0.55; // дистанция удара
const MIN_DIST_K = 0.3; // минимальная дистанция между бойцами одного ряда
const ROW_TOL = 30; // допуск по Y: считаем, что бойцы в одном ряду
const MISS_CHANCE = 0.12;
const PARRY_CHANCE = 0.1;
const BLEED_ON_CRIT_CHANCE = 0.6;

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export type Fighter = {
  container: PIXI.Container;
  sprite: PIXI.Sprite;
  name: string;

  hp: number;
  maxHp: number;
  alive: boolean;
  stats: FighterStats;
  abilities: Ability[];

  updateLayout(x: number, groundY: number, targetHeight: number): void;
  setZone(minX: number, maxX: number): void;
  rowY(): number;
  isBusy(): boolean;
  /** выход на арену: заходит с края экрана на свою позицию */
  enterArena(fromX: number): Promise<void>;
  performAttack(target: Fighter): Promise<void>;
  wander(): Promise<void>;
  destroy(): void;

  /** входящий удар: сам решает — попадание / промах / парирование */
  resolveIncoming(attacker: Fighter, dmg: number, crit: boolean): void;
  receiveDamage(dmg: number, opts?: { crit?: boolean; sourceX?: number; bleed?: boolean }): void;
};

export function createFighter(config: {
  name: string;
  flipped: boolean; // true — смотрит влево (правая команда)
  hp: number;
  stats: FighterStats;
  tint?: number;
  effectsLayer: PIXI.Container;
  decalsLayer: PIXI.Container;
  getOthers: () => Fighter[];
}): Fighter {
  const container = new PIXI.Container();
  const baseTint = config.tint ?? 0xffffff;

  const frames = FIGHTER_FRAME_URLS.map((u) => PIXI.Texture.from(u));

  const sprite = new PIXI.Sprite(frames[FRAME.idle]);
  sprite.anchor.set(0.5, 1);
  sprite.tint = baseTint;
  container.addChild(sprite);

  // ===== имя + мини-полоска HP над головой =====
  const nameText = new PIXI.Text({
    text: config.name,
    style: {
      fontFamily: "Arial",
      fontSize: 11,
      fill: 0xffffff,
      fontWeight: "800",
      stroke: { color: 0x000000, width: 3 },
    },
  });
  nameText.anchor.set(0.5);

  const hpBg = new PIXI.Graphics();
  const hpFill = new PIXI.Graphics();
  container.addChild(hpBg, hpFill, nameText);

  const HP_W = 52;
  const HP_H = 5;

  let homeX = 0;
  let baseY = 0;
  let baseScale = 1;
  let targetH = 100;

  const walkSpeed = () => Math.max(230, targetH * WALK_SPEED_K);
  const reach = () => targetH * REACH_K;
  const minDist = () => targetH * MIN_DIST_K;
  let zoneMin = -Infinity;
  let zoneMax = Infinity;
  let destroyed = false;
  let busy = false; // сейчас в атаке/контратаке — не дёргать
  const defaultDir = config.flipped ? -1 : 1;

  function setFrame(i: number) {
    sprite.texture = frames[Math.max(0, Math.min(frames.length - 1, i))];
  }

  function face(dir: number) {
    sprite.scale.x = Math.abs(sprite.scale.x) * (dir >= 0 ? 1 : -1);
  }

  function redrawHp() {
    const topY = -targetH - 16;
    const pct = fighter.maxHp > 0 ? fighter.hp / fighter.maxHp : 0;
    const color = pct > 0.5 ? 0x35c94a : pct > 0.25 ? 0xffb020 : 0xff3b3b;

    hpBg
      .clear()
      .roundRect(-HP_W / 2, topY, HP_W, HP_H, 3)
      .fill({ color: 0x000000, alpha: 0.55 });
    hpFill
      .clear()
      .roundRect(-HP_W / 2, topY, HP_W * pct, HP_H, 3)
      .fill(color);
    nameText.position.set(0, topY - 10);
  }

  function headPos() {
    return { x: container.x, y: container.y - targetH * 0.95 };
  }

  function chestPos() {
    return { x: container.x, y: container.y - targetH * 0.55 };
  }

  /** идти к точке x с шагающей анимацией; не проходит сквозь бойцов своего ряда */
  function walkTo(x: number, ignore?: Fighter): Promise<void> {
    return new Promise((resolve) => {
      if (destroyed || !fighter.alive || Math.abs(x - container.x) < 3) return resolve();

      face(Math.sign(x - container.x));
      let lastT = performance.now();
      let blockedMs = 0;

      function done() {
        PIXI.Ticker.shared.remove(cb);
        container.y = baseY;
        if (!destroyed && fighter.alive) setFrame(FRAME.idle);
        resolve();
      }

      function cb() {
        if (destroyed || !fighter.alive) return done();

        const now = performance.now();
        const dt = Math.min(50, now - lastT);
        lastT = now;

        const dir = Math.sign(x - container.x) || 1;
        const step = Math.min((walkSpeed() * dt) / 1000, Math.abs(x - container.x));
        const nx = container.x + dir * step;

        // впереди боец того же ряда — не проходить сквозь него
        // (цель атаки не считается препятствием — к ней и идём)
        const blocked = config.getOthers().some(
          (o) =>
            o !== fighter &&
            o !== ignore &&
            o.alive &&
            o.container.visible &&
            Math.abs(o.rowY() - baseY) < ROW_TOL &&
            Math.sign(o.container.x - container.x) === dir &&
            Math.abs(o.container.x - nx) < minDist()
        );

        if (blocked) {
          blockedMs += dt;
        } else {
          container.x = nx;
          blockedMs = 0;
        }

        container.y = baseY - Math.abs(Math.sin(now * 0.018)) * 2;
        setFrame(Math.floor(now / 110) % 2 === 0 ? FRAME.idle : FRAME.step);

        // дошёл или слишком долго упирается в другого бойца
        if (Math.abs(container.x - x) < 3 || blockedMs > 700) return done();
      }

      PIXI.Ticker.shared.add(cb);
    });
  }

  /**
   * идти к цели, пока не окажемся на дистанции удара от её ТЕКУЩЕЙ позиции —
   * даже если цель движется навстречу, стоп происходит вовремя, без наложения
   */
  function walkToward(target: Fighter): Promise<void> {
    return new Promise((resolve) => {
      if (destroyed || !fighter.alive) return resolve();

      let lastT = performance.now();
      const startedAt = lastT;
      let blockedMs = 0;

      function done() {
        PIXI.Ticker.shared.remove(cb);
        container.y = baseY;
        if (!destroyed && fighter.alive) setFrame(FRAME.idle);
        resolve();
      }

      function cb() {
        if (destroyed || !fighter.alive || !target.alive) return done();

        const now = performance.now();
        const dt = Math.min(50, now - lastT);
        lastT = now;

        const dist = target.container.x - container.x;
        if (Math.abs(dist) <= reach() * 1.02) return done();

        const dir = Math.sign(dist) || 1;
        face(dir);

        const step = Math.min((walkSpeed() * dt) / 1000, Math.abs(dist) - reach());
        const nx = container.x + dir * step;

        // чужой боец на пути (не цель) — не проходить сквозь него
        const blocked = config.getOthers().some(
          (o) =>
            o !== fighter &&
            o !== target &&
            o.alive &&
            o.container.visible &&
            Math.abs(o.rowY() - baseY) < ROW_TOL &&
            Math.sign(o.container.x - container.x) === dir &&
            Math.abs(o.container.x - nx) < minDist()
        );

        if (blocked) {
          blockedMs += dt;
        } else {
          container.x = nx;
          blockedMs = 0;
        }

        container.y = baseY - Math.abs(Math.sin(now * 0.018)) * 2;
        setFrame(Math.floor(now / 110) % 2 === 0 ? FRAME.idle : FRAME.step);

        // упёрся надолго или что-то пошло не так — бьём с текущей позиции
        if (blockedMs > 700 || now - startedAt > 5000) return done();
      }

      PIXI.Ticker.shared.add(cb);
    });
  }

  async function playFrames(from: number, to: number, msPerFrame: number) {
    for (let i = from; i <= to; i++) {
      if (destroyed || !fighter.alive) return;
      setFrame(i);
      await delay(msPerFrame);
    }
  }

  function flash(color: number, ms = 140) {
    sprite.tint = color;
    setTimeout(() => {
      if (!destroyed) sprite.tint = baseTint;
    }, ms);
  }

  function die(sourceX?: number) {
    fighter.alive = false;
    hpBg.visible = hpFill.visible = nameText.visible = false;

    const dir = sourceX !== undefined ? Math.sign(container.x - sourceX) || 1 : defaultDir * -1;
    spawnStain(config.decalsLayer, container.x, container.y);

    const start = performance.now();
    const startRot = sprite.rotation;
    const cb = () => {
      const t = Math.min(1, (performance.now() - start) / 560);
      sprite.rotation = startRot + dir * 1.1 * t;
      container.y = baseY + 30 * t;
      container.alpha = 1 - 0.75 * t;
      if (t >= 1 || destroyed) PIXI.Ticker.shared.remove(cb);
    };
    PIXI.Ticker.shared.add(cb);
  }

  async function applyBleed(sourceX?: number) {
    for (let i = 0; i < 3; i++) {
      await delay(850);
      if (destroyed || !fighter.alive) return;
      const dmg = 2 + Math.floor(Math.random() * 2);
      fighter.hp = Math.max(0, fighter.hp - dmg);
      redrawHp();
      const h = headPos();
      floatText(config.effectsLayer, h.x, h.y - 6, `-${dmg}`, { color: 0x8e0b0b, size: 14 });
      spawnBlood(config.effectsLayer, chestPos().x, chestPos().y, 0, 0.4);
      if (Math.random() < 0.5) spawnStain(config.decalsLayer, container.x, container.y);
      if (fighter.hp <= 0) {
        die(sourceX);
        return;
      }
    }
  }

  /** быстрая контратака без передвижения (противник рядом) */
  async function counterAttack(attacker: Fighter) {
    if (destroyed || !fighter.alive || !attacker.alive || busy) return;
    busy = true;
    try {
      face(Math.sign(attacker.container.x - container.x) || defaultDir);
      setFrame(FRAME.windupTo);
      await delay(90);
      if (destroyed || !fighter.alive || !attacker.alive) return;
      setFrame(FRAME.strike);
      const dmg = Math.max(3, Math.round(fighter.stats.attack * 0.6));
      attacker.receiveDamage(dmg, { sourceX: container.x });
      await delay(140);
      setFrame(FRAME.idle);
      face(defaultDir);
    } finally {
      busy = false;
    }
  }

  /** уклонение: короткий отскок назад */
  function dodge(fromX: number) {
    const dir = Math.sign(container.x - fromX) || defaultDir * -1;
    const startX = container.x;
    const start = performance.now();
    setFrame(FRAME.guard);
    const cb = () => {
      const t = Math.min(1, (performance.now() - start) / 240);
      const k = t < 0.5 ? t * 2 : (1 - t) * 2;
      container.x = startX + dir * targetH * 0.14 * k;
      if (t >= 1 || destroyed) {
        PIXI.Ticker.shared.remove(cb);
        container.x = startX;
        if (!destroyed && fighter.alive && !busy) setFrame(FRAME.idle);
      }
    };
    PIXI.Ticker.shared.add(cb);
  }

  const fighter: Fighter = {
    container,
    sprite,
    name: config.name,

    hp: config.hp,
    maxHp: config.hp,
    alive: true,
    stats: config.stats,

    abilities: [
      { id: "a1", cooldown: 2.5, cdLeft: 0 },
      { id: "a2", cooldown: 4.0, cdLeft: 0 },
      { id: "a3", cooldown: 6.0, cdLeft: 0 },
    ],

    updateLayout(x, groundY, targetHeight) {
      const texH = frames[FRAME.idle].height || 1;
      baseScale = targetHeight / texH;
      targetH = targetHeight;
      homeX = x;
      baseY = groundY;

      sprite.scale.set(defaultDir * baseScale, baseScale);
      container.position.set(x, groundY);
      redrawHp();
    },

    setZone(minX, maxX) {
      zoneMin = minX;
      zoneMax = maxX;
    },

    rowY: () => baseY,
    isBusy: () => busy,

    async enterArena(fromX) {
      if (destroyed || !fighter.alive) return;
      container.visible = true;
      container.x = fromX;
      container.y = baseY;
      await walkTo(homeX);
      face(defaultDir);
      setFrame(FRAME.idle);
    },

    async performAttack(target) {
      if (busy || destroyed || !fighter.alive || !target.alive) return;
      busy = true;
      try {
        await walkToward(target);
        if (destroyed || !fighter.alive) return;

        if (!target.alive) {
          await walkTo(homeX);
          face(defaultDir);
          return;
        }

        const dir = target.container.x >= container.x ? 1 : -1;
        face(dir);

        // замах
        await playFrames(FRAME.windupFrom, FRAME.windupTo, 55);
        if (destroyed || !fighter.alive || !target.alive) {
          await walkTo(homeX);
          face(defaultDir);
          return;
        }

        // выпад
        setFrame(FRAME.strike);
        container.x += dir * reach() * 0.18;
        await delay(45);

        const raw = fighter.stats.attack * (0.85 + Math.random() * 0.3);
        const crit = Math.random() < fighter.stats.critChance;
        const dmg = Math.max(
          3,
          Math.round(raw * (crit ? 1.7 : 1) - target.stats.defense * 0.5)
        );
        target.resolveIncoming(fighter, dmg, crit);

        setFrame(FRAME.strike2);
        await delay(60);
        container.x -= dir * reach() * 0.18;

        // возврат в стойку
        await playFrames(FRAME.recoverFrom, FRAME.recoverTo, 45);

        await walkTo(homeX);
        face(defaultDir);
        setFrame(FRAME.idle);
      } finally {
        busy = false;
      }
    },

    async wander() {
      if (busy || destroyed || !fighter.alive) return;
      busy = true;
      try {
        const dx = (Math.random() < 0.5 ? -1 : 1) * targetH * (0.15 + Math.random() * 0.3);
        homeX = Math.max(zoneMin, Math.min(zoneMax, homeX + dx));
        await walkTo(homeX);
        face(defaultDir);
      } finally {
        busy = false;
      }
    },

    resolveIncoming(attacker, dmg, crit) {
      if (destroyed || !fighter.alive) return;
      const h = headPos();

      // промах
      if (Math.random() < MISS_CHANCE) {
        floatText(config.effectsLayer, h.x, h.y, "Промах", { color: 0xbfbfbf, size: 15 });
        dodge(attacker.container.x);
        return;
      }

      // парирование + контратака
      if (!busy && Math.random() < PARRY_CHANCE) {
        setFrame(FRAME.guard);
        const c = chestPos();
        spawnSpark(config.effectsLayer, c.x, c.y - 8);
        floatText(config.effectsLayer, h.x, h.y, "Парировал!", { color: 0x9ecbff, size: 15 });
        setTimeout(() => void counterAttack(attacker), 180);
        return;
      }

      fighter.receiveDamage(dmg, { crit, sourceX: attacker.container.x });

      if (crit && fighter.alive && Math.random() < BLEED_ON_CRIT_CHANCE) {
        floatText(config.effectsLayer, h.x, h.y - 18, "Кровотечение", {
          color: 0x8e0b0b,
          size: 13,
        });
        void applyBleed(attacker.container.x);
      }
    },

    receiveDamage(dmg, opts = {}) {
      if (destroyed || !fighter.alive) return;

      fighter.hp = Math.max(0, fighter.hp - dmg);
      redrawHp();

      const h = headPos();
      const c = chestPos();
      const dir = opts.sourceX !== undefined ? Math.sign(container.x - opts.sourceX) || 1 : 1;

      floatText(config.effectsLayer, h.x, h.y, `-${dmg}${opts.crit ? "!" : ""}`, {
        color: opts.crit ? 0xffa020 : 0xff3b3b,
        size: opts.crit ? 24 : 18,
      });
      spawnBlood(config.effectsLayer, c.x, c.y, dir, opts.crit ? 1.6 : 1);
      if (opts.crit || Math.random() < 0.3) {
        spawnStain(config.decalsLayer, container.x, container.y);
      }

      flash(0xff7a7a);

      if (fighter.hp <= 0) {
        die(opts.sourceX);
      }
    },

    destroy() {
      destroyed = true;
      PIXI.Ticker.shared.remove(idleTick);
      container.destroy({ children: true });
    },
  };

  // дыхание в стойке + сортировка по глубине + расталкивание при наложении
  const idleTick = () => {
    if (destroyed) return;
    container.zIndex = container.y;
    if (!fighter.alive || busy) return;

    const t = performance.now() * 0.002;
    sprite.scale.y = baseScale * (1 + Math.sin(t) * 0.018);

    // стоим внахлёст с другим бойцом — плавно отодвигаемся
    if (container.visible) {
      for (const o of config.getOthers()) {
        if (o === fighter || !o.alive || !o.container.visible) continue;
        if (Math.abs(o.rowY() - baseY) >= ROW_TOL) continue;
        const dx = container.x - o.container.x;
        if (Math.abs(dx) < minDist()) {
          const dir = dx !== 0 ? Math.sign(dx) : defaultDir * -1;
          container.x += dir * 1.4;
        }
      }
    }
  };
  PIXI.Ticker.shared.add(idleTick);

  redrawHp();
  return fighter;
}
