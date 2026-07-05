import type { Gladiator } from "./Colosseum.types";

/**
 * Убедись что картинки реально лежат в public/gladiators/...
 * Например: public/gladiators/marcell.png
 */
export const GLADIATORS: Gladiator[] = [
  {
    id: "marcell",
    name: "Марцелл",
    image: "/gladiators/marcellus.png",
    hp: 110,
    attack: 13,
    defense: 4,
    critChance: 0.2,
  },
  {
    id: "tit",
    name: "Тит",
    image: "/gladiators/gladiator1.png",
    hp: 95,
    attack: 15,
    defense: 3,
    critChance: 0.25,
  },
  {
    id: "cassius",
    name: "Кассий",
    image: "/gladiators/gladiator2.png",
    hp: 120,
    attack: 11,
    defense: 6,
    critChance: 0.15,
  },
  {
    id: "sextus",
    name: "Секст",
    image: "/gladiators/first-gladiator/2.png",
    hp: 100,
    attack: 12,
    defense: 5,
    critChance: 0.18,
  },
  {
    id: "aurelius",
    name: "Аврелий",
    image: "/gladiators/first-gladiator/5.png",
    hp: 105,
    attack: 14,
    defense: 4,
    critChance: 0.2,
  },
];
