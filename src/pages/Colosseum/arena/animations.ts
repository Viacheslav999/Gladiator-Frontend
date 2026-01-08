import gsap from "gsap";
import type { Fighter } from "./Fighter";

export async function attackAnimation(attacker: Fighter, target: Fighter) {
  const startX = attacker.container.x;

  await gsap
    .timeline()
    .to(attacker.container, {
      x: target.container.x - (attacker.sprite.scale.x > 0 ? 80 : -80),
      duration: 0.2,
    })
    .to(target.container, {
      x: "+=12",
      duration: 0.05,
      yoyo: true,
      repeat: 2,
    })
    .to(attacker.container, {
      x: startX,
      duration: 0.25,
    });
}

export async function deathAnimation(fighter: Fighter) {
  await gsap.to(fighter.container, {
    alpha: 0,
    duration: 1,
  });
}
