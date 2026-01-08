import * as PIXI from "pixi.js";
import type { Gladiator } from "../Colosseum.types";
import { createFighter } from "./Fighter";
import { BattleController } from "./BattleController";

export function createArena(container: HTMLDivElement, fighters: Gladiator[]) {
  container.innerHTML = "";

  const app = new PIXI.Application({
    resizeTo: container,
    backgroundColor: 0x111111,
    antialias: true,
  });

  container.appendChild(app.view as HTMLCanvasElement);

  // ФОН
  const bg = PIXI.Sprite.from("/arena/arena.jpg");
  bg.width = app.screen.width;
  bg.height = app.screen.height;
  app.stage.addChild(bg);

  // Защита от пустого массива
  const leftGl = fighters[0];
  const rightGl = fighters[1];
  if (!leftGl || !rightGl) {
    return {
      app,
      controller: null as any,
      destroy: () => {
        app.destroy(true);
      },
    };
  }

  // БОЙЦЫ
  const left = createFighter({
    id: leftGl.id,
    name: leftGl.name,
    texture: leftGl.image,
    x: app.screen.width * 0.3,
    flipped: false,
    stats: {
      hp: leftGl.hp,
      attack: leftGl.attack,
      defense: leftGl.defense,
      critChance: leftGl.critChance,
    },
  });

  const right = createFighter({
    id: rightGl.id,
    name: rightGl.name,
    texture: rightGl.image,
    x: app.screen.width * 0.7,
    flipped: true,
    stats: {
      hp: rightGl.hp,
      attack: rightGl.attack,
      defense: rightGl.defense,
      critChance: rightGl.critChance,
    },
  });

  app.stage.addChild(left.container);
  app.stage.addChild(right.container);

  const controller = new BattleController(left, right);

  // Ресайз
  const onResize = () => {
    bg.width = app.screen.width;
    bg.height = app.screen.height;

    left.container.x = app.screen.width * 0.3;
    right.container.x = app.screen.width * 0.7;
  };

  app.renderer.on("resize", onResize);

  return {
    app,
    controller,
    destroy: () => {
      controller.stop();
      // Важно: не используем baseTexture, иначе TS ругается
      app.destroy(true, { children: true, texture: true });
    },
  };
}
