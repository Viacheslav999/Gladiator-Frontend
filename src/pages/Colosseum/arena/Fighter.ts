import * as PIXI from "pixi.js";

export type Fighter = {
  id: string;
  name: string;
  container: PIXI.Container;
  sprite: PIXI.Sprite;
  nameText: PIXI.Text;
  alive: boolean;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    critChance: number;
  };
};

export function createFighter(config: {
  id: string;
  name: string;
  texture: string;
  x: number;
  flipped: boolean;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    critChance: number;
  };
}): Fighter {
  const sprite = PIXI.Sprite.from(config.texture);
  sprite.anchor.set(0.5, 1);
  sprite.scale.set(0.85);
  sprite.y = 0;

  if (config.flipped) {
    sprite.scale.x *= -1;
  }

  const shadow = new PIXI.Graphics();
  shadow.beginFill(0x000000, 0.3);
  shadow.drawEllipse(0, 0, 50, 14);
  shadow.endFill();
  shadow.y = 10;

  const nameText = new PIXI.Text(config.name, {
    fontFamily: "Arial",
    fontSize: 18,
    fill: 0xffffff,
    fontWeight: "bold",
    dropShadow: {
      color: 0x000000,
      blur: 4,
      distance: 2,
      angle: Math.PI / 4,
      alpha: 0.8,
    },
  });

  nameText.anchor.set(0.5);
  nameText.y = -sprite.height - 20;

  const container = new PIXI.Container();
  container.x = config.x;
  container.y = 620;

  container.addChild(shadow);
  container.addChild(sprite);
  container.addChild(nameText);

  return {
    id: config.id,
    name: config.name,
    container,
    sprite,
    nameText,
    alive: true,
    stats: { ...config.stats },
  };
}
