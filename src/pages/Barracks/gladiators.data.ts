export type Ability = {
  id: number;
  name: string;
  description: string;
  ultimate?: boolean;
};

export type Gladiator = {
  id: number;
  name: string;
  image: string;
  locked: boolean;
  hp: number;
  attack: number;
  defense: number;
  lore: string;
  abilities: Ability[];
};

export const gladiators: Gladiator[] = [
  {
    id: 1,
    name: "Марцелл Железнорукий",
    image: "/gladiators/marcellus.png",
    locked: true,
    hp: 1200,
    attack: 180,
    defense: 90,
    lore:
      "Бывший центурион римского легиона. Был обвинён в измене после поражения от варваров и продан ланисте.",
    abilities: [
      { id: 1, name: "Рассечение", description: "Мощный удар мечом по врагу." },
      { id: 2, name: "Стойкость", description: "Повышает защиту на время." },
      { id: 3, name: "Контрудар", description: "Отражает часть урона." },
      {
        id: 4,
        name: "Гнев легиона",
        description: "Серия беспощадных ударов.",
        ultimate: true,
      },
    ],
  },

  {
    id: 2,
    name: "Флавий Песчаный",
    image: "/gladiators/flavius.png",
    locked: true,
    hp: 1000,
    attack: 210,
    defense: 70,
    lore:
      "Бывший раб из Африки. Сражался ради свободы и славы.",
    abilities: [
      { id: 1, name: "Бросок копья", description: "Дальний удар." },
      { id: 2, name: "Манёвр", description: "Уклонение от атак." },
      { id: 3, name: "Песчаная пыль", description: "Ослабляет врага." },
      {
        id: 4,
        name: "Ярость пустыни",
        description: "Резко увеличивает урон.",
        ultimate: true,
      },
    ],
  },

  // 👉 ещё 3 можешь копировать по шаблону
];
