import * as PIXI from "pixi.js";

/** Цикл на общем тикере: fn возвращает false — цикл останавливается */
function tickerLoop(fn: (dt: number) => boolean) {
  const cb = (ticker: PIXI.Ticker) => {
    if (!fn(ticker.deltaTime)) PIXI.Ticker.shared.remove(cb);
  };
  PIXI.Ticker.shared.add(cb);
}

export type FloatTextOpts = {
  color?: number;
  size?: number;
  rise?: number;
};

/** Всплывающий текст урона/промаха/крита */
export function floatText(
  layer: PIXI.Container,
  x: number,
  y: number,
  text: string,
  opts: FloatTextOpts = {}
) {
  const { color = 0xff3b3b, size = 18, rise = 1.25 } = opts;

  const txt = new PIXI.Text({
    text,
    style: {
      fontFamily: "Arial",
      fontSize: size,
      fill: color,
      fontWeight: "900",
      stroke: { color: 0x000000, width: 3 },
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
  txt.position.set(x + (Math.random() - 0.5) * 14, y);
  txt.alpha = 0;
  layer.addChild(txt);

  let life = 1;
  tickerLoop((dt) => {
    if (txt.alpha < 1 && life > 0.5) txt.alpha = Math.min(1, txt.alpha + 0.14 * dt);
    txt.y -= rise * dt;
    txt.scale.set(1 + (1 - life) * 0.1);
    life -= 0.022 * dt;
    if (life < 0.35) txt.alpha -= 0.06 * dt;
    if (life <= 0 || txt.alpha <= 0) {
      txt.destroy();
      return false;
    }
    return true;
  });
}

/** Брызги крови */
export function spawnBlood(
  layer: PIXI.Container,
  x: number,
  y: number,
  dir: number,
  amount = 1
) {
  const count = Math.round((8 + Math.random() * 6) * amount);

  for (let i = 0; i < count; i++) {
    const p = new PIXI.Graphics();
    const r = 1.2 + Math.random() * 2.4;
    p.circle(0, 0, r).fill(Math.random() < 0.5 ? 0x9e0b0f : 0xc41e24);
    p.position.set(x, y);
    layer.addChild(p);

    let vx = dir * (0.4 + Math.random() * 2.6) + (Math.random() - 0.5) * 1.4;
    let vy = -(0.8 + Math.random() * 2.6);

    tickerLoop((dt) => {
      p.x += vx * dt;
      p.y += vy * dt;
      vy += 0.16 * dt;
      p.alpha -= 0.02 * dt;
      if (p.alpha <= 0) {
        p.destroy();
        return false;
      }
      return true;
    });
  }
}

/** Пятно крови на песке, медленно исчезает */
export function spawnStain(decals: PIXI.Container, x: number, y: number) {
  const s = new PIXI.Graphics();
  const rx = 12 + Math.random() * 16;
  s.ellipse(0, 0, rx, rx * 0.32).fill({ color: 0x6e0a0a, alpha: 1 });
  s.alpha = 0.32;
  s.position.set(x + (Math.random() - 0.5) * 10, y + 2);
  decals.addChild(s);

  tickerLoop((dt) => {
    s.alpha -= 0.00045 * dt;
    if (s.alpha <= 0) {
      s.destroy();
      return false;
    }
    return true;
  });
}

/** Вспышка при парировании */
export function spawnSpark(layer: PIXI.Container, x: number, y: number) {
  const c = new PIXI.Graphics();
  c.circle(0, 0, 6).fill({ color: 0xfff2c9, alpha: 0.95 });
  c.position.set(x, y);
  layer.addChild(c);

  let scale = 1;
  tickerLoop((dt) => {
    scale += 0.35 * dt;
    c.scale.set(scale);
    c.alpha -= 0.09 * dt;
    if (c.alpha <= 0) {
      c.destroy();
      return false;
    }
    return true;
  });
}
