import * as PIXI from "pixi.js";
import type { Gladiator } from "../Colosseum.types";
import { createFighter, FIGHTER_FRAME_URLS, type Fighter } from "./Fighter";
import { BattleController, type Side } from "./BattleController";

// позиция активного бойца (доли экрана); правая сторона — зеркально
const SLOT = { x: 0.32, y: 0.84 };

const ENEMY_TINT = 0xffc9b4; // лёгкий красноватый оттенок вражеской команды

export async function createArena(
  container: HTMLDivElement,
  playerTeam: Gladiator[],
  enemyTeam: Gladiator[],
  onExit: () => void
) {
  container.innerHTML = "";

  const app = new PIXI.Application();
  await app.init({ resizeTo: container, backgroundAlpha: 0, antialias: true });
  container.appendChild(app.canvas);

  await PIXI.Assets.load(["/arena/arena.png", ...FIGHTER_FRAME_URLS]);

  const bg = PIXI.Sprite.from("/arena/arena.png");
  bg.anchor.set(0.5);
  app.stage.addChild(bg);

  // слои: пятна крови -> бойцы (сортировка по глубине) -> эффекты -> UI
  const decalsLayer = new PIXI.Container();
  const fightersLayer = new PIXI.Container();
  fightersLayer.sortableChildren = true;
  const effectsLayer = new PIXI.Container();
  app.stage.addChild(decalsLayer, fightersLayer, effectsLayer);

  const all: Fighter[] = [];

  const makeTeam = (team: Gladiator[], flipped: boolean): Fighter[] =>
    team.slice(0, 3).map((g) =>
      createFighter({
        name: g.name,
        flipped,
        hp: g.hp,
        stats: { attack: g.attack, defense: g.defense, critChance: g.critChance },
        tint: flipped ? ENEMY_TINT : 0xffffff,
        effectsLayer,
        decalsLayer,
        getOthers: () => all,
      })
    );

  const left = makeTeam(playerTeam, false);
  const right = makeTeam(enemyTeam, true);
  all.push(...left, ...right);

  all.forEach((f) => fightersLayer.addChild(f.container));

  // на арене только первые бойцы, остальные ждут в очереди
  left.forEach((f, i) => (f.container.visible = i === 0));
  right.forEach((f, i) => (f.container.visible = i === 0));

  // ===== UI =====
  const ui = new PIXI.Container();
  app.stage.addChild(ui);

  const BAR_H = 12;

  const hpBgL = new PIXI.Graphics();
  const hpFillL = new PIXI.Graphics();
  const hpBgR = new PIXI.Graphics();
  const hpFillR = new PIXI.Graphics();

  const labelStyle = {
    fontFamily: "Arial",
    fontSize: 11,
    fill: 0xffffff,
    fontWeight: "800" as const,
  };

  const hpTextL = new PIXI.Text({ text: "Твоя команда", style: labelStyle });
  const hpTextR = new PIXI.Text({ text: "Противник", style: labelStyle });
  hpTextL.anchor.set(0, 0.5);
  hpTextR.anchor.set(1, 0.5);

  ui.addChild(hpBgL, hpFillL, hpTextL, hpBgR, hpFillR, hpTextR);

  // ===== очередь "Далее" по краям =====
  const THUMB_H = 46;

  type QueueEntry = { fighter: Fighter; box: PIXI.Container; sprite: PIXI.Sprite };

  const makeQueue = (team: Fighter[], flipped: boolean): QueueEntry[] =>
    team.map((f) => {
      const box = new PIXI.Container();

      const sprite = new PIXI.Sprite(PIXI.Texture.from(FIGHTER_FRAME_URLS[0]));
      sprite.anchor.set(0.5, 0);
      const s = THUMB_H / sprite.texture.height;
      sprite.scale.set(flipped ? -s : s, s);
      if (flipped) sprite.tint = ENEMY_TINT;
      box.addChild(sprite);

      const name = new PIXI.Text({
        text: f.name,
        style: { fontFamily: "Arial", fontSize: 9, fill: 0xffffff, fontWeight: "800" },
      });
      name.anchor.set(0.5, 0);
      name.position.set(0, THUMB_H + 2);
      box.addChild(name);

      box.visible = false;
      ui.addChild(box);
      return { fighter: f, box, sprite };
    });

  const queueL = makeQueue(left, false);
  const queueR = makeQueue(right, true);

  const queueLabelStyle = {
    fontFamily: "Arial",
    fontSize: 10,
    fill: 0xd9c9a8,
    fontWeight: "800" as const,
  };
  const queueTitleL = new PIXI.Text({ text: "Далее:", style: queueLabelStyle });
  const queueTitleR = new PIXI.Text({ text: "Далее:", style: queueLabelStyle });
  queueTitleR.anchor.set(1, 0);
  ui.addChild(queueTitleL, queueTitleR);

  // ===== способности активных бойцов внизу =====
  const AB_SIZE = 26;
  const AB_GAP = 6;
  const CLUSTER_W = AB_SIZE * 3 + AB_GAP * 2;

  type Cluster = { name: PIXI.Text; slots: { box: PIXI.Graphics; text: PIXI.Text }[] };

  const makeCluster = (): Cluster => {
    const name = new PIXI.Text({
      text: "",
      style: { fontFamily: "Arial", fontSize: 11, fill: 0xd9c9a8, fontWeight: "800" },
    });
    name.anchor.set(0.5);
    ui.addChild(name);

    const slots = Array.from({ length: 3 }, () => {
      const box = new PIXI.Graphics();
      const text = new PIXI.Text({
        text: "",
        style: { fontFamily: "Arial", fontSize: 9, fill: 0xffffff, fontWeight: "800" },
      });
      text.anchor.set(0.5);
      ui.addChild(box, text);
      return { box, text };
    });

    return { name, slots };
  };

  const clusterL = makeCluster();
  const clusterR = makeCluster();

  // ===== оверлей результата =====
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
  let endAt = 0;

  const onResize = () => {
    const w = app.screen.width;
    const h = app.screen.height;

    const scale = Math.max(w / bg.texture.width, h / bg.texture.height);
    bg.scale.set(scale);
    bg.position.set(w / 2, h / 2);

    const targetH = h * 0.26;
    left.forEach((f) => {
      f.updateLayout(w * SLOT.x, h * SLOT.y, targetH);
      f.setZone(w * 0.1, w * 0.45);
    });
    right.forEach((f) => {
      f.updateLayout(w * (1 - SLOT.x), h * SLOT.y, targetH);
      f.setZone(w * 0.55, w * 0.9);
    });

    // overlay
    dim.clear().rect(0, 0, w, h).fill({ color: 0x000000, alpha: 0.6 });
    title.position.set(w / 2, h / 2 - 40);
    rewards.position.set(w / 2, h / 2);
    btn.clear().roundRect(w / 2 - 120, h / 2 + 40, 240, 44, 12).fill(0x8b0000);
    btnText.position.set(w / 2, h / 2 + 62);
  };

  app.renderer.on("resize", onResize);
  onResize();

  const teamHp = (team: Fighter[]) => {
    const hp = team.reduce((s, f) => s + f.hp, 0);
    const max = team.reduce((s, f) => s + f.maxHp, 0);
    return { hp, max, pct: max > 0 ? hp / max : 0 };
  };

  const drawCluster = (cluster: Cluster, fighter: Fighter | null, baseX: number, y: number) => {
    cluster.name.visible = !!fighter;
    cluster.slots.forEach((s) => {
      s.box.visible = !!fighter;
      s.text.visible = !!fighter;
    });
    if (!fighter) return;

    cluster.name.text = fighter.name;
    cluster.name.position.set(baseX + CLUSTER_W / 2, y - 10);

    fighter.abilities.forEach((a, i) => {
      a.cdLeft = Math.max(0, a.cdLeft - 0.016);
      const x = baseX + i * (AB_SIZE + AB_GAP);
      const ratio = a.cooldown > 0 ? a.cdLeft / a.cooldown : 0;
      const slot = cluster.slots[i];

      slot.box
        .clear()
        .roundRect(x, y, AB_SIZE, AB_SIZE, 6)
        .fill({ color: 0x0f0f0f, alpha: 0.75 })
        .stroke({ color: 0xffffff, alpha: 0.12, width: 2 });

      if (ratio > 0) {
        slot.box
          .roundRect(x, y + AB_SIZE * (1 - ratio), AB_SIZE, AB_SIZE * ratio, 6)
          .fill({ color: 0x000000, alpha: 0.55 });
      }

      slot.text.text = ratio > 0 ? `${Math.ceil((1 - ratio) * 100)}%` : "";
      slot.text.position.set(x + AB_SIZE / 2, y + AB_SIZE / 2);
    });
  };

  const drawQueue = (entries: QueueEntry[], fromLeft: boolean, w: number) => {
    const waiting = entries.filter((e) => e.fighter.alive && !e.fighter.container.visible);
    const anyWaiting = waiting.length > 0;
    (fromLeft ? queueTitleL : queueTitleR).visible = anyWaiting;

    let y = 64;
    entries.forEach((e) => {
      const isWaiting = waiting.includes(e);
      e.box.visible = isWaiting;
      if (!isWaiting) return;
      e.box.position.set(fromLeft ? 34 : w - 34, y);
      y += THUMB_H + 22;
    });
  };

  // ===== UI tick =====
  app.ticker.add(() => {
    const w = app.screen.width;
    const h = app.screen.height;
    const barW = Math.min(220, Math.max(130, w * 0.3));

    // командные HP сверху
    const l = teamHp(left);
    const r = teamHp(right);

    hpBgL.clear().roundRect(14, 14, barW, BAR_H, 6).fill({ color: 0x1a0505, alpha: 0.75 });
    hpFillL.clear().roundRect(14, 14, barW * l.pct, BAR_H, 6).fill(0x35c94a);
    hpTextL.position.set(16, 14 + BAR_H + 10);

    hpBgR
      .clear()
      .roundRect(w - 14 - barW, 14, barW, BAR_H, 6)
      .fill({ color: 0x1a0505, alpha: 0.75 });
    hpFillR
      .clear()
      .roundRect(w - 14 - barW * r.pct, 14, barW * r.pct, BAR_H, 6)
      .fill(0xff3b3b);
    hpTextR.position.set(w - 16, 14 + BAR_H + 10);

    // очереди "Далее"
    queueTitleL.position.set(14, 48);
    queueTitleR.position.set(w - 14, 48);
    drawQueue(queueL, true, w);
    drawQueue(queueR, false, w);

    // способности активных бойцов
    const abY = h - AB_SIZE - 100; // над нижней навигацией
    drawCluster(clusterL, controller.getActive("left"), 14, abY);
    drawCluster(clusterR, controller.getActive("right"), w - 14 - CLUSTER_W, abY);

    // конец боя — когда одна из команд полностью пала
    if (!fightEnded) {
      const leftAlive = left.some((f) => f.alive);
      const rightAlive = right.some((f) => f.alive);

      if (!leftAlive || !rightAlive) {
        if (endAt === 0) {
          endAt = performance.now() + 900; // дать доиграть смерти
        } else if (performance.now() >= endAt) {
          fightEnded = true;
          controller.stop();
          overlay.visible = true;

          const win = leftAlive && !rightAlive;
          title.text = win ? "ПОБЕДА!" : "ПОРАЖЕНИЕ";
          rewards.text = win ? "+120 золота • +30 опыта" : "Без награды";
        }
      }
    }
  });

  const controller = new BattleController(left, right, {
    enterFrom: (side: Side) => (side === "left" ? -80 : app.screen.width + 80),
  });
  controller.start();

  return {
    destroy: () => {
      controller.stop();
      all.forEach((f) => f.destroy());
      app.destroy(true);
    },
  };
}
