import * as PIXI from "pixi.js";
import type { Gladiator } from "../Colosseum.types";
import { createFighter } from "./Fighter";
import { BattleController } from "./BattleController";

export async function createArena(
  container: HTMLDivElement,
  fighters: Gladiator[],
  onExit: () => void
) {
  container.innerHTML = "";

  const app = new PIXI.Application();
  await app.init({ resizeTo: container, backgroundAlpha: 0, antialias: true });
  container.appendChild(app.canvas);

  const [leftGl, rightGl] = fighters;

  await PIXI.Assets.load(["/arena/arena.png", leftGl.image, rightGl.image]);

  const bg = PIXI.Sprite.from("/arena/arena.png");
  bg.anchor.set(0.5);
  app.stage.addChild(bg);

  const left = createFighter({
    texture: leftGl.image,
    flipped: false,
    hp: leftGl.hp,
  });

  const right = createFighter({
    texture: rightGl.image,
    flipped: true,
    hp: rightGl.hp,
  });

  app.stage.addChild(left.container, right.container);

  // ===== UI =====
  const ui = new PIXI.Container();
  ui.x = -12; // ✅ “сместить чуть влево” ВСЮ панель
  app.stage.addChild(ui);

  const HP_OFFSET = 48;
  const BAR_W = 200;
  const BAR_H = 14;

  const hpBgL = new PIXI.Graphics();
  const hpFillL = new PIXI.Graphics();
  const hpBgR = new PIXI.Graphics();
  const hpFillR = new PIXI.Graphics();

  const hpTextL = new PIXI.Text({
    text: "",
    style: { fontFamily: "Arial", fontSize: 12, fill: 0xffffff, fontWeight: "800" },
  });
  hpTextL.anchor.set(0.5);

  const hpTextR = new PIXI.Text({
    text: "",
    style: { fontFamily: "Arial", fontSize: 12, fill: 0xffffff, fontWeight: "800" },
  });
  hpTextR.anchor.set(0.5);

  ui.addChild(hpBgL, hpFillL, hpTextL, hpBgR, hpFillR, hpTextR);

  // способности: компактные рамки + проценты кд
  const AB_SIZE = 30;
  const AB_GAP = 8;

  const abilityL = left.abilities.map(() => ({
    box: new PIXI.Graphics(),
    text: new PIXI.Text({
      text: "",
      style: { fontFamily: "Arial", fontSize: 10, fill: 0xffffff, fontWeight: "800" },
    }),
  }));

  const abilityR = right.abilities.map(() => ({
    box: new PIXI.Graphics(),
    text: new PIXI.Text({
      text: "",
      style: { fontFamily: "Arial", fontSize: 10, fill: 0xffffff, fontWeight: "800" },
    }),
  }));

  abilityL.forEach((a) => {
    a.text.anchor.set(0.5);
    ui.addChild(a.box, a.text);
  });
  abilityR.forEach((a) => {
    a.text.anchor.set(0.5);
    ui.addChild(a.box, a.text);
  });

  // ===== RESULT OVERLAY =====
  const overlay = new PIXI.Container();
  overlay.visible = false;
  overlay.eventMode = "static";
  app.stage.addChild(overlay);

  const dim = new PIXI.Graphics();
  overlay.addChild(dim);

  const title = new PIXI.Text({
    text: "",
    style: { fontFamily: "Arial", fontSize: 34, fill: 0xffffff, fontWeight: "900" },
  });
  title.anchor.set(0.5);
  overlay.addChild(title);

  const rewards = new PIXI.Text({
    text: "",
    style: { fontFamily: "Arial", fontSize: 16, fill: 0xffd700, fontWeight: "800" },
  });
  rewards.anchor.set(0.5);
  overlay.addChild(rewards);

  const btn = new PIXI.Graphics();
  btn.cursor = "pointer";
  btn.eventMode = "static";
  btn.on("pointertap", () => onExit());
  overlay.addChild(btn);

  const btnText = new PIXI.Text({
    text: "Вернуться в Колизей",
    style: { fontFamily: "Arial", fontSize: 15, fill: 0xffffff, fontWeight: "900" },
  });
  btnText.anchor.set(0.5);
  overlay.addChild(btnText);

  let fightEnded = false;

  const onResize = () => {
    const w = app.screen.width;
    const h = app.screen.height;

    const scale = Math.max(w / bg.texture.width, h / bg.texture.height);
    bg.scale.set(scale);
    bg.position.set(w / 2, h / 2);

    // бойцы поменьше (чтобы под UI было место)
    left.updateLayout(w * 0.35, h * 0.82, h * 0.24);
    right.updateLayout(w * 0.65, h * 0.82, h * 0.24);

    hpTextL.position.set(HP_OFFSET + BAR_W / 2, 14 + BAR_H / 2);
    hpTextR.position.set(w - HP_OFFSET - BAR_W / 2, 14 + BAR_H / 2);

    // overlay layout
    dim.clear().rect(0, 0, w, h).fill({ color: 0x000000, alpha: 0.6 });
    title.position.set(w / 2, h / 2 - 40);
    rewards.position.set(w / 2, h / 2);
    btn.clear().roundRect(w / 2 - 120, h / 2 + 40, 240, 44, 12).fill(0x8b0000);
    btnText.position.set(w / 2, h / 2 + 62);
  };

  app.renderer.on("resize", onResize);
  onResize();

  // ===== UI tick =====
  app.ticker.add(() => {
    // cooldown tick (простая заглушка)
    left.abilities.forEach((a) => (a.cdLeft = Math.max(0, a.cdLeft - 0.016)));
    right.abilities.forEach((a) => (a.cdLeft = Math.max(0, a.cdLeft - 0.016)));

    // HP left
    hpBgL.clear().roundRect(HP_OFFSET, 14, BAR_W, BAR_H, 8).fill({ color: 0x1a0505, alpha: 0.75 });
    hpFillL
      .clear()
      .roundRect(HP_OFFSET, 14, BAR_W * (left.hp / left.maxHp), BAR_H, 8)
      .fill(0xff3b3b);
    hpTextL.text = `${left.hp} / ${left.maxHp}`;

    // HP right
    const rx = app.screen.width - HP_OFFSET - BAR_W;
    hpBgR.clear().roundRect(rx, 14, BAR_W, BAR_H, 8).fill({ color: 0x1a0505, alpha: 0.75 });
    hpFillR
      .clear()
      .roundRect(rx, 14, BAR_W * (right.hp / right.maxHp), BAR_H, 8)
      .fill(0xff3b3b);
    hpTextR.text = `${right.hp} / ${right.maxHp}`;

    // abilities left
    left.abilities.forEach((a, i) => {
      const x = HP_OFFSET + i * (AB_SIZE + AB_GAP);
      const y = 36;

      const ratio = a.cdLeft / a.cooldown; // 0..1
      const pct = Math.ceil((1 - ratio) * 100);

      const slot = abilityL[i];
      slot.box
        .clear()
        .roundRect(x, y, AB_SIZE, AB_SIZE, 8)
        .fill({ color: 0x0f0f0f, alpha: 0.75 })
        .stroke({ color: 0xffffff, alpha: 0.12, width: 2 });

      if (ratio > 0) {
        slot.box
          .roundRect(x, y + AB_SIZE * (1 - ratio), AB_SIZE, AB_SIZE * ratio, 8)
          .fill({ color: 0x000000, alpha: 0.55 });
      }

      slot.text.text = ratio > 0 ? `${pct}%` : "";
      slot.text.position.set(x + AB_SIZE / 2, y + AB_SIZE / 2);
    });

    // abilities right
    right.abilities.forEach((a, i) => {
      const x = rx + i * (AB_SIZE + AB_GAP);
      const y = 36;

      const ratio = a.cdLeft / a.cooldown;
      const pct = Math.ceil((1 - ratio) * 100);

      const slot = abilityR[i];
      slot.box
        .clear()
        .roundRect(x, y, AB_SIZE, AB_SIZE, 8)
        .fill({ color: 0x0f0f0f, alpha: 0.75 })
        .stroke({ color: 0xffffff, alpha: 0.12, width: 2 });

      if (ratio > 0) {
        slot.box
          .roundRect(x, y + AB_SIZE * (1 - ratio), AB_SIZE, AB_SIZE * ratio, 8)
          .fill({ color: 0x000000, alpha: 0.55 });
      }

      slot.text.text = ratio > 0 ? `${pct}%` : "";
      slot.text.position.set(x + AB_SIZE / 2, y + AB_SIZE / 2);
    });

    // end fight
    if (!fightEnded && (!left.alive || !right.alive)) {
      fightEnded = true;
      overlay.visible = true;

      const win = left.alive && !right.alive;
      title.text = win ? "ПОБЕДА!" : "ПОРАЖЕНИЕ";
      rewards.text = win ? "+120 золота • +30 опыта" : "Без награды";
    }
  });

  // ===== fight loop (через контроллер, чтобы не дублировать логику) =====
  const controller = new BattleController(left, right);
  controller.start();

  return {
    destroy: () => {
      controller.stop();
      app.destroy(true);
    },
  };
}
